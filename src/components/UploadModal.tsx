import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileCheck,
  AlertCircle,
  X,
  Sparkles,
  Loader2,
  File,
  CheckCircle2,
} from 'lucide-react';
import { DocumentRecord, DocumentAnalysisResult, SampleContract } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (doc: DocumentRecord, analysis: DocumentAnalysisResult | null) => void;
  samples: SampleContract[];
  onSelectSample: (sampleId: string) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  samples,
  onSelectSample,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateFile = (file: File): string | null => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const allowed = ['pdf', 'docx', 'txt'];
    if (!ext || !allowed.includes(ext)) {
      return `Unsupported file format (.${ext || 'unknown'}). LegalEase supports PDF, DOCX, and TXT documents.`;
    }
    if (file.size === 0) {
      return 'The selected file is empty (0 bytes). Please select a valid document.';
    }
    const maxSizeBytes = 15 * 1024 * 1024; // 15MB
    if (file.size > maxSizeBytes) {
      return 'File size exceeds 15 MB limit. Please upload a smaller document.';
    }
    return null;
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMessage(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const error = validateFile(file);
      if (error) {
        setErrorMessage(error);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const error = validateFile(file);
      if (error) {
        setErrorMessage(error);
        return;
      }
      setSelectedFile(file);
    }
  };

  const startUploadAndAnalyze = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProgressPercent(20);
    setProcessStep('Uploading document securely...');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      setProgressPercent(45);
      setProcessStep('Extracting and normalizing document text...');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setProgressPercent(80);
      setProcessStep('Generating plain-language legal analysis...');

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload and process document.');
      }

      setProgressPercent(100);
      setProcessStep('Finalizing dashboard...');

      setTimeout(() => {
        setIsProcessing(false);
        onUploadSuccess(data.document, data.analysis);
        onClose();
      }, 400);
    } catch (err: any) {
      setIsProcessing(false);
      setProgressPercent(0);
      setErrorMessage(
        err.message || 'An unexpected error occurred during document processing.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">Upload Legal Document</h2>
              <p className="text-xs text-slate-500">Supports PDF, DOCX, and TXT files up to 15 MB</p>
            </div>
          </div>
          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleFileDrop}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                : selectedFile
                ? 'border-emerald-400 bg-emerald-50/30'
                : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
            } ${isProcessing ? 'pointer-events-none opacity-80' : ''}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept=".pdf,.docx,.txt"
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <FileCheck className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-900">{selectedFile.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} KB · {selectedFile.type || 'Document'}
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="mt-3 text-xs text-slate-500 hover:text-rose-600 underline font-medium"
                >
                  Change file
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-slate-800">
                  <span className="text-indigo-600 font-semibold">Click to browse</span> or drag and drop your document
                </p>
                <p className="text-xs text-slate-400 mt-1.5">
                  PDF, DOCX, or TXT (Lease, NDA, Service Contract, Terms, Employment, etc.)
                </p>
              </div>
            )}
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Document Upload Error</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Progress Status */}
          {isProcessing && (
            <div className="space-y-2 p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl">
              <div className="flex items-center justify-between text-xs font-medium text-indigo-900">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  {processStep}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-indigo-200/50 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* 1-Click Sample Contracts Quick Selection */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Or explore with a sample contract:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  disabled={isProcessing}
                  onClick={() => {
                    onSelectSample(sample.id);
                    onClose();
                  }}
                  className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group disabled:opacity-50"
                >
                  <p className="text-xs font-medium text-slate-800 group-hover:text-indigo-700 truncate">
                    {sample.title}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{sample.category}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            🔒 Files are processed securely for text analysis
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={startUploadAndAnalyze}
              disabled={!selectedFile || isProcessing}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition flex items-center gap-1.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Analyze Document</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
