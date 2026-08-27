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
} from "lucide-react";
import type { AnalysisResult, CompareResult } from "@/types";
import { Navbar } from "@/components/layout/Navbar";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [urlInputs, setUrlInputs] = useState<string[]>([
    "https://example.com",
    "https://httpbin.org",
  ]);
  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState<CompareResult | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Parse query params if provided: ?u1=...&u2=... or ?urls=a,b
    const u1 = searchParams.get("u1");
    const u2 = searchParams.get("u2");
    const u3 = searchParams.get("u3");
    const u4 = searchParams.get("u4");

    const queryUrls = [u1, u2, u3, u4].filter(Boolean) as string[];
    if (queryUrls.length >= 2) {
      setUrlInputs(queryUrls.slice(0, 4));
      runComparison(queryUrls.slice(0, 4));
    } else {
      runComparison(["https://example.com", "https://httpbin.org"]);
    }
  }, [searchParams]);

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

  const handleUrlChange = (index: number, value: string) => {
    const updated = [...urlInputs];
    updated[index] = value;
    setUrlInputs(updated);
  };

  const addUrlInput = () => {
    if (urlInputs.length < 4) {
      setUrlInputs([...urlInputs, ""]);
    }
  };

  const removeUrlInput = (index: number) => {
    if (urlInputs.length > 2) {
      const updated = urlInputs.filter((_, i) => i !== index);
      setUrlInputs(updated);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runComparison(urlInputs);
  };

  // Metric analysis helpers for each site
  const getStrongestMetric = (site: AnalysisResult) => {
    const m = site.metrics;
    if (m.cls <= 0.05) return "Cumulative Layout Shift (Ultra Stable)";
    if (m.ttfbMs <= 250) return "Time to First Byte (Fast Origin)";
    if (m.lcpSec <= 2.0) return "Largest Contentful Paint (Quick Render)";
    if (m.pageSizeKb <= 100) return "Payload Size (Lightweight)";
    if (m.fcpSec <= 1.2) return "First Contentful Paint (Instant Paint)";
    return "Overall Score Consistency";
  };

  const getWeakestMetric = (site: AnalysisResult) => {
    const m = site.metrics;
    if (m.lcpSec > 3.5) return `Slow LCP (${m.lcpSec}s)`;
    if (m.ttfbMs > 800) return `High TTFB Latency (${m.ttfbMs}ms)`;
    if (m.pageSizeKb > 1500) return `Heavy Payload (${m.pageSizeKb} KB)`;
    if (m.cls > 0.15) return `Layout Instability (CLS: ${m.cls})`;
    if (site.resourceBreakdown.jsKb > 400) return `High JavaScript Weight (${site.resourceBreakdown.jsKb} KB)`;
    return `TTFB Response (${m.ttfbMs}ms)`;
  };

  const getBiggestProblem = (site: AnalysisResult) => {
    const critical = site.faults.find((f) => f.impact === "Critical");
    if (critical) return critical.title;
    const warning = site.faults.find((f) => f.impact === "Warning" || f.category === "Performance");
    if (warning) return warning.title;
    return "No critical bottlenecks detected";
  };

  const sites = compareData?.sites ?? [];
  const summary = compareData?.summary;

  // Find winner site
  const winnerSite = sites.find((s) => s.normalizedUrl === summary?.bestOverall) || sites[0];

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
        <Navbar />
        <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-8 shadow-2xl animate-pulse h-48 flex items-center justify-center text-zinc-500 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082] mr-3" />
            Initializing Multi-Site Comparison Dossier...
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid relative overflow-x-hidden flex flex-col justify-between">
      {/* ────────────────── NAVBAR ────────────────── */}
      <Navbar />

      {/* ────────────────── MAIN COMPARE DOSSIER ────────────────── */}
      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 space-y-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#c8b082] uppercase mb-1">
              <Scale className="w-3.5 h-3.5" />
              SIDE-BY-SIDE FORENSIC COMPARISON
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Compare Website Performance
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Benchmark 2 to 4 websites simultaneously using real-world Core Web Vitals and network diagnostics.
            </p>
          </div>
        </div>

        {/* URL Inputs Panel */}
        <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 shadow-2xl space-y-4">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {urlInputs.map((url, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-semibold text-zinc-400 flex items-center gap-1">
                      <span className="w-4 h-4 rounded-full bg-[#181824] border border-zinc-700 flex items-center justify-center text-[10px] text-[#c8b082]">
                        {idx + 1}
                      </span>
                      Site #{idx + 1}
                    </span>
                    {urlInputs.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeUrlInput(idx)}
                        className="text-zinc-600 hover:text-red-400 transition-colors p-1"
                        title="Remove URL"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-[#121218] border border-zinc-800 focus-within:border-[#c8b082] rounded-xl px-3 py-2 transition-colors">
                    <Globe className="w-4 h-4 text-zinc-500 shrink-0" />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => handleUrlChange(idx, e.target.value)}
                      placeholder={`https://site-${idx + 1}.com`}
                      className="bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-none w-full font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-zinc-800/80">
              <div>
                {urlInputs.length < 4 && (
                  <button
                    type="button"
                    onClick={addUrlInput}
                    className="px-3.5 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-[#14141c] hover:bg-zinc-850 border border-zinc-800 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#c8b082]" />
                    <span>Add Website ({urlInputs.length}/4)</span>
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-[#c8b082] hover:bg-[#b89f71] disabled:opacity-50 text-zinc-950 font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-[0_2px_14px_rgba(200,176,130,0.3)] cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Scale className="w-4 h-4" />}
                <span>{loading ? "Analyzing Sites Concurrently..." : "Execute Side-by-Side Comparison"}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {apiError && (
          <div className="bg-red-950/40 border border-red-800/80 rounded-2xl p-5 flex items-start gap-4 text-red-200 text-sm shadow-2xl backdrop-blur-md">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="font-bold text-red-300 text-base">Comparison Notice</div>
              <p className="text-xs text-red-200/90 leading-relaxed">{apiError}</p>
            </div>
          </div>
        )}

        {/* 1. OVERALL WINNER SPOTLIGHT BANNER */}
        {winnerSite && (
          <div className="bg-gradient-to-r from-[#17150f] via-[#1a1711] to-[#0e0e13] border border-[#c8b082]/40 rounded-3xl p-6 lg:p-8 shadow-[0_15px_50px_rgba(200,176,130,0.08)] relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c8b082] via-[#a38758] to-[#3a2817] p-0.5 shadow-xl shrink-0">
                <div className="w-full h-full rounded-2xl bg-[#12100a] flex items-center justify-center text-[#d8a764]">
                  <Trophy className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#c8b082] bg-[#c8b082]/10 px-2.5 py-0.5 rounded-full border border-[#c8b082]/30">
                  <Award className="w-3 h-3" />
                  OVERALL BENCHMARK WINNER
                </div>
                <h2 className="text-xl sm:text-2xl font-mono font-black text-white">
                  {winnerSite.normalizedUrl}
                </h2>
                <p className="text-xs text-zinc-400">
                  Delivered superior performance with an overall health score of{" "}
                  <strong className="text-[#d8a764]">{winnerSite.overallHealthScore}/100</strong> and{" "}
                  <strong className="text-zinc-200">{winnerSite.metrics.pageSizeKb} KB</strong> total transfer weight.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <Link
                href={`/overview?url=${encodeURIComponent(winnerSite.normalizedUrl)}`}
                className="px-4 py-2 text-xs font-bold text-zinc-950 bg-[#c8b082] hover:bg-[#b89f71] rounded-xl flex items-center gap-1.5 transition-all shadow"
              >
                <span>View Full Winner Dossier</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 2. SIDE-BY-SIDE MATRIX TABLE */}
        {sites.length > 0 && (
          <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#c8b082]" />
                Forensic Metric Comparison Matrix
              </h3>
              <span className="text-xs font-mono text-zinc-500">Live Measured Results</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400 font-mono">
                    <th className="pb-4 font-semibold w-56">Diagnostic Metric</th>
                    {sites.map((site, i) => (
                      <th key={i} className="pb-4 font-semibold text-center px-4">
                        <div className="flex flex-col items-center">
                          <span className="text-white font-bold truncate max-w-44 block">
                            {site.normalizedUrl.replace(/^https?:\/\//, "")}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            Score: {site.overallHealthScore}/100
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {/* Overall Performance Score */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-4 font-sans font-semibold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#d8a764]" />
                      Overall Performance Score
                    </td>
                    {sites.map((site, i) => (
                      <td key={i} className="py-4 text-center px-4">
                        <span
                          className={`text-base font-black px-3 py-1 rounded-xl border ${
                            site.overallHealthScore >= 80
                              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                              : site.overallHealthScore >= 60
                              ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                              : "text-red-400 bg-red-500/10 border-red-500/30"
                          }`}
                        >
                          {site.overallHealthScore}/100
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* LCP */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3.5 font-sans text-zinc-300">
                      Largest Contentful Paint (LCP)
                    </td>
                    {sites.map((site, i) => (
                      <td key={i} className="py-3.5 text-center px-4">
                        <span className="text-sm font-bold text-white">
                          {site.metrics.lcpSec}s
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* INP */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3.5 font-sans text-zinc-300">
                      Interaction to Next Paint (INP)
                    </td>
                    {sites.map((site, i) => (
                      <td key={i} className="py-3.5 text-center px-4">
                        <span className="text-sm font-bold text-white">
                          {site.metrics.inpMs}ms
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* CLS */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3.5 font-sans text-zinc-300">
                      Cumulative Layout Shift (CLS)
                    </td>
                    {sites.map((site, i) => (
                      <td key={i} className="py-3.5 text-center px-4">
                        <span className="text-sm font-bold text-white">
                          {site.metrics.cls}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* FCP */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3.5 font-sans text-zinc-300">
                      First Contentful Paint (FCP)
                    </td>
                    {sites.map((site, i) => (
                      <td key={i} className="py-3.5 text-center px-4">
                        <span className="text-sm font-bold text-white">
                          {site.metrics.fcpSec}s
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* TTFB */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3.5 font-sans text-zinc-300">
                      Time to First Byte (TTFB)
                    </td>
                    {sites.map((site, i) => (
                      <td key={i} className="py-3.5 text-center px-4">
                        <span className="text-sm font-bold text-white">
                          {site.metrics.ttfbMs}ms
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Total Page Size */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3.5 font-sans text-zinc-300">
                      Total Page Size
                    </td>
                    {sites.map((site, i) => (
                      <td key={i} className="py-3.5 text-center px-4 font-bold text-white">
                        {site.metrics.pageSizeKb} KB
                      </td>
                    ))}
                  </tr>

                  {/* Request Count */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3.5 font-sans text-zinc-300">
                      Total Network Requests
                    </td>
                    {sites.map((site, i) => (
                      <td key={i} className="py-3.5 text-center px-4 text-zinc-300">
                        {site.metrics.requestsCount} requests
                      </td>
                    ))}
                  </tr>

                  {/* JavaScript Size */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3.5 font-sans text-zinc-300">
                      JavaScript Size
                    </td>
                    {sites.map((site, i) => (
                      <td key={i} className="py-3.5 text-center px-4 text-amber-400 font-bold">
                        {site.resourceBreakdown.jsKb} KB
                      </td>
                    ))}
                  </tr>

                  {/* Image Size */}
                  <tr className="hover:bg-zinc-900/30 transition-colors">
                    <td className="py-3.5 font-sans text-zinc-300">
                      Images Size
                    </td>
                    {sites.map((site, i) => (
                      <td key={i} className="py-3.5 text-center px-4 text-emerald-400 font-bold">
                        {site.resourceBreakdown.imageKb} KB
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. PER-SITE DETAILED FORENSIC CARDS (Strongest, Weakest, Biggest Problem) */}
        {sites.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c8b082]" />
              Per-Website Diagnostic Verdicts
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sites.map((site, idx) => {
                const isWinner = site.normalizedUrl === summary?.bestOverall;
                return (
                  <div
                    key={idx}
                    className={`bg-[#0e0e13] border rounded-2xl p-5 space-y-4 shadow-xl transition-all ${
                      isWinner ? "border-[#c8b082]/60 ring-1 ring-[#c8b082]/30" : "border-zinc-800/90 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">Site #{idx + 1}</span>
                        <h4 className="text-sm font-bold text-white truncate max-w-48" title={site.normalizedUrl}>
                          {site.normalizedUrl.replace(/^https?:\/\//, "")}
                        </h4>
                      </div>
                      <span className="text-lg font-black text-[#d8a764] font-mono">
                        {site.overallHealthScore}
                        <span className="text-xs text-zinc-600">/100</span>
                      </span>
                    </div>

                    {/* Strongest Metric */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Strongest Metric
                      </div>
                      <div className="text-xs text-zinc-200 font-medium">
                        {getStrongestMetric(site)}
                      </div>
                    </div>

                    {/* Weakest Metric */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        Weakest Metric
                      </div>
                      <div className="text-xs text-zinc-200 font-medium">
                        {getWeakestMetric(site)}
                      </div>
                    </div>

                    {/* Biggest Problem */}
                    <div className="space-y-1 pt-1 border-t border-zinc-800/60">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Primary Bottleneck
                      </div>
                      <div className="text-xs text-zinc-300 leading-snug">
                        {getBiggestProblem(site)}
                      </div>
                    </div>

                    {/* Action Links */}
                    <div className="pt-2">
                      <Link
                        href={`/overview?url=${encodeURIComponent(site.normalizedUrl)}`}
                        className="w-full text-center py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-[#14141c] hover:bg-zinc-800 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-zinc-800"
                      >
                        <span>Investigate Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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
