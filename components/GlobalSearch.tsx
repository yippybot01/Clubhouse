"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, FileText, Brain } from "lucide-react";

export default function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const results = useQuery(
    api.functions.globalSearch,
    searchQuery ? { query: searchQuery } : "skip"
  );

  const displayResults = useMemo(() => {
    if (!results) return { memories: [], documents: [] };
    return results;
  }, [results]);

  const totalResults =
    displayResults.memories.length + displayResults.documents.length;

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search memories, documents, and past tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      {/* Results Summary */}
      {searchQuery && (
        <div className="text-sm text-slate-400">
          Found {totalResults} result{totalResults !== 1 ? "s" : ""} for "{searchQuery}"
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
        {/* Memory Results */}
        {displayResults.memories.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-white">
              <Brain className="w-5 h-5 text-cyan-400" />
              Memories ({displayResults.memories.length})
            </div>
            <div className="space-y-3">
              {displayResults.memories.map((memory) => (
                <div
                  key={memory._id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <Brain className="w-4 h-4 text-cyan-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-white">{memory.file_path}</p>
                      <p className="text-sm text-slate-300 mt-1 line-clamp-2">
                        {memory.content.substring(0, 200)}...
                      </p>
                      {memory.tags && memory.tags.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {memory.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-cyan-900/30 text-cyan-300 px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
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

        {/* Document Results */}
        {displayResults.documents.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-semibold text-white">
              <FileText className="w-5 h-5 text-blue-400" />
              Documents ({displayResults.documents.length})
            </div>
            <div className="space-y-3">
              {displayResults.documents.map((document) => (
                <div
                  key={document._id}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <FileText className="w-4 h-4 text-blue-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-white">{document.file_path}</p>
                        <span className="text-xs bg-blue-900/30 text-blue-300 px-2 py-1 rounded">
                          {document.doc_type}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1 line-clamp-2">
                        {document.content.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && totalResults === 0 && (
          <div className="text-center text-slate-400 py-8">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No results found for "{searchQuery}"</p>
          </div>
        )}

        {/* Placeholder */}
        {!searchQuery && (
          <div className="text-center text-slate-400 py-12">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Start typing to search through memories and documents</p>
          </div>
        )}
      </div>
    </div>
  );
}
