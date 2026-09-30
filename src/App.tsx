import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { DictionaryView } from './components/DictionaryView';
import { UploadModal } from './components/UploadModal';
import {
  DocumentRecord,
  DocumentAnalysisResult,
  ConversationRecord,
  LegalDictionaryEntry,
  SampleContract,
} from './types';
import { Scale, Heart, ShieldAlert } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'dictionary'>('home');
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [activeDocument, setActiveDocument] = useState<DocumentRecord | null>(null);
  const [analysis, setAnalysis] = useState<DocumentAnalysisResult | null>(null);
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [samples, setSamples] = useState<SampleContract[]>([]);
  const [dictionaryEntries, setDictionaryEntries] = useState<LegalDictionaryEntry[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load initial data on mount
  useEffect(() => {
    fetchDocuments();
    fetchSamples();
    fetchDictionary();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents');
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const fetchSamples = async () => {
    try {
      const res = await fetch('/api/samples');
      const data = await res.json();
      if (data.samples) {
        setSamples(data.samples);
      }
    } catch (err) {
      console.error('Failed to load samples:', err);
    }
  };

  const fetchDictionary = async () => {
    try {
      const res = await fetch('/api/dictionary');
      const data = await res.json();
      if (data.terms) {
        setDictionaryEntries(data.terms);
      }
    } catch (err) {
      console.error('Failed to load dictionary:', err);
    }
  };

  const handleSelectDocument = async (doc: DocumentRecord) => {
    try {
      const res = await fetch(`/api/documents/${doc.id}`);
      const data = await res.json();
      if (data.document) {
        setActiveDocument(data.document);
        setAnalysis(data.analysis);
        setConversations(data.conversations || []);
        setCurrentView('dashboard');
      }
    } catch (err) {
      console.error('Failed to load document details:', err);
    }
  };

  const handleSelectSample = async (sampleId: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`/api/load-sample/${sampleId}`, { method: 'POST' });
      const data = await res.json();
      if (data.document) {
        setActiveDocument(data.document);
        setAnalysis(data.analysis);
        setConversations(data.conversations || []);
        setCurrentView('dashboard');
        fetchDocuments(); // Refresh document list
      }
    } catch (err) {
      console.error('Failed to activate sample document:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUploadSuccess = (doc: DocumentRecord, analysisData: DocumentAnalysisResult | null) => {
    setActiveDocument(doc);
    setAnalysis(analysisData);
    setConversations([]);
    setCurrentView('dashboard');
    fetchDocuments();
  };

  const handleReAnalyze = async (docId: string) => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`/api/analyze/${docId}`, { method: 'POST' });
      const data = await res.json();
      if (data.analysis) {
        setAnalysis(data.analysis);
        fetchDocuments();
      }
    } catch (err) {
      console.error('Re-analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
      if (res.ok) {
        if (activeDocument?.id === docId) {
          setActiveDocument(null);
          setAnalysis(null);
          setConversations([]);
          setCurrentView('home');
        }
        fetchDocuments();
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleSendMessage = async (docId: string, question: string) => {
    try {
      const res = await fetch(`/api/chat/${docId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (data.conversation) {
        setConversations((prev) => [...prev, data.conversation]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      throw err;
    }
  };

  const handleClearChat = async (docId: string) => {
    try {
      await fetch(`/api/chat/${docId}`, { method: 'DELETE' });
      setConversations([]);
    } catch (err) {
      console.error('Clear chat error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          if (view === 'home') {
            setActiveDocument(null);
          }
        }}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        documents={documents}
        activeDocument={activeDocument}
        onSelectDocument={handleSelectDocument}
        onSelectSample={handleSelectSample}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <LandingView
            onOpenUpload={() => setIsUploadModalOpen(true)}
            onSelectSample={handleSelectSample}
            samples={samples}
            documents={documents}
            onSelectDocument={handleSelectDocument}
            onOpenDictionary={() => setCurrentView('dictionary')}
          />
        )}

        {currentView === 'dashboard' && activeDocument && (
          <DashboardView
            document={activeDocument}
            analysis={analysis}
            conversations={conversations}
            onReAnalyze={handleReAnalyze}
            onDeleteDocument={handleDeleteDocument}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            isAnalyzing={isAnalyzing}
            onOpenDictionary={() => setCurrentView('dictionary')}
          />
        )}

        {currentView === 'dictionary' && (
          <DictionaryView
            entries={dictionaryEntries}
            onBackToApp={() => setCurrentView(activeDocument ? 'dashboard' : 'home')}
          />
        )}
      </main>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
        samples={samples}
        onSelectSample={handleSelectSample}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-800 text-sm">
                Legal<span className="text-indigo-600">Ease</span>
              </span>
              <span className="text-xs text-slate-400">· AI Legal Document Assistant</span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500">
              <button
                onClick={() => setCurrentView('home')}
                className="hover:text-indigo-600 transition"
              >
                Home
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="hover:text-indigo-600 transition"
              >
                Upload Document
              </button>
              <button
                onClick={() => setCurrentView('dictionary')}
                className="hover:text-indigo-600 transition"
              >
                Legal Dictionary
              </button>
            </div>
          </div>

          {/* Full Disclaimer Banner in Footer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-[11px] text-slate-500 leading-relaxed text-center sm:text-left flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong>Important Legal Disclaimer:</strong> LegalEase provides general informational assistance and is not a substitute for advice from a qualified lawyer. AI-generated information may contain errors. Always consult a qualified legal professional for advice about your specific situation. LegalEase does not provide legal advice or form an attorney-client relationship.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
