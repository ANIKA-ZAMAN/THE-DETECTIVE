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
  Calendar,
  Layers,
  Database,
  Server,
  User,
  Box,
  Cpu,
  Flame,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  Plus,
  Minus,
  Maximize2,
  CheckCircle,
  XCircle,
  Check,
  Filter,
  ExternalLink,
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

  // Graph state
  const [activeTab, setActiveTab] = useState<"GRAPH" | "TIMELINE">("GRAPH");
  const [selectedNode, setSelectedNode] = useState<string>("Database");
  const [graphZoom, setGraphZoom] = useState<number>(1);
  const [selectedMetricView, setSelectedMetricView] = useState<string>("Response Time (ms)");
  const [timelineSlider, setTimelineSlider] = useState<number>(60);

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
    router.push(`/investigation?url=${encodeURIComponent(inputUrl.trim())}`);
  };

  // Safe Metric Extractions
  const metrics = analysisData?.metrics;
  const lcpSec = metrics?.lcpSec ?? 2.43;
  const fcpSec = metrics?.fcpSec ?? 1.12;
  const ttfbMs = metrics?.ttfbMs ?? 412;
  const inpMs = metrics?.inpMs ?? 143;
  const cls = metrics?.cls ?? 0.04;
  const pageSizeKb = metrics?.pageSizeKb ?? 840;
  const requestsCount = metrics?.requestsCount ?? 38;

  const faults = analysisData?.faults ?? [];
  const opportunities = analysisData?.opportunities ?? [];
  const waterfall = analysisData?.waterfall ?? [];

  // Identify root cause from highest impact fault
  const criticalFault = faults.find((f) => f.impact === "Critical") || faults[0];
  const rootCauseTitle = criticalFault ? criticalFault.title : "Render-Blocking Script & Origin Latency";
  const rootCauseDesc = criticalFault ? criticalFault.description : "High origin latency and render-blocking resources delayed critical path execution.";
  const rootCauseCode = criticalFault?.clueCode || `<script src="/app/bundle.min.js" defer="false">`;

  // Calculate dynamic node timings based on real metrics
  const userTiming = 120;
  const frontendTiming = Math.max(80, Math.round(fcpSec * 100));
  const apiGatewayTiming = Math.max(150, ttfbMs);
  const authTiming = 98;
  const orderTiming = Math.max(300, Math.round(ttfbMs * 1.4));
  const dbTiming = `${lcpSec}s`;
  const cacheTiming = 56;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-8 shadow-2xl animate-pulse h-64 flex items-center justify-center text-zinc-500 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082] mr-3" />
            Loading Interactive Investigation Graph...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
      {/* ────────────────── NAVBAR ────────────────── */}
      <Navbar />

      {/* ────────────────── MAIN INVESTIGATION WORKSPACE ────────────────── */}
      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 py-4 flex-1 space-y-4">
        {/* Top Header Bar: Case Dossier & Controls */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-[#0d0d12]/90 border border-zinc-800/80 rounded-2xl px-5 py-3 shadow-xl backdrop-blur-md">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-1 rounded bg-[#dfd7c2] text-zinc-950 text-xs font-mono font-black tracking-wider uppercase border border-[#c7beaa]">
              {analysisData?.caseId || "#CASE-6773"}
            </span>
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-[#c8b082]" />
              <span className="text-sm font-mono font-bold text-white truncate max-w-xs sm:max-w-md">
                {analysisData?.normalizedUrl || targetUrlParam || "https://example.com"}
              </span>
            </div>
            <span className="text-xs text-zinc-400 font-mono hidden md:inline">
              Audited: {analysisData?.investigatedAt || "Aug 27, 2026"}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-end flex-wrap">
            {/* Quick URL Bar */}
            <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-[#14141c] border border-zinc-800 rounded-xl px-3 py-1.5 w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Audit URL..."
                className="bg-transparent text-xs text-zinc-200 placeholder-zinc-500 outline-none w-full font-mono"
              />
              <button
                type="submit"
                disabled={loading}
                className="text-[11px] font-bold text-[#c8b082] hover:text-[#dfd7c2]"
              >
                Go
              </button>
            </form>

            <div className="flex items-center gap-1.5 bg-[#14141c] border border-zinc-800 px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-300">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span>Aug 27, 2026 02:00 PM - 03:00 PM</span>
            </div>

            <button
              onClick={() => runInvestigation(inputUrl || targetUrlParam || "https://example.com")}
              disabled={loading}
              className="p-2 bg-[#14141c] hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh Investigation"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#c8b082]" : ""}`} />
            </button>

            <button
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
              className="px-3 py-1.5 bg-[#14141c] hover:bg-zinc-800 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-[#c8b082]" />
              <span>Share Report</span>
            </button>
          </div>
        </div>

        {/* API Error Alert if any */}
        {apiError && (
          <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-4 flex items-start gap-3 text-red-200 text-sm shadow-2xl backdrop-blur-md">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-bold text-red-300">Investigation Notice</div>
              <p className="text-xs text-red-200/90">{apiError}</p>
            </div>
          </div>
        )}

        {/* ────────────────── 3-COLUMN INVESTIGATION DASHBOARD ────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* ══════════════════════════════════════════════════
              LEFT COLUMN: INVESTIGATION SUMMARY & TIMELINE
             ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-3 space-y-4">
            {/* 1. Summary Card */}
            <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-5 backdrop-blur-md">
              <div className="space-y-1 border-b border-zinc-800/80 pb-3">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
                  INVESTIGATION SUMMARY
                </span>
                <div className="flex items-start gap-2.5 pt-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1 animate-pulse shadow-[0_0_8px_#ef4444]" />
                  <div>
                    <h2 className="text-sm font-bold text-red-400 leading-tight">
                      Critical Issue Detected
                    </h2>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Started at 02:34:15 PM • Affected 12.4K sessions
                    </p>
                  </div>
                </div>
              </div>

              {/* Root Cause Card */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                  ROOT CAUSE
                </span>
                <div className="bg-gradient-to-r from-[#17110e] to-[#121218] border border-amber-500/40 rounded-xl p-3.5 space-y-2 relative overflow-hidden shadow-lg">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-white leading-tight">
                        {rootCauseTitle}
                      </h3>
                      <div className="text-[10px] font-mono text-zinc-400 mt-1">
                        Confidence <strong className="text-amber-400">94%</strong>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-[#221611] border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Database className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#c8b082] to-amber-500 w-[94%] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  </div>
                </div>
              </div>

              {/* Impact Metrics Table */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                  IMPACT
                </span>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121218] border border-zinc-800/60">
                    <span className="text-zinc-400 font-sans text-[11px]">LCP Degradation</span>
                    <span className="font-bold text-red-400">+{lcpSec}s</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121218] border border-zinc-800/60">
                    <span className="text-zinc-400 font-sans text-[11px]">Affected Users</span>
                    <span className="font-bold text-white">12.4K</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121218] border border-zinc-800/60">
                    <span className="text-zinc-400 font-sans text-[11px]">Revenue Impact</span>
                    <span className="font-bold text-red-400">-$8,430</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#121218] border border-zinc-800/60">
                    <span className="text-zinc-400 font-sans text-[11px]">Error Rate</span>
                    <span className="font-bold text-amber-400">8.7%</span>
                  </div>
                </div>
              </div>

              {/* Timeline Sequence List */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">
                  TIMELINE
                </span>
                <div className="space-y-2.5 font-mono text-[11px]">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    <span className="text-zinc-500 text-[10px]">02:34 PM</span>
                    <span className="text-red-300">Anomaly Detected</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-zinc-500 text-[10px]">02:34 PM</span>
                    <span className="text-amber-300">Traffic Spike</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    <span className="text-zinc-500 text-[10px]">02:35 PM</span>
                    <span className="text-red-300">DB Slowdown</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    <span className="text-zinc-500 text-[10px]">02:36 PM</span>
                    <span className="text-red-300">Error Rate Increased</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-zinc-500 text-[10px]">02:37 PM</span>
                    <span className="text-emerald-300">Root Cause Identified</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full mt-3 py-2 text-xs font-bold text-zinc-300 hover:text-white bg-[#14141c] hover:bg-zinc-800 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-zinc-800"
                >
                  <span>View Full Timeline</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              CENTER COLUMN: TOPOLOGY GRAPH & TRACE BARS & CHART
             ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 space-y-4">
            {/* 1. Interactive Topology Canvas */}
            <div className="bg-[#0b0b10] border border-zinc-800/90 rounded-2xl p-5 shadow-2xl relative space-y-4 min-h-[460px] flex flex-col justify-between overflow-hidden">
              {/* Header & Tabs */}
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 z-10">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 font-mono">
                    <Cpu className="w-4 h-4 text-[#c8b082]" />
                    INVESTIGATION GRAPH
                  </h3>
                  <p className="text-[11px] text-zinc-400">AI-powered root cause analysis</p>
                </div>

                <div className="flex items-center gap-1 bg-[#14141a] p-1 rounded-xl border border-zinc-800 text-xs font-mono">
                  <button
                    onClick={() => setActiveTab("GRAPH")}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      activeTab === "GRAPH" ? "bg-[#c8b082] text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Graph
                  </button>
                  <button
                    onClick={() => setActiveTab("TIMELINE")}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      activeTab === "TIMELINE" ? "bg-[#c8b082] text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    Timeline
                  </button>
                </div>
              </div>

              {/* Topology SVG Canvas */}
              <div className="relative w-full h-[320px] my-auto select-none overflow-hidden">
                {/* SVG Connections with animated flow pulses */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 300" fill="none">
                  <defs>
                    <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="grad-amber" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="grad-red" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>

                  {/* Flow Lines */}
                  {/* User -> Frontend */}
                  <path d="M 60 140 L 160 140" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                  {/* Frontend -> API Gateway */}
                  <path d="M 190 140 L 290 140" stroke="#22c55e" strokeWidth="2" strokeDasharray="4 4" className="animate-pulse" />
                  {/* API Gateway -> Deployment */}
                  <path d="M 310 120 Q 300 70 270 70" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                  {/* API Gateway -> Auth Service */}
                  <path d="M 320 130 Q 390 80 430 80" stroke="#22c55e" strokeWidth="2" />
                  {/* API Gateway -> Order Service */}
                  <path d="M 320 140 L 430 140" stroke="#f59e0b" strokeWidth="2" />
                  {/* API Gateway -> Database (Critical Path) */}
                  <path d="M 320 155 Q 380 200 430 220" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="4 2" />
                  {/* Database -> Cache */}
                  <path d="M 460 225 L 520 225" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" />
                </svg>

                {/* Node 1: User */}
                <div
                  onClick={() => setSelectedNode("User")}
                  style={{ top: "115px", left: "30px" }}
                  className="absolute flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#122218] border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-300 font-bold">User</span>
                  <span className="text-[9px] font-mono text-emerald-400">{userTiming}ms</span>
                </div>

                {/* Node 2: Frontend */}
                <div
                  onClick={() => setSelectedNode("Frontend")}
                  style={{ top: "115px", left: "160px" }}
                  className="absolute flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#122218] border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.3)] group-hover:scale-110 transition-transform">
                    <Box className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-300 font-bold">Frontend</span>
                  <span className="text-[9px] font-mono text-emerald-400">{frontendTiming}ms</span>
                </div>

                {/* Node 3: Deployment (Auxiliary) */}
                <div
                  onClick={() => setSelectedNode("Deployment")}
                  style={{ top: "35px", left: "245px" }}
                  className="absolute flex flex-col items-center gap-0.5 cursor-pointer opacity-80 hover:opacity-100 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-[#101b2b] border border-sky-400 flex items-center justify-center text-sky-400 shadow">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-400">Deployment</span>
                  <span className="text-[8px] font-mono text-sky-300">v2.4.1</span>
                </div>

                {/* Node 4: API Gateway */}
                <div
                  onClick={() => setSelectedNode("API Gateway")}
                  style={{ top: "115px", left: "285px" }}
                  className="absolute flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#241c10] border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)] group-hover:scale-110 transition-transform">
                    <Server className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-300 font-bold">API Gateway</span>
                  <span className="text-[9px] font-mono text-amber-400">{apiGatewayTiming}ms</span>
                </div>

                {/* Node 5: Auth Service */}
                <div
                  onClick={() => setSelectedNode("Auth Service")}
                  style={{ top: "55px", left: "420px" }}
                  className="absolute flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#122218] border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-300 font-bold">Auth Service</span>
                  <span className="text-[9px] font-mono text-emerald-400">{authTiming}ms</span>
                </div>

                {/* Node 6: Order Service */}
                <div
                  onClick={() => setSelectedNode("Order Service")}
                  style={{ top: "115px", left: "420px" }}
                  className="absolute flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#241c10] border-2 border-amber-500 flex items-center justify-center text-amber-400 shadow group-hover:scale-110 transition-transform">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono text-zinc-300 font-bold">Order Service</span>
                  <span className="text-[9px] font-mono text-amber-400">{orderTiming}ms</span>
                </div>

                {/* Node 7: Database (Root Cause Focus) */}
                <div
                  onClick={() => setSelectedNode("Database")}
                  style={{ top: "190px", left: "410px" }}
                  className="absolute flex flex-col items-center gap-1 cursor-pointer group z-20"
                >
                  {/* Glowing halo ripple */}
                  <div className="relative">
                    <div className="absolute -inset-2 rounded-full bg-red-500/20 animate-ping pointer-events-none" />
                    <div className="w-12 h-12 rounded-full bg-[#2b1010] border-2 border-red-500 flex items-center justify-center text-red-400 shadow-[0_0_20px_rgba(239,68,68,0.5)] group-hover:scale-110 transition-transform">
                      <Database className="w-6 h-6" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[9px] font-bold flex items-center justify-center border border-zinc-900">
                      !
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-white font-black">Database</span>
                  <span className="text-[10px] font-mono text-red-400 font-bold">+{dbTiming}</span>
                </div>

                {/* Node 8: Cache */}
                <div
                  onClick={() => setSelectedNode("Cache")}
                  style={{ top: "205px", left: "515px" }}
                  className="absolute flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#122218] border border-emerald-500 flex items-center justify-center text-emerald-400 shadow group-hover:scale-110 transition-transform">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-[9px] font-mono text-zinc-300 font-bold">Cache</span>
                  <span className="text-[8px] font-mono text-emerald-400">{cacheTiming}ms</span>
                </div>

                {/* Zoom & Canvas Controls */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 z-30">
                  <button
                    onClick={() => setGraphZoom((z) => Math.min(1.5, z + 0.1))}
                    className="w-6 h-6 rounded-lg bg-[#14141c] border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-xs"
                  >
                    +
                  </button>
                  <button
                    onClick={() => setGraphZoom((z) => Math.max(0.7, z - 0.1))}
                    className="w-6 h-6 rounded-lg bg-[#14141c] border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-xs"
                  >
                    -
                  </button>
                  <button
                    onClick={() => setGraphZoom(1)}
                    className="w-6 h-6 rounded-lg bg-[#14141c] border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center text-xs"
                  >
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Legend Bar */}
              <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3 text-[11px] font-mono text-zinc-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Normal
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> Warning
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-red-400" /> Critical
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[10px]">
                  <span>AI Confidence</span>
                  <span className="text-amber-400 tracking-widest">●●●●●○</span>
                </div>
              </div>
            </div>

            {/* 2. Bottom Two Cards: PERFORMANCE TRACE & KEY METRICS OVER TIME */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Box: Performance Trace Waterfall */}
              <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-white font-mono">
                    PERFORMANCE TRACE
                  </h4>
                  <Link
                    href={`/details?url=${encodeURIComponent(analysisData?.normalizedUrl || "")}`}
                    className="text-[10px] font-bold text-[#c8b082] hover:text-white flex items-center gap-1"
                  >
                    View Full Trace →
                  </Link>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  {/* User Request */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[11px] w-28 truncate">User Request</span>
                    <div className="flex-1 mx-3 h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 w-[15%]" />
                    </div>
                    <span className="text-zinc-300 text-[11px]">{userTiming}ms</span>
                  </div>

                  {/* Frontend */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[11px] w-28 truncate">Frontend</span>
                    <div className="flex-1 mx-3 h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 w-[20%] ml-[15%]" />
                    </div>
                    <span className="text-zinc-300 text-[11px]">{frontendTiming}ms</span>
                  </div>

                  {/* API Gateway */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[11px] w-28 truncate">API Gateway</span>
                    <div className="flex-1 mx-3 h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 w-[30%] ml-[35%]" />
                    </div>
                    <span className="text-zinc-300 text-[11px]">{apiGatewayTiming}ms</span>
                  </div>

                  {/* Order Service */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[11px] w-28 truncate">Order Service</span>
                    <div className="flex-1 mx-3 h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 w-[40%] ml-[45%]" />
                    </div>
                    <span className="text-zinc-300 text-[11px]">{orderTiming}ms</span>
                  </div>

                  {/* Database Query (Critical) */}
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 font-bold text-[11px] w-28 truncate">Database Query</span>
                    <div className="flex-1 mx-3 h-2.5 bg-zinc-900 rounded-full overflow-hidden shadow">
                      <div className="h-full bg-red-500 w-[80%] ml-[20%] shadow-[0_0_8px_#ef4444]" />
                    </div>
                    <span className="text-red-400 font-bold text-[11px]">{dbTiming}</span>
                  </div>

                  {/* Cache Lookup */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[11px] w-28 truncate">Cache Lookup</span>
                    <div className="flex-1 mx-3 h-2 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 w-[8%] ml-[90%]" />
                    </div>
                    <span className="text-zinc-300 text-[11px]">{cacheTiming}ms</span>
                  </div>
                </div>
              </div>

              {/* Right Box: Key Metrics Over Time Chart */}
              <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-white font-mono">
                    KEY METRICS OVER TIME
                  </h4>
                  <select
                    value={selectedMetricView}
                    onChange={(e) => setSelectedMetricView(e.target.value)}
                    className="bg-[#14141c] text-zinc-300 text-[10px] font-mono rounded px-2 py-0.5 border border-zinc-800 outline-none cursor-pointer"
                  >
                    <option>Response Time (ms)</option>
                    <option>Error Rate (%)</option>
                    <option>Throughput (req/s)</option>
                  </select>
                </div>

                {/* Response Time Curve SVG */}
                <div className="relative h-24 w-full">
                  <svg className="w-full h-full" viewBox="0 0 300 80" fill="none">
                    <defs>
                      <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="300" y2="20" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="0" y1="50" x2="300" y2="50" stroke="#27272a" strokeWidth="0.5" strokeDasharray="2 2" />

                    {/* Incident Marker Line */}
                    <line x1="140" y1="0" x2="140" y2="80" stroke="#71717a" strokeWidth="0.8" strokeDasharray="2 2" />
                    <text x="142" y="10" fill="#a1a1aa" fontSize="7" fontFamily="monospace">Incident Start</text>

                    {/* Curve Fill */}
                    <path
                      d="M 0 70 Q 60 68 110 65 Q 135 60 145 30 Q 155 10 165 20 Q 185 45 220 62 L 300 66 L 300 80 L 0 80 Z"
                      fill="url(#chart-grad)"
                    />

                    {/* Curve Stroke */}
                    <path
                      d="M 0 70 Q 60 68 110 65 Q 135 60 145 30 Q 155 10 165 20 Q 185 45 220 62 L 300 66"
                      stroke="#ef4444"
                      strokeWidth="1.5"
                    />

                    {/* Peak Dot */}
                    <circle cx="155" cy="10" r="3" fill="#ef4444" className="animate-ping" />
                    <circle cx="155" cy="10" r="2" fill="#ffffff" />
                  </svg>
                </div>

                {/* Time Axis Ticks */}
                <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500">
                  <span>02:20 PM</span>
                  <span>02:30 PM</span>
                  <span className="text-red-400">02:40 PM</span>
                  <span>02:50 PM</span>
                  <span>03:00 PM</span>
                </div>

                {/* Range Slider */}
                <div className="pt-1">
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={timelineSlider}
                    onChange={(e) => setTimelineSlider(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#c8b082]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════
              RIGHT COLUMN: AI INSIGHTS & EVIDENCE
             ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-3 space-y-4">
            {/* 1. AI Investigation Insights Card */}
            <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#c8b082]" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                    AI INVESTIGATION INSIGHTS
                  </h3>
                </div>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Beta
                </span>
              </div>

              {/* Confidence Dial Banner */}
              <div className="bg-[#14120e] border border-amber-500/40 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-zinc-400">Root cause identified with</div>
                  <div className="text-sm font-black font-mono text-white">
                    <span className="text-amber-400">94%</span> Confidence
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full border-2 border-amber-500/50 flex items-center justify-center relative">
                  <div className="w-5 h-5 rounded-full border border-amber-400 animate-spin" />
                  <ChevronRight className="w-3 h-3 text-amber-400 absolute" />
                </div>
              </div>

              {/* Forensic Explanation Paragraph */}
              <p className="text-xs text-zinc-300 leading-relaxed">
                {rootCauseDesc}
              </p>

              {/* WHY THIS HAPPENED */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                  WHY THIS HAPPENED?
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-[11px]">Traffic increased by 340%</span>
                    <CheckCircle className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-[11px]">Connection pool limit reached</span>
                    <CheckCircle className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-[11px]">Long running queries detected</span>
                    <CheckCircle className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="text-[11px]">No connection reuse</span>
                    <Minus className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                </div>
              </div>

              {/* RECOMMENDED ACTIONS */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/80">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                  RECOMMENDED ACTIONS
                </span>
                <div className="space-y-1.5">
                  {(criticalFault?.recommendation
                    ? [
                        criticalFault.recommendation,
                        "Enable connection pooling & reuse",
                        "Optimize blocking assets and queries",
                        "Add CDN edge caching rules",
                      ]
                    : [
                        "Increase connection pool size",
                        "Optimize slow queries & scripts",
                        "Enable connection pooling",
                        "Add database read replicas",
                      ]
                  ).map((action, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#121218] border border-zinc-800/70 hover:border-[#c8b082]/40 transition-colors text-xs text-zinc-200 cursor-pointer group"
                    >
                      <span className="truncate pr-2 text-[11px]">○ {action}</span>
                      <ArrowRight className="w-3 h-3 text-zinc-500 group-hover:text-[#c8b082] transition-colors shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Evidence Stack Card */}
            <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-3 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c8b082]" />
                  EVIDENCE
                </h4>
                <Link
                  href={`/details?url=${encodeURIComponent(analysisData?.normalizedUrl || "")}`}
                  className="text-[10px] font-bold text-[#c8b082] hover:text-white"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-2.5">
                {/* Evidence Item 1 */}
                <div className="bg-[#121218] border border-zinc-800/80 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-red-400 flex items-center gap-1">
                      <Database className="w-3 h-3" /> Slow Query Detected
                    </span>
                    <span className="text-zinc-500">02:35:12 PM</span>
                  </div>
                  <div className="bg-[#07070a] p-1.5 rounded font-mono text-[9px] text-[#d8a764] truncate border border-zinc-850">
                    <code>{rootCauseCode}</code>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-0.5">
                    <span>Duration: <strong className="text-white">2.43s</strong></span>
                    <button className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[9px]">
                      View
                    </button>
                  </div>
                </div>

                {/* Evidence Item 2 */}
                <div className="bg-[#121218] border border-zinc-800/80 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <FileCode className="w-3 h-3" /> Error Logs
                    </span>
                    <span className="text-zinc-500">02:35:15 PM</span>
                  </div>
                  <div className="text-[11px] text-zinc-300">
                    Connection timeout errors (Count: 324)
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-0.5">
                    <span>Count: <strong className="text-white">324</strong></span>
                    <button className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[9px]">
                      View
                    </button>
                  </div>
                </div>

                {/* Evidence Item 3 */}
                <div className="bg-[#121218] border border-zinc-800/80 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-blue-400 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> Metric Anomaly
                    </span>
                    <span className="text-zinc-500">02:34:15 PM</span>
                  </div>
                  <div className="text-[11px] text-zinc-300">
                    Database response time spiked +243%
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-0.5">
                    <span>Spike: <strong className="text-white">+243%</strong></span>
                    <button className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[9px]">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
