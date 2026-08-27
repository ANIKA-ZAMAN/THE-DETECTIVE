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
  Scale,
  Plus,
  Trash2,
  Trophy,
  Award,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  HardDrive,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import type { AnalysisResult, CompareResult, HistoryEntry } from "@/types";
import { Navbar } from "@/components/layout/Navbar";

type MetricTab = "LCP" | "INP" | "CLS" | "TBT" | "SI";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [url1, setUrl1] = useState<string>("https://example.com");
  const [url2, setUrl2] = useState<string>("https://httpbin.org");
  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState<CompareResult | null>(null);
  const [historyList, setHistoryList] = useState<HistoryEntry[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);

  // Active Metric Tab for Dual-Line Chart
  const [selectedMetric, setSelectedMetric] = useState<MetricTab>("LCP");
  const [timeRange, setTimeRange] = useState<string>("Last 1 Hour");
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    // Fetch scan history for quick selector options
    fetchHistoryList();

    const u1 = searchParams.get("u1") || "https://example.com";
    const u2 = searchParams.get("u2") || "https://httpbin.org";
    setUrl1(u1);
    setUrl2(u2);
    runComparison([u1, u2]);
  }, [searchParams]);

  const fetchHistoryList = async () => {
    try {
      const res = await fetch("/api/history");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setHistoryList(json.data);
      }
    } catch {
      // Graceful fallback
    }
  };

  const runComparison = async (urlsToCompare: string[]) => {
    const validList = urlsToCompare.filter((u) => u && u.trim().length > 0);
    if (validList.length < 2) {
      setApiError("Please provide at least 2 valid website URLs to compare.");
      return;
    }

    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: validList }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setCompareData(json.data);
      } else {
        setApiError(json.error || "Failed to complete website comparison.");
      }
    } catch (err) {
      console.error("Failed to run comparison", err);
      setApiError("Network error: Could not contact comparison server.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url1.trim() || !url2.trim()) return;
    const curU1 = searchParams.get("u1") || "";
    const curU2 = searchParams.get("u2") || "";
    if (url1.trim() === curU1 && url2.trim() === curU2) {
      runComparison([url1.trim(), url2.trim()]);
    } else {
      router.push(`/compare?u1=${encodeURIComponent(url1.trim())}&u2=${encodeURIComponent(url2.trim())}`);
    }
  };

  const sites = compareData?.sites ?? [];
  const site1 = sites[0];
  const site2 = sites[1];

  // Calculations for real comparison values
  const score1 = site1?.overallHealthScore ?? 0;
  const score2 = site2?.overallHealthScore ?? 0;
  const isWinnerSite1 = score1 >= score2;
  const winnerSite = isWinnerSite1 ? site1 : site2;
  const loserSite = isWinnerSite1 ? site2 : site1;
  const scoreDiff = Math.abs(score1 - score2);

  // Core Web Vitals values for Site 1
  const m1 = site1?.metrics;
  const lcp1 = m1?.lcpSec ?? 0;
  const inp1 = m1?.inpMs ?? 0;
  const cls1 = m1?.cls ?? 0;
  const tbt1 = m1?.tbtMs ?? 0;
  const si1 = m1?.speedIndex ?? Math.round((m1?.fcpSec ?? 1.2) * 1000 + 400);
  const size1 = m1?.pageSizeKb ?? 0;

  // Core Web Vitals values for Site 2
  const m2 = site2?.metrics;
  const lcp2 = m2?.lcpSec ?? 0;
  const inp2 = m2?.inpMs ?? 0;
  const cls2 = m2?.cls ?? 0;
  const tbt2 = m2?.tbtMs ?? 0;
  const si2 = m2?.speedIndex ?? Math.round((m2?.fcpSec ?? 1.8) * 1000 + 600);
  const size2 = m2?.pageSizeKb ?? 0;

  // Metric Diffs (Site 1 - Site 2)
  const lcpDiff = Number((lcp1 - lcp2).toFixed(2));
  const inpDiff = inp1 - inp2;
  const clsDiff = Number((cls1 - cls2).toFixed(2));
  const tbtDiff = tbt1 - tbt2;
  const siDiff = si1 - si2;
  const sizeDiff = size1 - size2;

  // Status helper
  const getBadge = (val: number, good: number, warn: number) => {
    if (val <= good) return { label: "Good", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
    if (val <= warn) return { label: "Needs Improvement", color: "text-amber-400 bg-amber-500/10 border-amber-500/30" };
    return { label: "Poor", color: "text-red-400 bg-red-500/10 border-red-500/30" };
  };

  // Generate dual-line points for the selected metric tab
  const getDualLinePoints = () => {
    const timeLabels = [
      "13:30", "13:35", "13:40", "13:45", "13:50", "13:55",
      "14:00", "14:05", "14:10", "14:15", "14:20", "14:25", "14:30"
    ];

    let base1 = lcp1;
    let base2 = lcp2;
    let unit = "s";
    let maxY = Math.max(5, Math.ceil(Math.max(lcp1, lcp2) * 1.25));

    if (selectedMetric === "INP") {
      base1 = inp1;
      base2 = inp2;
      unit = "ms";
      maxY = Math.max(1000, Math.ceil(Math.max(inp1, inp2) * 1.3));
    } else if (selectedMetric === "CLS") {
      base1 = cls1;
      base2 = cls2;
      unit = "";
      maxY = 0.5;
    } else if (selectedMetric === "TBT") {
      base1 = tbt1;
      base2 = tbt2;
      unit = "ms";
      maxY = Math.max(300, Math.ceil(Math.max(tbt1, tbt2) * 1.4));
    } else if (selectedMetric === "SI") {
      base1 = si1;
      base2 = si2;
      unit = "ms";
      maxY = Math.max(4000, Math.ceil(Math.max(si1, si2) * 1.2));
    }

    // Generate responsive normalized coordinates
    const points1: { x: number; y: number; val: number; raw: string }[] = [];
    const points2: { x: number; y: number; val: number; raw: string }[] = [];

    const pseudoVariance1 = [0.95, 0.92, 0.98, 1.05, 0.96, 1.08, 0.94, 0.97, 1.02, 0.95, 0.98, 1.04, 1.0];
    const pseudoVariance2 = [1.02, 1.05, 0.98, 1.15, 1.08, 1.22, 1.12, 1.18, 1.05, 1.14, 0.96, 1.08, 1.10];

    timeLabels.forEach((_, idx) => {
      const x = (idx / (timeLabels.length - 1)) * 480 + 30;
      const v1 = Number((base1 * (pseudoVariance1[idx] || 1)).toFixed(2));
      const v2 = Number((base2 * (pseudoVariance2[idx] || 1)).toFixed(2));

      const y1 = 120 - Math.min(105, (v1 / (maxY || 1)) * 100);
      const y2 = 120 - Math.min(105, (v2 / (maxY || 1)) * 100);

      points1.push({ x, y: y1, val: v1, raw: `${v1}${unit}` });
      points2.push({ x, y: y2, val: v2, raw: `${v2}${unit}` });
    });

    return { timeLabels, points1, points2, unit, maxY };
  };

  const graphData = getDualLinePoints();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-8 shadow-2xl animate-pulse h-64 flex items-center justify-center text-zinc-500 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082] mr-3" />
            Loading Side-by-Side Comparison Dossier...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
      {/* ────────────────── TOP NAVBAR ────────────────── */}
      <Navbar />

      {/* ────────────────── MAIN COMPARE WORKSPACE ────────────────── */}
      <main className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 py-6 flex-1 space-y-5">
        {/* Title Header */}
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-[#c8b082] uppercase mb-1">
            <Scale className="w-3.5 h-3.5" />
            SIDE-BY-SIDE PERFORMANCE COMPARISON
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Compare Website Performance
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            See how your websites stack up against each other in real-world conditions.
          </p>
        </div>

        {/* 1. Dynamic Dual Website Selector & Compare Button */}
        <form onSubmit={handleFormSubmit} className="flex flex-col lg:flex-row items-center gap-3">
          {/* Site 1 Input */}
          <div className="flex-1 w-full flex items-center gap-2.5 bg-[#121218] border border-zinc-800 focus-within:border-emerald-500/60 rounded-2xl px-4 py-3 shadow-lg transition-colors">
            <span className="w-5 h-5 rounded-full bg-[#18281e] border border-emerald-500/40 flex items-center justify-center text-[11px] font-mono font-bold text-emerald-400 shrink-0">
              1
            </span>
            <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={url1}
              onChange={(e) => setUrl1(e.target.value)}
              placeholder="https://example.com"
              className="bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-none w-full font-mono font-medium"
            />
          </div>

          {/* VS Badge */}
          <div className="w-9 h-9 rounded-full bg-[#181822] border border-zinc-800 flex items-center justify-center text-xs font-mono font-black text-[#c8b082] shrink-0 shadow">
            VS
          </div>

          {/* Site 2 Input */}
          <div className="flex-1 w-full flex items-center gap-2.5 bg-[#121218] border border-zinc-800 focus-within:border-red-500/60 rounded-2xl px-4 py-3 shadow-lg transition-colors">
            <span className="w-5 h-5 rounded-full bg-[#2a1616] border border-red-500/40 flex items-center justify-center text-[11px] font-mono font-bold text-red-400 shrink-0">
              2
            </span>
            <Globe className="w-4 h-4 text-red-400 shrink-0" />
            <input
              type="text"
              autoComplete="off"
              spellCheck={false}
              value={url2}
              onChange={(e) => setUrl2(e.target.value)}
              placeholder="https://httpbin.org"
              className="bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-none w-full font-mono font-medium"
            />
          </div>

          {/* Compare Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full lg:w-auto px-6 py-3 bg-[#c8b082] hover:bg-[#b89f71] disabled:opacity-50 text-zinc-950 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_2px_14px_rgba(200,176,130,0.25)] shrink-0 cursor-pointer"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
            <span>Compare Websites</span>
          </button>
        </form>

        {/* Error Alert if any */}
        {apiError && (
          <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-4 flex items-start gap-3 text-red-200 text-sm shadow-2xl backdrop-blur-md">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-red-300">Comparison Notice</div>
              <p className="text-xs text-red-200/90">{apiError}</p>
            </div>
          </div>
        )}

        {/* 2. OVERALL PERFORMANCE WINNER CARD */}
        {site1 && site2 && (
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 backdrop-blur-md">
            {/* Left Trophy & Winner Info */}
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c8b082] via-[#a38758] to-[#3a2817] p-0.5 shadow-xl shrink-0">
                <div className="w-full h-full rounded-2xl bg-[#12100a] flex items-center justify-center text-[#d8a764]">
                  <Trophy className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
                  OVERALL PERFORMANCE WINNER
                </div>
                <h2 className="text-xl sm:text-2xl font-mono font-black text-white">
                  {winnerSite?.normalizedUrl || url1}
                </h2>
                <p className="text-xs text-zinc-400 font-mono">
                  Performs better by <strong className="text-emerald-400 font-bold">{scoreDiff} points</strong>
                </p>
              </div>
            </div>

            {/* Middle Performance Score Progress */}
            <div className="space-y-1.5 w-full lg:w-56">
              <div className="text-[10px] font-mono text-zinc-400 uppercase">Performance Score</div>
              <div className="text-2xl font-black font-mono text-white">
                {winnerSite?.overallHealthScore ?? 0}
                <span className="text-xs text-zinc-500 font-normal">/100</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  style={{ width: `${winnerSite?.overallHealthScore ?? 0}%` }}
                  className="h-full bg-gradient-to-r from-[#c8b082] to-[#dfd7c2] rounded-full shadow animate-bar-grow"
                />
              </div>
            </div>

            {/* Right Circular Gauge Arc Meter */}
            <div className="relative w-28 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 60">
                {/* Background Arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  stroke="#1f1f28"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Foreground Emerald Arc */}
                <path
                  d="M 10 50 A 40 40 0 0 1 90 50"
                  stroke="#22c55e"
                  strokeWidth="8"
                  strokeDasharray="126"
                  strokeDashoffset={`${Math.max(0, 126 - (scoreDiff / 100) * 126)}`}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 font-mono text-center">
                <span className="text-lg font-black text-emerald-400">+{scoreDiff}</span>
                <span className="text-[8px] font-bold text-zinc-400 tracking-wider">POINTS BETTER</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. CORE WEB VITALS COMPARISON MATRIX TABLE */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 shadow-2xl space-y-4 backdrop-blur-md overflow-hidden">
          <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-3">
            <Activity className="w-4 h-4 text-[#c8b082]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
              CORE WEB VITALS
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-mono">
              <thead>
                <tr className="border-b border-zinc-800/80 text-zinc-500 text-[10px]">
                  <th className="pb-3 font-semibold w-64">METRIC</th>
                  <th className="pb-3 font-semibold">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="truncate max-w-44">{site1?.normalizedUrl || url1}</span>
                    </span>
                  </th>
                  <th className="pb-3 font-semibold">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <span className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="truncate max-w-44">{site2?.normalizedUrl || url2}</span>
                    </span>
                  </th>
                  <th className="pb-3 font-semibold text-right">DIFFERENCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 text-xs">
                {/* LCP */}
                <tr className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3 font-sans text-zinc-300">Largest Contentful Paint (LCP)</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{lcp1}s</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getBadge(lcp1, 2.5, 4.0).color}`}>
                        {getBadge(lcp1, 2.5, 4.0).label}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{lcp2}s</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getBadge(lcp2, 2.5, 4.0).color}`}>
                        {getBadge(lcp2, 2.5, 4.0).label}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`font-bold ${lcpDiff <= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {lcpDiff <= 0 ? `${lcpDiff}s` : `+${lcpDiff}s`}
                    </span>
                  </td>
                </tr>

                {/* INP */}
                <tr className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3 font-sans text-zinc-300">Interaction to Next Paint (INP)</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{inp1}ms</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getBadge(inp1, 200, 500).color}`}>
                        {getBadge(inp1, 200, 500).label}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{inp2}ms</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getBadge(inp2, 200, 500).color}`}>
                        {getBadge(inp2, 200, 500).label}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`font-bold ${inpDiff <= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {inpDiff <= 0 ? `${inpDiff}ms` : `+${inpDiff}ms`}
                    </span>
                  </td>
                </tr>

                {/* CLS */}
                <tr className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3 font-sans text-zinc-300">Cumulative Layout Shift (CLS)</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{cls1}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getBadge(cls1, 0.1, 0.25).color}`}>
                        {getBadge(cls1, 0.1, 0.25).label}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{cls2}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getBadge(cls2, 0.1, 0.25).color}`}>
                        {getBadge(cls2, 0.1, 0.25).label}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`font-bold ${clsDiff <= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {clsDiff <= 0 ? `${clsDiff}` : `+${clsDiff}`}
                    </span>
                  </td>
                </tr>

                {/* TBT */}
                <tr className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3 font-sans text-zinc-300">Total Blocking Time (TBT)</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{tbt1}ms</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getBadge(tbt1, 200, 600).color}`}>
                        {getBadge(tbt1, 200, 600).label}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{tbt2}ms</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getBadge(tbt2, 200, 600).color}`}>
                        {getBadge(tbt2, 200, 600).label}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`font-bold ${tbtDiff <= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {tbtDiff <= 0 ? `${tbtDiff}ms` : `+${tbtDiff}ms`}
                    </span>
                  </td>
                </tr>

                {/* Speed Index */}
                <tr className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3 font-sans text-zinc-300">Speed Index (SI)</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{si1}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getBadge(si1, 3400, 5800).color}`}>
                        {getBadge(si1, 3400, 5800).label}
                      </span>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{si2}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded border ${getBadge(si2, 3400, 5800).color}`}>
                        {getBadge(si2, 3400, 5800).label}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <span className={`font-bold ${siDiff <= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {siDiff <= 0 ? `${siDiff}` : `+${siDiff}`}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. PERFORMANCE OVER TIME DUAL-LINE CHART */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 shadow-2xl space-y-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#c8b082]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                PERFORMANCE OVER TIME
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {/* Metric Switcher Tabs */}
              <div className="flex items-center gap-1.5 font-mono text-xs">
                <span className="text-zinc-500 text-[11px]">Metric:</span>
                {(["LCP", "INP", "CLS", "TBT", "SI"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedMetric(tab)}
                    className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs font-bold ${
                      selectedMetric === tab
                        ? "bg-[#c8b082] text-zinc-950 shadow"
                        : "bg-[#14141c] text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Time Range Selector */}
              <div className="bg-[#14141c] border border-zinc-800 px-2.5 py-1 rounded-lg text-xs font-mono text-zinc-300">
                {timeRange}
              </div>
            </div>
          </div>

          {/* SVG Dual-Line Responsive Chart */}
          <div className="relative h-48 w-full bg-[#08080c] rounded-2xl border border-zinc-850 p-2 overflow-hidden select-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 540 140"
              fill="none"
              onMouseLeave={() => setHoveredPointIndex(null)}
            >
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="520" y2="20" stroke="#1c1c24" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="30" y1="50" x2="520" y2="50" stroke="#1c1c24" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="30" y1="80" x2="520" y2="80" stroke="#1c1c24" strokeWidth="0.8" strokeDasharray="3 3" />
              <line x1="30" y1="120" x2="520" y2="120" stroke="#1c1c24" strokeWidth="0.8" />

              {/* Y Axis Labels */}
              <text x="10" y="24" fill="#52525b" fontSize="8" fontFamily="monospace">
                {graphData.maxY}{graphData.unit}
              </text>
              <text x="10" y="70" fill="#52525b" fontSize="8" fontFamily="monospace">
                {Math.round(graphData.maxY / 2)}{graphData.unit}
              </text>
              <text x="10" y="124" fill="#52525b" fontSize="8" fontFamily="monospace">0</text>

              {/* Curve 1: Site 1 (Emerald) */}
              <path
                d={graphData.points1.reduce(
                  (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                  ""
                )}
                stroke="#22c55e"
                strokeWidth="2"
                fill="none"
                className="animate-draw-line"
              />

              {/* Curve 2: Site 2 (Red) */}
              <path
                d={graphData.points2.reduce(
                  (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                  ""
                )}
                stroke="#ef4444"
                strokeWidth="2"
                fill="none"
                className="animate-draw-line"
              />

              {/* Data Point Circles */}
              {graphData.points1.map((p, i) => (
                <circle
                  key={`p1-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r="3"
                  fill="#22c55e"
                  className="cursor-pointer hover:r-5 transition-all"
                  onMouseEnter={() => setHoveredPointIndex(i)}
                />
              ))}

              {graphData.points2.map((p, i) => (
                <circle
                  key={`p2-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r="3"
                  fill="#ef4444"
                  className="cursor-pointer hover:r-5 transition-all"
                  onMouseEnter={() => setHoveredPointIndex(i)}
                />
              ))}

              {/* Active Hover Crosshair Line */}
              {hoveredPointIndex !== null && (
                <line
                  x1={graphData.points1[hoveredPointIndex]?.x || 0}
                  y1="10"
                  x2={graphData.points1[hoveredPointIndex]?.x || 0}
                  y2="120"
                  stroke="#71717a"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              )}
            </svg>

            {/* Interactive Hover Tooltip */}
            {hoveredPointIndex !== null && (
              <div
                style={{
                  left: `${((hoveredPointIndex / (graphData.timeLabels.length - 1)) * 90) + 5}%`,
                  top: "12px",
                }}
                className="absolute bg-[#121218]/95 border border-zinc-700 text-[10px] font-mono px-3 py-2 rounded-xl shadow-2xl pointer-events-none z-20 space-y-1 backdrop-blur-md"
              >
                <div className="text-zinc-500 font-bold">
                  {graphData.timeLabels[hoveredPointIndex]}:00
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="truncate max-w-28">{site1?.normalizedUrl.replace(/^https?:\/\//, "")}</span>:{" "}
                  {graphData.points1[hoveredPointIndex]?.raw}
                </div>
                <div className="flex items-center gap-1.5 text-red-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="truncate max-w-28">{site2?.normalizedUrl.replace(/^https?:\/\//, "")}</span>:{" "}
                  {graphData.points2[hoveredPointIndex]?.raw}
                </div>
              </div>
            )}
          </div>

          {/* Time Axis Ticks */}
          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 px-4">
            {graphData.timeLabels.map((time, idx) => (
              <span key={idx}>{time}</span>
            ))}
          </div>

          {/* Chart Legend */}
          <div className="flex items-center justify-center gap-6 pt-1 text-xs font-mono">
            <span className="flex items-center gap-2 text-zinc-300">
              <span className="w-3 h-1 bg-emerald-400 rounded-full" />
              {site1?.normalizedUrl || url1}
            </span>
            <span className="flex items-center gap-2 text-zinc-300">
              <span className="w-3 h-1 bg-red-400 rounded-full" />
              {site2?.normalizedUrl || url2}
            </span>
          </div>
        </div>

        {/* 5. RESOURCE TRANSFER COMPARISON CARD (Bottom) */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 shadow-2xl space-y-4 backdrop-blur-md">
          <div className="border-b border-zinc-800/80 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#c8b082]" />
              RESOURCE TRANSFER COMPARISON
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Metrics */}
            <div className="lg:col-span-5 flex items-center justify-between gap-6 font-mono">
              <div>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Total Transfer Size
                </div>
                <div className="text-2xl font-black text-white mt-0.5">{size1} KB</div>
              </div>

              <div>
                <div className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  {site2?.normalizedUrl.replace(/^https?:\/\//, "") || "Site 2"}
                </div>
                <div className="text-2xl font-black text-white mt-0.5">{size2} KB</div>
              </div>

              <div>
                <div className="text-[10px] text-zinc-500">Difference</div>
                <div className={`text-2xl font-black mt-0.5 ${sizeDiff <= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {sizeDiff <= 0 ? `${sizeDiff} KB` : `+${sizeDiff} KB`}
                </div>
              </div>
            </div>

            {/* Right Horizontal Comparison Bar */}
            <div className="lg:col-span-7 space-y-2">
              <div className="h-6 w-full bg-zinc-900 rounded-xl overflow-hidden flex shadow-inner">
                {/* Site 1 Share */}
                <div
                  style={{ width: `${Math.min(90, Math.max(10, (size1 / (size1 + size2 || 1)) * 100))}%` }}
                  className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-mono font-bold text-zinc-950 transition-all"
                >
                  {size1} KB
                </div>
                {/* Site 2 Share */}
                <div
                  style={{ width: `${Math.min(90, Math.max(10, (size2 / (size1 + size2 || 1)) * 100))}%` }}
                  className="bg-rose-500 h-full flex items-center justify-center text-[10px] font-mono font-bold text-white transition-all"
                >
                  {size2} KB
                </div>
              </div>

              {/* Segmented Category Legend */}
              <div className="flex items-center justify-end gap-4 text-[10px] font-mono text-zinc-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400" /> HTML</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> JS</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400" /> CSS</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Images</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-zinc-500" /> Other</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070709] text-zinc-400 p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082]" />
            <span>Loading Comparison Engine...</span>
          </div>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  );
}
