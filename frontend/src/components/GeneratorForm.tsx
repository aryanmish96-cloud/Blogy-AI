"use client";

import React, { useState } from "react";

export default function GeneratorForm({ onComplete }: { onComplete: (data: any) => void }) {
  const [keyword, setKeyword] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [mode, setMode] = useState<"generate" | "rewrite">("generate");
  const [draftContent, setDraftContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = mode === "generate" ? "/api/generate-blog" : "/api/rewrite-blog";
      const payload = mode === "generate" 
        ? { seed_keyword: keyword, tone, length }
        : { content: draftContent, keyword: keyword };

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to process request");

      const data = await response.json();
      
      let formattedData = data;
      if (mode === "rewrite") {
        formattedData = {
          status: "success",
          data: {
            final_blog: data.rewritten_content,
            keyword_data: { intent: "Rewrite Optimized", search_volume_estimate: "N/A", lsi: [], long_tail: [] },
            serp_report: { why_rank_higher: "Enhanced readability and added strategic keywords.", content_gaps: ["None - newly optimized"], missing_keywords: [] },
            geo_optimization: { snippet_ready_answer: "Optimized for snippets automatically.", faq_schema: "{}" }
          },
          seo_report: data.seo_report
        };
      }
      
      onComplete(formattedData);
    } catch (err: any) {
      setError(err.message || "An error occurred connecting to the Engine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden group">
      <div className="relative z-10">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Generation Engine
        </h2>
        <p className="text-sm text-gray-400 mb-8 font-light">Input a seed target to synthesize ranking content instantly using our AI pipelines.</p>
        
        <form onSubmit={handleGenerate} className="flex flex-col gap-6">
          <div className="flex gap-2 bg-black/40 p-1 rounded-xl">
            <button 
              type="button" 
              onClick={() => setMode("generate")} 
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "generate" ? "bg-blue-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              Generate New
            </button>
            <button 
              type="button" 
              onClick={() => setMode("rewrite")} 
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === "rewrite" ? "bg-purple-500 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              Rewrite Draft
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2 ml-1">
              {mode === "generate" ? "Seed Keyword / Topic" : "Target Keyword"}
            </label>
            <div className="relative group/input">
              <input
                type="text"
                className="relative w-full px-5 py-4 bg-[#0a0a0f]/80 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50 text-white placeholder-gray-500 shadow-inner text-base transition-all"
                placeholder={mode === "generate" ? "e.g., automated SEO tool" : "e.g., ai automation"}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {mode === "generate" && (
            <div className="grid grid-cols-2 gap-4 animate-fade-in">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2 ml-1">Tone Voice</label>
                <select 
                  title="Select tone"
                  className="w-full px-4 py-3 bg-[#0a0a0f] rounded-xl border border-white/10 text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  disabled={loading}
                >
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Persuasive</option>
                  <option>Academic</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2 ml-1">Word Count</label>
                <select 
                  title="Select length"
                  className="w-full px-4 py-3 bg-[#0a0a0f] rounded-xl border border-white/10 text-gray-300 focus:outline-none focus:border-blue-500 cursor-pointer"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  disabled={loading}
                >
                  <option>Short</option>
                  <option>Medium</option>
                  <option>Long</option>
                </select>
              </div>
            </div>
          )}

          {mode === "rewrite" && (
            <div className="animate-fade-in">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2 ml-1">Draft Content to Rewrite</label>
              <div className="relative group/input">
                <textarea
                  className="relative w-full px-5 py-4 bg-[#0a0a0f]/80 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50 text-white placeholder-gray-500 shadow-inner text-sm transition-all min-h-[160px] custom-scrollbar"
                  placeholder="Paste your existing blog draft here..."
                  value={draftContent}
                  onChange={(e) => setDraftContent(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm px-4 py-3 bg-red-950/50 border border-red-500/50 rounded-lg backdrop-blur-sm flex items-start gap-2 animate-fade-in">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="relative w-full overflow-hidden mt-2 group/btn rounded-xl bg-blue-600 hover:bg-blue-500 transition-colors border border-blue-500/50 text-white font-semibold shadow-sm"
            disabled={loading}
          >
            <div className="relative px-6 py-4 flex items-center justify-center gap-3 tracking-wide">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Synthesizing Content...
                </>
              ) : (
                mode === "generate" ? "Engage Generator" : "Rewrite & Optimize"
              )}
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
