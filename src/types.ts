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
  hasAnalysis?: boolean;
}

export interface DocumentAnalysisResult {
  documentType: string;
  documentPurpose: string;
  shortSummary: string;
  detailedSummary: string[];
  keyInformation: {
    parties: string;
    effectiveDate: string;
    expirationDate: string;
    monetaryAmounts: string;
    deadlines: string;
    obligations: string[];
    rights: string[];
    terminationConditions: string;
    penaltiesAndRemedies: string;
    governingLawAndJurisdiction: string;
  };
  explainedClauses: Array<{
    clauseTitle: string;
    originalClause: string;
    simpleExplanation: string;
    whyItMatters: string;
    thingsToCheck: string;
  }>;
  reviewPoints: Array<{
    title: string;
    category:
      | 'Indemnity'
      | 'Liability Limitations'
      | 'Automatic Renewal'
      | 'Payment & Fees'
      | 'Termination & Default'
      | 'Broad Obligations'
      | 'Dispute & Jurisdiction'
      | 'Confidentiality & IP'
      | 'Other';
    concernLevel: 'High Review' | 'Moderate Review' | 'Informational';
    clauseSnippet: string;
    observation: string;
    recommendedVerification: string;
  }>;
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

export interface LegalDictionaryEntry {
  term: string;
  category: 'General' | 'Contract' | 'Dispute' | 'Liability' | 'Property';
  simpleMeaning: string;
  example: string;
  practicalTip: string;
}

export interface SampleContract {
  id: string;
  title: string;
  category: string;
  summary: string;
  filename: string;
  content: string;
}
