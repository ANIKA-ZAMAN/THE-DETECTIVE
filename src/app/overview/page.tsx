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
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  Code2,
  Clock,
  HardDrive,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Radio,
  FileCode,
  FileSpreadsheet,
  Image as ImageIcon,
  Type,
  Share2,
  Crosshair,
  Maximize2,
  Terminal,
  Filter,
  Layers,
} from "lucide-react";
import type { AnalysisResult, FaultItem } from "@/types";
import { Navbar } from "@/components/layout/Navbar";
import { ShareModal } from "@/components/common/ShareModal";

// Radar Blip Definition
interface RadarBlip {
  id: string;
  label: string;
  value: string;
  category: "vitals" | "network" | "fault" | "asset";
  status: "good" | "warn" | "poor";
  angleDeg: number; // 0 to 360
  radiusPercent: number; // 25 to 88%
  detail: string;
  codeClue?: string;
  actionHref?: string;
}

export function OverviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUrlParam = searchParams.get("url") || "";

  const [mounted, setMounted] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Scan Progression Animation State (0 to 6)
  const [scanStage, setScanStage] = useState<number>(0);
  const [displayedScore, setDisplayedScore] = useState<number>(0);
  const [selectedBlip, setSelectedBlip] = useState<RadarBlip | null>(null);
  const [viewTimeFilter, setViewTimeFilter] = useState<"LIVE" | "LAB" | "CRUX">("LIVE");

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
    setScanStage(0);
    setDisplayedScore(0);

    try {
      const res = await fetch("/api/investigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlToFetch }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setAnalysisData(json.data);
        startSequentialReveal(json.data);
      } else {
        setApiError(json.error || "Failed to analyze target website.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Failed to run investigation", err);
      setApiError("Network error: Could not contact investigation server.");
      setLoading(false);
    }
  };

  // Orchestrates the step-by-step forensic scanner reveal sequence
  const startSequentialReveal = (data: AnalysisResult) => {
    setScanStage(1);

    const timeouts = [
      setTimeout(() => setScanStage(2), 500),  // TTFB & FCP
      setTimeout(() => setScanStage(3), 1000), // LCP & Speed Index
      setTimeout(() => setScanStage(4), 1500), // INP & CLS
      setTimeout(() => setScanStage(5), 2000), // Assets & Payload
      setTimeout(() => setScanStage(6), 2500), // Faults & Final Score
      setTimeout(() => {
        setLoading(false);
        // Animate score count-up to target
        animateScoreCount(data.overallHealthScore);
      }, 2900),
    ];

    return () => timeouts.forEach(clearTimeout);
  };

  const animateScoreCount = (targetScore: number) => {
    const duration = 800; // ms
    const startTime = performance.now();

    const updateScore = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const current = Math.floor(progress * targetScore);
      setDisplayedScore(current);

      if (progress < 1) {
        requestAnimationFrame(updateScore);
      } else {
        setDisplayedScore(targetScore);
      }
    };

    requestAnimationFrame(updateScore);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    if (inputUrl.trim() === targetUrlParam) {
      fetchAnalysis(inputUrl.trim());
    } else {
      router.push(`/overview?url=${encodeURIComponent(inputUrl.trim())}`);
    }
  };

  // Safe Metric Extractions
  const metrics = analysisData?.metrics;
  const lcpSec = metrics?.lcpSec ?? 0;
  const fcpSec = metrics?.fcpSec ?? 0;
  const ttfbMs = metrics?.ttfbMs ?? 0;
  const inpMs = metrics?.inpMs ?? 0;
  const cls = metrics?.cls ?? 0;
  const speedIndex = metrics?.speedIndex ?? 0;
  const pageSizeKb = metrics?.pageSizeKb ?? 0;
  const requestsCount = metrics?.requestsCount ?? 0;
  const domNodesCount = metrics?.domNodesCount ?? 0;

  const breakdown = analysisData?.resourceBreakdown;
  const jsKb = breakdown?.jsKb ?? 0;
  const cssKb = breakdown?.cssKb ?? 0;
  const imageKb = breakdown?.imageKb ?? 0;
  const fontKb = breakdown?.fontKb ?? 0;
  const htmlKb = breakdown?.htmlKb ?? 0;

  const jsCount = breakdown?.counts?.js ?? 0;
  const cssCount = breakdown?.counts?.css ?? 0;
  const imageCount = breakdown?.counts?.image ?? 0;
  const fontCount = breakdown?.counts?.font ?? 0;

  const faults = analysisData?.faults ?? [];
  const topProblems = faults.filter((f) => f.category === "Performance" || f.impact === "Critical");

  // Construct Radar Evidence Blips dynamically from real backend data
  const radarBlips: RadarBlip[] = [];

  if (analysisData) {
    // 1. TTFB blip (Angle ~40°, Inner ring)
    radarBlips.push({
      id: "blip-ttfb",
      label: "TTFB Origin Latency",
      value: `${ttfbMs}ms`,
      category: "network",
      status: ttfbMs <= 600 ? "good" : ttfbMs <= 1200 ? "warn" : "poor",
      angleDeg: 42,
      radiusPercent: 32,
      detail: `Time to First Byte measured from origin server. Target: < 600ms.`,
      actionHref: `/details?url=${encodeURIComponent(analysisData.normalizedUrl)}`,
    });

    // 2. FCP blip (Angle ~115°, Mid ring)
    radarBlips.push({
      id: "blip-fcp",
      label: "First Contentful Paint",
      value: `${fcpSec}s`,
      category: "vitals",
      status: fcpSec <= 1.8 ? "good" : fcpSec <= 3.0 ? "warn" : "poor",
      angleDeg: 118,
      radiusPercent: 52,
      detail: `First visual paint timestamp. Target: < 1.8s.`,
      actionHref: `/details?url=${encodeURIComponent(analysisData.normalizedUrl)}`,
    });

    // 3. LCP blip (Angle ~210°, Mid-outer ring)
    radarBlips.push({
      id: "blip-lcp",
      label: "Largest Contentful Paint",
      value: `${lcpSec}s`,
      category: "vitals",
      status: lcpSec <= 2.5 ? "good" : lcpSec <= 4.0 ? "warn" : "poor",
      angleDeg: 215,
      radiusPercent: 68,
      detail: `Main viewport content render time. Target: < 2.5s.`,
      actionHref: `/details?url=${encodeURIComponent(analysisData.normalizedUrl)}`,
    });

    // 4. INP blip (Angle ~290°, Mid ring)
    radarBlips.push({
      id: "blip-inp",
      label: "Interaction Responsiveness",
      value: `${inpMs}ms`,
      category: "vitals",
      status: inpMs <= 200 ? "good" : inpMs <= 500 ? "warn" : "poor",
      angleDeg: 292,
      radiusPercent: 46,
      detail: `Main thread interaction responsiveness. Target: < 200ms.`,
      actionHref: `/details?url=${encodeURIComponent(analysisData.normalizedUrl)}`,
    });

    // 5. CLS blip (Angle ~340°, Outer ring)
    radarBlips.push({
      id: "blip-cls",
      label: "Cumulative Layout Shift",
      value: `${cls}`,
      category: "vitals",
      status: cls <= 0.1 ? "good" : cls <= 0.25 ? "warn" : "poor",
      angleDeg: 342,
      radiusPercent: 78,
      detail: `Visual stability metric. Target: < 0.1 unexpected movement.`,
      actionHref: `/details?url=${encodeURIComponent(analysisData.normalizedUrl)}`,
    });

    // 6. Add blips for detected critical/warning faults
    faults.slice(0, 4).forEach((fault, i) => {
      const angles = [75, 165, 255, 320];
      const radii = [62, 74, 82, 58];
      radarBlips.push({
        id: `blip-fault-${fault.id}`,
        label: fault.title,
        value: `${fault.impact} Impact`,
        category: "fault",
        status: fault.impact === "Critical" ? "poor" : "warn",
        angleDeg: angles[i % angles.length],
        radiusPercent: radii[i % radii.length],
        detail: fault.description,
        codeClue: fault.clueCode,
        actionHref: `/investigation?url=${encodeURIComponent(analysisData.normalizedUrl)}`,
      });
    });
  }

  // Active HUD popup blip (defaults to first fault or LCP if none selected)
  const activeBlip = selectedBlip || (radarBlips.find((b) => b.category === "fault") || radarBlips[2] || radarBlips[0]);

  // Stage message indicator
  const getStageMessage = () => {
    if (loading) {
      if (scanStage <= 1) return "Connecting to target web server & resolving DNS...";
      if (scanStage === 2) return "Measuring initial Time to First Byte (TTFB) & FCP...";
      if (scanStage === 3) return "Analyzing Largest Contentful Paint (LCP) assets...";
      if (scanStage === 4) return "Evaluating Interaction to Next Paint & Layout Shifts...";
      if (scanStage === 5) return "Parsing asset payload breakdown & dependencies...";
      return "Isolating performance bottlenecks & rendering verdict...";
    }
    return "Forensic Performance Scan Complete • Telemetry Verified";
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-8 shadow-2xl animate-pulse h-64 flex items-center justify-center text-zinc-500 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082] mr-3" />
            Initializing Forensic Radar Command Center...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
      {/* ────────────────── TOP NAVBAR ────────────────── */}
      <Navbar />

      {/* ────────────────── MAIN OVERVIEW DASHBOARD ────────────────── */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6">
        {/* Top Case Dossier Bar & Search */}
        <div className="bg-[#0c0c11]/90 border border-zinc-800/80 rounded-2xl px-5 py-3.5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-[#dfd7c2] text-zinc-950 text-xs font-mono font-black tracking-widest uppercase border border-[#c7beaa] shadow-sm">
              {analysisData?.caseId || "#CASE-AUDIT"}
            </span>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#c8b082] shrink-0" />
              <span className="text-sm font-mono font-bold text-white truncate max-w-xs sm:max-w-md" title={analysisData?.normalizedUrl || targetUrlParam}>
                {analysisData?.normalizedUrl || targetUrlParam || "https://example.com"}
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 font-mono hidden lg:inline">
              Audited: {analysisData?.investigatedAt || "Live Session"}
            </span>
          </div>

          {/* Quick Target URL Input & Live Status */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-[#14141c] border border-zinc-800 rounded-xl px-3 py-1.5 w-full md:w-80">
              <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <input
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Audit target URL (e.g. site.com)..."
                className="bg-transparent text-xs text-zinc-200 placeholder-zinc-500 outline-none w-full font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#c8b082] hover:bg-[#b89f71] disabled:opacity-50 text-zinc-950 font-bold text-[11px] px-3 py-1 rounded-lg transition-colors shrink-0 shadow cursor-pointer"
              >
                {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Probe"}
              </button>
            </form>

            <button
              onClick={() => fetchAnalysis(inputUrl || targetUrlParam || "https://example.com")}
              disabled={loading}
              className="p-2 bg-[#14141c] hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Re-Scan Target"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#c8b082]" : ""}`} />
            </button>

            <button
              onClick={() => setShareModalOpen(true)}
              className="px-3 py-1.5 bg-[#14141c] hover:bg-[#1c1c28] border border-zinc-800 hover:border-[#c8b082]/60 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-sm"
              title="Share Investigation Dossier"
            >
              <Share2 className="w-3.5 h-3.5 text-[#c8b082]" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* API Error Alert if any */}
        {apiError && (
          <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-4 flex items-start gap-3 text-red-200 text-sm shadow-2xl backdrop-blur-md">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-red-300">Scanner Notice</div>
              <p className="text-xs text-red-200/90">{apiError}</p>
            </div>
          </div>
        )}

        {/* ────────────────── COMMAND CENTER 3-COLUMN LAYOUT ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* ═══════════ LEFT PANEL: CASE TELEMETRY & VITALS ═══════════ */}
          <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
            {/* 1. Core Web Vitals Summary Panel */}
            <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#c8b082]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">Core Web Vitals</h3>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">Google Targets</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* LCP */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#13131b] border border-zinc-800/70 hover:border-zinc-700 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-400 font-sans font-semibold">LCP (Largest Paint)</span>
                    <div className="text-sm font-bold text-white">
                      {loading && scanStage < 3 ? "--" : `${lcpSec}s`}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      lcpSec <= 2.5
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                        : lcpSec <= 4.0
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                        : "text-red-400 bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    {lcpSec <= 2.5 ? "Good" : lcpSec <= 4.0 ? "Needs Work" : "Poor"}
                  </span>
                </div>

                {/* INP */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#13131b] border border-zinc-800/70 hover:border-zinc-700 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-400 font-sans font-semibold">INP (Responsiveness)</span>
                    <div className="text-sm font-bold text-white">
                      {loading && scanStage < 4 ? "--" : `${inpMs}ms`}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      inpMs <= 200
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                        : inpMs <= 500
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                        : "text-red-400 bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    {inpMs <= 200 ? "Good" : inpMs <= 500 ? "Needs Work" : "Poor"}
                  </span>
                </div>

                {/* CLS */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#13131b] border border-zinc-800/70 hover:border-zinc-700 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-400 font-sans font-semibold">CLS (Visual Shift)</span>
                    <div className="text-sm font-bold text-white">
                      {loading && scanStage < 4 ? "--" : `${cls}`}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      cls <= 0.1
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                        : cls <= 0.25
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                        : "text-red-400 bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    {cls <= 0.1 ? "Good" : cls <= 0.25 ? "Needs Work" : "Poor"}
                  </span>
                </div>

                {/* TTFB */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#13131b] border border-zinc-800/70 hover:border-zinc-700 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-400 font-sans font-semibold">TTFB (Origin Latency)</span>
                    <div className="text-sm font-bold text-white">
                      {loading && scanStage < 2 ? "--" : `${ttfbMs}ms`}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      ttfbMs <= 600
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                        : ttfbMs <= 1200
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                        : "text-red-400 bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    {ttfbMs <= 600 ? "Good" : ttfbMs <= 1200 ? "Needs Work" : "Poor"}
                  </span>
                </div>

                {/* FCP */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-[#13131b] border border-zinc-800/70 hover:border-zinc-700 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-zinc-400 font-sans font-semibold">FCP (First Paint)</span>
                    <div className="text-sm font-bold text-white">
                      {loading && scanStage < 2 ? "--" : `${fcpSec}s`}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      fcpSec <= 1.8
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                        : fcpSec <= 3.0
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                        : "text-red-400 bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    {fcpSec <= 1.8 ? "Good" : fcpSec <= 3.0 ? "Needs Work" : "Poor"}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Diagnostic Pillar Scores */}
            <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#c8b082]" />
                  Diagnostic Pillars
                </span>
                <span className="text-[10px] font-mono text-zinc-500">Weights</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#121218] p-2.5 rounded-xl border border-zinc-800/80">
                  <div className="text-[10px] text-zinc-400">Performance (40%)</div>
                  <div className="text-lg font-mono font-bold text-amber-400">
                    {loading ? "--" : `${analysisData?.categoryScores?.performance ?? 0}%`}
                  </div>
                </div>

                <div className="bg-[#121218] p-2.5 rounded-xl border border-zinc-800/80">
                  <div className="text-[10px] text-zinc-400">SEO (25%)</div>
                  <div className="text-lg font-mono font-bold text-blue-400">
                    {loading ? "--" : `${analysisData?.categoryScores?.seo ?? 0}%`}
                  </div>
                </div>

                <div className="bg-[#121218] p-2.5 rounded-xl border border-zinc-800/80">
                  <div className="text-[10px] text-zinc-400">Security (20%)</div>
                  <div className="text-lg font-mono font-bold text-emerald-400">
                    {loading ? "--" : `${analysisData?.categoryScores?.security ?? 0}%`}
                  </div>
                </div>

                <div className="bg-[#121218] p-2.5 rounded-xl border border-zinc-800/80">
                  <div className="text-[10px] text-zinc-400">A11y (15%)</div>
                  <div className="text-lg font-mono font-bold text-purple-400">
                    {loading ? "--" : `${analysisData?.categoryScores?.accessibility ?? 0}%`}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════ CENTER: RADIAL PERFORMANCE SCANNER ═══════════ */}
          <div className="lg:col-span-6 bg-[#0a0a0f] border border-zinc-800/90 rounded-3xl p-6 shadow-2xl relative flex flex-col items-center justify-between min-h-[560px] overflow-hidden">
            {/* Ambient Background Gold Glare */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(200,176,130,0.06)_0%,_transparent_70%)] pointer-events-none" />

            {/* Scanner Header Controls */}
            <div className="w-full flex items-center justify-between border-b border-zinc-800/80 pb-3 z-20">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${loading ? "text-amber-400 animate-pulse" : "text-[#c8b082]"}`} />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  {loading ? "LIVE FORENSIC SWEEP IN PROGRESS" : "RADIAL EVIDENCE RADAR"}
                </span>
              </div>

              {/* View Mode Chips (Inspired by 1 Day / 1 Week / 1 Month in reference) */}
              <div className="flex items-center gap-1 bg-[#121218] p-1 rounded-xl border border-zinc-800 text-[11px] font-mono">
                {(["LIVE", "LAB", "CRUX"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewTimeFilter(mode)}
                    className={`px-2.5 py-0.5 rounded-lg transition-colors cursor-pointer ${
                      viewTimeFilter === mode
                        ? "bg-[#c8b082] text-zinc-950 font-bold"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Central Polar Radar Canvas */}
            <div className="relative my-auto flex items-center justify-center w-full max-w-[420px] aspect-square select-none">
              {/* 1. Radar Grid SVG (Concentric Rings + Radial Spokes + Degree Labels) */}
              <svg className="absolute inset-0 w-full h-full text-zinc-800/80" viewBox="0 0 400 400" fill="none">
                {/* Outer Polar Ring */}
                <circle cx="200" cy="200" r="185" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3" />
                {/* 75% Ring */}
                <circle cx="200" cy="200" r="140" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
                {/* 50% Ring */}
                <circle cx="200" cy="200" r="95" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
                {/* 25% Ring */}
                <circle cx="200" cy="200" r="50" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />

                {/* 8 Radial Spoke Lines */}
                <line x1="200" y1="15" x2="200" y2="385" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
                <line x1="15" y1="200" x2="385" y2="200" stroke="currentColor" strokeWidth="0.7" opacity="0.5" />
                <line x1="69" y1="69" x2="331" y2="331" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />
                <line x1="69" y1="331" x2="331" y2="69" stroke="currentColor" strokeWidth="0.6" opacity="0.3" />

                {/* Degree Tick Marks */}
                <text x="200" y="10" fill="#71717a" fontSize="8" fontFamily="monospace" textAnchor="middle">0°</text>
                <text x="390" y="203" fill="#71717a" fontSize="8" fontFamily="monospace" textAnchor="middle">90°</text>
                <text x="200" y="396" fill="#71717a" fontSize="8" fontFamily="monospace" textAnchor="middle">180°</text>
                <text x="10" y="203" fill="#71717a" fontSize="8" fontFamily="monospace" textAnchor="middle">270°</text>
              </svg>

              {/* 2. Rotating Radar Sweep Beam (Active during loading / slow idle) */}
              <div
                className={`absolute inset-[3.75%] rounded-full overflow-hidden pointer-events-none ${
                  loading ? "animate-radar-sweep-fast" : "animate-radar-sweep"
                }`}
              >
                <div className="w-full h-full relative rounded-full overflow-hidden">
                  {/* Conical Gradient Sweep Cone - strictly bounded inside round radar perimeter */}
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "conic-gradient(from 0deg at 50% 50%, #c8b082 0deg, rgba(200, 176, 130, 0.25) 4deg, rgba(200, 176, 130, 0.08) 30deg, transparent 48deg, transparent 360deg)",
                      opacity: loading ? 0.95 : 0.45,
                    }}
                  />
                  {/* Sweep Leading Edge Line */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1/2 bg-gradient-to-t from-[#c8b082] via-[#e5d4ab] to-transparent shadow-[0_0_10px_#c8b082]" />
                </div>
              </div>

              {/* 3. Interactive Evidence Radar Blips */}
              {radarBlips.map((blip) => {
                const angleRad = ((blip.angleDeg - 90) * Math.PI) / 180;
                // Calculate position relative to center 50%
                const r = (blip.radiusPercent / 100) * 45; // percentage from center
                const x = 50 + r * Math.cos(angleRad);
                const y = 50 + r * Math.sin(angleRad);

                const isSelected = selectedBlip?.id === blip.id;

                return (
                  <div
                    key={blip.id}
                    onClick={() => setSelectedBlip(blip)}
                    style={{ top: `${y}%`, left: `${x}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30 group cursor-pointer"
                  >
                    {/* Blip Outer Halo */}
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                        blip.status === "good"
                          ? "text-emerald-400 bg-emerald-500/20"
                          : blip.status === "warn"
                          ? "text-amber-400 bg-amber-500/20"
                          : "text-red-400 bg-red-500/20"
                      } ${isSelected ? "ring-2 ring-white scale-125" : "hover:scale-125"}`}
                    >
                      {/* Blip Inner Solid Core */}
                      <span
                        className={`w-2 h-2 rounded-full animate-blip ${
                          blip.status === "good"
                            ? "bg-emerald-400"
                            : blip.status === "warn"
                            ? "bg-amber-400"
                            : "bg-red-400"
                        }`}
                      />
                    </div>

                    {/* Small Hover Tooltip Label */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#121218] text-white text-[9px] font-mono px-1.5 py-0.5 rounded border border-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
                      {blip.label}: {blip.value}
                    </div>
                  </div>
                );
              })}

              {/* 4. Attached Forensic HUD Card (Inspired by reference "Malware Infection" card) */}
              {activeBlip && (
                <div
                  className="absolute top-4 left-4 z-40 bg-[#0d0d12]/95 border border-[#c8b082]/60 rounded-2xl p-4 shadow-2xl backdrop-blur-md max-w-[210px] space-y-2 animate-popup-reveal pointer-events-auto"
                >
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                    <span className="text-[10px] font-bold font-mono text-[#c8b082] uppercase truncate">
                      {activeBlip.label}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        activeBlip.status === "good"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : activeBlip.status === "warn"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {activeBlip.value}
                    </span>
                  </div>

                  <p className="text-[10px] text-zinc-300 leading-tight">
                    {activeBlip.detail}
                  </p>

                  {activeBlip.codeClue && (
                    <div className="bg-[#07070a] p-1.5 rounded text-[9px] font-mono text-[#d8a764] truncate border border-zinc-800">
                      <code>{activeBlip.codeClue}</code>
                    </div>
                  )}

                  <div className="pt-1">
                    <Link
                      href={activeBlip.actionHref || `/details?url=${encodeURIComponent(analysisData?.normalizedUrl || "")}`}
                      className="w-full py-1 text-center bg-[#c8b082] hover:bg-[#b89f71] text-zinc-950 text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 transition-colors shadow"
                    >
                      <span>Investigate</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* 5. Central Master Score Core (The Verdict Hub) */}
              <div className="relative z-20 w-32 h-32 rounded-full bg-gradient-to-br from-[#1c1a14] via-[#101016] to-[#07070a] border-2 border-[#c8b082]/80 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(200,176,130,0.18)]">
                <div className="text-[9px] font-bold text-[#c8b082] uppercase tracking-widest font-mono">
                  VERDICT
                </div>
                <div className="text-3xl font-black font-mono text-white tracking-tight leading-none my-0.5">
                  {loading ? "--" : displayedScore || analysisData?.overallHealthScore || 0}
                </div>
                <div className="text-[10px] font-mono text-zinc-400">/100</div>

                <div
                  className={`text-[9px] font-semibold uppercase mt-0.5 ${
                    (displayedScore || analysisData?.overallHealthScore || 0) >= 80
                      ? "text-emerald-400"
                      : (displayedScore || analysisData?.overallHealthScore || 0) >= 60
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {loading
                    ? "Scanning..."
                    : (displayedScore || analysisData?.overallHealthScore || 0) >= 80
                    ? "Optimal"
                    : (displayedScore || analysisData?.overallHealthScore || 0) >= 60
                    ? "Needs Work"
                    : "Critical"}
                </div>
              </div>
            </div>

            {/* Scanner Status Sequence Sub-Banner */}
            <div className="w-full bg-[#121218] border border-zinc-800 rounded-xl px-4 py-2 flex items-center justify-between text-xs font-mono text-zinc-400 z-20">
              <div className="flex items-center gap-2 truncate">
                <Sparkles className="w-3.5 h-3.5 text-[#c8b082] shrink-0" />
                <span className="truncate">{getStageMessage()}</span>
              </div>
              <span className="text-[11px] text-[#c8b082] font-bold shrink-0">
                {radarBlips.length} Evidence Points
              </span>
            </div>
          </div>

          {/* ═══════════ RIGHT PANEL: ACTION ITEMS & PROBLEMS ═══════════ */}
          <div className="lg:col-span-3 space-y-4 flex flex-col justify-between">
            {/* Action Items List Panel (Inspired by reference Action Items 20) */}
            <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4 flex-1 flex flex-col justify-between backdrop-blur-md">
              <div className="space-y-1 border-b border-zinc-800/80 pb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#c8b082]" />
                    Action Items ({faults.length})
                  </h3>
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {topProblems.length} High Priority
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Critical findings requiring immediate remediation.
                </p>
              </div>

              {/* Action Items Stack */}
              <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
                {loading ? (
                  <div className="py-16 text-center text-zinc-500 text-xs flex flex-col items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082]" />
                    <span>Isolating code vulnerabilities...</span>
                  </div>
                ) : faults.length === 0 ? (
                  <div className="py-12 text-center text-zinc-400 text-xs flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    <span>No critical performance issues identified!</span>
                  </div>
                ) : (
                  faults.slice(0, 5).map((fault) => (
                    <div
                      key={fault.id}
                      className="bg-[#121218] border border-zinc-800/80 rounded-xl p-3 space-y-2 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-white leading-tight">
                          {fault.title}
                        </span>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                            fault.impact === "Critical"
                              ? "bg-red-500/20 text-red-400 border border-red-500/40"
                              : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                          }`}
                        >
                          {fault.impact}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-snug line-clamp-2">
                        {fault.description}
                      </p>

                      {/* Action buttons (Inspired by View / Actions in reference) */}
                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-zinc-800/60">
                        <Link
                          href={`/investigation?url=${encodeURIComponent(analysisData?.normalizedUrl || "")}`}
                          className="px-2.5 py-1 text-[10px] font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg border border-zinc-800 transition-colors"
                        >
                          View Clue
                        </Link>
                        <Link
                          href={`/details?url=${encodeURIComponent(analysisData?.normalizedUrl || "")}`}
                          className="px-2.5 py-1 text-[10px] font-bold text-zinc-950 bg-[#c8b082] hover:bg-[#b89f71] rounded-lg transition-colors"
                        >
                          Remediation
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* View Full Log CTA */}
              <div className="pt-2 border-t border-zinc-800/80">
                <Link
                  href={`/investigation?url=${encodeURIComponent(analysisData?.normalizedUrl || "")}`}
                  className="w-full py-2 text-xs font-bold text-zinc-300 hover:text-white bg-[#14141c] hover:bg-zinc-800 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-zinc-800"
                >
                  <span>Open Full Investigation Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ────────────────── BOTTOM ASSET PAYLOAD HISTOGRAM ────────────────── */}
        {/* (Inspired by the bottom timeline bar histogram in the reference image) */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#c8b082]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Asset Allocation & Wire Transfer Distribution
              </h3>
            </div>
            <div className="text-xs font-mono text-zinc-400">
              Total Wire Transfer: <strong className="text-white">{pageSizeKb} KB</strong> ({requestsCount} Requests)
            </div>
          </div>

          {/* Proportional Segmented Stack Bar */}
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden flex shadow-inner">
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

          {/* Bottom Metric Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* JS */}
            <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                  <FileCode className="w-3.5 h-3.5" />
                  JavaScript
                </div>
                <div className="text-sm font-bold font-mono text-white">{jsKb} KB</div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                {jsCount} files
              </span>
            </div>

            {/* Images */}
            <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Images
                </div>
                <div className="text-sm font-bold font-mono text-white">{imageKb} KB</div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                {imageCount} files
              </span>
            </div>

            {/* CSS */}
            <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-400">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  CSS Styles
                </div>
                <div className="text-sm font-bold font-mono text-white">{cssKb} KB</div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                {cssCount} files
              </span>
            </div>

            {/* Fonts */}
            <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-400">
                  <Type className="w-3.5 h-3.5" />
                  Web Fonts
                </div>
                <div className="text-sm font-bold font-mono text-white">{fontKb} KB</div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                {fontCount} files
              </span>
            </div>

            {/* HTML */}
            <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-400">
                  <Globe className="w-3.5 h-3.5" />
                  HTML Doc
                </div>
                <div className="text-sm font-bold font-mono text-white">{htmlKb} KB</div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                1 doc
              </span>
            </div>

            {/* DOM Complexity */}
            <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-300">
                  <Layers className="w-3.5 h-3.5 text-[#c8b082]" />
                  DOM Depth
                </div>
                <div className="text-sm font-bold font-mono text-white">{domNodesCount}</div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded">
                Nodes
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Share Report Forensic Dossier Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        targetUrl={analysisData?.normalizedUrl || targetUrlParam || "https://example.com"}
        caseId={analysisData?.caseId || "#CASE-AUDIT"}
        score={analysisData?.overallHealthScore ?? 0}
        metrics={{
          lcpSec: analysisData?.metrics?.lcpSec,
          ttfbMs: analysisData?.metrics?.ttfbMs,
          pageSizeKb: analysisData?.metrics?.pageSizeKb,
        }}
      />
    </div>
  );
}

export default function OverviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070709] text-zinc-400 p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082]" />
            <span>Loading Forensic Radar Overview...</span>
          </div>
        </div>
      }
    >
      <OverviewContent />
    </Suspense>
  );
}
