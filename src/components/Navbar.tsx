import React, { useState } from 'react';
import {
  Scale,
  Upload,
  BookOpen,
  FileText,
  AlertTriangle,
  Info,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { DocumentRecord } from '../types';

interface NavbarProps {
  currentView: 'home' | 'dashboard' | 'dictionary';
  onNavigate: (view: 'home' | 'dashboard' | 'dictionary') => void;
  onOpenUpload: () => void;
  documents: DocumentRecord[];
  activeDocument: DocumentRecord | null;
  onSelectDocument: (doc: DocumentRecord) => void;
  onSelectSample: (sampleId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenUpload,
  documents,
  activeDocument,
  onSelectDocument,
  onSelectSample,
}) => {
  const [showDocDropdown, setShowDocDropdown] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* Prominent Legal Disclaimer Banner */}
      {showDisclaimer && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Informational Assistance Only:</strong> LegalEase is an AI tool designed to help you understand documents in plain language. It does not provide legal advice and is not a substitute for a qualified lawyer. Always consult an attorney for specific legal matters.
            </span>
          </div>
          <button
            onClick={() => setShowDisclaimer(false)}
            className="text-amber-700 hover:text-amber-950 font-medium ml-3 text-xs"
            aria-label="Dismiss disclaimer"
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Legal<span className="text-indigo-600">Ease</span>
                </span>
                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded px-1.5 py-0.5">
                  AI Legal Assistant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight hidden sm:block">
                Clear insights for complex documents
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'home' && !activeDocument
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>

            {/* Document Switcher Dropdown */}
            {documents.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowDocDropdown(!showDocDropdown)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>
                    {activeDocument
                      ? activeDocument.filename.length > 20
                        ? activeDocument.filename.slice(0, 18) + '...'
                        : activeDocument.filename
                      : `Documents (${documents.length})`}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>

                {showDocDropdown && (
                  <div
                    className="absolute left-0 mt-1 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setShowDocDropdown(false)}
                  >
                    <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Loaded Documents
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {documents.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => {
                            onSelectDocument(doc);
                            setShowDocDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between hover:bg-indigo-50/70 transition-colors ${
                            activeDocument?.id === doc.id
                              ? 'bg-indigo-50 text-indigo-700 font-semibold'
                              : 'text-slate-700'
                          }`}
                        >
                          <div className="truncate pr-2">
                            <p className="truncate text-xs font-medium">{doc.filename}</p>
                            <p className="text-[10px] text-slate-400">
                              {doc.wordCount.toLocaleString()} words · {doc.pageCount} page(s)
                            </p>
                          </div>
                          {doc.hasAnalysis && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-1.5 py-0.5 whitespace-nowrap">
                              Analyzed
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => onNavigate('dictionary')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === 'dictionary'
                  ? 'text-indigo-600 bg-indigo-50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Legal Dictionary</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {/* Quick Sample Contract Launcher */}
            <div className="hidden lg:flex items-center gap-1 text-xs text-slate-500 bg-slate-100/80 rounded-lg p-1">
              <span className="px-2 text-slate-400 font-medium">Quick Demo:</span>
              <button
                onClick={() => onSelectSample('sample-nda')}
                className="px-2.5 py-1 rounded bg-white text-slate-700 hover:text-indigo-600 hover:shadow-xs text-xs font-medium border border-slate-200/60 transition"
              >
                Sample NDA
              </button>
              <button
                onClick={() => onSelectSample('sample-lease')}
                className="px-2.5 py-1 rounded bg-white text-slate-700 hover:text-indigo-600 hover:shadow-xs text-xs font-medium border border-slate-200/60 transition"
              >
                Office Lease
              </button>
              <button
                onClick={() => onSelectSample('sample-saas')}
                className="px-2.5 py-1 rounded bg-white text-slate-700 hover:text-indigo-600 hover:shadow-xs text-xs font-medium border border-slate-200/60 transition"
              >
                SaaS Agreement
              </button>
            </div>

            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm shadow-indigo-200 hover:shadow-md transition-all active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
