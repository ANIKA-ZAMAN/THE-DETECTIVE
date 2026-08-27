"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  RefreshCw,
  Zap,
  Activity,
  Search,
  History as HistoryIcon,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  ArrowUpRight,
  BarChart3,
  GitCompare,
} from "lucide-react";
import type { HistoryEntry } from "@/types";
import { Navbar } from "@/components/layout/Navbar";

function HistoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [historyList, setHistoryList] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBeforeId, setSelectedBeforeId] = useState<string | null>(null);
  const [selectedAfterId, setSelectedAfterId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch("/api/history");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setHistoryList(json.data);
        // Automatically select the latest two scans for before/after comparison if available
        if (json.data.length >= 2) {
          setSelectedBeforeId(json.data[1].id);
          setSelectedAfterId(json.data[0].id);
        } else if (json.data.length === 1) {
          setSelectedAfterId(json.data[0].id);
        }
      } else {
        setApiError("Failed to fetch scan history records.");
      }
    } catch (err) {
      console.error("Failed to load history", err);
      setApiError("Network error: Could not contact history server.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm("Are you sure you want to clear all forensic scan records?")) return;
    try {
      const res = await fetch("/api/history", { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setHistoryList([]);
        setSelectedBeforeId(null);
        setSelectedAfterId(null);
      }
    } catch (err) {
      console.error("Failed to clear history", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchHistory();
  }, []);

  const filteredHistory = historyList.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      item.targetUrl.toLowerCase().includes(q) ||
      item.normalizedUrl.toLowerCase().includes(q) ||
      item.caseId.toLowerCase().includes(q)
    );
  });

  // Calculate before vs after diff
  const beforeEntry = historyList.find((h) => h.id === selectedBeforeId);
  const afterEntry = historyList.find((h) => h.id === selectedAfterId);

  const scoreDiff =
    beforeEntry && afterEntry
      ? afterEntry.overallHealthScore - beforeEntry.overallHealthScore
      : 0;

  const lcpDiff =
    beforeEntry && afterEntry
      ? Number((afterEntry.metrics.lcpSec - beforeEntry.metrics.lcpSec).toFixed(2))
      : 0;

  const sizeDiff =
    beforeEntry && afterEntry
      ? afterEntry.metrics.pageSizeKb - beforeEntry.metrics.pageSizeKb
      : 0;

  const ttfbDiff =
    beforeEntry && afterEntry
      ? afterEntry.metrics.ttfbMs - beforeEntry.metrics.ttfbMs
      : 0;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-8 shadow-2xl animate-pulse h-48 flex items-center justify-center text-zinc-500 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082] mr-3" />
            Loading Forensic Scan Archive...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
      {/* ────────────────── NAVBAR ────────────────── */}
      <Navbar />

      {/* ────────────────── MAIN HISTORY DOSSIER ────────────────── */}
      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
        {/* Header Title & Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#c8b082] uppercase mb-1">
              <HistoryIcon className="w-3.5 h-3.5" />
              CASE EVIDENCE CHRONOLOGY
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Investigation Scan History
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Historical audit records, performance score evolution over time, and before-vs-after regression tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {historyList.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-3.5 py-2 text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/30 hover:bg-red-900/40 border border-red-900/50 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
            <button
              onClick={fetchHistory}
              disabled={loading}
              className="px-3.5 py-2 text-xs font-semibold text-zinc-300 bg-[#121218] hover:bg-zinc-800 border border-zinc-800 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#c8b082]" : ""}`} />
              <span>Refresh Log</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-5 flex items-start gap-4 text-red-200 text-sm shadow-2xl backdrop-blur-md">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-red-300 text-base">Archive Notice</div>
              <p className="text-xs text-red-200/90 leading-relaxed">{apiError}</p>
            </div>
          </div>
        )}

        {/* 1. BEFORE VS. AFTER COMPARISON PANEL */}
        {historyList.length >= 2 && beforeEntry && afterEntry && (
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <GitCompare className="w-4 h-4 text-[#c8b082]" />
                  Before vs. After Delta Comparison
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select any two historical scans to measure performance gains or regressions.
                </p>
              </div>

              {/* Quick Selectors */}
              <div className="flex items-center gap-3 text-xs flex-wrap">
                <div className="flex items-center gap-1.5 bg-[#14141c] border border-zinc-800 px-2.5 py-1.5 rounded-xl">
                  <span className="text-zinc-500 font-mono text-[11px]">Before:</span>
                  <select
                    value={selectedBeforeId || ""}
                    onChange={(e) => setSelectedBeforeId(e.target.value)}
                    className="bg-transparent text-zinc-200 outline-none font-mono text-xs cursor-pointer"
                  >
                    {historyList.map((h) => (
                      <option key={h.id} value={h.id} className="bg-[#121218] text-white">
                        {h.caseId} - {h.normalizedUrl.replace(/^https?:\/\//, "")} ({h.overallHealthScore}/100)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-[#14141c] border border-zinc-800 px-2.5 py-1.5 rounded-xl">
                  <span className="text-zinc-500 font-mono text-[11px]">After:</span>
                  <select
                    value={selectedAfterId || ""}
                    onChange={(e) => setSelectedAfterId(e.target.value)}
                    className="bg-transparent text-zinc-200 outline-none font-mono text-xs cursor-pointer"
                  >
                    {historyList.map((h) => (
                      <option key={h.id} value={h.id} className="bg-[#121218] text-white">
                        {h.caseId} - {h.normalizedUrl.replace(/^https?:\/\//, "")} ({h.overallHealthScore}/100)
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Delta Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Score Delta */}
              <div className="bg-[#13131a] border border-zinc-800/90 rounded-2xl p-5 space-y-2">
                <span className="text-xs text-zinc-400 font-medium">Score Evolution</span>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black font-mono text-white">
                    {beforeEntry.overallHealthScore}{" "}
                    <span className="text-zinc-500 text-sm font-normal">→</span>{" "}
                    <span className="text-[#d8a764]">{afterEntry.overallHealthScore}</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      scoreDiff >= 0
                        ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                        : "text-red-400 bg-red-500/10 border border-red-500/30"
                    }`}
                  >
                    {scoreDiff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} pts
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500">
                  {scoreDiff > 0
                    ? "Optimization improved overall health score."
                    : scoreDiff < 0
                    ? "Performance regression detected."
                    : "No net score change between audits."}
                </div>
              </div>

              {/* LCP Delta */}
              <div className="bg-[#13131a] border border-zinc-800/90 rounded-2xl p-5 space-y-2">
                <span className="text-xs text-zinc-400 font-medium">Largest Contentful Paint</span>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black font-mono text-white">
                    {beforeEntry.metrics.lcpSec}s{" "}
                    <span className="text-zinc-500 text-sm font-normal">→</span>{" "}
                    <span>{afterEntry.metrics.lcpSec}s</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      lcpDiff <= 0
                        ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                        : "text-red-400 bg-red-500/10 border border-red-500/30"
                    }`}
                  >
                    {lcpDiff <= 0 ? `${lcpDiff}s faster` : `+${lcpDiff}s slower`}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500">Perceived render timing delta.</div>
              </div>

              {/* Page Size Delta */}
              <div className="bg-[#13131a] border border-zinc-800/90 rounded-2xl p-5 space-y-2">
                <span className="text-xs text-zinc-400 font-medium">Payload Size</span>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black font-mono text-white">
                    {beforeEntry.metrics.pageSizeKb} KB{" "}
                    <span className="text-zinc-500 text-sm font-normal">→</span>{" "}
                    <span>{afterEntry.metrics.pageSizeKb} KB</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      sizeDiff <= 0
                        ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                        : "text-amber-400 bg-amber-500/10 border border-amber-500/30"
                    }`}
                  >
                    {sizeDiff <= 0 ? `${sizeDiff} KB` : `+${sizeDiff} KB`}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500">Wire transfer reduction delta.</div>
              </div>

              {/* TTFB Delta */}
              <div className="bg-[#13131a] border border-zinc-800/90 rounded-2xl p-5 space-y-2">
                <span className="text-xs text-zinc-400 font-medium">Origin TTFB</span>
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-black font-mono text-white">
                    {beforeEntry.metrics.ttfbMs}ms{" "}
                    <span className="text-zinc-500 text-sm font-normal">→</span>{" "}
                    <span>{afterEntry.metrics.ttfbMs}ms</span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      ttfbDiff <= 0
                        ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                        : "text-red-400 bg-red-500/10 border border-red-500/30"
                    }`}
                  >
                    {ttfbDiff <= 0 ? `${ttfbDiff}ms` : `+${ttfbDiff}ms`}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500">Server response latency variance.</div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PERFORMANCE HISTORY TREND TIMELINE */}
        {historyList.length > 0 && (
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#c8b082]" />
                  Performance Score Trend Trajectory
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Chronological audit score trajectory</p>
              </div>
              <span className="text-xs font-mono text-zinc-500">{historyList.length} Total Audits Logged</span>
            </div>

            {/* Visual Sparkline Trend Bars */}
            <div className="h-32 flex items-end gap-2.5 pt-4 pb-2 px-2 overflow-x-auto">
              {historyList
                .slice(0, 18)
                .reverse()
                .map((entry, idx) => {
                  const score = entry.overallHealthScore;
                  const heightPercent = Math.max(15, score);
                  return (
                    <div
                      key={idx}
                      className="flex-1 min-w-8 flex flex-col items-center gap-1 group relative cursor-pointer"
                      onClick={() => router.push(`/overview?url=${encodeURIComponent(entry.normalizedUrl)}`)}
                    >
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-10 bg-[#161622] border border-zinc-700 text-[10px] text-zinc-200 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl z-20 font-mono">
                        {entry.normalizedUrl.replace(/^https?:\/\//, "")}: {score}/100
                      </div>

                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-lg transition-all ${
                          score >= 80
                            ? "bg-emerald-400 group-hover:bg-emerald-300"
                            : score >= 60
                            ? "bg-[#d8a764] group-hover:bg-[#e4c084]"
                            : "bg-red-400 group-hover:bg-red-300"
                        }`}
                      />
                      <span className="text-[9px] font-mono text-zinc-500 truncate w-full text-center">
                        {score}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 3. HISTORICAL SCAN ARCHIVE TABLE */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#c8b082]" />
                Forensic Scan Records
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Every investigated URL is preserved with captured Core Web Vitals telemetry.
              </p>
            </div>

            {/* Filter Search */}
            <div className="flex items-center gap-2 bg-[#121218] border border-zinc-800 rounded-xl px-3 py-1.5 w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by domain or case ID..."
                className="bg-transparent text-xs text-zinc-200 placeholder-zinc-500 outline-none w-full font-mono"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-zinc-500 text-sm flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#c8b082]" />
              <span>Retrieving historical scan logs...</span>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 text-sm flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#14141c] border border-zinc-800 flex items-center justify-center text-[#c8b082]">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white text-base">No Scan Records Found</div>
                <p className="text-xs text-zinc-500 max-w-sm">
                  {searchQuery
                    ? `No historical scans match "${searchQuery}".`
                    : "Run your first performance audit from the home landing page to start recording scan history."}
                </p>
              </div>
              <Link
                href="/"
                className="mt-2 px-4 py-2 text-xs font-bold text-zinc-950 bg-[#c8b082] hover:bg-[#b89f71] rounded-xl flex items-center gap-1.5 transition-colors shadow"
              >
                <span>Initiate First Investigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono">
                    <th className="pb-3.5 font-semibold">Case File</th>
                    <th className="pb-3.5 font-semibold">Target Website</th>
                    <th className="pb-3.5 font-semibold">Scan Date</th>
                    <th className="pb-3.5 font-semibold text-center">Score</th>
                    <th className="pb-3.5 font-semibold text-center">LCP</th>
                    <th className="pb-3.5 font-semibold text-center">INP</th>
                    <th className="pb-3.5 font-semibold text-center">CLS</th>
                    <th className="pb-3.5 font-semibold text-center">Size</th>
                    <th className="pb-3.5 font-semibold text-center">Requests</th>
                    <th className="pb-3.5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {filteredHistory.map((entry) => (
                    <tr key={entry.id} className="hover:bg-zinc-900/40 transition-colors">
                      {/* Case ID */}
                      <td className="py-4">
                        <span className="px-2.5 py-1 rounded bg-[#dfd7c2] text-zinc-950 text-[11px] font-bold">
                          {entry.caseId}
                        </span>
                      </td>

                      {/* URL */}
                      <td className="py-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-[#c8b082] shrink-0" />
                          <span className="truncate max-w-xs block" title={entry.normalizedUrl}>
                            {entry.normalizedUrl.replace(/^https?:\/\//, "")}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-4 text-zinc-400 font-sans text-[11px]">
                        {entry.investigatedAt}
                      </td>

                      {/* Score */}
                      <td className="py-4 text-center">
                        <span
                          className={`font-black px-2.5 py-1 rounded-lg text-xs border ${
                            entry.overallHealthScore >= 80
                              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                              : entry.overallHealthScore >= 60
                              ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                              : "text-red-400 bg-red-500/10 border-red-500/30"
                          }`}
                        >
                          {entry.overallHealthScore}
                        </span>
                      </td>

                      {/* LCP */}
                      <td className="py-4 text-center text-zinc-200">
                        {entry.metrics.lcpSec}s
                      </td>

                      {/* INP */}
                      <td className="py-4 text-center text-zinc-300">
                        {entry.metrics.inpMs ? `${entry.metrics.inpMs}ms` : "--"}
                      </td>

                      {/* CLS */}
                      <td className="py-4 text-center text-zinc-200">
                        {entry.metrics.cls}
                      </td>

                      {/* Size */}
                      <td className="py-4 text-center text-zinc-300 font-bold">
                        {entry.metrics.pageSizeKb} KB
                      </td>

                      {/* Requests */}
                      <td className="py-4 text-center text-zinc-400">
                        {entry.metrics.requestsCount}
                      </td>

                      {/* Actions */}
                      <td className="py-4 text-right">
                        <Link
                          href={`/overview?url=${encodeURIComponent(entry.normalizedUrl)}`}
                          className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-[#c8b082] hover:text-[#e8d098] bg-[#c8b082]/10 hover:bg-[#c8b082]/20 px-3 py-1.5 rounded-lg border border-[#c8b082]/30 transition-all"
                        >
                          <span>Open Dossier</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070709] text-zinc-400 p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082]" />
            <span>Loading History Dossier...</span>
          </div>
        </div>
      }
    >
      <HistoryContent />
    </Suspense>
  );
}
