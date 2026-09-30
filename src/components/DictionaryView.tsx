import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  HelpCircle,
  Lightbulb,
  FileCheck2,
  Filter,
} from 'lucide-react';
import { LegalDictionaryEntry } from '../types';

interface DictionaryViewProps {
  entries: LegalDictionaryEntry[];
  onBackToApp?: () => void;
}

export const DictionaryView: React.FC<DictionaryViewProps> = ({
  entries,
  onBackToApp,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    entries.forEach((e) => set.add(e.category));
    return ['All', ...Array.from(set)];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      const matchesSearch =
        item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.simpleMeaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.example.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [entries, searchTerm, selectedCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-medium mb-3 backdrop-blur-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Legal Vocabulary Simplified</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Legal Terminology Dictionary
          </h1>
          <p className="mt-2 text-indigo-100 text-sm sm:text-base leading-relaxed">
            Contracts are often filled with obscure jargon. Use this educational guide to understand what key legal terms mean in plain, everyday language.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search terms, keywords, meanings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:inline" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEntries.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-slate-900">{item.term}</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 rounded px-2 py-0.5">
                  {item.category}
                </span>
              </div>

              {/* Simple Meaning */}
              <div className="mt-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 mb-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Simple Meaning</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-indigo-50/40 p-2.5 rounded-lg border border-indigo-100/60">
                  {item.simpleMeaning}
                </p>
              </div>

              {/* Example */}
              <div className="mt-3">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Real-World Example</span>
                </div>
                <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  "{item.example}"
                </p>
              </div>
            </div>

            {/* Practical Tip */}
            {item.practicalTip && (
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-amber-900 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/50">
                <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-950">Tip to watch for: </span>
                  {item.practicalTip}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-700 font-medium text-sm">No legal terms match your search.</p>
          <p className="text-slate-400 text-xs mt-1">Try clearing your filters or search query.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="mt-3 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-lg hover:bg-indigo-100 transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
