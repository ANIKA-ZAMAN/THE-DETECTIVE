"use client";

import React, { useState, useEffect, Suspense, useRef } from "react";
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
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import type { HistoryEntry } from "@/types";
import { Navbar } from "@/components/layout/Navbar";

type HistoryMetric = "Performance Score" | "LCP (s)" | "Origin TTFB (ms)" | "Payload Size (KB)";

function HistoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [historyList, setHistoryList] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBeforeId, setSelectedBeforeId] = useState<string | null>(null);
  const [selectedAfterId, setSelectedAfterId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Chart Controls
  const [selectedMetric, setSelectedMetric] = useState<HistoryMetric>("Performance Score");
  const [timeFilter, setTimeFilter] = useState<string>("Last 30 Days");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const chartScrollContainerRef = useRef<HTMLDivElement>(null);

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
          setSelectedBeforeId(json.data[0].id);
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

  // Calculate before vs after delta values from selected records
  const beforeEntry = historyList.find((h) => h.id === selectedBeforeId) || historyList[1] || historyList[0];
  const afterEntry = historyList.find((h) => h.id === selectedAfterId) || historyList[0];

  const score1 = beforeEntry?.overallHealthScore ?? 0;
  const score2 = afterEntry?.overallHealthScore ?? 0;
  const scoreDelta = score2 - score1;

  const lcp1 = beforeEntry?.metrics?.lcpSec ?? 0;
  const lcp2 = afterEntry?.metrics?.lcpSec ?? 0;
  const lcpDelta = Number((lcp2 - lcp1).toFixed(2));

  const size1 = beforeEntry?.metrics?.pageSizeKb ?? 0;
  const size2 = afterEntry?.metrics?.pageSizeKb ?? 0;
  const sizeDelta = size2 - size1;

  const ttfb1 = beforeEntry?.metrics?.ttfbMs ?? 0;
  const ttfb2 = afterEntry?.metrics?.ttfbMs ?? 0;
  const ttfbDelta = ttfb2 - ttfb1;

  // Prepare chronological chart points (oldest to newest)
  const chronologicalHistory = [...historyList].reverse();

  // Helper to get metric value for a history point
  const getPointMetricValue = (entry: HistoryEntry) => {
    if (selectedMetric === "LCP (s)") return entry.metrics?.lcpSec ?? 0;
    if (selectedMetric === "Origin TTFB (ms)") return entry.metrics?.ttfbMs ?? 0;
    if (selectedMetric === "Payload Size (KB)") return entry.metrics?.pageSizeKb ?? 0;
    return entry.overallHealthScore ?? 0;
  };

  const getMetricUnit = () => {
    if (selectedMetric === "LCP (s)") return "s";
    if (selectedMetric === "Origin TTFB (ms)") return "ms";
    if (selectedMetric === "Payload Size (KB)") return " KB";
    return "/100";
  };

  // Compute SVG chart coordinates
  const getChartPoints = () => {
    if (chronologicalHistory.length === 0) return { points: [], maxY: 100, pathString: "", areaString: "", svgWidth: 700 };

    const values = chronologicalHistory.map(getPointMetricValue);
    const maxVal = Math.max(...values, selectedMetric === "Performance Score" ? 100 : 5);
    const maxY = selectedMetric === "Performance Score" ? 100 : Math.ceil(maxVal * 1.25);

    const totalPoints = Math.max(11, chronologicalHistory.length);
    const svgWidth = Math.max(700, totalPoints * 75);

    const points = chronologicalHistory.map((entry, idx) => {
      const x = (idx / Math.max(1, chronologicalHistory.length - 1)) * (svgWidth - 60) + 30;
      const val = getPointMetricValue(entry);
      const y = 140 - Math.min(125, (val / (maxY || 1)) * 120);
      return {
        x,
        y,
        val,
        entry,
        date: entry.investigatedAt || "Scan Date",
        caseId: entry.caseId,
        url: entry.normalizedUrl.replace(/^https?:\/\//, ""),
      };
    });

    const pathString = points.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "");
    const areaString = points.length > 0
      ? `${pathString} L ${points[points.length - 1].x} 140 L ${points[0].x} 140 Z`
      : "";

    return { points, maxY, pathString, areaString, svgWidth };
  };

  const chartData = getChartPoints();

  // Relative time helper
  const getRelativeTime = (dateStr?: string) => {
    if (!dateStr) return "recently";
    return "recent scan";
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-8 shadow-2xl animate-pulse h-64 flex items-center justify-center text-zinc-500 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082] mr-3" />
            Loading Forensic History Archive...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
      {/* ────────────────── TOP NAVBAR ────────────────── */}
      <Navbar />

      {/* ────────────────── MAIN HISTORY WORKSPACE ────────────────── */}
      <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 py-6 flex-1 space-y-5">
        {/* Top Header Bar & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-[#c8b082] uppercase mb-1">
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

          <div className="flex items-center gap-2.5">
            {historyList.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 text-xs font-semibold text-red-400 hover:text-red-300 bg-[#1e1111] hover:bg-red-950/60 border border-red-900/60 rounded-xl flex items-center gap-1.5 transition-all shadow cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}

            <button
              onClick={fetchHistory}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-[#14141c] hover:bg-zinc-800 border border-zinc-800 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#c8b082]" : ""}`} />
              <span>Refresh Log</span>
            </button>
          </div>
        </div>

        {/* Error Alert if any */}
        {apiError && (
          <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-4 flex items-start gap-3 text-red-200 text-sm shadow-2xl backdrop-blur-md">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-red-300">History Notice</div>
              <p className="text-xs text-red-200/90">{apiError}</p>
            </div>
          </div>
        )}

        {/* 1. BEFORE VS. AFTER DELTA COMPARISON CARD */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6 backdrop-blur-md">
          {/* Header & Dropdowns Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-zinc-800/80 pb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-[#c8b082]" />
                Before vs. After Delta Comparison
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Select any two historical scans to measure performance gains or regressions.
              </p>
            </div>

            {/* Dropdowns */}
            <div className="flex items-center gap-3 text-xs flex-wrap w-full lg:w-auto">
              {/* Before Dropdown */}
              <div className="flex items-center gap-1.5 bg-[#14141c] border border-zinc-800 px-3 py-2 rounded-xl">
                <span className="text-zinc-500 font-mono text-[11px]">Before:</span>
                <select
                  value={selectedBeforeId || ""}
                  onChange={(e) => setSelectedBeforeId(e.target.value)}
                  className="bg-transparent text-zinc-200 outline-none font-mono text-xs cursor-pointer max-w-[220px]"
                >
                  {historyList.map((h) => (
                    <option key={h.id} value={h.id} className="bg-[#121218] text-white">
                      {h.caseId} - {h.normalizedUrl.replace(/^https?:\/\//, "")} ({h.overallHealthScore}/100)
                    </option>
                  ))}
                </select>
              </div>

              {/* After Dropdown */}
              <div className="flex items-center gap-1.5 bg-[#14141c] border border-zinc-800 px-3 py-2 rounded-xl">
                <span className="text-zinc-500 font-mono text-[11px]">After:</span>
                <select
                  value={selectedAfterId || ""}
                  onChange={(e) => setSelectedAfterId(e.target.value)}
                  className="bg-transparent text-zinc-200 outline-none font-mono text-xs cursor-pointer max-w-[220px]"
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

          {/* 4 Delta Metric Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Score Evolution */}
            <div className="bg-[#121218] border border-zinc-800/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-zinc-400 font-medium">Score Evolution</span>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black font-mono text-white">
                  {score1} <span className="text-zinc-500 text-sm font-normal">→</span> <span>{score2}</span>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    scoreDelta > 0
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                      : scoreDelta < 0
                      ? "text-red-400 bg-red-500/10 border border-red-500/30"
                      : "text-zinc-400 bg-zinc-800 border border-zinc-700"
                  }`}
                >
                  {scoreDelta > 0 ? `+${scoreDelta} pts` : scoreDelta < 0 ? `${scoreDelta} pts` : "+0 pts"}
                </span>
              </div>
              <div className="text-[11px] text-zinc-500">
                {scoreDelta > 0
                  ? "Optimization improved overall health score."
                  : scoreDelta < 0
                  ? "Performance regression detected."
                  : "No net score change between audits."}
              </div>
            </div>

            {/* Largest Contentful Paint */}
            <div className="bg-[#121218] border border-zinc-800/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-zinc-400 font-medium">Largest Contentful Paint</span>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black font-mono text-white">
                  {lcp1}s <span className="text-zinc-500 text-sm font-normal">→</span> <span>{lcp2}s</span>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    lcpDelta <= 0
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                      : "text-red-400 bg-red-500/10 border border-red-500/30"
                  }`}
                >
                  {lcpDelta <= 0 ? `${Math.abs(lcpDelta)}s faster` : `+${lcpDelta}s slower`}
                </span>
              </div>
              <div className="text-[11px] text-zinc-500">Perceived render timing delta.</div>
            </div>

            {/* Payload Size */}
            <div className="bg-[#121218] border border-zinc-800/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-zinc-400 font-medium">Payload Size</span>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black font-mono text-white">
                  {size1} KB <span className="text-zinc-500 text-sm font-normal">→</span> <span>{size2} KB</span>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    sizeDelta <= 0
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                      : "text-amber-400 bg-amber-500/10 border border-amber-500/30"
                  }`}
                >
                  {sizeDelta <= 0 ? `${sizeDelta} KB` : `+${sizeDelta} KB`}
                </span>
              </div>
              <div className="text-[11px] text-zinc-500">Wire transfer reduction delta.</div>
            </div>

            {/* Origin TTFB */}
            <div className="bg-[#121218] border border-zinc-800/80 rounded-2xl p-5 space-y-2">
              <span className="text-xs text-zinc-400 font-medium">Origin TTFB</span>
              <div className="flex items-baseline justify-between">
                <div className="text-2xl font-black font-mono text-white">
                  {ttfb1}ms <span className="text-zinc-500 text-sm font-normal">→</span> <span>{ttfb2}ms</span>
                </div>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    ttfbDelta <= 0
                      ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                      : "text-red-400 bg-red-500/10 border border-red-500/30"
                  }`}
                >
                  {ttfbDelta <= 0 ? `${ttfbDelta}ms` : `+${ttfbDelta}ms`}
                </span>
              </div>
              <div className="text-[11px] text-zinc-500">Server response latency variance.</div>
            </div>
          </div>
        </div>

        {/* 2. PERFORMANCE HISTORY OVER TIME GOLDEN WAVE CHART */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#c8b082]" />
                PERFORMANCE HISTORY OVER TIME
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {selectedMetric} trend across all historical audits.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Metric Dropdown */}
              <div className="bg-[#14141c] border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-mono">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value as HistoryMetric)}
                  className="bg-transparent text-zinc-200 outline-none cursor-pointer"
                >
                  <option className="bg-[#121218]">Performance Score</option>
                  <option className="bg-[#121218]">LCP (s)</option>
                  <option className="bg-[#121218]">Origin TTFB (ms)</option>
                  <option className="bg-[#121218]">Payload Size (KB)</option>
                </select>
              </div>

              {/* Range Dropdown */}
              <div className="bg-[#14141c] border border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-mono text-zinc-300">
                <select
                  value={timeFilter}
                  onChange={(e) => setTimeFilter(e.target.value)}
                  className="bg-transparent text-zinc-200 outline-none cursor-pointer"
                >
                  <option className="bg-[#121218]">Last 30 Days</option>
                  <option className="bg-[#121218]">Last 7 Days</option>
                  <option className="bg-[#121218]">All Time</option>
                </select>
              </div>

              <span className="text-xs font-mono text-zinc-500 hidden sm:inline">
                {historyList.length} Total Audits
              </span>
            </div>
          </div>

          {/* SVG Golden Wave Chart with Horizontal Scroll Container */}
          <div
            ref={chartScrollContainerRef}
            className="relative h-48 w-full bg-[#08080c] rounded-2xl border border-zinc-850 p-2 overflow-x-auto overflow-y-hidden select-none"
          >
            {chartData.points.length === 0 ? (
              <div className="h-full flex items-center justify-center text-zinc-500 text-xs font-mono">
                No historical audit records available. Run an investigation to generate trajectory data.
              </div>
            ) : (
              <div style={{ width: `${chartData.svgWidth}px`, height: "100%" }} className="relative">
                <svg
                  className="w-full h-full"
                  viewBox={`0 0 ${chartData.svgWidth} 150`}
                  fill="none"
                  onMouseLeave={() => setHoveredPointIndex(null)}
                >
                  <defs>
                    <linearGradient id="gold-wave-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c8b082" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#c8b082" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Y Axis Grid Lines */}
                  <line x1="30" y1="20" x2={chartData.svgWidth - 20} y2="20" stroke="#1c1c24" strokeWidth="0.8" strokeDasharray="3 3" />
                  <text x="10" y="24" fill="#52525b" fontSize="8" fontFamily="monospace">100</text>

                  <line x1="30" y1="55" x2={chartData.svgWidth - 20} y2="55" stroke="#1c1c24" strokeWidth="0.8" strokeDasharray="3 3" />
                  <text x="10" y="59" fill="#52525b" fontSize="8" fontFamily="monospace">75</text>

                  <line x1="30" y1="90" x2={chartData.svgWidth - 20} y2="90" stroke="#1c1c24" strokeWidth="0.8" strokeDasharray="3 3" />
                  <text x="10" y="94" fill="#52525b" fontSize="8" fontFamily="monospace">50</text>

                  <line x1="30" y1="120" x2={chartData.svgWidth - 20} y2="120" stroke="#1c1c24" strokeWidth="0.8" strokeDasharray="3 3" />
                  <text x="10" y="124" fill="#52525b" fontSize="8" fontFamily="monospace">25</text>

                  <text x="10" y="145" fill="#52525b" fontSize="8" fontFamily="monospace">0</text>

                  {/* Golden Gradient Area */}
                  {chartData.areaString && (
                    <path d={chartData.areaString} fill="url(#gold-wave-grad)" />
                  )}

                  {/* Golden Stroke Wave */}
                  {chartData.pathString && (
                    <path
                      d={chartData.pathString}
                      stroke="#c8b082"
                      strokeWidth="2.5"
                      fill="none"
                      className="animate-draw-line"
                    />
                  )}

                  {/* Glowing Node Dots */}
                  {chartData.points.map((p, i) => (
                    <g key={i} className="cursor-pointer" onMouseEnter={() => setHoveredPointIndex(i)}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="4"
                        fill="#c8b082"
                        className="transition-all hover:r-6 shadow"
                      />
                      <circle cx={p.x} cy={p.y} r="2" fill="#ffffff" />
                    </g>
                  ))}

                  {/* Hover Indicator Crosshair */}
                  {hoveredPointIndex !== null && chartData.points[hoveredPointIndex] && (
                    <line
                      x1={chartData.points[hoveredPointIndex].x}
                      y1="10"
                      x2={chartData.points[hoveredPointIndex].x}
                      y2="140"
                      stroke="#c8b082"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}
                </svg>

                {/* Hover Tooltip Callout */}
                {hoveredPointIndex !== null && chartData.points[hoveredPointIndex] && (
                  <div
                    style={{
                      left: `${Math.min(chartData.svgWidth - 160, Math.max(10, chartData.points[hoveredPointIndex].x - 60))}px`,
                      top: `${Math.max(10, chartData.points[hoveredPointIndex].y - 50)}px`,
                    }}
                    className="absolute bg-[#121218]/95 border border-[#c8b082]/60 text-[10px] font-mono px-3 py-2 rounded-xl shadow-2xl pointer-events-none z-20 space-y-0.5 backdrop-blur-md"
                  >
                    <div className="text-zinc-400 font-bold">
                      {chartData.points[hoveredPointIndex].date}
                    </div>
                    <div className="text-white font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c8b082]" />
                      <span>{selectedMetric}:</span>
                      <strong className="text-[#c8b082]">{chartData.points[hoveredPointIndex].val}{getMetricUnit()}</strong>
                    </div>
                    <div className="text-zinc-500 text-[9px]">
                      {chartData.points[hoveredPointIndex].caseId} • {chartData.points[hoveredPointIndex].url}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 3. HISTORICAL AUDIT LOGS TABLE */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-4 backdrop-blur-md">
          <div className="border-b border-zinc-800/80 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              HISTORICAL AUDIT LOGS
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Chronological list of all website audits.
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-zinc-500 text-sm flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#c8b082]" />
              <span>Retrieving historical audit logs...</span>
            </div>
          ) : historyList.length === 0 ? (
            <div className="py-16 text-center text-zinc-400 text-sm flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#14141c] border border-zinc-800 flex items-center justify-center text-[#c8b082]">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="font-bold text-white text-base">No Historical Audits Found</div>
                <p className="text-xs text-zinc-500 max-w-sm">
                  Run an investigation from the home or overview page to record your first scan.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-zinc-800/80 text-zinc-500 text-[10px]">
                    <th className="pb-3 font-semibold">Case ID</th>
                    <th className="pb-3 font-semibold">URL</th>
                    <th className="pb-3 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Audit Date</th>
                    <th className="pb-3 font-semibold">Changes</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40 text-xs">
                  {historyList.map((entry, idx) => {
                    const prevEntry = historyList[idx + 1];
                    const diff = prevEntry
                      ? entry.overallHealthScore - prevEntry.overallHealthScore
                      : 0;

                    const isImprovement = diff > 0;
                    const isRegression = diff < 0;
                    const isBaseline = !prevEntry || diff === 0;

                    return (
                      <tr key={entry.id} className="hover:bg-zinc-800/40 transition-colors group cursor-default">
                        {/* Case ID */}
                        <td className="py-3.5">
                          <span className="text-zinc-400 font-bold group-hover:text-[#c8b082] transition-colors">
                            {entry.caseId}
                          </span>
                        </td>

                        {/* URL */}
                        <td className="py-3.5 text-white font-bold">
                          <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-[#c8b082] shrink-0" />
                            <span className="truncate max-w-xs block" title={entry.normalizedUrl}>
                              {entry.normalizedUrl.replace(/^https?:\/\//, "")}
                            </span>
                          </div>
                        </td>

                        {/* Score */}
                        <td className="py-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#181824] border border-zinc-700 flex items-center justify-center text-[10px] font-bold text-white">
                              {entry.overallHealthScore}
                            </span>
                            <span className="text-zinc-500 text-[10px]">/100</span>
                          </div>
                        </td>

                        {/* Audit Date */}
                        <td className="py-3.5 text-zinc-300 font-sans text-xs">
                          <div>{entry.investigatedAt}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">{getRelativeTime(entry.investigatedAt)}</div>
                        </td>

                        {/* Changes */}
                        <td className="py-3.5">
                          {isImprovement && (
                            <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                              ↑ Score increased by {diff} pts
                            </span>
                          )}
                          {isRegression && (
                            <span className="text-red-400 flex items-center gap-1 text-[11px]">
                              ↓ Score decreased by {Math.abs(diff)} pts
                            </span>
                          )}
                          {isBaseline && (
                            <span className="text-zinc-500 text-[11px]">Baseline audit</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3.5">
                          {isImprovement && (
                            <span className="text-emerald-400 flex items-center gap-1.5 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Improvement
                            </span>
                          )}
                          {isRegression && (
                            <span className="text-red-400 flex items-center gap-1.5 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Regression
                            </span>
                          )}
                          {isBaseline && (
                            <span className="text-zinc-400 flex items-center gap-1.5 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" /> Baseline
                            </span>
                          )}
                        </td>

                        {/* View Action */}
                        <td className="py-3.5 text-right">
                          <Link
                            href={`/details?url=${encodeURIComponent(entry.normalizedUrl)}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-[#14141c] hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-lg border border-zinc-800 text-xs font-semibold transition-colors"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3 h-3 text-[#c8b082]" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
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
            <span>Loading History Archive...</span>
          </div>
        </div>
      }
    >
      <HistoryContent />
    </Suspense>
  );
}
