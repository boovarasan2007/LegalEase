import { createRequire } from 'module';
import mammoth from 'mammoth';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export interface ExtractedDocument {
  text: string;
  pageCount?: number;
  wordCount: number;
  charCount: number;
  sections?: { title: string; content: string }[];
  isScannedOrEmpty?: boolean;
}

/**
 * Normalizes extracted text by removing excess blank lines,
 * trimming whitespace, and preserving paragraph structure.
 */
export function normalizeText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Extracts text from PDF buffer
 */
export async function parsePdf(buffer: Buffer): Promise<ExtractedDocument> {
  try {
    const data = await pdfParse(buffer);
    const cleanedText = normalizeText(data.text);

    const isScannedOrEmpty = !cleanedText || cleanedText.replace(/\s+/g, '').length < 30;

    return {
      text: cleanedText,
      pageCount: data.numpages || 1,
      wordCount: cleanedText ? cleanedText.split(/\s+/).filter(Boolean).length : 0,
      charCount: cleanedText.length,
      isScannedOrEmpty,
    };
  } catch (error: any) {
    throw new Error(`Failed to parse PDF document: ${error.message}`);
  }
}

/**
 * Extracts text from DOCX buffer
 */
export async function parseDocx(buffer: Buffer): Promise<ExtractedDocument> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    const cleanedText = normalizeText(result.value);

    const isScannedOrEmpty = !cleanedText || cleanedText.replace(/\s+/g, '').length < 20;

    return {
      text: cleanedText,
      pageCount: Math.max(1, Math.ceil(cleanedText.length / 2500)),
      wordCount: cleanedText ? cleanedText.split(/\s+/).filter(Boolean).length : 0,
      charCount: cleanedText.length,
      isScannedOrEmpty,
    };
  } catch (error: any) {
    throw new Error(`Failed to parse DOCX document: ${error.message}`);
  }
}

/**
 * Extracts text from plain text buffer (with UTF-8 and latin-1 fallback)
 */
export function parseTxt(buffer: Buffer): ExtractedDocument {
  try {
    let rawText = buffer.toString('utf-8');
    // Check for weird replacement characters, fallback to latin1 if needed
    if (rawText.includes('\uFFFD')) {
      rawText = buffer.toString('latin1');
    }

    const cleanedText = normalizeText(rawText);
    const isScannedOrEmpty = !cleanedText || cleanedText.replace(/\s+/g, '').length < 10;

    return {
      text: cleanedText,
      pageCount: Math.max(1, Math.ceil(cleanedText.length / 2500)),
      wordCount: cleanedText ? cleanedText.split(/\s+/).filter(Boolean).length : 0,
      charCount: cleanedText.length,
      isScannedOrEmpty,
    };
  } catch (error: any) {
    throw new Error(`Failed to read plain text document: ${error.message}`);
  }
}

/**
 * High-level parser dispatcher based on mimetype and filename
 */
export async function extractDocumentText(
  buffer: Buffer,
  filename: string,
  mimetype: string
): Promise<ExtractedDocument> {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (mimetype === 'application/pdf' || ext === 'pdf') {
    return await parsePdf(buffer);
  }

  if (
    mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    ext === 'docx'
  ) {
    return await parseDocx(buffer);
  }

  if (
    mimetype === 'text/plain' ||
    ext === 'txt' ||
    ext === 'text' ||
    mimetype.startsWith('text/')
  ) {
    return parseTxt(buffer);
  }

  throw new Error(
    `Unsupported file type (.${ext || mimetype}). LegalEase supports PDF, DOCX, and TXT files.`
  );
}
