import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { DocumentAnalysisResult } from './geminiService';
import { SAMPLE_CONTRACTS } from './sampleData';

export interface DocumentRecord {
  id: string;
  filename: string;
  filetype: string;
  filesize: number;
  extractedText: string;
  pageCount: number;
  wordCount: number;
  charCount: number;
  createdAt: string;
}

export interface AnalysisRecord {
  id: string;
  documentId: string;
  data: DocumentAnalysisResult;
  createdAt: string;
}

export interface ConversationRecord {
  id: string;
  documentId: string;
  question: string;
  answer: string;
  sourceSection?: string;
  quoteSnippet?: string;
  foundInDocument: boolean;
  createdAt: string;
}

interface DatabaseSchema {
  documents: Record<string, DocumentRecord>;
  analyses: Record<string, AnalysisRecord>;
  conversations: Record<string, ConversationRecord[]>;
}

const DATA_DIR = path.resolve(process.cwd(), 'database');
const DB_FILE = path.join(DATA_DIR, 'legalease_store.json');

// Ensure database folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading database file, initializing fresh:', err);
  }
  return { documents: {}, analyses: {}, conversations: {} };
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// In-memory active database synchronized with disk
let dbState: DatabaseSchema = loadDatabase();

/**
 * Seed initial sample documents if empty
 */
export function seedSampleDocumentsIfNeeded() {
  for (const sample of SAMPLE_CONTRACTS) {
    if (!dbState.documents[sample.id]) {
      const words = sample.content.split(/\s+/).filter(Boolean).length;
      dbState.documents[sample.id] = {
        id: sample.id,
        filename: sample.filename,
        filetype: 'text/plain',
        filesize: Buffer.byteLength(sample.content, 'utf-8'),
        extractedText: sample.content,
        pageCount: Math.max(1, Math.ceil(sample.content.length / 2500)),
        wordCount: words,
        charCount: sample.content.length,
        createdAt: new Date().toISOString(),
      };
    }
  }
  saveDatabase(dbState);
}

// Run initial seed
seedSampleDocumentsIfNeeded();

export const db = {
  createDocument(doc: Omit<DocumentRecord, 'id' | 'createdAt'>): DocumentRecord {
    const id = 'doc_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    const newDoc: DocumentRecord = {
      ...doc,
      id,
      createdAt: new Date().toISOString(),
    };
    dbState.documents[id] = newDoc;
    saveDatabase(dbState);
    return newDoc;
  },

  getDocument(id: string): DocumentRecord | null {
    return dbState.documents[id] || null;
  },

  getAllDocuments(): DocumentRecord[] {
    return Object.values(dbState.documents).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  deleteDocument(id: string): boolean {
    if (dbState.documents[id]) {
      delete dbState.documents[id];
      delete dbState.analyses[id];
      delete dbState.conversations[id];
      saveDatabase(dbState);
      return true;
    }
    return false;
  },

  saveAnalysis(documentId: string, data: DocumentAnalysisResult): AnalysisRecord {
    const id = 'analysis_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12);
    const record: AnalysisRecord = {
      id,
      documentId,
      data,
      createdAt: new Date().toISOString(),
    };
    dbState.analyses[documentId] = record;
    saveDatabase(dbState);
    return record;
  },

  getAnalysis(documentId: string): AnalysisRecord | null {
    return dbState.analyses[documentId] || null;
  },

  addConversation(
    documentId: string,
    message: Omit<ConversationRecord, 'id' | 'documentId' | 'createdAt'>
  ): ConversationRecord {
    if (!dbState.conversations[documentId]) {
      dbState.conversations[documentId] = [];
    }
    const record: ConversationRecord = {
      id: 'msg_' + crypto.randomUUID().replace(/-/g, '').slice(0, 12),
      documentId,
      ...message,
      createdAt: new Date().toISOString(),
    };
    dbState.conversations[documentId].push(record);
    saveDatabase(dbState);
    return record;
  },

  getConversations(documentId: string): ConversationRecord[] {
    return dbState.conversations[documentId] || [];
  },

  clearConversations(documentId: string): void {
    dbState.conversations[documentId] = [];
    saveDatabase(dbState);
  },
};
