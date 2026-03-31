"use client";

import React from "react";

export default function SEOReportView({ report }: { report: any }) {
  if (!report) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400";
    if (score >= 70) return "text-blue-400";
    if (score >= 50) return "text-amber-400";
    return "text-red-400";
  };

  const getCardStyle = (score: number) => {
    if (score >= 90) return "from-emerald-500/10 to-transparent border-emerald-500/20";
    if (score >= 70) return "from-blue-500/10 to-transparent border-blue-500/20";
    if (score >= 50) return "from-amber-500/10 to-transparent border-amber-500/20";
    return "from-red-500/10 to-transparent border-red-500/20";
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10 mt-2 relative overflow-hidden group">
      
      {/* Background decorations removed for professional look */}

      <div className="flex justify-between items-center mb-8 relative z-10 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">SEO Grading Engine</h2>
          <p className="text-gray-400 text-sm mt-1">Algorithmic validation of SERP readiness</p>
        </div>
        <div className={`text-6xl font-black tracking-tighter ${getScoreColor(report.overall_score)} flex items-baseline gap-1`}>
          {report.overall_score}
          <span className="text-2xl font-bold opacity-40 mix-blend-overlay">/100</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 relative z-10">
        <StatCard title="Keyword Density" value={report.keyword_density} gradient="from-purple-500/10" borderCol="border-purple-500/20" valColor="text-purple-300" />
        <StatCard title="Readability" value={report.readability_score} gradient="from-blue-500/10" borderCol="border-blue-500/20" valColor="text-blue-300" />
        <StatCard title="AI Detectability" value={report.ai_detectability} gradient="from-orange-500/10" borderCol="border-orange-500/20" valColor="text-orange-300" />
        <StatCard title="Featured Snippet" value={report.snippet_prediction?.snippet_probability || report.snippet_probability || "N/A"} gradient="from-emerald-500/10" borderCol="border-emerald-500/20" valColor="text-emerald-300" />
      </div>

      <div className={`bg-gradient-to-r ${getCardStyle(report.heading_optimization.score)} p-6 rounded-xl border relative z-10 backdrop-blur-sm`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-white tracking-wide">Heading Optimization</h3>
          <span className={`text-sm font-bold ${getScoreColor(report.heading_optimization.score)} text-2xl`}>{report.heading_optimization.score}/100</span>
        </div>
        
        {report.heading_optimization.issues?.length > 0 ? (
          <ul className="list-disc list-inside text-sm text-red-300/90 space-y-1 mt-4 border-t border-white/10 pt-4">
            {report.heading_optimization.issues.map((issue: string, i: number) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-2 text-emerald-400 mt-2 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            Perfect heading structure detected.
          </div>
        )}
      </div>

      {/* --- Hackathon Winning Block: Revenue Pipeline & Ranking Explanation --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 relative z-10">
        {/* Blog -> Money Pipeline */}
        {report.revenue_pipeline && (
          <div className="bg-gradient-to-br from-green-900/40 to-emerald-900/20 rounded-xl p-6 border border-green-500/30 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-green-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Revenue Pipeline
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-green-500/10 pb-2">
                <span className="text-gray-400">Est. Traffic:</span>
                <span className="font-bold text-white">{report.revenue_pipeline.estimated_traffic_volume}/mo</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-green-500/10 pb-2">
                <span className="text-gray-400">Conversion Rate:</span>
                <span className="font-bold text-white">{report.revenue_pipeline.conversion_rate}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-green-500/10 pb-2">
                <span className="text-gray-400">Captured Leads:</span>
                <span className="font-bold text-green-300">{report.revenue_pipeline.monthly_leads}/mo</span>
              </div>
              <div className="flex justify-between items-center bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                <span className="font-semibold text-green-200">Revenue Potential:</span>
                <span className="text-2xl font-black text-green-400">{report.revenue_pipeline.revenue_potential_inr}/mo</span>
              </div>
            </div>
          </div>
        )}

        {/* Why This Blog Will Rank */}
        {report.ranking_explanation && (
          <div className="bg-blue-900/20 rounded-xl p-6 border border-blue-500/30 shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-blue-400 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Explainable AI: Why This Ranks
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">✔</div>
                <span className="text-gray-300">Covers <span className="text-white font-bold">{report.ranking_explanation.intent_coverage}</span> keyword intent automatically learned</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">✔</div>
                <span className="text-gray-300">Contains <span className="text-white font-bold">{report.ranking_explanation.missing_competitor_topics_covered}</span> missing topics competitors ignored</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">✔</div>
                <span className="text-gray-300">{report.ranking_explanation.optimized_heading_structure ? "Highly optimized sub-heading nesting" : "Standard heading format"}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">✔</div>
                <span className="text-gray-300">Snippet Ready Structure Probability: <span className="text-white font-bold">{report.ranking_explanation.snippet_probability}</span></span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, gradient, borderCol, valColor }: { title: string, value: string | number, gradient: string, borderCol: string, valColor: string }) {
  return (
    <div className={`bg-gradient-to-b ${gradient} to-black/20 p-5 rounded-xl border ${borderCol} flex flex-col items-center justify-center transform hover:scale-[1.03] hover:shadow-lg transition-all duration-300`}>
      <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 text-center font-bold">{title}</div>
      <div className={`text-2xl font-black ${valColor}`}>{value}</div>
    </div>
  );
}
