"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Code2,
  Layers,
  Zap,
  Lock,
  Eye,
  SlidersHorizontal,
  Clock,
  HardDrive,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  Type,
  Server,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Flame,
} from "lucide-react";
import type { AnalysisResult, WaterfallItem, FaultItem } from "@/types";
import { Navbar } from "@/components/layout/Navbar";

export function InvestigationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUrlParam = searchParams.get("url") || "";

  const [mounted, setMounted] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"WATERFALL" | "FAULTS">("WATERFALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [impactFilter, setImpactFilter] = useState<string>("ALL");
  const [waterfallFilter, setWaterfallFilter] = useState<string>("ALL");

  useEffect(() => {
    setMounted(true);
    const initialUrl = targetUrlParam || "https://example.com";
    setInputUrl(initialUrl);
    runInvestigation(initialUrl);
  }, [targetUrlParam]);

  const runInvestigation = async (urlToFetch: string) => {
    if (!urlToFetch.trim()) return;
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
        setApiError(json.error || "Failed to inspect target website.");
      }
    } catch (err) {
      console.error("Failed to run investigation", err);
      setApiError("Network error: Could not contact investigation server.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    router.push(`/admin?url=${encodeURIComponent(inputUrl.trim())}`);
  };

  const waterfall = analysisData?.waterfall ?? [];
  const faults = analysisData?.faults ?? [];

  // Filtered waterfall
  const filteredWaterfall = waterfall.filter((item) => {
    if (waterfallFilter === "ALL") return true;
    if (waterfallFilter === "BLOCKING") return item.isRenderBlocking;
    if (waterfallFilter === "THIRD_PARTY") return item.isThirdParty;
    return item.type.toUpperCase() === waterfallFilter;
  });

  // Slowest requests (top 5 by duration)
  const slowestRequests = [...waterfall]
    .sort((a, b) => (b.durationMs || 0) - (a.durationMs || 0))
    .slice(0, 5);

  // Filtered faults
  const filteredFaults = faults.filter((f) => {
    const matchesCategory = categoryFilter === "ALL" || f.category.toUpperCase() === categoryFilter;
    const matchesImpact = impactFilter === "ALL" || f.impact.toUpperCase() === impactFilter;
    return matchesCategory && matchesImpact;
  });

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-8 shadow-2xl animate-pulse h-48 flex items-center justify-center text-zinc-500 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082] mr-3" />
            Loading Forensic Investigation Dossier...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
      {/* ────────────────── NAVBAR ────────────────── */}
      <Navbar />

      {/* ────────────────── MAIN INVESTIGATION DOSSIER ────────────────── */}
      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
        {/* Error Alert */}
        {apiError && (
          <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-5 flex items-start gap-4 text-red-200 text-sm shadow-2xl backdrop-blur-md">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-red-300 text-base">Investigation Notice</div>
              <p className="text-xs text-red-200/90 leading-relaxed">{apiError}</p>
            </div>
          </div>
        )}

        {/* 1. CASE HEADER & MASTER INVESTIGATION DOSSIER */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 relative z-10 w-full lg:w-auto">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-[#dfd7c2] text-zinc-950 text-xs font-mono font-black tracking-widest uppercase border border-[#c7beaa] shadow-sm">
                {analysisData?.caseId || "#CASE-AUDIT"}
              </span>
              <span className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c8b082]" />
                Investigated: {analysisData?.investigatedAt || (loading ? "Probing..." : "Live Snapshot")}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[11px] font-mono border border-amber-500/30 flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                Network Waterfall & Clue Forensics
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white flex items-center gap-3 tracking-tight break-all">
              <Globe className="w-6 h-6 text-[#c8b082] shrink-0" />
              {analysisData?.normalizedUrl || targetUrlParam || "Forensic Investigation"}
            </h1>

            {/* Quick URL Bar */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1 max-w-lg">
              <div className="flex items-center gap-2 bg-[#121218] border border-zinc-800 rounded-xl px-3 py-1.5 w-full">
                <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Investigate another website..."
                  className="bg-transparent text-xs text-zinc-200 placeholder-zinc-500 outline-none w-full font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#c8b082] hover:bg-[#b89f71] disabled:opacity-50 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow cursor-pointer"
              >
                {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <span>Inspect</span>}
              </button>
            </form>
          </div>

          {/* Overall Health Score Card */}
          <div className="bg-[#13131a] border border-zinc-800/90 rounded-2xl p-5 shrink-0 flex items-center gap-6 shadow-xl w-full sm:w-auto justify-between">
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                OVERALL HEALTH SCORE
              </div>
              <div className="flex items-baseline gap-1 my-0.5">
                <span className="text-3xl lg:text-4xl font-black text-[#d8a764] font-mono">
                  {loading ? "--" : analysisData?.overallHealthScore ?? 0}
                </span>
                <span className="text-xs text-zinc-500 font-bold">/100</span>
              </div>
              <div className="text-xs text-zinc-400 font-mono">
                {waterfall.length} network requests parsed
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#1b1b24] border border-zinc-800 flex items-center justify-center text-[#c8b082]">
              <Zap className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 2. SLOWEST REQUESTS SPOTLIGHT */}
        {slowestRequests.length > 0 && (
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                Slowest Origin & Network Requests
              </h3>
              <span className="text-xs font-mono text-zinc-500">Ranked by Total Request Duration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {slowestRequests.map((req, idx) => (
                <div key={idx} className="bg-[#121218] p-3.5 rounded-xl border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase">
                      {req.type}
                    </span>
                    <span className="font-mono font-bold text-amber-400">
                      {req.durationMs}ms
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white truncate font-mono" title={req.url}>
                    {req.filename || req.url}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span>TTFB: {req.ttfbMs}ms</span>
                    <span>{req.sizeKb} KB</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. TABS SWITCHER: FULL WATERFALL vs. FAULTS & CLUES */}
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
          <button
            onClick={() => setActiveTab("WATERFALL")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "WATERFALL"
                ? "bg-[#c8b082] text-zinc-950 shadow"
                : "text-zinc-400 hover:text-white bg-[#121218]"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full Network Waterfall ({waterfall.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("FAULTS")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === "FAULTS"
                ? "bg-[#c8b082] text-zinc-950 shadow"
                : "text-zinc-400 hover:text-white bg-[#121218]"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Detected Faults & Clues ({faults.length})</span>
          </button>
        </div>

        {/* TAB 1: WATERFALL TABLE */}
        {activeTab === "WATERFALL" && (
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#c8b082]" />
                  Sequential Asset Loading Waterfall
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Detailed timeline trace of every HTTP request, status code, size, TTFB, and render-blocking tag.
                </p>
              </div>

              {/* Waterfall Type Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {["ALL", "BLOCKING", "DOCUMENT", "SCRIPT", "STYLE", "IMAGE", "FONT", "THIRD_PARTY"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setWaterfallFilter(filter)}
                    className={`px-2.5 py-1 text-xs rounded-lg border font-mono transition-all cursor-pointer ${
                      waterfallFilter === filter
                        ? "bg-[#c8b082] text-zinc-950 font-bold border-[#c8b082]"
                        : "bg-[#14141c] text-zinc-400 border-zinc-800 hover:text-white"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="py-16 text-center text-zinc-500 text-sm flex flex-col items-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-[#c8b082]" />
                <span>Tracing request timings and connection dependencies...</span>
              </div>
            ) : filteredWaterfall.length === 0 ? (
              <div className="py-10 text-center text-zinc-400 text-sm">
                No network requests match the selected filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400">
                      <th className="pb-3.5 font-semibold">Asset / URL</th>
                      <th className="pb-3.5 font-semibold text-center">Type</th>
                      <th className="pb-3.5 font-semibold text-center">Status</th>
                      <th className="pb-3.5 font-semibold text-center">Size</th>
                      <th className="pb-3.5 font-semibold text-center">TTFB</th>
                      <th className="pb-3.5 font-semibold text-center">Duration</th>
                      <th className="pb-3.5 font-semibold text-right">Attributes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredWaterfall.map((item, idx) => (
                      <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                        {/* URL / Filename */}
                        <td className="py-3 max-w-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-500 text-[11px]">#{idx + 1}</span>
                            <span className="font-bold text-white truncate block" title={item.url}>
                              {item.filename || item.url}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 truncate block pl-5" title={item.url}>
                            {item.domain || item.url}
                          </span>
                        </td>

                        {/* Type */}
                        <td className="py-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              item.type === "script"
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                : item.type === "stylesheet"
                                ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                                : item.type === "image"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : item.type === "font"
                                ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                                : "bg-zinc-800 text-zinc-300"
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3 text-center">
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                            {item.status || 200}
                          </span>
                        </td>

                        {/* Size */}
                        <td className="py-3 text-center text-zinc-200 font-bold">
                          {item.sizeKb} KB
                        </td>

                        {/* TTFB */}
                        <td className="py-3 text-center text-zinc-400">
                          {item.ttfbMs}ms
                        </td>

                        {/* Duration */}
                        <td className="py-3 text-center text-white font-bold">
                          {item.durationMs}ms
                        </td>

                        {/* Flags */}
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {item.isRenderBlocking && (
                              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/40">
                                Blocking
                              </span>
                            )}
                            {item.isThirdParty && (
                              <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold border border-blue-500/40">
                                3rd Party
                              </span>
                            )}
                            {!item.isRenderBlocking && !item.isThirdParty && (
                              <span className="text-zinc-600 text-[11px]">Normal</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: FAULTS & CLUES */}
        {activeTab === "FAULTS" && (
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#c8b082]" />
                  Detected Website Faults & Diagnostic Clues
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Calculated vulnerabilities, missing meta tags, render-blocking scripts, and header configurations.
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 bg-[#14141a] p-1 rounded-xl border border-zinc-800">
                  {["ALL", "PERFORMANCE", "SEO", "SECURITY", "ACCESSIBILITY"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        categoryFilter === cat
                          ? "bg-[#c8b082] text-zinc-950 shadow"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 bg-[#14141a] p-1 rounded-xl border border-zinc-800">
                  {["ALL", "CRITICAL", "WARNING", "INFO"].map((imp) => (
                    <button
                      key={imp}
                      onClick={() => setImpactFilter(imp)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
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

            {loading ? (
              <div className="py-16 text-center text-zinc-500 text-sm flex flex-col items-center gap-3">
                <RefreshCw className="w-6 h-6 animate-spin text-[#c8b082]" />
                <span>Auditing code structure and vulnerabilities...</span>
              </div>
            ) : filteredFaults.length === 0 ? (
              <div className="py-10 text-center text-zinc-400 text-sm">
                No issues detected for the selected filters.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaults.map((fault) => (
                  <div
                    key={fault.id}
                    className="bg-[#121218] border border-zinc-800/90 rounded-2xl p-5 shadow-lg space-y-3 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-[#c8b082] bg-[#c8b082]/10 px-2.5 py-0.5 rounded border border-[#c8b082]/30">
                          {fault.id}
                        </span>
                        <h4 className="text-sm font-bold text-white">{fault.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                          {fault.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                            fault.impact === "Critical"
                              ? "bg-red-500/20 text-red-400 border border-red-500/40"
                              : fault.impact === "Warning"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                          }`}
                        >
                          {fault.impact} Impact
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">{fault.description}</p>

                    {/* Clue Code Snippet */}
                    {fault.clueCode && (
                      <div className="bg-[#09090d] border border-zinc-800 rounded-xl p-3 font-mono text-xs text-[#d4b170] overflow-x-auto flex items-center gap-3">
                        <Code2 className="w-4 h-4 text-zinc-500 shrink-0" />
                        <code>{fault.clueCode}</code>
                      </div>
                    )}

                    {/* Recommended Action */}
                    <div className="bg-[#161620] border-l-2 border-[#c8b082] p-3 rounded-r-xl text-xs text-zinc-200">
                      <span className="font-bold text-[#c8b082] mr-2">Remediation Action:</span>
                      {fault.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070709] text-zinc-400 p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082]" />
            <span>Loading Investigation Dossier...</span>
          </div>
        </div>
      }
    >
      <InvestigationContent />
    </Suspense>
  );
}
