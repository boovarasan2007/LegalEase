import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { extractDocumentText } from './server/documentParser';
import {
  analyzeLegalDocument,
  askDocumentQuestion,
  simplifyCustomClause,
} from './server/geminiService';
import { db } from './server/db';
import { LEGAL_DICTIONARY, SAMPLE_CONTRACTS } from './server/sampleData';

dotenv.config();

const app = express();
const PORT = 3000;

// Setup upload storage with multer
const uploadsDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB limit
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExtensions = ['.pdf', '.docx', '.txt'];
    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported file format: ${ext}. Please upload a PDF, DOCX, or TXT file.`
        )
      );
    }
  },
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

/**
 * Health check & disclaimer info
 */
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'LegalEase',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    disclaimer:
      'LegalEase provides general informational assistance and is not a substitute for advice from a qualified lawyer.',
  });
});

/**
 * Get Legal Dictionary terms
 */
app.get('/api/dictionary', (_req: Request, res: Response) => {
  res.json({ terms: LEGAL_DICTIONARY });
});

/**
 * Get available sample contracts
 */
app.get('/api/samples', (_req: Request, res: Response) => {
  res.json({ samples: SAMPLE_CONTRACTS });
});

/**
 * Load or activate a sample contract
 */
app.post('/api/load-sample/:sampleId', async (req: Request, res: Response) => {
  try {
    const { sampleId } = req.params;
    const sample = SAMPLE_CONTRACTS.find((s) => s.id === sampleId);
    if (!sample) {
      return res.status(404).json({ error: 'Sample contract not found' });
    }

    let doc = db.getDocument(sample.id);
    if (!doc) {
      const words = sample.content.split(/\s+/).filter(Boolean).length;
      doc = db.createDocument({
        filename: sample.filename,
        filetype: 'text/plain',
        filesize: Buffer.byteLength(sample.content, 'utf-8'),
        extractedText: sample.content,
        pageCount: Math.max(1, Math.ceil(sample.content.length / 2500)),
        wordCount: words,
        charCount: sample.content.length,
      });
    }

    // Check if already analyzed
    let analysis = db.getAnalysis(doc.id);
    if (!analysis) {
      try {
        const analysisData = await analyzeLegalDocument(doc.extractedText, doc.filename);
        analysis = db.saveAnalysis(doc.id, analysisData);
      } catch (analysisErr: any) {
        console.warn('Auto-analysis for sample skipped or failed:', analysisErr.message);
      }
    }

    return res.json({
      document: doc,
      analysis: analysis ? analysis.data : null,
      conversations: db.getConversations(doc.id),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

/**
 * List all uploaded documents
 */
app.get('/api/documents', (_req: Request, res: Response) => {
  const docs = db.getAllDocuments();
  const list = docs.map((d) => ({
    id: d.id,
    filename: d.filename,
    filetype: d.filetype,
    filesize: d.filesize,
    pageCount: d.pageCount,
    wordCount: d.wordCount,
    charCount: d.charCount,
    createdAt: d.createdAt,
    hasAnalysis: Boolean(db.getAnalysis(d.id)),
  }));
  res.json({ documents: list });
});

/**
 * Get single document details with its analysis & chat history
 */
app.get('/api/documents/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const doc = db.getDocument(id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  const analysis = db.getAnalysis(id);
  const conversations = db.getConversations(id);

  res.json({
    document: doc,
    analysis: analysis ? analysis.data : null,
    conversations,
  });
});

/**
 * Delete a document
 */
app.delete('/api/documents/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const success = db.deleteDocument(id);
  if (!success) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json({ success: true, message: 'Document deleted successfully' });
});

/**
 * Upload a document (PDF, DOCX, TXT)
 */
app.post('/api/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { originalname, mimetype, size, buffer } = req.file;

    if (size === 0) {
      return res.status(400).json({ error: 'Uploaded file is empty (0 bytes).' });
    }

    // Extract text using dedicated parser
    const extracted = await extractDocumentText(buffer, originalname, mimetype);

    if (extracted.isScannedOrEmpty) {
      return res.status(422).json({
        error:
          'LegalEase could not extract readable text from this document. The file may contain scanned images. OCR support can be added in a future version.',
        filename: originalname,
      });
    }

    // Save document to DB
    const doc = db.createDocument({
      filename: originalname,
      filetype: mimetype,
      filesize: size,
      extractedText: extracted.text,
      pageCount: extracted.pageCount || 1,
      wordCount: extracted.wordCount,
      charCount: extracted.charCount,
    });

    // Auto-trigger initial AI analysis
    let analysisResult = null;
    try {
      const result = await analyzeLegalDocument(extracted.text, originalname);
      analysisResult = db.saveAnalysis(doc.id, result);
    } catch (aiErr: any) {
      console.error('Initial auto-analysis warning:', aiErr.message);
      // Even if AI fails, document is saved and user can retry
    }

    return res.status(201).json({
      document: doc,
      analysis: analysisResult ? analysisResult.data : null,
      message: 'Document uploaded and processed successfully.',
    });
  } catch (error: any) {
    console.error('Upload processing error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to process document upload.',
    });
  }
});

/**
 * Trigger or re-run document AI analysis
 */
app.post('/api/analyze/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = db.getDocument(id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const analysisData = await analyzeLegalDocument(doc.extractedText, doc.filename);
    const saved = db.saveAnalysis(id, analysisData);

    return res.json({
      success: true,
      analysis: saved.data,
      message: 'Document analyzed successfully.',
    });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to analyze legal document with AI.',
    });
  }
});

/**
 * Ask questions about a specific document (Grounded Q&A)
 */
app.post('/api/chat/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { question } = req.body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const doc = db.getDocument(id);
    if (!doc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const existingChat = db.getConversations(id);
    const chatHistory = existingChat.map((c) => [
      { role: 'user' as const, text: c.question },
      { role: 'assistant' as const, text: c.answer },
    ]).flat();

    const answerResponse = await askDocumentQuestion(
      doc.extractedText,
      question.trim(),
      chatHistory
    );

    const record = db.addConversation(id, {
      question: question.trim(),
      answer: answerResponse.answer,
      sourceSection: answerResponse.sourceSection,
      quoteSnippet: answerResponse.quoteSnippet,
      foundInDocument: answerResponse.foundInDocument,
    });

    return res.json({
      conversation: record,
      answer: answerResponse.answer,
      sourceSection: answerResponse.sourceSection,
      quoteSnippet: answerResponse.quoteSnippet,
      foundInDocument: answerResponse.foundInDocument,
      disclaimer: answerResponse.legalDisclaimer,
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate answer for your question.',
    });
  }
});

/**
 * Clear chat history for a document
 */
app.delete('/api/chat/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  db.clearConversations(id);
  res.json({ success: true, message: 'Chat history cleared' });
});

/**
 * Simplify a custom legal clause
 */
app.post('/api/simplify-clause', async (req: Request, res: Response) => {
  try {
    const { clause } = req.body;
    if (!clause || typeof clause !== 'string' || !clause.trim()) {
      return res.status(400).json({ error: 'Clause text is required' });
    }

    const simplified = await simplifyCustomClause(clause.trim());
    return res.json({ simplified });
  } catch (error: any) {
    console.error('Clause simplification error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to simplify legal clause.',
    });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Static serving
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`LegalEase Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
