import React from 'react';
import {
  Scale,
  Upload,
  FileText,
  ShieldAlert,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  HelpCircle,
  FileCheck,
  Calendar,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { DocumentRecord, SampleContract } from '../types';

interface LandingViewProps {
  onOpenUpload: () => void;
  onSelectSample: (sampleId: string) => void;
  samples: SampleContract[];
  documents: DocumentRecord[];
  onSelectDocument: (doc: DocumentRecord) => void;
  onOpenDictionary: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onOpenUpload,
  onSelectSample,
  samples,
  documents,
  onSelectDocument,
  onOpenDictionary,
}) => {
  return (
    <div className="space-y-16 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>AI-Powered Legal Document Intelligence</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Understand Legal Documents.{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
            Simply.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
          Upload a legal document and let LegalEase turn complex legal language into clear, understandable information. Find key dates, uncover hidden liabilities, and ask questions with confidence.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onOpenUpload}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm sm:text-base shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={() => onSelectSample('sample-nda')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base border border-slate-200 shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Try Sample NDA</span>
          </button>
        </div>

        {/* Supported formats & trust badge */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pt-4">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Supports PDF, DOCX, TXT
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-slate-400" />
            Secure & Private Parsing
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500" />
            Instant Plain-English Analysis
          </span>
        </div>
      </section>

      {/* Preloaded Sample Contracts Carousel / Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50/80 rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Explore Preloaded Sample Contracts</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Click any contract below to immediately test the AI analysis, plain-language simplification, and interactive Q&A:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {samples.map((sample) => (
              <div
                key={sample.id}
                onClick={() => onSelectSample(sample.id)}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                      {sample.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">.txt</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                    {sample.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                    {sample.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                  <span>Open & Analyze</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Uploads (if any) */}
      {documents.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Your Documents ({documents.length})</h2>
            <button
              onClick={onOpenUpload}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              + Upload Another
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectDocument(doc)}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition">
                      {doc.filename}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {doc.wordCount.toLocaleString()} words · {doc.pageCount} page(s)
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Core Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Everything You Need to Decipher Any Legal Agreement
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Built specifically to bridge the gap between complex legal jargon and practical everyday understanding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Document Analysis */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Document Analysis</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Upload PDF, DOCX, or TXT contracts. LegalEase extracts text page by page, identifies structure, and parses the core intent.
            </p>
          </div>

          {/* Card 2: Simple Summaries */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Simple Summaries</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Convert complicated legal language into plain-English summaries, executive briefs, and section breakdowns without changing legal meaning.
            </p>
          </div>

          {/* Card 3: Key Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Key Information</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Instantly pinpoint parties, effective dates, monetary fees, deadlines, obligations, rights, termination rules, and penalties.
            </p>
          </div>

          {/* Card 4: Ask Questions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs hover:shadow-md transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Ask Questions</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Have a conversation with your document. Ask specific questions and receive answers grounded strictly in the document with source citations.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mt-1">How LegalEase Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-indigo-300 font-bold flex items-center justify-center text-lg mx-auto md:mx-0">
                1
              </div>
              <h3 className="text-base font-bold text-white">Upload Document</h3>
              <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                Drag and drop your PDF, DOCX, or TXT file. Files are parsed securely and normalized immediately.
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-indigo-300 font-bold flex items-center justify-center text-lg mx-auto md:mx-0">
                2
              </div>
              <h3 className="text-base font-bold text-white">AI Analysis & Breakdown</h3>
              <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                Our model analyzes obligations, extracts critical dates and amounts, and simplifies dense clauses into plain language.
              </p>
            </div>

            <div className="space-y-3 text-center md:text-left">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-indigo-300 font-bold flex items-center justify-center text-lg mx-auto md:mx-0">
                3
              </div>
              <h3 className="text-base font-bold text-white">Review & Ask Questions</h3>
              <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                Browse executive summaries, review attention flags, simplify custom text, and ask interactive questions grounded in the contract.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10 text-center">
            <button
              onClick={onOpenUpload}
              className="px-6 py-3 rounded-xl bg-white hover:bg-indigo-50 text-indigo-950 font-bold text-sm shadow-md transition"
            >
              Get Started with Your Document
            </button>
          </div>
        </div>
      </section>

      {/* Legal Dictionary Callout Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700">
              <BookOpen className="w-4 h-4" />
              <span>Educational Resource</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Curious About Legal Terms like Indemnity, Force Majeure, or Consideration?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Browse our comprehensive Legal Terminology Dictionary for plain-language definitions, practical real-world examples, and attorney review tips.
            </p>
          </div>
          <button
            onClick={onOpenDictionary}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm whitespace-nowrap shadow-xs transition"
          >
            Explore Dictionary
          </button>
        </div>
      </section>
    </div>
  );
};
