"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Globe,
  ArrowRight,
  Search,
  Folder,
  Shield,
  CheckCircle,
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Download,
  Code2,
  Layers,
  Zap,
  Lock,
  Eye,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";
import type { AnalysisResult, FaultItem } from "@/types";


function AdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUrlParam = searchParams.get("url") || "https://example.com";

  const [inputUrl, setInputUrl] = useState(targetUrlParam);
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [impactFilter, setImpactFilter] = useState<string>("ALL");

  const runInvestigation = async (urlToFetch: string) => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToFetch }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalysisData(json.data);
      } else {
        setApiError(json.error || "Failed to analyze target website.");
      }
    } catch (err) {
      console.error("Failed to run investigation", err);
      setApiError("Network error: Could not contact investigation server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runInvestigation(targetUrlParam);
  }, [targetUrlParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    router.push(`/admin?url=${encodeURIComponent(inputUrl.trim())}`);
  };

  const filteredFaults = analysisData
    ? analysisData.faults.filter((f) => {
        const matchesCategory = categoryFilter === "ALL" || f.category.toUpperCase() === categoryFilter;
        const matchesImpact = impactFilter === "ALL" || f.impact.toUpperCase() === impactFilter;
        return matchesCategory && matchesImpact;
      })
    : [];

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col">
      {/* Top Admin Navbar */}
      <header className="w-full bg-[#0a0a0f]/95 border-b border-zinc-800/80 sticky top-0 z-40 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/")}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/")}>
            <div className="relative w-8 h-8 flex items-center justify-center bg-[#101014] rounded border border-zinc-800">
              <span className="absolute top-0.5 left-0.5 w-1 h-1 border-t border-l border-[#c8b082]" />
              <span className="absolute top-0.5 right-0.5 w-1 h-1 border-t border-r border-[#c8b082]" />
              <span className="absolute bottom-0.5 left-0.5 w-1 h-1 border-b border-l border-[#c8b082]" />
              <span className="absolute bottom-0.5 right-0.5 w-1 h-1 border-b border-r border-[#c8b082]" />
              <svg className="w-4 h-4 text-[#c8b082]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                <path d="M17.29 21.02c.12-.6.43-2.3.43-5.02 0-3.04-1.28-5.32-3.72-6.49" />
                <path d="M7 11.23a4 4 0 0 1 7.24-2.22" />
                <path d="M6 15c.34 2.87 1.5 5.5 2 6" />
                <path d="M9 6.8a6 6 0 0 1 9 4.2c0 2.66.5 6 1 7" />
                <path d="M12 2a10 10 0 0 0-8 10c0 3.51.5 7 1.5 10" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-semibold tracking-widest text-zinc-400">PERFORMANCE DETECTIVE</span>
              <span className="text-xs font-bold text-zinc-100 tracking-wider uppercase">GENERIC DIAGNOSTIC ADMIN</span>
            </div>
          </div>
        </div>

        {/* Dynamic URL Search Bar */}
        <form onSubmit={handleSubmit} className="hidden md:flex items-center gap-2 bg-[#121217] border border-zinc-800 rounded-lg p-1 w-96">
          <Globe className="w-4 h-4 text-zinc-500 ml-2" />
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter website URL to audit..."
            className="bg-transparent text-xs text-zinc-200 placeholder-zinc-500 outline-none w-full py-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#c8b082] hover:bg-[#b89f71] text-zinc-950 font-semibold text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors shrink-0"
          >
            {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Run Audit"}
          </button>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => runInvestigation(targetUrlParam)}
            disabled={loading}
            className="px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-lg flex items-center gap-2 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#c8b082]" : ""}`} />
            <span>Re-Scan</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-xs font-medium text-zinc-950 bg-[#c8b082] hover:bg-[#b89f71] rounded-lg flex items-center gap-1.5 transition-colors font-semibold shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Body */}
      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
        {/* API Error Alert Banner */}
        {apiError && (
          <div className="bg-red-950/40 border border-red-800/80 rounded-xl p-4 flex items-center gap-3 text-red-200 text-sm shadow-lg">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <div className="flex-1">
              <span className="font-semibold text-red-300">Investigation Error:</span> {apiError}
            </div>
          </div>
        )}

        {/* Case File Metadata Card */}
        <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-[#ebe4d4] text-zinc-950 text-xs font-mono font-bold tracking-wider uppercase border border-[#c7beaa]">
                {analysisData?.caseId || "#CASE-0001"}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                Investigated on {analysisData?.investigatedAt || "May 21, 2024"}
              </span>
            </div>

            <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#c8b082]" />
              {analysisData?.normalizedUrl || targetUrlParam}
            </h1>

            <p className="text-xs text-zinc-400">
              Generic Multi-Diagnostic Audit • {analysisData?.metrics.requestsCount || 0} Total Requests • {analysisData?.metrics.domNodesCount || 0} DOM Elements • {analysisData?.metrics.pageSizeKb || 0} KB Payload
            </p>
          </div>

          {/* Overall Health Badge */}
          <div className="flex items-center gap-4 bg-[#121218] border border-zinc-800/80 rounded-xl p-4 shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                OVERALL HEALTH SCORE
              </div>
              <div className="text-2xl font-black text-[#c8b082]">
                {loading ? "--" : `${analysisData?.overallHealthScore || 82}/100`}
              </div>
            </div>
            <CheckCircle2 className="w-8 h-8 text-[#c8b082]" />
          </div>
        </div>

        {/* 4 Category Health Scores Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Performance Category */}
          <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Performance
              </span>
              <span className="text-xs text-zinc-500 font-mono">Weight 40%</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">
                {loading ? "--" : analysisData?.categoryScores.performance || 68}
              </span>
              <span className="text-xs text-zinc-500 font-medium">/100</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                style={{ width: `${analysisData?.categoryScores.performance || 68}%` }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
          </div>

          {/* SEO Category */}
          <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
                <Search className="w-4 h-4 text-blue-500" />
                SEO Readiness
              </span>
              <span className="text-xs text-zinc-500 font-mono">Weight 25%</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">
                {loading ? "--" : analysisData?.categoryScores.seo || 85}
              </span>
              <span className="text-xs text-zinc-500 font-medium">/100</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                style={{ width: `${analysisData?.categoryScores.seo || 85}%` }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>

          {/* Security Category */}
          <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-500" />
                Security Headers
              </span>
              <span className="text-xs text-zinc-500 font-mono">Weight 20%</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">
                {loading ? "--" : analysisData?.categoryScores.security || 90}
              </span>
              <span className="text-xs text-zinc-500 font-medium">/100</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                style={{ width: `${analysisData?.categoryScores.security || 90}%` }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
          </div>

          {/* Accessibility Category */}
          <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-purple-500" />
                Accessibility
              </span>
              <span className="text-xs text-zinc-500 font-mono">Weight 15%</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">
                {loading ? "--" : analysisData?.categoryScores.accessibility || 75}
              </span>
              <span className="text-xs text-zinc-500 font-medium">/100</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
              <div
                style={{ width: `${analysisData?.categoryScores.accessibility || 75}%` }}
                className="h-full bg-purple-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Detailed Faults Log & Diagnostic Filters */}
        <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-6 shadow-2xl space-y-6">
          {/* Filter Bar Controls */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-[#c8b082]" />
                Detected Website Faults & Diagnostic Clues
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Calculated vulnerabilities, missing meta tags, render-blocking scripts, and header configurations.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <div className="flex items-center gap-1 bg-[#14141a] p-1 rounded-xl border border-zinc-800">
                {["ALL", "PERFORMANCE", "SEO", "SECURITY", "ACCESSIBILITY"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      categoryFilter === cat
                        ? "bg-[#c8b082] text-zinc-950 shadow"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Impact Severity Filter */}
              <div className="flex items-center gap-1 bg-[#14141a] p-1 rounded-xl border border-zinc-800">
                {["ALL", "CRITICAL", "WARNING", "INFO"].map((imp) => (
                  <button
                    key={imp}
                    onClick={() => setImpactFilter(imp)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      impactFilter === imp
                        ? imp === "CRITICAL"
                          ? "bg-red-500 text-white"
                          : imp === "WARNING"
                          ? "bg-amber-500 text-zinc-950"
                          : "bg-zinc-700 text-white"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {imp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Fault Cards Grid */}
          {loading ? (
            <div className="py-20 text-center text-zinc-500 text-sm flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#c8b082]" />
              <span>Performing multi-category generic audit (Speed, SEO, Security, Accessibility)...</span>
            </div>
          ) : filteredFaults.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No issues detected for the selected filters.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaults.map((fault) => (
                <div
                  key={fault.id}
                  className="bg-[#121218] border border-zinc-800/90 rounded-xl p-5 shadow-lg space-y-4 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-semibold text-[#c8b082] bg-[#c8b082]/10 px-2 py-0.5 rounded border border-[#c8b082]/30">
                        {fault.id}
                      </span>
                      <h3 className="text-base font-bold text-white">{fault.title}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                        {fault.category}
                      </span>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                          fault.impact === "Critical"
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : fault.impact === "Warning"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                        }`}
                      >
                        {fault.impact}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">{fault.description}</p>

                  {/* Code Clue Snippet */}
                  {fault.clueCode && (
                    <div className="bg-[#09090d] border border-zinc-800 rounded-lg p-3 font-mono text-xs text-[#d4b170] overflow-x-auto flex items-center gap-3">
                      <Code2 className="w-4 h-4 text-zinc-500 shrink-0" />
                      <code>{fault.clueCode}</code>
                    </div>
                  )}

                  {/* Recommended Fix */}
                  <div className="bg-[#161620] border-l-2 border-[#c8b082] p-3 rounded-r-lg text-xs text-zinc-200">
                    <span className="font-bold text-[#c8b082] mr-2">Recommended Fix:</span>
                    {fault.recommendation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070709] text-zinc-400 p-8">Loading Generic Diagnostic Dashboard...</div>}>
      <AdminContent />
    </Suspense>
  );
}
