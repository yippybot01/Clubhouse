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
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-club-gold/50" />
        <input
          type="text"
          placeholder="Search memories, documents, and past tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-club-navy-light/60 border border-club-gold/20 rounded-xl pl-12 pr-4 py-3 text-club-cream placeholder-club-cream/30 focus:outline-none focus:border-club-gold/50 focus:shadow-lg focus:shadow-club-gold/5 transition font-serif"
        />
      </div>

      {searchQuery && (
        <div className="text-sm text-club-cream/40">Found {totalResults} result{totalResults !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;</div>
      )}

      <div className="space-y-6">
        {displayResults.memories.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-serif font-semibold text-club-cream">
              <Brain className="w-5 h-5 text-club-gold" />Memories ({displayResults.memories.length})
            </div>
            <div className="space-y-3">
              {displayResults.memories.map((memory) => (
                <div key={memory._id} className="bg-club-navy-light/50 border border-club-gold/15 rounded-xl p-4 hover:border-club-gold/30 transition cursor-pointer">
                  <div className="flex items-start gap-3">
                    <Brain className="w-4 h-4 text-club-gold mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-serif font-semibold text-club-cream">{memory.file_path}</p>
                      <p className="text-sm text-club-cream/50 mt-1 line-clamp-2">{memory.content.substring(0, 200)}...</p>
                      {memory.tags && memory.tags.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {memory.tags.map((tag) => (
                            <span key={tag} className="text-xs bg-club-forest/15 text-emerald-300 px-2 py-1 rounded border border-club-forest-light/20">{tag}</span>
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
            <div className="flex items-center gap-2 text-lg font-serif font-semibold text-club-cream">
              <FileText className="w-5 h-5 text-club-burgundy-light" />Documents ({displayResults.documents.length})
            </div>
            <div className="space-y-3">
              {displayResults.documents.map((document) => (
                <div key={document._id} className="bg-club-navy-light/50 border border-club-gold/15 rounded-xl p-4 hover:border-club-gold/30 transition cursor-pointer">
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-club-burgundy-light mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-serif font-semibold text-club-cream">{document.file_path}</p>
                        <span className="text-xs bg-club-burgundy/15 text-club-burgundy-light px-2 py-1 rounded border border-club-burgundy/20">{document.doc_type}</span>
                      </div>
                      <p className="text-sm text-club-cream/50 mt-1 line-clamp-2">{document.content.substring(0, 200)}...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {searchQuery && totalResults === 0 && (
          <div className="text-center text-club-cream/30 py-8">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No results found for &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}

        {!searchQuery && (
          <div className="text-center text-club-cream/30 py-12">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-serif">Start typing to search through memories and documents</p>
          </div>
        )}
      </div>
    </div>
  );
}
