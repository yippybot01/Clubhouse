"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, FileText, Brain } from "lucide-react";

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const results = useQuery(api.functions.globalSearch, searchQuery ? { query: searchQuery } : "skip");
  const displayResults = useMemo(() => {
    if (!results) return { memories: [], documents: [] };
    return results;
  }, [results]);
  const totalResults = displayResults.memories.length + displayResults.documents.length;

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-emerald-400/50" />
        <input
          type="text"
          placeholder="Search memories, documents, and past tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 focus:shadow-[0_0_20px_rgba(16,185,129,0.15)] transition font-sans"
        />
      </div>

      {searchQuery && (
        <div className="text-sm text-gray-400">Found {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;</div>
      )}

      <div className="space-y-6">
        {displayResults.memories.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-sans font-semibold text-white">
              <Brain className="w-5 h-5 text-amber-400" />Memories ({displayResults.memories.length})
            </div>
            <div className="space-y-3">
              {displayResults.memories.map((memory) => (
                <div key={memory._id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/[0.07] hover:border-emerald-500/20 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Brain className="w-4 h-4 text-amber-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-sans font-semibold text-white">{memory.file_path}</p>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{memory.content.substring(0, 200)}...</p>
                      {memory.tags && memory.tags.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {memory.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/20">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {displayResults.documents.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-sans font-semibold text-white">
              <FileText className="w-5 h-5 text-purple-400" />Documents ({displayResults.documents.length})
            </div>
            <div className="space-y-3">
              {displayResults.documents.map((document) => (
                <div key={document._id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/[0.07] hover:border-purple-500/20 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-sans font-semibold text-white">{document.file_path}</p>
                        <span className="text-xs bg-purple-500/10 text-purple-400 px-2 py-1 rounded-lg border border-purple-500/20">{document.doc_type}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{document.content.substring(0, 200)}...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchQuery && totalResults === 0 && (
          <div className="text-center text-gray-500 py-8">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No results found for &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}

        {!searchQuery && (
          <div className="text-center text-gray-600 py-12">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-sans">Start typing to search through memories and documents</p>
          </div>
        )}
      </div>
    </div>
  );
}
