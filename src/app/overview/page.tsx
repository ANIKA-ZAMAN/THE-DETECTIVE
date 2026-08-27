"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  ArrowLeft,
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
  FileText,
  Clock,
  Layers,
  HardDrive,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import type { AnalysisResult, FaultItem } from "@/types";
import { Navbar } from "@/components/layout/Navbar";

function OverviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const targetUrlParam = searchParams.get("url") || "https://example.com";

  const [inputUrl, setInputUrl] = useState(targetUrlParam);
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchAnalysis = async (urlToFetch: string) => {
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
    if (targetUrlParam) {
      setInputUrl(targetUrlParam);
      fetchAnalysis(targetUrlParam);
    }
  }, [targetUrlParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    router.push(`/overview?url=${encodeURIComponent(inputUrl.trim())}`);
  };

  // Metric status helpers
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    if (score >= 60) return "text-[#d8a764] border-[#d8a764]/40 bg-[#d8a764]/10";
    return "text-red-400 border-red-500/40 bg-red-500/10";
  };

  const getMetricBadge = (val: number, goodLimit: number, warnLimit: number, unit = "s") => {
    if (val <= goodLimit) {
      return {
        label: "Good",
        color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/40",
        dot: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
      };
    }
    if (val <= warnLimit) {
      return {
        label: "Needs Improvement",
        color: "text-amber-400 bg-amber-500/15 border-amber-500/40",
        dot: "bg-amber-400 shadow-[0_0_8px_#fbbf24]",
      };
    }
    return {
      label: "Poor",
      color: "text-red-400 bg-red-500/15 border-red-500/40",
      dot: "bg-red-400 shadow-[0_0_8px_#f87171]",
    };
  };

  const lcpBadge = analysisData ? getMetricBadge(analysisData.metrics.lcpSec, 2.5, 4.0) : null;
  const fcpBadge = analysisData ? getMetricBadge(analysisData.metrics.fcpSec, 1.8, 3.0) : null;
  const ttfbBadge = analysisData ? getMetricBadge(analysisData.metrics.ttfbMs, 600, 1200, "ms") : null;
  const inpBadge = analysisData ? getMetricBadge(analysisData.metrics.inpMs, 200, 500, "ms") : null;
  const clsBadge = analysisData ? getMetricBadge(analysisData.metrics.cls, 0.1, 0.25, "") : null;

  // Filter top performance problems
  const topProblems = analysisData
    ? analysisData.faults.filter((f) => f.category === "Performance" || f.impact === "Critical")
    : [];

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col">
      {/* ────────────────── TOP NAVBAR ────────────────── */}
      <Navbar />

      {/* ────────────────── MAIN OVERVIEW DOSSIER ────────────────── */}
      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
        {/* Error Alert if any */}
        {apiError && (
          <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-5 flex items-start gap-4 text-red-200 text-sm shadow-2xl backdrop-blur-md">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-red-300 text-base">Investigation Notice</div>
              <p className="text-xs text-red-200/90 leading-relaxed">{apiError}</p>
            </div>
          </div>
        )}

        {/* 1. CASE FILE MASTER DOSSIER HEADER */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Ambient Background Gold Glare */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[radial-gradient(circle,_rgba(200,176,130,0.06)_0%,_transparent_70%)] pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-md bg-[#dfd7c2] text-zinc-950 text-xs font-mono font-black tracking-widest uppercase border border-[#c7beaa] shadow-sm">
                {analysisData?.caseId || "#CASE-0001"}
              </span>
              <span className="text-xs text-zinc-400 font-mono flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#c8b082]" />
                Audited on {analysisData?.investigatedAt || "Live Probe"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-mono border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Inspection Complete
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white flex items-center gap-3 tracking-tight break-all">
              <Globe className="w-6 h-6 text-[#c8b082] shrink-0" />
              {analysisData?.normalizedUrl || targetUrlParam}
            </h1>

            <p className="text-xs text-zinc-400 flex items-center gap-4 flex-wrap">
              <span>Payload: <strong className="text-zinc-200">{analysisData?.metrics.pageSizeKb || 0} KB</strong></span>
              <span>•</span>
              <span>Requests: <strong className="text-zinc-200">{analysisData?.metrics.requestsCount || 0} Total</strong></span>
              <span>•</span>
              <span>DOM Complexity: <strong className="text-zinc-200">{analysisData?.metrics.domNodesCount || 0} Elements</strong></span>
            </p>
          </div>

          {/* Master Performance Gauge / Dial */}
          <div className="flex items-center gap-6 bg-[#13131a] border border-zinc-800/90 rounded-2xl p-6 shrink-0 relative shadow-2xl">
            <div className="text-right">
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                OVERALL HEALTH SCORE
              </div>
              <div className="flex items-baseline justify-end gap-1.5 my-1">
                <span className="text-4xl lg:text-5xl font-black text-[#d8a764] tracking-tight">
                  {loading ? "--" : analysisData?.overallHealthScore}
                </span>
                <span className="text-sm font-semibold text-zinc-500">/100</span>
              </div>
              <div className="text-xs font-semibold text-[#e88d43]">
                {loading
                  ? "Analyzing..."
                  : (analysisData?.overallHealthScore || 0) >= 85
                  ? "Optimal Condition"
                  : (analysisData?.overallHealthScore || 0) >= 65
                  ? "Needs Improvement"
                  : "Critical Remediation Required"}
              </div>
            </div>

            {/* Circular Brass Shield Badge */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c8b082] via-[#8c6f48] to-[#2a1d12] p-0.5 flex items-center justify-center shadow-lg border border-[#c8b082]/60">
              <div className="w-full h-full rounded-2xl bg-[#0e0e14] flex items-center justify-center">
                <Zap className="w-7 h-7 text-[#d8a764]" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. CORE WEB VITALS SPOTLIGHT CARDS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#c8b082]" />
              Core Web Vitals & Real-Time Performance Telemetry
            </h2>
            <span className="text-xs font-mono text-zinc-500">Google Recommended Thresholds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Metric 1: LCP */}
            <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-3 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">LCP</span>
                {lcpBadge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${lcpBadge.color}`}>
                    {lcpBadge.label}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">
                  {loading ? "--" : `${analysisData?.metrics.lcpSec}s`}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 leading-tight">
                Largest Contentful Paint (Target: &lt; 2.5s)
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(100, ((analysisData?.metrics.lcpSec || 1) / 5) * 100)}%`,
                  }}
                  className={`h-full rounded-full ${
                    (analysisData?.metrics.lcpSec || 0) <= 2.5
                      ? "bg-emerald-400"
                      : (analysisData?.metrics.lcpSec || 0) <= 4.0
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                />
              </div>
            </div>

            {/* Metric 2: FCP */}
            <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-3 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">FCP</span>
                {fcpBadge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${fcpBadge.color}`}>
                    {fcpBadge.label}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">
                  {loading ? "--" : `${analysisData?.metrics.fcpSec}s`}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 leading-tight">
                First Contentful Paint (Target: &lt; 1.8s)
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(100, ((analysisData?.metrics.fcpSec || 1) / 4) * 100)}%`,
                  }}
                  className={`h-full rounded-full ${
                    (analysisData?.metrics.fcpSec || 0) <= 1.8
                      ? "bg-emerald-400"
                      : (analysisData?.metrics.fcpSec || 0) <= 3.0
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                />
              </div>
            </div>

            {/* Metric 3: TTFB */}
            <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-3 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">TTFB</span>
                {ttfbBadge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ttfbBadge.color}`}>
                    {ttfbBadge.label}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">
                  {loading ? "--" : `${analysisData?.metrics.ttfbMs}ms`}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 leading-tight">
                Time to First Byte (Target: &lt; 600ms)
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(100, ((analysisData?.metrics.ttfbMs || 100) / 1500) * 100)}%`,
                  }}
                  className={`h-full rounded-full ${
                    (analysisData?.metrics.ttfbMs || 0) <= 600
                      ? "bg-emerald-400"
                      : (analysisData?.metrics.ttfbMs || 0) <= 1200
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                />
              </div>
            </div>

            {/* Metric 4: INP */}
            <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-3 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">INP</span>
                {inpBadge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${inpBadge.color}`}>
                    {inpBadge.label}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">
                  {loading ? "--" : `${analysisData?.metrics.inpMs}ms`}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 leading-tight">
                Interaction to Next Paint (Target: &lt; 200ms)
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(100, ((analysisData?.metrics.inpMs || 50) / 600) * 100)}%`,
                  }}
                  className={`h-full rounded-full ${
                    (analysisData?.metrics.inpMs || 0) <= 200
                      ? "bg-emerald-400"
                      : (analysisData?.metrics.inpMs || 0) <= 500
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                />
              </div>
            </div>

            {/* Metric 5: CLS */}
            <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-3 hover:border-zinc-700 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">CLS</span>
                {clsBadge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${clsBadge.color}`}>
                    {clsBadge.label}
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white font-mono">
                  {loading ? "--" : `${analysisData?.metrics.cls}`}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 leading-tight">
                Cumulative Layout Shift (Target: &lt; 0.1)
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  style={{
                    width: `${Math.min(100, ((analysisData?.metrics.cls || 0.01) / 0.3) * 100)}%`,
                  }}
                  className={`h-full rounded-full ${
                    (analysisData?.metrics.cls || 0) <= 0.1
                      ? "bg-emerald-400"
                      : (analysisData?.metrics.cls || 0) <= 0.25
                      ? "bg-amber-400"
                      : "bg-red-400"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. FOUR CATEGORY SCORES + RESOURCE BREAKDOWN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: 4 Category Pillars */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#c8b082]" />
              Diagnostic Pillars & Weight Distribution
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Performance */}
              <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" />
                    Performance
                  </span>
                  <span className="text-zinc-500 font-mono">40%</span>
                </div>
                <div className="text-2xl font-black text-white">
                  {loading ? "--" : analysisData?.categoryScores.performance}
                  <span className="text-xs text-zinc-500 font-normal">/100</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${analysisData?.categoryScores.performance || 0}%` }}
                    className="h-full bg-amber-500 rounded-full"
                  />
                </div>
              </div>

              {/* SEO */}
              <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-blue-500" />
                    SEO Readiness
                  </span>
                  <span className="text-zinc-500 font-mono">25%</span>
                </div>
                <div className="text-2xl font-black text-white">
                  {loading ? "--" : analysisData?.categoryScores.seo}
                  <span className="text-xs text-zinc-500 font-normal">/100</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${analysisData?.categoryScores.seo || 0}%` }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>

              {/* Security */}
              <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-500" />
                    Security Headers
                  </span>
                  <span className="text-zinc-500 font-mono">20%</span>
                </div>
                <div className="text-2xl font-black text-white">
                  {loading ? "--" : analysisData?.categoryScores.security}
                  <span className="text-xs text-zinc-500 font-normal">/100</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${analysisData?.categoryScores.security || 0}%` }}
                    className="h-full bg-emerald-500 rounded-full"
                  />
                </div>
              </div>

              {/* Accessibility */}
              <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-purple-500" />
                    Accessibility
                  </span>
                  <span className="text-zinc-500 font-mono">15%</span>
                </div>
                <div className="text-2xl font-black text-white">
                  {loading ? "--" : analysisData?.categoryScores.accessibility}
                  <span className="text-xs text-zinc-500 font-normal">/100</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${analysisData?.categoryScores.accessibility || 0}%` }}
                    className="h-full bg-purple-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Network & Payload Composition */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#c8b082]" />
              Payload Distribution & Resource Breakdown
            </h3>

            <div className="bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-5 shadow-xl space-y-4">
              {/* Segmented Visual Stack Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-medium">Total Wire Transfer</span>
                  <span className="font-mono font-bold text-white">{analysisData?.metrics.pageSizeKb || 0} KB</span>
                </div>
                <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${Math.min(100, ((analysisData?.resourceBreakdown.jsKb || 1) / (analysisData?.metrics.pageSizeKb || 1)) * 100)}%` }}
                    className="bg-amber-400 h-full"
                    title="JavaScript"
                  />
                  <div
                    style={{ width: `${Math.min(100, ((analysisData?.resourceBreakdown.imageKb || 1) / (analysisData?.metrics.pageSizeKb || 1)) * 100)}%` }}
                    className="bg-emerald-400 h-full"
                    title="Images"
                  />
                  <div
                    style={{ width: `${Math.min(100, ((analysisData?.resourceBreakdown.cssKb || 1) / (analysisData?.metrics.pageSizeKb || 1)) * 100)}%` }}
                    className="bg-blue-400 h-full"
                    title="CSS"
                  />
                  <div
                    style={{ width: `${Math.min(100, ((analysisData?.resourceBreakdown.htmlKb || 1) / (analysisData?.metrics.pageSizeKb || 1)) * 100)}%` }}
                    className="bg-purple-400 h-full"
                    title="HTML"
                  />
                </div>
              </div>

              {/* Resource Size Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    JavaScript
                  </div>
                  <div className="text-base font-bold font-mono text-white">
                    {analysisData?.resourceBreakdown.jsKb || 0} KB
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {analysisData?.resourceBreakdown.counts?.js || 0} files
                  </div>
                </div>

                <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Images
                  </div>
                  <div className="text-base font-bold font-mono text-white">
                    {analysisData?.resourceBreakdown.imageKb || 0} KB
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {analysisData?.resourceBreakdown.counts?.image || 0} files
                  </div>
                </div>

                <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] text-blue-400 font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    CSS Styles
                  </div>
                  <div className="text-base font-bold font-mono text-white">
                    {analysisData?.resourceBreakdown.cssKb || 0} KB
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {analysisData?.resourceBreakdown.counts?.css || 0} files
                  </div>
                </div>

                <div className="bg-[#121218] p-3 rounded-xl border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] text-purple-400 font-semibold mb-1">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    HTML Document
                  </div>
                  <div className="text-base font-bold font-mono text-white">
                    {analysisData?.resourceBreakdown.htmlKb || 0} KB
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">1 document</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. TOP PERFORMANCE BOTTLENECKS & EVIDENCE PANEL */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#c8b082]" />
                Top Priority Performance Problems & Clues
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Critical bottlenecks impacting Core Web Vitals and user conversion rates.
              </p>
            </div>

            <Link
              href={`/admin?url=${encodeURIComponent(targetUrlParam)}`}
              className="text-xs font-bold text-[#c8b082] hover:text-[#e4cf9c] flex items-center gap-1 transition-colors"
            >
              View Full Evidence Log ({analysisData?.faults.length || 0} items)
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-16 text-center text-zinc-500 text-sm flex flex-col items-center gap-3">
              <RefreshCw className="w-6 h-6 animate-spin text-[#c8b082]" />
              <span>Analyzing live network trace and DOM structure...</span>
            </div>
          ) : topProblems.length === 0 ? (
            <div className="py-10 text-center text-zinc-400 text-sm flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <span>No critical performance faults detected for this website!</span>
            </div>
          ) : (
            <div className="space-y-4">
              {topProblems.slice(0, 4).map((fault) => (
                <div
                  key={fault.id}
                  className="bg-[#121218] border border-zinc-800/90 rounded-2xl p-5 shadow-lg space-y-3 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-[#c8b082] bg-[#c8b082]/10 px-2.5 py-0.5 rounded border border-[#c8b082]/30">
                        {fault.id}
                      </span>
                      <h4 className="text-sm font-bold text-white">{fault.title}</h4>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                        fault.impact === "Critical"
                          ? "bg-red-500/20 text-red-400 border border-red-500/40"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      }`}
                    >
                      {fault.impact} Impact
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">{fault.description}</p>

                  {/* Code Clue Snippet */}
                  {fault.clueCode && (
                    <div className="bg-[#08080c] border border-zinc-800 rounded-xl p-3 font-mono text-xs text-[#d4b170] overflow-x-auto flex items-center gap-3">
                      <Code2 className="w-4 h-4 text-zinc-500 shrink-0" />
                      <code>{fault.clueCode}</code>
                    </div>
                  )}

                  {/* Fix Recommendation */}
                  <div className="bg-[#161620] border-l-2 border-[#c8b082] p-3 rounded-r-xl text-xs text-zinc-200">
                    <span className="font-bold text-[#c8b082] mr-2">Remediation Action:</span>
                    {fault.recommendation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. AUDIT LAB / FIELD DATA NOTICE */}
        <div className="bg-[#0b0b10] border border-zinc-800/60 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#c8b082] shrink-0" />
            <span>
              <strong>Diagnostic Lab Probe:</strong> Metrics captured under controlled headless browser inspection with HTTP/2 and standard synthetic network emulation.
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500 shrink-0">Engine v2.4</span>
        </div>
      </main>
    </div>
  );
}

export default function OverviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#070709] text-zinc-400 p-8">Loading Overview Dossier...</div>}>
      <OverviewContent />
    </Suspense>
  );
}
