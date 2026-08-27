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
  HardDrive,
  Clock,
  Layers,
  ArrowRight,
  TrendingDown,
  Sparkles,
  CheckCircle2,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  Type,
  ShieldAlert,
  Server,
  Share2,
  ExternalLink,
  SlidersHorizontal,
  ChevronRight,
  Cpu,
  BarChart2,
} from "lucide-react";
import type { AnalysisResult, ThirdPartyResource, OpportunityItem } from "@/types";
import { Navbar } from "@/components/layout/Navbar";

function DetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUrlParam = searchParams.get("url") || "";

  const [mounted, setMounted] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");

  useEffect(() => {
    setMounted(true);
    const initialUrl = targetUrlParam || "https://example.com";
    setInputUrl(initialUrl);
    fetchAnalysis(initialUrl);
  }, [targetUrlParam]);

  const fetchAnalysis = async (urlToFetch: string) => {
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
        setApiError(json.error || "Failed to retrieve website details.");
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
    router.push(`/details?url=${encodeURIComponent(inputUrl.trim())}`);
  };

  // Safe Metric Extraction
  const metrics = analysisData?.metrics;
  const lcpSec = metrics?.lcpSec ?? 0;
  const fcpSec = metrics?.fcpSec ?? 0;
  const ttfbMs = metrics?.ttfbMs ?? 0;
  const inpMs = metrics?.inpMs ?? 0;
  const cls = metrics?.cls ?? 0;
  const speedIndex = metrics?.speedIndex ?? 0;
  const tbtMs = metrics?.tbtMs ?? 0;
  const pageSizeKb = metrics?.pageSizeKb ?? 0;
  const requestsCount = metrics?.requestsCount ?? 0;
  const domNodesCount = metrics?.domNodesCount ?? 0;

  const breakdown = analysisData?.resourceBreakdown;
  const jsKb = breakdown?.jsKb ?? 0;
  const cssKb = breakdown?.cssKb ?? 0;
  const imageKb = breakdown?.imageKb ?? 0;
  const fontKb = breakdown?.fontKb ?? 0;
  const htmlKb = breakdown?.htmlKb ?? 0;
  const otherKb = breakdown?.otherKb ?? 0;

  const jsCount = breakdown?.counts?.js ?? 0;
  const cssCount = breakdown?.counts?.css ?? 0;
  const imageCount = breakdown?.counts?.image ?? 0;
  const fontCount = breakdown?.counts?.font ?? 0;
  const thirdPartyCount = breakdown?.thirdPartyCount ?? 0;

  const thirdPartyList = analysisData?.thirdPartyResources ?? [];
  const opportunities = analysisData?.opportunities ?? [];

  // Calculate cumulative potential savings
  const totalTimeSavingsMs = opportunities.reduce((acc, opp) => acc + (opp.savingsMs || 0), 0);
  const totalByteSavingsKb = opportunities.reduce((acc, opp) => acc + (opp.savingsKb || 0), 0);

  // Filter third-party resources if filtered
  const filteredThirdParty = selectedCategoryFilter === "ALL"
    ? thirdPartyList
    : thirdPartyList.filter((item) => item.category.toUpperCase() === selectedCategoryFilter);

  // Status helper
  const getVitalsBadge = (val: number, goodLimit: number, warnLimit: number) => {
    if (val <= goodLimit) {
      return {
        label: "Good",
        color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/40",
      };
    }
    if (val <= warnLimit) {
      return {
        label: "Needs Improvement",
        color: "text-amber-400 bg-amber-500/15 border-amber-500/40",
      };
    }
    return {
      label: "Poor",
      color: "text-red-400 bg-red-500/15 border-red-500/40",
    };
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-8 shadow-2xl animate-pulse h-48 flex items-center justify-center text-zinc-500 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082] mr-3" />
            Loading Detailed Forensic Breakdown...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
      {/* ────────────────── NAVBAR ────────────────── */}
      <Navbar />

      {/* ────────────────── MAIN WEBSITE DETAILS DOSSIER ────────────────── */}
      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
        {/* Error Alert Banner */}
        {apiError && (
          <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-5 flex items-start gap-4 text-red-200 text-sm shadow-2xl backdrop-blur-md">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-red-300 text-base">Diagnostic Notice</div>
              <p className="text-xs text-red-200/90 leading-relaxed">{apiError}</p>
            </div>
          </div>
        )}

        {/* 1. CASE HEADER & TARGET URL DOSSIER */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 relative z-10 w-full lg:w-auto">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-[#dfd7c2] text-zinc-950 text-xs font-mono font-black tracking-widest uppercase border border-[#c7beaa] shadow-sm">
                {analysisData?.caseId || "#CASE-AUDIT"}
              </span>
              <span className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c8b082]" />
                Audited: {analysisData?.investigatedAt || (loading ? "Probing..." : "Live Snapshot")}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[11px] font-mono border border-blue-500/30 flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-blue-400" />
                Deep Website Forensic Breakdown
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white flex items-center gap-3 tracking-tight break-all">
              <Globe className="w-6 h-6 text-[#c8b082] shrink-0" />
              {analysisData?.normalizedUrl || targetUrlParam || "Forensic Inspection"}
            </h1>

            {/* Quick URL Search Bar */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1 max-w-lg">
              <div className="flex items-center gap-2 bg-[#121218] border border-zinc-800 rounded-xl px-3 py-1.5 w-full">
                <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Inspect another website (e.g. site.com)..."
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

          {/* Aggregate Payload Stats Card */}
          <div className="bg-[#13131a] border border-zinc-800/90 rounded-2xl p-5 shrink-0 flex items-center gap-6 shadow-xl w-full sm:w-auto justify-between">
            <div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                TOTAL WIRE TRANSFER
              </div>
              <div className="flex items-baseline gap-1 my-0.5">
                <span className="text-3xl lg:text-4xl font-black text-white font-mono">
                  {loading ? "--" : pageSizeKb}
                </span>
                <span className="text-xs text-zinc-500 font-bold">KB</span>
              </div>
              <div className="text-xs text-zinc-400 font-mono">
                {loading ? "--" : `${requestsCount} total network requests`}
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-[#1b1b24] border border-zinc-800 flex items-center justify-center text-[#c8b082]">
              <HardDrive className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 2. DETAILED CORE WEB VITALS & LOADING TELEMETRY */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#c8b082]" />
              Detailed Core Web Vitals & Loading Timeline
            </h2>
            <span className="text-xs font-mono text-zinc-500">Real-Time Measurements</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* LCP Card */}
            <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">Largest Contentful Paint</span>
                {analysisData && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getVitalsBadge(lcpSec, 2.5, 4.0).color}`}>
                    {getVitalsBadge(lcpSec, 2.5, 4.0).label}
                  </span>
                )}
              </div>
              <div className="text-3xl font-black font-mono text-white">
                {loading ? "--" : `${lcpSec}s`}
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Measures perceived loading speed. Target: &lt; 2.5s for 75% of page visits.
              </p>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (lcpSec / 5) * 100)}%` }}
                  className={`h-full rounded-full ${lcpSec <= 2.5 ? "bg-emerald-400" : lcpSec <= 4.0 ? "bg-amber-400" : "bg-red-400"}`}
                />
              </div>
            </div>

            {/* INP Card */}
            <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">Interaction to Next Paint</span>
                {analysisData && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getVitalsBadge(inpMs, 200, 500).color}`}>
                    {getVitalsBadge(inpMs, 200, 500).label}
                  </span>
                )}
              </div>
              <div className="text-3xl font-black font-mono text-white">
                {loading ? "--" : `${inpMs}ms`}
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Measures user interface responsiveness. Target: &lt; 200ms on all device interactions.
              </p>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (inpMs / 600) * 100)}%` }}
                  className={`h-full rounded-full ${inpMs <= 200 ? "bg-emerald-400" : inpMs <= 500 ? "bg-amber-400" : "bg-red-400"}`}
                />
              </div>
            </div>

            {/* CLS Card */}
            <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">Cumulative Layout Shift</span>
                {analysisData && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getVitalsBadge(cls, 0.1, 0.25).color}`}>
                    {getVitalsBadge(cls, 0.1, 0.25).label}
                  </span>
                )}
              </div>
              <div className="text-3xl font-black font-mono text-white">
                {loading ? "--" : `${cls}`}
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Measures visual stability during render. Target: &lt; 0.1 unexpected layout movement.
              </p>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, (cls / 0.3) * 100)}%` }}
                  className={`h-full rounded-full ${cls <= 0.1 ? "bg-emerald-400" : cls <= 0.25 ? "bg-amber-400" : "bg-red-400"}`}
                />
              </div>
            </div>

            {/* Speed Index & TBT Card */}
            <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400">Speed Index & TBT</span>
                <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  Lab Probe
                </span>
              </div>
              <div className="flex items-baseline gap-3">
                <div>
                  <div className="text-2xl font-black font-mono text-white">
                    {loading ? "--" : speedIndex}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">Speed Index</div>
                </div>
                <div className="border-l border-zinc-800 pl-3">
                  <div className="text-2xl font-black font-mono text-[#d8a764]">
                    {loading ? "--" : `${tbtMs}ms`}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">Total Blocking Time</div>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                Speed Index measures how quickly page contents are visually populated.
              </p>
            </div>
          </div>
        </div>

        {/* 3. RESOURCE BREAKDOWN & ASSET ALLOCATION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#c8b082]" />
              Detailed Resource Breakdown & Asset Allocation
            </h2>
            <span className="text-xs font-mono text-zinc-500">
              {requestsCount} Total Requests ({pageSizeKb} KB)
            </span>
          </div>

          {/* Proportional Stack Bar */}
          <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Asset Byte Proportions</span>
                <span className="font-mono text-white">{pageSizeKb} KB Total</span>
              </div>
              <div className="h-3.5 w-full bg-zinc-900 rounded-full overflow-hidden flex shadow-inner">
                <div
                  style={{ width: `${Math.min(100, (jsKb / (pageSizeKb || 1)) * 100)}%` }}
                  className="bg-amber-400 h-full transition-all"
                  title={`JavaScript: ${jsKb} KB`}
                />
                <div
                  style={{ width: `${Math.min(100, (imageKb / (pageSizeKb || 1)) * 100)}%` }}
                  className="bg-emerald-400 h-full transition-all"
                  title={`Images: ${imageKb} KB`}
                />
                <div
                  style={{ width: `${Math.min(100, (cssKb / (pageSizeKb || 1)) * 100)}%` }}
                  className="bg-blue-400 h-full transition-all"
                  title={`CSS: ${cssKb} KB`}
                />
                <div
                  style={{ width: `${Math.min(100, (fontKb / (pageSizeKb || 1)) * 100)}%` }}
                  className="bg-purple-400 h-full transition-all"
                  title={`Fonts: ${fontKb} KB`}
                />
                <div
                  style={{ width: `${Math.min(100, (htmlKb / (pageSizeKb || 1)) * 100)}%` }}
                  className="bg-rose-400 h-full transition-all"
                  title={`HTML: ${htmlKb} KB`}
                />
              </div>
            </div>

            {/* Asset Allocation Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
              {/* JavaScript */}
              <div className="bg-[#121218] p-4 rounded-xl border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                    <FileCode className="w-3.5 h-3.5" />
                    JavaScript
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                    {jsCount} files
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-white">{jsKb} KB</div>
                <div className="text-[10px] text-zinc-500">
                  {pageSizeKb > 0 ? Math.round((jsKb / pageSizeKb) * 100) : 0}% of total page weight
                </div>
              </div>

              {/* CSS */}
              <div className="bg-[#121218] p-4 rounded-xl border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    CSS Styles
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                    {cssCount} files
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-white">{cssKb} KB</div>
                <div className="text-[10px] text-zinc-500">
                  {pageSizeKb > 0 ? Math.round((cssKb / pageSizeKb) * 100) : 0}% of total page weight
                </div>
              </div>

              {/* Images */}
              <div className="bg-[#121218] p-4 rounded-xl border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Images
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                    {imageCount} files
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-white">{imageKb} KB</div>
                <div className="text-[10px] text-zinc-500">
                  {pageSizeKb > 0 ? Math.round((imageKb / pageSizeKb) * 100) : 0}% of total page weight
                </div>
              </div>

              {/* Fonts */}
              <div className="bg-[#121218] p-4 rounded-xl border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-purple-400">
                    <Type className="w-3.5 h-3.5" />
                    Web Fonts
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                    {fontCount} files
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-white">{fontKb} KB</div>
                <div className="text-[10px] text-zinc-500">
                  {pageSizeKb > 0 ? Math.round((fontKb / pageSizeKb) * 100) : 0}% of total page weight
                </div>
              </div>

              {/* HTML Document */}
              <div className="bg-[#121218] p-4 rounded-xl border border-zinc-800/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                    <Globe className="w-3.5 h-3.5" />
                    HTML Doc
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                    1 doc
                  </span>
                </div>
                <div className="text-xl font-bold font-mono text-white">{htmlKb} KB</div>
                <div className="text-[10px] text-zinc-500">
                  {domNodesCount} DOM elements
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. PERFORMANCE OPPORTUNITIES & ESTIMATED POTENTIAL SAVINGS */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#c8b082]" />
                Performance Opportunities & Potential Savings
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Targeted optimizations to directly improve Core Web Vitals and reduce origin load.
              </p>
            </div>

            {/* Savings Badge */}
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-[#c8b082]/10 border border-[#c8b082]/30 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#c8b082]" />
                <div className="text-xs">
                  <span className="text-zinc-400">Potential Savings: </span>
                  <strong className="text-white font-mono">
                    {totalTimeSavingsMs > 0 ? `~${totalTimeSavingsMs}ms` : "Optimal"}
                  </strong>
                  {totalByteSavingsKb > 0 && (
                    <span className="text-zinc-400"> / <strong className="text-[#d8a764] font-mono">{totalByteSavingsKb} KB</strong></span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-zinc-500 text-sm flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#c8b082]" />
              <span>Calculating potential payload and rendering optimizations...</span>
            </div>
          ) : opportunities.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-sm flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <span className="font-bold text-white">No Significant Performance Bottlenecks Found!</span>
              <span className="text-xs text-zinc-500">The audited page is already well-optimized for asset delivery.</span>
            </div>
          ) : (
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <div
                  key={opp.id}
                  className="bg-[#121218] border border-zinc-800/90 rounded-2xl p-5 shadow-lg space-y-3 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#c8b082] bg-[#c8b082]/10 px-2.5 py-0.5 rounded border border-[#c8b082]/30">
                        {opp.id}
                      </span>
                      <h4 className="text-sm font-bold text-white">{opp.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {opp.savingsMs && opp.savingsMs > 0 && (
                        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          Est. Save ~{opp.savingsMs}ms
                        </span>
                      )}
                      {opp.savingsKb && opp.savingsKb > 0 && (
                        <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/30">
                          ~{opp.savingsKb} KB
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          opp.impact === "High"
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : opp.impact === "Medium"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                        }`}
                      >
                        {opp.impact} Priority
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">{opp.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. THIRD-PARTY RESOURCES & NETWORK ECOSYSTEM */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#c8b082]" />
                Third-Party Resources & Origin Breakdown
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                External scripts, analytics trackers, CDNs, and font libraries loaded on the target page.
              </p>
            </div>

            <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl">
              {thirdPartyList.length} External Origins Detected ({thirdPartyCount} requests)
            </span>
          </div>

          {/* Category Filter Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {["ALL", "ANALYTICS", "FONTS", "CDN", "ADS", "SOCIAL", "OTHER"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`text-xs px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                  selectedCategoryFilter === cat
                    ? "bg-[#c8b082] text-zinc-950 font-bold border-[#c8b082]"
                    : "bg-[#14141c] text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-16 text-center text-zinc-500 text-sm flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#c8b082]" />
              <span>Analyzing third-party network origins...</span>
            </div>
          ) : filteredThirdParty.length === 0 ? (
            <div className="py-10 text-center text-zinc-400 text-sm flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <span>No third-party resources found in this category.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono">
                    <th className="pb-3 font-semibold">Third-Party Domain</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Requests</th>
                    <th className="pb-3 font-semibold">Transfer Size</th>
                    <th className="pb-3 font-semibold text-right">Sample Asset</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {filteredThirdParty.map((tp, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 font-bold text-white flex items-center gap-2">
                        <Server className="w-3.5 h-3.5 text-[#c8b082] shrink-0" />
                        <span>{tp.domain}</span>
                      </td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-[10px] font-sans border border-zinc-700">
                          {tp.category}
                        </span>
                      </td>
                      <td className="py-3.5 text-zinc-300">
                        {tp.requestCount} {tp.requestCount === 1 ? "call" : "calls"}
                      </td>
                      <td className="py-3.5 text-zinc-200 font-bold">
                        {tp.sizeKb} KB
                      </td>
                      <td className="py-3.5 text-right font-sans">
                        {tp.urls && tp.urls.length > 0 ? (
                          <span className="text-[11px] text-zinc-400 truncate max-w-xs inline-block font-mono" title={tp.urls[0]}>
                            {tp.urls[0].split("/").pop() || tp.urls[0]}
                          </span>
                        ) : (
                          <span className="text-zinc-600">--</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 6. LAB PROBE FOOTER */}
        <div className="bg-[#0b0b10] border border-zinc-800/60 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#c8b082] shrink-0" />
            <span>
              <strong>Website Details Forensic Probe:</strong> Real asset measurements extracted from document parse, external sub-requests, and response headers.
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 shrink-0">Engine v2.4</span>
        </div>
      </main>
    </div>
  );
}

export default function DetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070709] text-zinc-400 p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082]" />
            <span>Loading Website Details Dossier...</span>
          </div>
        </div>
      }
    >
      <DetailsContent />
    </Suspense>
  );
}
