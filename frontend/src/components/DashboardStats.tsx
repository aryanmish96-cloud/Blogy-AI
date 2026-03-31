"use client";

import React, { useEffect, useState } from "react";

export default function DashboardStats() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dashboard-stats")
      .then(res => res.json())
      .then(data => setStats(data.data))
      .catch(err => console.error("Failed to load stats", err));
  }, []);

  if (!stats) return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl h-64 flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="text-gray-500 text-sm font-medium tracking-widest uppercase">Fetching Telemetry...</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10 flex flex-col gap-6 relative overflow-hidden group">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-radial from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

      <h2 className="text-xl font-bold text-white relative z-10 flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
        SaaS Analytics
      </h2>
      
      <div className="flex flex-col gap-5 relative z-10">
        {/* Funnel */}
        <div className="bg-blue-900/10 border border-blue-500/20 p-5 rounded-xl hover:bg-blue-900/20 transition duration-300">
          <h3 className="text-sm font-semibold text-blue-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            Conversion Funnel
          </h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex justify-between items-center bg-black/30 p-2 rounded-lg border border-white/5"><span>Signup Rate</span><span className="font-bold text-white">{stats.conversion_funnel.signup_rate}</span></div>
            <div className="flex justify-between items-center bg-black/30 p-2 rounded-lg border border-white/5"><span>Gen Rate</span><span className="font-bold text-white">{stats.conversion_funnel.generation_rate}</span></div>
            <div className="flex justify-between items-center bg-black/30 p-2 rounded-lg border border-white/5"><span>Publish Rate</span><span className="font-bold text-white">{stats.conversion_funnel.publish_rate}</span></div>
          </div>
        </div>

        {/* Bug Detection */}
        <div className="bg-red-900/10 border border-red-500/20 p-5 rounded-xl hover:bg-red-900/20 transition duration-300">
          <h3 className="text-sm font-semibold text-red-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            System Health
          </h3>
          <div className="flex flex-col gap-2 text-xs text-gray-400">
            <div className="bg-black/30 p-3 rounded-lg border border-white/5 border-l-2 border-l-red-500"><strong>SEO:</strong> {stats.bug_detection.seo_issues}</div>
            <div className="bg-black/30 p-3 rounded-lg border border-white/5 border-l-2 border-l-orange-500"><strong>Index:</strong> {stats.bug_detection.indexing_risks}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
