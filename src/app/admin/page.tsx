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
  XCircle,
  ArrowLeft,
  RefreshCw,
  Download,
  Filter,
  Code2,
  Terminal,
  Cpu,
  Layers,
} from "lucide-react";
import { AnalysisResult, FaultItem } from "@/lib/analyzer";

function AdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUrlParam = searchParams.get("url") || "https://example.com";

  const [inputUrl, setInputUrl] = useState(targetUrlParam);
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [filterImpact, setFilterImpact] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"FAULTS" | "BREAKDOWN" | "METRICS">("FAULTS");

  const runInvestigation = async (urlToFetch: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToFetch }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalysisData(json.data);
      }
    } catch (err) {
      console.error("Failed to run investigation", err);
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
        if (filterImpact === "ALL") return true;
        return f.impact.toUpperCase() === filterImpact;
      })
    : [];

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col">
      {/* Top Admin Navbar */}
      <header className="w-full bg-[#0a0a0f]/90 border-b border-zinc-800/80 sticky top-0 z-40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
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
              <svg
                className="w-4 h-4 text-[#c8b082]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
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
              <span className="text-xs font-bold text-zinc-100 tracking-wider uppercase">ADMIN DASHBOARD</span>
            </div>
          </div>
        </div>

        {/* Dynamic Investigation Search Bar */}
        <form onSubmit={handleSubmit} className="hidden md:flex items-center gap-2 bg-[#121217] border border-zinc-800 rounded-lg p-1 w-96">
          <Globe className="w-4 h-4 text-zinc-500 ml-2" />
          <input
            type="url"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="Enter website URL..."
            className="bg-transparent text-xs text-zinc-200 placeholder-zinc-500 outline-none w-full py-1"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#c8b082] hover:bg-[#b89f71] text-zinc-950 font-semibold text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors shrink-0"
          >
            {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Investigate"}
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
            className="px-3 py-1.5 text-xs font-medium text-zinc-950 bg-[#c8b082] hover:bg-[#b89f71] rounded-lg flex items-center gap-1.5 transition-colors font-semibold shadow"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
        {/* Case File Header Card */}
        <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-6 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-[#ebe4d4] text-zinc-950 text-xs font-mono font-bold tracking-wider uppercase border border-[#c7beaa]">
                {analysisData?.caseId || "#CASE-0001"}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                Investigated on {analysisData?.investigatedAt || "May 21, 2024"}
              </span>
            </div>

            <h1 className="text-2xl font-bold font-mono text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#c8b082]" />
              {analysisData?.normalizedUrl || targetUrlParam}
            </h1>

            <p className="text-xs text-zinc-400">
              Audit calculated by backend engine • {analysisData?.metrics.requestsCount || 0} total requests • {analysisData?.metrics.pageSizeKb || 0} KB payload
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-4 bg-[#121218] border border-zinc-800/80 rounded-xl p-4 shrink-0">
            <div className="text-right">
              <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                INVESTIGATION STATUS
              </div>
              <div className="text-sm font-extrabold text-[#c8b082]">
                {loading ? "CALCULATING DATA..." : analysisData?.status.replace("_", " ") || "COMPLETE"}
              </div>
            </div>
            {analysisData?.performanceScore && analysisData.performanceScore >= 90 ? (
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-[#e06a3b]" />
            )}
          </div>
        </div>

        {/* Performance Metrics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Performance Score */}
          <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="text-xs font-bold text-zinc-400 tracking-wider uppercase mb-2">
              PERFORMANCE SCORE
            </div>
            <div className="flex items-baseline gap-1.5 my-1">
              <span
                className={`text-4xl font-black tracking-tight ${
                  (analysisData?.performanceScore || 68) >= 90
                    ? "text-emerald-400"
                    : (analysisData?.performanceScore || 68) >= 60
                    ? "text-[#e06a3b]"
                    : "text-red-500"
                }`}
              >
                {loading ? "--" : analysisData?.performanceScore || 68}
              </span>
              <span className="text-xs text-zinc-500 font-medium">/100</span>
            </div>
            <div className="text-xs font-medium text-[#e06a3b] mt-1">
              {analysisData?.status.replace("_", " ") || "Needs Improvement"}
            </div>
          </div>

          {/* Card 2: LCP */}
          <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="text-xs font-bold text-zinc-400 tracking-wider uppercase mb-2">
              LCP (LARGEST PAINT)
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold font-mono text-white">
                {loading ? "--" : `${analysisData?.metrics.lcpSec || 4.2}s`}
              </span>
              <span
                className={`w-3 h-3 rounded-full ${
                  (analysisData?.metrics.lcpSec || 4.2) <= 2.5 ? "bg-emerald-500" : "bg-red-500"
                } shadow-[0_0_8px_#ef4444]`}
              />
            </div>
            <div className="text-[11px] text-zinc-500 mt-2">Target: ≤ 2.5s</div>
          </div>

          {/* Card 3: INP */}
          <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="text-xs font-bold text-zinc-400 tracking-wider uppercase mb-2">
              INP (INTERACTION)
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold font-mono text-white">
                {loading ? "--" : `${analysisData?.metrics.inpMs || 391}ms`}
              </span>
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
            </div>
            <div className="text-[11px] text-zinc-500 mt-2">Target: ≤ 200ms</div>
          </div>

          {/* Card 4: CLS */}
          <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="text-xs font-bold text-zinc-400 tracking-wider uppercase mb-2">
              CLS (LAYOUT SHIFT)
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold font-mono text-white">
                {loading ? "--" : analysisData?.metrics.cls || 0.28}
              </span>
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            </div>
            <div className="text-[11px] text-zinc-500 mt-2">Target: ≤ 0.10</div>
          </div>

          {/* Card 5: TTFB */}
          <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
            <div className="text-xs font-bold text-zinc-400 tracking-wider uppercase mb-2">
              TTFB (LATENCY)
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold font-mono text-white">
                {loading ? "--" : `${analysisData?.metrics.ttfbMs || 320}ms`}
              </span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
            </div>
            <div className="text-[11px] text-zinc-500 mt-2">Server Response Time</div>
          </div>
        </div>

        {/* Actionable Evidence Tabs */}
        <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-6 shadow-2xl space-y-6">
          {/* Header & Tab Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-[#c8b082]" />
                Actionable Evidence & Detective Log
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Calculated bottlenecks, code clues, and specific fixes to improve performance.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-2 bg-[#14141a] p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setFilterImpact("ALL")}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filterImpact === "ALL" ? "bg-[#c8b082] text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                All ({analysisData?.faults.length || 0})
              </button>
              <button
                onClick={() => setFilterImpact("HIGH")}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filterImpact === "HIGH" ? "bg-red-500 text-white font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                High Impact
              </button>
              <button
                onClick={() => setFilterImpact("MEDIUM")}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filterImpact === "MEDIUM" ? "bg-amber-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                }`}
              >
                Medium
              </button>
            </div>
          </div>

          {/* Fault Evidence Cards List */}
          {loading ? (
            <div className="py-16 text-center text-zinc-500 text-sm flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#c8b082]" />
              <span>Analyzing DOM structure, scripts, and server response times...</span>
            </div>
          ) : filteredFaults.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm">
              No critical bottlenecks found for this impact filter.
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
                          fault.impact === "High"
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : fault.impact === "Medium"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                        }`}
                      >
                        {fault.impact} Impact
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

        {/* Resource Distribution Breakdown */}
        {analysisData && (
          <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#c8b082]" />
              Payload & Resource Breakdown
            </h3>

            {/* Visual Distribution Bar */}
            <div className="h-4 w-full bg-zinc-900 rounded-full overflow-hidden flex border border-zinc-800">
              <div
                style={{ width: `${(analysisData.resourceBreakdown.jsKb / analysisData.metrics.pageSizeKb) * 100}%` }}
                className="bg-amber-500 h-full"
                title="JavaScript"
              />
              <div
                style={{ width: `${(analysisData.resourceBreakdown.cssKb / analysisData.metrics.pageSizeKb) * 100}%` }}
                className="bg-blue-500 h-full"
                title="CSS"
              />
              <div
                style={{ width: `${(analysisData.resourceBreakdown.imageKb / analysisData.metrics.pageSizeKb) * 100}%` }}
                className="bg-emerald-500 h-full"
                title="Images"
              />
              <div
                style={{ width: `${(analysisData.resourceBreakdown.htmlKb / analysisData.metrics.pageSizeKb) * 100}%` }}
                className="bg-[#c8b082] h-full"
                title="HTML"
              />
            </div>

            {/* Legend Labels */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-zinc-400 pt-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
                <span>JavaScript ({analysisData.resourceBreakdown.jsKb} KB)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block" />
                <span>CSS ({analysisData.resourceBreakdown.cssKb} KB)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                <span>Images ({analysisData.resourceBreakdown.imageKb} KB)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-[#c8b082] inline-block" />
                <span>HTML ({analysisData.resourceBreakdown.htmlKb} KB)</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070709] text-zinc-400 p-8">Loading Admin Dashboard...</div>}>
      <AdminContent />
    </Suspense>
  );
}
