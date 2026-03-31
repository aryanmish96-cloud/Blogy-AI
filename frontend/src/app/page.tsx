"use client";

import React, { useState } from "react";
import GeneratorForm from "../components/GeneratorForm";
import SEOReportView from "../components/SEOReportView";
import DashboardStats from "../components/DashboardStats";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [generatedData, setGeneratedData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [publishing, setPublishing] = useState("");
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  // Competitor Analysis State
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [competitorReport, setCompetitorReport] = useState<any>(null);

  React.useEffect(() => {
    const token = localStorage.getItem("blogy_token");
    const storedName = localStorage.getItem("blogy_user_name");
    if (token) {
      setIsAuthenticated(true);
      if (storedName) setUserName(storedName);
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");
    try {
      const endpoint = isLoginMode ? "/api/login" : "/api/signup";
      const payload = isLoginMode ? { email, password } : { name, email, password };
      
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Authentication failed");
      
      localStorage.setItem("blogy_token", data.token);
      localStorage.setItem("blogy_user_name", data.user.name);
      setUserName(data.user.name);
      setIsAuthenticated(true);
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("blogy_token");
    setIsAuthenticated(false);
  };

  const handleComplete = (data: any) => {
    setGeneratedData(data);
  };

  const publishToPlatform = async (platform: string) => {
    setPublishing(platform);
    try {
      const response = await fetch(`${API_BASE_URL}/api/adapt-platform`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: generatedData.data.final_blog, platform }),
      });
      const data = await response.json();
      alert(`Successfully adapted for ${platform}!\n\nPreview snippet:\n${data.adapted_content.substring(0, 150)}...`);
    } catch (err) {
      alert(`Failed to adapt for ${platform}`);
    }
    setPublishing("");
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans flex items-center justify-center p-4 selection:bg-blue-500/30">
        <div className="max-w-md w-full animate-fade-in-up">
          <div className="text-center mb-10 text-white">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-3xl flex items-center justify-center shadow-lg mx-auto mb-4">B</div>
            <h1 className="text-4xl font-black tracking-tight mt-4">Blogy<span className="text-blue-500">.ai</span></h1>
            <p className="text-gray-400 mt-3 font-light">Secure Engine Workspace Setup</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex gap-2 mb-8 bg-black/40 p-1 rounded-xl">
              <button onClick={() => {setIsLoginMode(true); setAuthError("");}} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${isLoginMode ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}>Login</button>
              <button onClick={() => {setIsLoginMode(false); setAuthError("");}} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${!isLoginMode ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}>Sign Up</button>
            </div>

            <form onSubmit={handleAuth} className="flex flex-col gap-5">
              {!isLoginMode && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required={!isLoginMode} className="w-full px-5 py-4 bg-[#0a0a0f]/80 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50 text-white text-base transition-all" placeholder="John Doe" />
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-5 py-4 bg-[#0a0a0f]/80 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50 text-white text-base transition-all" placeholder="name@company.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-widest mb-2 ml-1">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-5 py-4 bg-[#0a0a0f]/80 rounded-xl border border-white/10 focus:outline-none focus:border-blue-500/50 text-white text-base transition-all" placeholder="••••••••" />
              </div>

              {authError && (
                <div className="text-red-400 text-sm px-4 py-3 bg-red-950/30 border border-red-500/30 rounded-lg flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  {authError}
                </div>
              )}

              <button type="submit" disabled={isAuthenticating} className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-500 border border-blue-500/50 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                {isAuthenticating ? "Processing..." : (isLoginMode ? "Login to Workspace" : "Create Account")}
              </button>
            </form>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-gray-100 font-sans selection:bg-blue-500/30 overflow-hidden relative">
      {/* Clean solid background */}
      
      <header className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 font-bold text-white flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">B</div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Blogy<span className="text-blue-500">.ai</span>
            </h1>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <button onClick={() => setActiveTab('dashboard')} className={`pb-7 pt-7 transition-colors ${activeTab === 'dashboard' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}>Dashboard</button>
            <button onClick={() => setActiveTab('competitor')} className={`pb-7 pt-7 transition-colors ${activeTab === 'competitor' ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}>Competitor Intel ⚡</button>
            <button onClick={() => setActiveTab('generations')} className={`pb-7 pt-7 transition-colors ${activeTab === 'generations' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}>Generations</button>
            <button onClick={() => setActiveTab('settings')} className={`pb-7 pt-7 transition-colors ${activeTab === 'settings' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-white border-b-2 border-transparent'}`}>Settings</button>
          </nav>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-300 hidden md:block">Welcome, <span className="text-white font-bold">{userName}</span></span>
            <button onClick={logout} className="text-xs font-semibold text-gray-400 hover:text-white transition uppercase tracking-widest mx-2">Disengage</button>
            <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sm font-bold text-blue-300 shadow-inner cursor-pointer hover:bg-blue-600/30 transition shadow-lg">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {activeTab === 'dashboard' && (
          <>
            {/* Top Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
              <div>
                <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500 mt-2 tracking-tight">Intelligence Workspace</h2>
                <p className="text-gray-400 mt-2 text-lg font-light">Command your automated SEO content engine.</p>
              </div>
              <div className="flex gap-3">
                <button 
                  className="bg-white/5 border border-white/10 text-gray-300 font-medium py-2.5 px-5 rounded-xl hover:bg-white/10 hover:text-white transition-all backdrop-blur-md"
                  onClick={() => alert("Mock: Exporting your SEO report as PDF...")}
                >
                  Export Report
                </button>
                <button 
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-2.5 px-6 rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transform hover:-translate-y-0.5"
                  onClick={() => alert("Mock: Starting a new blog SEO campaign...")}
                >
                  + New Campaign
                </button>
              </div>
            </div>

            {/* Dynamic Engine Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              <div className="lg:col-span-4 flex flex-col gap-8">
                <div className="transform hover:scale-[1.01] transition-transform duration-300">
                  <GeneratorForm onComplete={handleComplete} />
                </div>
                
                <div className="transform hover:scale-[1.01] transition-transform duration-300">
                  <DashboardStats />
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-8">
                {generatedData ? (
                  <div className="flex flex-col gap-8 animate-fade-in">
                    <div className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-sm flex flex-col h-full relative overflow-hidden group">
                      
                      <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10 relative z-10">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                          <span className="w-2 h-8 bg-blue-500 rounded-full inline-block"></span>
                          Generated Article Masterpiece
                        </h2>
                        <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.2)]">Ready to Publish</span>
                      </div>
                      
                      <div className="prose prose-invert max-w-none flex-grow bg-black/40 p-8 rounded-xl overflow-y-auto max-h-[600px] border border-white/5 shadow-inner custom-scrollbar relative z-10">
                        <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-gray-300">
                          {generatedData.data.final_blog}
                        </pre>
                      </div>
                      
                      {/* Multi-Platform Publishing */}
                      <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">One-Click Multi-Platform Publishing</h3>
                        <div className="flex flex-wrap gap-3">
                          {['Medium', 'LinkedIn', 'Dev.to', 'WordPress'].map(platform => (
                            <button 
                              key={platform}
                              onClick={() => publishToPlatform(platform)}
                              disabled={publishing !== ""}
                              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-200 transition-colors flex items-center gap-2"
                            >
                              {publishing === platform ? (
                                <svg className="animate-spin h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                              ) : (
                                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
                              )}
                              Export to {platform}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <SEOReportView report={generatedData.seo_report} />
                    
                    {/* LIVE SEO COACH */}
                    <div className="bg-gradient-to-r from-indigo-900/40 to-blue-900/20 p-6 rounded-2xl border border-indigo-500/40 shadow-[0_0_30px_rgba(79,70,229,0.15)] mt-8 animate-fade-in-up">
                       <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-5">
                         <div className="relative flex h-3 w-3 sm:mr-1">
                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                           <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                         </div>
                         Live SEO Coach
                       </h3>
                       <div className="space-y-3">
                         {generatedData.seo_report.snippet_prediction?.suggestions?.map((sug: string, i: number) => (
                           <div key={`sug-${i}`} className="bg-indigo-950/40 border border-indigo-500/20 p-4 rounded-xl flex gap-3 items-center transform transition hover:scale-[1.01]">
                             <span className="text-indigo-400 text-lg">👉</span>
                             <span className="text-indigo-100 font-medium">{sug}</span>
                           </div>
                         ))}
                         {generatedData.seo_report.heading_optimization?.issues?.map((issue: string, i: number) => (
                           <div key={`iss-${i}`} className="bg-indigo-950/40 border border-indigo-500/20 p-4 rounded-xl flex gap-3 items-center transform transition hover:scale-[1.01]">
                             <span className="text-indigo-400 text-lg">👉</span>
                             <span className="text-indigo-100 font-medium">Fix Structure: {issue}</span>
                           </div>
                         ))}
                         {/* Fallback positive reinforcement if perfectly optimized */}
                         {(!generatedData.seo_report.snippet_prediction?.suggestions?.length && !generatedData.seo_report.heading_optimization?.issues?.length) && (
                           <div className="bg-green-950/40 border border-green-500/20 p-4 rounded-xl flex gap-3 items-center">
                             <span className="text-green-400 text-lg">🏆</span>
                             <span className="text-green-100 font-medium">Perfectly optimized! The SEO Coach has no further recommendations for this masterpiece.</span>
                           </div>
                         )}
                       </div>
                    </div>
                    
                    {/* Keyword Intelligence & SERP Gap Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Keyword Intelligence</h3>
                        <div className="space-y-4 text-sm text-gray-300">
                          <div><span className="text-gray-500 font-medium">Intent:</span> <span className="capitalize">{generatedData.data.keyword_data.intent}</span></div>
                          <div><span className="text-gray-500 font-medium">Volume:</span> <span>{generatedData.data.keyword_data.search_volume_estimate}</span></div>
                          <div>
                            <span className="text-gray-500 font-medium block mb-1">LSI Clusters:</span>
                            <div className="flex flex-wrap gap-2">
                              {generatedData.data.keyword_data.lsi.map((k: string, i: number) => <span key={i} className="bg-blue-500/10 text-blue-300 px-2 py-1 rounded text-xs border border-blue-500/20">{k}</span>)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-500 font-medium block mb-1">Long-tail Variations:</span>
                            <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                              {generatedData.data.keyword_data.long_tail.map((k: string, i: number) => <li key={i}>{k}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-sm relative overflow-hidden group">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2 relative z-10"><span className="w-2 h-2 rounded-full bg-orange-500"></span>SERP Gap Analyzer</h3>
                        <div className="space-y-3 text-sm text-gray-300 relative z-10">
                          <p className="bg-orange-500/10 text-orange-200 p-3 rounded-lg border border-orange-500/20 mb-4 font-medium italic text-xs leading-relaxed">
                            💡 "{generatedData.data.serp_report.why_rank_higher}"
                          </p>
                          <div><span className="text-gray-500 font-medium block mb-1">Competitor Content Gaps:</span></div>
                          <ul className="list-disc list-inside text-xs space-y-1 ml-2">
                            {generatedData.data.serp_report.content_gaps.map((item: string, i: number) => <li key={i}>{item}</li>)}
                          </ul>
                          <div className="mt-3"><span className="text-gray-500 font-medium block mb-1">Missing Keywords in Top 10:</span></div>
                          <div className="flex flex-wrap gap-2">
                            {generatedData.data.serp_report.missing_keywords.map((k: string, i: number) => <span key={i} className="bg-orange-500/10 text-orange-300 px-2 py-1 rounded text-xs border border-orange-500/20">{k}</span>)}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="relative bg-[#0a0a0f] p-8 rounded-2xl border border-blue-500/20 shadow-sm overflow-hidden group">
                      <div className="relative z-10">
                        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                          Generative Engine Optimization (GEO)
                        </h3>
                        <p className="text-base text-blue-200 italic mb-6 border-l-4 border-blue-500 pl-4 py-1">"{generatedData.data.geo_optimization.snippet_ready_answer}"</p>
                        
                        <div className="bg-[#0a0a0f] rounded-xl p-5 overflow-auto border border-white/10 shadow-inner">
                          <code className="text-green-400 text-sm block min-w-full font-mono">
                            {generatedData.data.geo_optimization.faq_schema}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur-xl p-10 rounded-2xl border border-white/10 flex flex-col items-center justify-center h-full min-h-[500px] text-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.2)] relative z-10">
                      <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white relative z-10">Awaiting Content Matrix</h3>
                    <p className="text-gray-400 mt-3 max-w-md text-lg font-light relative z-10">Initialize the Generator on the left to synthesize a high-ranking blog from your seed keyword.</p>
                  </div>
                )}
              </div>

            </div>
          </>
        )}

        {/* --- HACKATHON WOW FEATURE: Competitor Breakdown --- */}
        {activeTab === 'competitor' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/20 p-8 rounded-2xl border border-purple-500/30 shadow-2xl">
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2 tracking-tight">Competitor Intelligence ⚡</h2>
              <p className="text-gray-400 mb-8 font-medium">Extract the exact SEO strengths and critical weaknesses of any ranking competitor. Exploit their gaps and outrank them effortlessly.</p>
              
              <div className="flex gap-4">
                <input 
                  type="url" 
                  value={competitorUrl} 
                  onChange={(e) => setCompetitorUrl(e.target.value)} 
                  placeholder="https://competitor.com/blog/..." 
                  className="flex-1 px-5 py-4 rounded-xl bg-black/40 border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 transition"
                  required
                />
                <button 
                  onClick={async () => {
                    if (!competitorUrl) return;
                    setIsAnalyzing(true);
                    try {
                      const res = await fetch(`${API_BASE_URL}/api/analyze-competitor`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ url: competitorUrl })
                      });
                      const data = await res.json();
                      setCompetitorReport(data.analysis);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsAnalyzing(false);
                    }
                  }}
                  disabled={isAnalyzing}
                  className="px-8 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-[0_0_15px_rgba(147,51,234,0.4)] flex items-center justify-center min-w-[200px]"
                >
                  {isAnalyzing ? "Extracting DNA..." : "Analyze DNA"}
                </button>
              </div>
            </div>

            {competitorReport && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 animate-fade-in-up">
                {/* Strengths */}
                <div className="bg-emerald-950/30 rounded-2xl p-6 border border-emerald-500/30 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-500 text-6xl">🛡️</div>
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-xl">🛡️</div>
                    <h3 className="text-xl font-bold text-emerald-400">Why They Rank</h3>
                  </div>
                  <ul className="space-y-4 relative z-10">
                    {competitorReport.strengths.map((str: string, i: number) => (
                      <li key={`str-${i}`} className="flex gap-3 text-emerald-100/80">
                        <span className="text-emerald-400 font-bold shrink-0">✓</span> {str}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-red-950/30 rounded-2xl p-6 border border-red-500/30 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500 text-6xl">🎯</div>
                  <div className="flex items-center gap-3 mb-6 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 font-black text-xl">🎯</div>
                    <h3 className="text-xl font-bold text-red-400">Their Vulnerabilities</h3>
                  </div>
                  <ul className="space-y-4 relative z-10">
                    {competitorReport.weaknesses.map((weak: string, i: number) => (
                      <li key={`weak-${i}`} className="flex gap-3 text-red-100/80">
                        <span className="text-red-400 font-bold shrink-0">✗</span> {weak}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-6 border-t border-red-500/20 relative z-10">
                    <button onClick={() => {setActiveTab('dashboard'); setCompetitorReport(null);}} className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg font-bold transition">
                      Exploit & Outrank Them Now →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'generations' && (
          <div className="animate-fade-in max-w-5xl mx-auto">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500 mb-6 tracking-tight">Generation Archive</h2>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#0a0a0f] text-gray-300 uppercase font-semibold border-b border-white/10">
                  <tr>
                    <th className="px-6 py-5 tracking-wider">Seed Keyword</th>
                    <th className="px-6 py-5 tracking-wider">Timestamp</th>
                    <th className="px-6 py-5 tracking-wider">SEO Score</th>
                    <th className="px-6 py-5 tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="px-6 py-5 text-white font-medium flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div> Blogy - Best AI Blog Automation Tool
                    </td>
                    <td className="px-6 py-5 font-mono text-xs">Today, 10:45 AM</td>
                    <td className="px-6 py-5"><span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">98/100</span></td>
                    <td className="px-6 py-5 text-right"><button className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Review</button></td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="px-6 py-5 text-white font-medium flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div> How Blogy is Disrupting Martech
                    </td>
                    <td className="px-6 py-5 font-mono text-xs">Yesterday</td>
                    <td className="px-6 py-5"><span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20">92/100</span></td>
                    <td className="px-6 py-5 text-right"><button className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Review</button></td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors group cursor-pointer opacity-60">
                    <td className="px-6 py-5 text-white font-medium flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gray-600"></div> SEO Tips for Beginners 2024
                    </td>
                    <td className="px-6 py-5 font-mono text-xs">Older</td>
                    <td className="px-6 py-5"><span className="text-orange-400 font-bold bg-orange-500/10 px-3 py-1 rounded-md border border-orange-500/20">64/100</span></td>
                    <td className="px-6 py-5 text-right"><button className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">Review</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-3xl mx-auto animate-fade-in relative">
            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500 mb-8 tracking-tight">Workspace Configuration</h2>
            
            <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl flex flex-col gap-8 relative z-10">
              
              <div className="group">
                <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-widest uppercase">OpenAI API Key</label>
                <div className="relative">
                  <input type="password" placeholder="sk-..." className="relative w-full px-5 py-4 bg-[#0a0a0f]/80 rounded-xl border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all font-mono text-sm shadow-inner" defaultValue="sk-blogy-hackathon-demo-key" />
                </div>
                <p className="text-sm text-gray-500 mt-3 font-light">Controls the advanced GPT-4 context windows for the Blog Generation Engine fallback model.</p>
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-300 mb-3 tracking-widest uppercase">Default Target Language</label>
                <div className="relative">
                  <select className="relative w-full px-5 py-4 bg-[#0a0a0f] rounded-xl border border-white/10 text-white focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer">
                    <option>English (US) - High Priority</option>
                    <option>English (UK)</option>
                    <option>Spanish (ES)</option>
                    <option>French (FR)</option>
                  </select>
                  <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-6 pt-8 border-t border-white/10">
                <button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transform hover:-translate-y-1"
                  onClick={() => alert('Configurations saved to the secure vault.')}
                >
                  Save Configurations
                </button>
                <button className="text-gray-400 hover:text-white px-4 py-2 transition-colors font-medium">Reset Defaults</button>
              </div>

            </div>
          </div>
        )}

      </div>
      
      {/* Custom Styles for scrollbar & animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
      `}} />
    </main>
  );
}
