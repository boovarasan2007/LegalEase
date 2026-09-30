import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Calendar,
  DollarSign,
  AlertTriangle,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  Send,
  Trash2,
  RefreshCw,
  Copy,
  Check,
  Search,
  Sparkles,
  Download,
  Info,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Scale,
  Users,
  Clock,
  Briefcase,
  AlertCircle,
  FileCheck,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import {
  DocumentRecord,
  DocumentAnalysisResult,
  ConversationRecord,
} from '../types';

interface DashboardViewProps {
  document: DocumentRecord;
  analysis: DocumentAnalysisResult | null;
  conversations: ConversationRecord[];
  onReAnalyze: (id: string) => Promise<void>;
  onDeleteDocument: (id: string) => void;
  onSendMessage: (id: string, question: string) => Promise<void>;
  onClearChat: (id: string) => void;
  isAnalyzing: boolean;
  onOpenDictionary: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  document,
  analysis,
  conversations,
  onReAnalyze,
  onDeleteDocument,
  onSendMessage,
  onClearChat,
  isAnalyzing,
  onOpenDictionary,
}) => {
  const [activeTab, setActiveTab] = useState<
    'summary' | 'keyinfo' | 'clauses' | 'reviews' | 'chat' | 'text'
  >('summary');

  // Chat input
  const [chatInput, setChatInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Custom clause simplifier tool inside Clause tab
  const [customClauseInput, setCustomClauseInput] = useState('');
  const [isSimplifyingCustom, setIsSimplifyingCustom] = useState(false);
  const [customSimplification, setCustomSimplification] = useState<any>(null);

  // Document text search
  const [textSearchTerm, setTextSearchTerm] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, activeTab]);

  const handleSendChat = async (questionText?: string) => {
    const q = (questionText || chatInput).trim();
    if (!q || isSendingMessage) return;

    setIsSendingMessage(true);
    if (!questionText) setChatInput('');

    try {
      await onSendMessage(document.id, q);
    } catch (err) {
      console.error('Chat send error:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleSimplifyCustomClause = async () => {
    if (!customClauseInput.trim() || isSimplifyingCustom) return;
    setIsSimplifyingCustom(true);
    setCustomSimplification(null);

    try {
      const res = await fetch('/api/simplify-clause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clause: customClauseInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCustomSimplification(data.simplified);
    } catch (err: any) {
      console.error('Failed to simplify clause:', err);
    } finally {
      setIsSimplifyingCustom(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const exportSummaryReport = () => {
    if (!analysis) return;
    const content = `=====================================================
LEGALEASE DOCUMENT ANALYSIS REPORT
=====================================================
Document: ${document.filename}
Document Type: ${analysis.documentType}
Date Analyzed: ${new Date().toLocaleDateString()}
Total Words: ${document.wordCount.toLocaleString()}
Estimated Pages: ${document.pageCount}

DISCLAIMER:
LegalEase provides general informational assistance and is not a substitute 
for advice from a qualified lawyer. AI-generated information may contain errors.
Always consult a qualified legal professional for advice about your specific situation.

-----------------------------------------------------
1. DOCUMENT PURPOSE
-----------------------------------------------------
${analysis.documentPurpose}

-----------------------------------------------------
2. EXECUTIVE SUMMARY
-----------------------------------------------------
${analysis.shortSummary}

Detailed Breakdown:
${analysis.detailedSummary.map((b, i) => `${i + 1}. ${b}`).join('\n')}

-----------------------------------------------------
3. KEY INFORMATION & ESSENTIAL TERMS
-----------------------------------------------------
Parties Involved:
${analysis.keyInformation.parties}

Effective Date:
${analysis.keyInformation.effectiveDate}

Expiration / Term:
${analysis.keyInformation.expirationDate}

Monetary Amounts & Payments:
${analysis.keyInformation.monetaryAmounts}

Deadlines & Milestones:
${analysis.keyInformation.deadlines}

Termination Conditions:
${analysis.keyInformation.terminationConditions}

Penalties & Remedies:
${analysis.keyInformation.penaltiesAndRemedies}

Governing Law & Jurisdiction:
${analysis.keyInformation.governingLawAndJurisdiction}

Core Obligations:
${analysis.keyInformation.obligations.map((o) => `• ${o}`).join('\n')}

Core Rights:
${analysis.keyInformation.rights.map((r) => `• ${r}`).join('\n')}

-----------------------------------------------------
4. IMPORTANT POINTS TO REVIEW (ATTENTION ITEMS)
-----------------------------------------------------
${analysis.reviewPoints
  .map(
    (rp, i) =>
      `[${rp.concernLevel}] ${rp.title} (${rp.category})
Observation: ${rp.observation}
Clause Snippet: "${rp.clauseSnippet}"
Verification: ${rp.recommendedVerification}
`
  )
  .join('\n')}

-----------------------------------------------------
5. SIMPLIFIED CLAUSES
-----------------------------------------------------
${analysis.explainedClauses
  .map(
    (c, i) =>
      `Clause ${i + 1}: ${c.clauseTitle}
Original: "${c.originalClause}"
Plain English: ${c.simpleExplanation}
Why It Matters: ${c.whyItMatters}
Questions for Legal Counsel: ${c.thingsToCheck}
`
  )
  .join('\n')}
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `LegalEase_${document.filename.replace(/\.[^/.]+$/, '')}_Summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const suggestedQuestions = [
    'What is this document about?',
    'What are my obligations?',
    'What are the important deadlines?',
    'How can this agreement be terminated?',
    'Explain the most important clause.',
    'What should I review carefully?',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Document Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{document.filename}</h1>
                {analysis && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {analysis.documentType}
                  </span>
                )}
                <span className="text-xs text-slate-400">
                  Uploaded {new Date(document.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <strong>{document.pageCount}</strong> {document.pageCount === 1 ? 'page' : 'pages'}
                </span>
                <span>•</span>
                <span>
                  <strong>{document.wordCount.toLocaleString()}</strong> words
                </span>
                <span>•</span>
                <span>{(document.filesize / 1024).toFixed(1)} KB</span>
                <span>•</span>
                <span className="uppercase text-[11px] font-mono text-slate-400">
                  {document.filetype.split('/').pop()}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={exportSummaryReport}
              disabled={!analysis}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium shadow-2xs transition disabled:opacity-50"
              title="Download text summary report"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export Report</span>
            </button>

            <button
              onClick={() => onReAnalyze(document.id)}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium shadow-2xs transition disabled:opacity-50"
              title="Re-run AI analysis"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing...' : 'Re-Analyze'}</span>
            </button>

            {confirmDelete ? (
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 rounded-lg p-1">
                <span className="text-[11px] text-rose-800 font-medium px-1.5">Delete document?</span>
                <button
                  onClick={() => onDeleteDocument(document.id)}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold rounded"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 bg-white text-slate-700 hover:bg-slate-100 text-[11px] rounded border border-slate-200"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-medium shadow-2xs transition"
                title="Delete document"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'summary'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Summary & Purpose</span>
        </button>

        <button
          onClick={() => setActiveTab('keyinfo')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'keyinfo'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Key Information</span>
        </button>

        <button
          onClick={() => setActiveTab('clauses')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'clauses'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Explain in Simple Language</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'reviews'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Points to Review</span>
          {analysis && analysis.reviewPoints?.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold">
              {analysis.reviewPoints.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'chat'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask LegalEase</span>
          {conversations.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-bold">
              {conversations.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition ${
            activeTab === 'text'
              ? 'border-indigo-600 text-indigo-700 bg-indigo-50/40'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Original Document</span>
        </button>
      </div>

      {/* Loading State during AI Analysis */}
      {isAnalyzing && (
        <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-6 text-center">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <h3 className="text-base font-bold text-indigo-950">Analyzing Legal Document...</h3>
          <p className="text-xs text-indigo-700 mt-1 max-w-md mx-auto">
            Extracting core obligations, translating legal clauses into everyday language, and checking important review points.
          </p>
        </div>
      )}

      {/* TAB 1: SUMMARY & PURPOSE */}
      {activeTab === 'summary' && analysis && (
        <div className="space-y-6">
          {/* Document Purpose Card */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50/50 rounded-xl p-5 border border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-1.5">
              <Scale className="w-4 h-4 text-indigo-600" />
              <span>Primary Purpose of this Document</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-medium">
              {analysis.documentPurpose}
            </p>
          </div>

          {/* Executive Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Executive Summary</h3>
              </div>
              <button
                onClick={() => copyToClipboard(analysis.shortSummary)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 transition"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {analysis.shortSummary}
            </p>

            {/* Detailed Section Breakdown */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Key Structural Provisions
              </h4>
              <div className="space-y-2.5">
                {analysis.detailedSummary.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-white transition"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KEY INFORMATION */}
      {activeTab === 'keyinfo' && analysis && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Parties */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Users className="w-4 h-4" />
                <span>Parties Involved</span>
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {analysis.keyInformation.parties}
              </p>
            </div>

            {/* Dates */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4" />
                <span>Effective Date & Duration</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-800 space-y-1">
                <p>
                  <span className="text-slate-500">Effective:</span>{' '}
                  <span className="font-semibold">{analysis.keyInformation.effectiveDate}</span>
                </p>
                <p>
                  <span className="text-slate-500">Term / Expiration:</span>{' '}
                  <span className="font-semibold">{analysis.keyInformation.expirationDate}</span>
                </p>
              </div>
            </div>

            {/* Monetary Values */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                <DollarSign className="w-4 h-4" />
                <span>Monetary Amounts & Fees</span>
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {analysis.keyInformation.monetaryAmounts}
              </p>
            </div>

            {/* Deadlines */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                <Clock className="w-4 h-4" />
                <span>Deadlines & Notice Windows</span>
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {analysis.keyInformation.deadlines}
              </p>
            </div>

            {/* Termination Conditions */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                <AlertCircle className="w-4 h-4" />
                <span>Termination Conditions</span>
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {analysis.keyInformation.terminationConditions}
              </p>
            </div>

            {/* Penalties & Remedies */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
              <div className="flex items-center gap-2 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Penalties & Remedies</span>
              </div>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {analysis.keyInformation.penaltiesAndRemedies}
              </p>
            </div>
          </div>

          {/* Governing Law */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-start gap-3">
            <Scale className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Governing Law & Jurisdiction
              </p>
              <p className="text-sm text-slate-800 font-medium mt-0.5">
                {analysis.keyInformation.governingLawAndJurisdiction}
              </p>
            </div>
          </div>

          {/* Obligations vs Rights Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Obligations */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm mb-4">
                <div className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  ⚖️
                </div>
                <span>Key Obligations (What You / Parties Must Do)</span>
              </div>
              <div className="space-y-2.5">
                {analysis.keyInformation.obligations.map((ob, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50/70 border border-slate-100 text-xs sm:text-sm text-slate-700"
                  >
                    <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <span>{ob}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rights */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs">
              <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm mb-4">
                <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  🛡️
                </div>
                <span>Key Rights (What Parties Are Entitled To)</span>
              </div>
              <div className="space-y-2.5">
                {analysis.keyInformation.rights.map((rt, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50/40 border border-emerald-100 text-xs sm:text-sm text-emerald-900"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{rt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLAUSE SIMPLIFIER */}
      {activeTab === 'clauses' && (
        <div className="space-y-6">
          {/* Interactive Custom Clause Simplifier */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Interactive Clause Translator</span>
            </div>
            <h3 className="text-lg font-bold">Simplify Any Clause or Paragraph</h3>
            <p className="text-xs text-indigo-100 mt-1 max-w-2xl">
              Paste any convoluted sentence or paragraph from this document (or any other contract) below to translate it into plain English with practical takeaways.
            </p>

            <div className="mt-4 space-y-3">
              <textarea
                rows={3}
                value={customClauseInput}
                onChange={(e) => setCustomClauseInput(e.target.value)}
                placeholder="Paste confusing legal clause text here (e.g. 'Party A covenants to indemnify, defend, and hold harmless Party B from and against any third-party claim...')"
                className="w-full p-3.5 rounded-xl bg-white/10 text-white placeholder-indigo-200/50 border border-white/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSimplifyCustomClause}
                  disabled={!customClauseInput.trim() || isSimplifyingCustom}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs sm:text-sm shadow-md transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSimplifyingCustom ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Translating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Translate to Plain English</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Custom Clause Result */}
            {customSimplification && (
              <div className="mt-5 p-4 rounded-xl bg-white/10 border border-white/20 text-white space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4" />
                  <span>Plain Language Translation</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-indigo-200">Simple Meaning:</p>
                  <p className="text-xs sm:text-sm text-white mt-0.5 leading-relaxed">
                    {customSimplification.simpleExplanation}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <p className="text-xs font-semibold text-indigo-200">Why It Matters:</p>
                    <p className="text-xs text-indigo-100 mt-0.5 leading-relaxed">
                      {customSimplification.whyItMatters}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-300">Questions to Ask a Lawyer:</p>
                    <p className="text-xs text-amber-100 mt-0.5 leading-relaxed">
                      {customSimplification.thingsToCheck}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pre-extracted Document Clauses */}
          {analysis && analysis.explainedClauses && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Important Clauses Simplified
                  </h3>
                  <p className="text-xs text-slate-500">
                    Key contractual provisions broken down into everyday explanations
                  </p>
                </div>
                <button
                  onClick={onOpenDictionary}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Look up legal words</span>
                </button>
              </div>

              <div className="space-y-4">
                {analysis.explainedClauses.map((clause, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:border-indigo-300 transition"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {clause.clauseTitle}
                      </h4>
                    </div>

                    {/* Original Clause */}
                    <div className="mb-3">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Original Contract Language
                      </p>
                      <p className="text-xs font-mono text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 leading-relaxed italic">
                        "{clause.originalClause}"
                      </p>
                    </div>

                    {/* Plain Meaning */}
                    <div className="mb-3 bg-indigo-50/50 p-3.5 rounded-lg border border-indigo-100">
                      <p className="text-xs font-bold text-indigo-900 mb-0.5">
                        Simple Explanation (What this actually means)
                      </p>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                        {clause.simpleExplanation}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {/* Why it matters */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <p className="font-bold text-slate-700 mb-0.5">💡 Why It Matters to You</p>
                        <p className="text-slate-600 leading-relaxed">{clause.whyItMatters}</p>
                      </div>

                      {/* Things to check */}
                      <div className="bg-amber-50/60 p-3 rounded-lg border border-amber-200/60">
                        <p className="font-bold text-amber-900 mb-0.5">
                          🔍 Questions / Things to Clarify
                        </p>
                        <p className="text-amber-800 leading-relaxed">{clause.thingsToCheck}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: POINTS TO REVIEW (RISKS & ATTENTION) */}
      {activeTab === 'reviews' && analysis && (
        <div className="space-y-4">
          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <p className="font-bold text-amber-950">Neutral Review Guidance</p>
              <p className="mt-0.5">
                The items below highlight contractual obligations, liability caps, automatic renewals, or termination provisions that frequently warrant closer consideration. LegalEase never makes legal accusations (e.g. "illegal"); these are observations for you to review with a qualified lawyer.
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {analysis.reviewPoints.map((item, idx) => {
              const isHigh = item.concernLevel === 'High Review';
              const isMod = item.concernLevel === 'Moderate Review';

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-xl border p-5 shadow-2xs transition ${
                    isHigh
                      ? 'border-amber-300 hover:border-amber-400'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isHigh
                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                            : isMod
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.concernLevel}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {item.title}
                      </h4>
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>

                  {/* Observation */}
                  <div className="mt-2 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <p className="font-semibold text-slate-900">{item.observation}</p>
                  </div>

                  {/* Clause Quote */}
                  {item.clauseSnippet && (
                    <div className="mt-2.5 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs font-mono text-slate-600 italic">
                      "{item.clauseSnippet}"
                    </div>
                  )}

                  {/* Recommended Verification */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-indigo-900 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                    <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-indigo-950">Recommended verification: </span>
                      {item.recommendedVerification}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: ASK LEGALEASE (INTERACTIVE GROUNDED Q&A) */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Chat Header */}
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                LE
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ask LegalEase Assistant</h3>
                <p className="text-[11px] text-slate-500">
                  Grounded strictly in {document.filename} · Cites sections & pages
                </p>
              </div>
            </div>
            {conversations.length > 0 && (
              <button
                onClick={() => onClearChat(document.id)}
                className="text-xs text-slate-500 hover:text-rose-600 transition flex items-center gap-1 font-medium"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Chat</span>
              </button>
            )}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Initial Welcome message */}
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                AI
              </div>
              <div className="bg-slate-100 text-slate-800 rounded-2xl rounded-tl-xs p-4 text-xs sm:text-sm max-w-xl shadow-2xs leading-relaxed space-y-2">
                <p>
                  Hello! I am your LegalEase assistant for <strong>{document.filename}</strong>.
                </p>
                <p>
                  You can ask me questions about this agreement, such as termination rights, payment deadlines, obligations, or confusing clauses. I will only answer based on what is in your document and will cite the relevant section.
                </p>
              </div>
            </div>

            {/* Conversation turns */}
            {conversations.map((msg) => (
              <React.Fragment key={msg.id}>
                {/* User Message (Right) */}
                <div className="flex justify-end">
                  <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs sm:text-sm max-w-lg shadow-2xs leading-relaxed">
                    {msg.question}
                  </div>
                </div>

                {/* Assistant Answer (Left) */}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                    LE
                  </div>
                  <div className="bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-xs p-4 text-xs sm:text-sm max-w-xl shadow-2xs leading-relaxed space-y-2.5">
                    <p>{msg.answer}</p>

                    {/* Source citation if available */}
                    {msg.sourceSection && (
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5 font-medium">
                        <Scale className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Source: {msg.sourceSection}</span>
                      </div>
                    )}

                    {/* Quote snippet if available */}
                    {msg.quoteSnippet && (
                      <div className="p-2 rounded bg-slate-50 text-[11px] font-mono text-slate-600 italic border border-slate-100">
                        "{msg.quoteSnippet}"
                      </div>
                    )}

                    {/* Grounded check */}
                    {!msg.foundInDocument && (
                      <div className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                        Notice: This information was not explicitly stated in the uploaded document.
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            ))}

            {isSendingMessage && (
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  LE
                </div>
                <div className="bg-slate-100 text-slate-500 rounded-2xl p-3 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                  <span>Searching document text & formulating plain-language answer...</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Suggested Questions */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 overflow-x-auto flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap mr-1">
              Suggested:
            </span>
            {suggestedQuestions.map((sq, i) => (
              <button
                key={i}
                disabled={isSendingMessage}
                onClick={() => handleSendChat(sq)}
                className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 text-xs whitespace-nowrap transition shadow-2xs disabled:opacity-50"
              >
                {sq}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything about this document (e.g. 'Can I terminate early?')"
                disabled={isSendingMessage}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isSendingMessage}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition disabled:opacity-50 flex items-center gap-1.5"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Ask</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 6: ORIGINAL DOCUMENT TEXT */}
      {activeTab === 'text' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Extracted Document Text</h3>
              <p className="text-xs text-slate-500">
                Normalized text extracted from {document.filename} ({document.charCount.toLocaleString()} characters)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search in document..."
                  value={textSearchTerm}
                  onChange={(e) => setTextSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => copyToClipboard(document.extractedText)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium transition flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Full Text</span>
              </button>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 max-h-[550px] overflow-y-auto font-mono text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
            {document.extractedText}
          </div>
        </div>
      )}
    </div>
  );
};
