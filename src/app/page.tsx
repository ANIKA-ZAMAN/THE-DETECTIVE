"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  ArrowRight,
  Search,
  Folder,
  TrendingUp,
  Shield,
  RefreshCw,
  Activity,
  Layers,
  FileSearch,
  Scale,
  History as HistoryIcon,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveData, setLiveData] = useState<{
    overallHealthScore?: number;
    lcpSec?: number;
    inpMs?: number;
    cls?: number;
    url?: string;
    domain?: string;
    caseId?: string;
    timestamp?: string;
  } | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadLatestMetrics() {
      try {
        const histRes = await fetch("/api/history");
        const histJson = await histRes.json();
        if (mounted && histJson.success && histJson.data && histJson.data.length > 0) {
          setLiveData(histJson.data[0]);
          return;
        }

        // Fetch real data for example.com if history is empty
        const invRes = await fetch("/api/investigate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: "https://example.com" }),
        });
        const invJson = await invRes.json();
        if (mounted && invJson.success && invJson.data) {
          setLiveData(invJson.data);
        }
      } catch (err) {
        console.error("Failed to load live hero metrics", err);
      }
    }

    loadLatestMetrics();
    return () => {
      mounted = false;
    };
  }, []);

  const handleInvestigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setIsSubmitting(true);
    router.push(`/overview?url=${encodeURIComponent(urlInput.trim())}`);
  };

  const score = liveData?.overallHealthScore ?? 68;
  const scoreVerdict =
    score >= 90
      ? "Good"
      : score >= 50
      ? "Needs Improvement"
      : "Poor";
  const scoreColor =
    score >= 90 ? "#4ade80" : score >= 50 ? "#d8a764" : "#f87171";
  const scoreVerdictColor =
    score >= 90 ? "#4ade80" : score >= 50 ? "#e88d43" : "#f87171";

  const lcpValue =
    liveData?.lcpSec !== undefined ? `${liveData.lcpSec.toFixed(1)}s` : "4.2s";
  const inpValue =
    liveData?.inpMs !== undefined ? `${Math.round(liveData.inpMs)}ms` : "391ms";
  const clsValue =
    liveData?.cls !== undefined ? `${liveData.cls.toFixed(2)}` : "0.28";

  const displayUrl = liveData?.url || "https://example.com";
  const displayDomain = liveData?.domain || "example.com";

  return (
    <div
      className="min-h-screen lg:h-screen lg:max-h-screen bg-[#070709] text-zinc-100 relative overflow-x-hidden flex flex-col justify-between"
      style={{
        backgroundImage: "url('/elements/texture.svg'), radial-gradient(circle at 68% 42%, rgba(200,176,130,0.06) 0%, rgba(7,7,9,0) 70%)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover, cover",
        backgroundPosition: "center top, center",
      }}
    >
      {/* ────────────────── TOP NAVBAR WITH 5-PAGE PILL TABS ────────────────── */}
      <header className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 h-16 sm:h-18 flex items-center justify-between z-30 shrink-0">
        {/* Brand Logo with Viewfinder Brackets */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          <div className="relative w-8 h-8 flex items-center justify-center bg-[#0d0d12] rounded border border-zinc-800/80 shadow-sm">
            {/* Viewfinder Corner Ticks */}
            <span className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#c8b082]" />
            <span className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-[#c8b082]" />
            <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-[#c8b082]" />
            <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#c8b082]" />

            <svg
              className="w-4 h-4 text-[#c8b082]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
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
            <span className="text-[9px] font-bold tracking-[0.22em] text-zinc-400 uppercase leading-tight">
              PERFORMANCE
            </span>
            <span className="text-xs font-black uppercase tracking-[0.18em] text-zinc-100 leading-tight">
              DETECTIVE
            </span>
          </div>
        </Link>

        {/* Centered Navigation Pill Tabs (Overview, Details, Investigation, Compare, History) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#101014]/90 p-1 rounded-xl border border-zinc-800/80 backdrop-blur-md shadow-inner">
          <Link
            href="/overview"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-950 bg-[#d5b579] shadow-sm transition-all"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Overview</span>
          </Link>
          <Link
            href="/details"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>
          <Link
            href="/investigation"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all"
          >
            <FileSearch className="w-3.5 h-3.5" />
            <span>Investigation</span>
          </Link>
          <Link
            href="/compare"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare</span>
          </Link>
          <Link
            href="/history"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-all"
          >
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>History</span>
          </Link>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-5">
          <Link
            href="/overview"
            className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Log in
          </Link>
          <button
            onClick={() => {
              const input = document.getElementById("hero-url-input") as HTMLInputElement;
              if (input) input.focus();
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-[#0e0e14]/80 hover:bg-[#15151f] border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm cursor-pointer"
          >
            <span>Start Investigation</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        </div>
      </header>

      {/* ────────────────── MAIN HERO BODY (FIT TO 100VH) ────────────────── */}
      <main className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 flex-1 flex items-center z-20 py-1 sm:py-2 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full">
          {/* ══════════════════════════════════════════════════
              LEFT COLUMN: HEADLINE, DESCRIPTION & URL INPUT
             ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-4 z-20">
            {/* Top Tag Badge */}
            <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#c8b082] uppercase mb-3 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8b082] inline-block shadow-[0_0_6px_#c8b082]" />
              WEB PERFORMANCE INVESTIGATION
            </div>

            {/* Main Dramatic Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] leading-[1.12] tracking-tight font-serif italic font-normal text-[#f3eedc] mb-4 select-none">
              <span className="block">Every website</span>
              <span className="block">leaves clues.</span>
              <span className="block mt-0.5">
                Find what slows
              </span>
              <span className="block">
                it down.
              </span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="text-zinc-400 text-xs sm:text-[13px] leading-relaxed max-w-md mb-5 font-normal">
              Performance Detective analyzes your website like a case file,
              uncovering hidden issues, measuring impact, and revealing exactly
              what to fix.
            </p>

            {/* URL Investigation Input Bar */}
            <form
              onSubmit={handleInvestigate}
              className="w-full max-w-md bg-[#101015] border border-zinc-800/90 rounded-xl p-1.5 flex items-center shadow-2xl focus-within:border-[#c8b082]/70 transition-all mb-2.5"
            >
              <div className="flex items-center gap-2.5 pl-3 pr-2 text-zinc-500 w-full">
                <Globe className="w-4 h-4 shrink-0 text-zinc-500" />
                <input
                  id="hero-url-input"
                  type="text"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter website URL to investigate"
                  className="bg-transparent text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 outline-none w-full py-1.5 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#d5b579] hover:bg-[#c4a367] text-zinc-950 font-bold text-xs sm:text-xs px-4 sm:px-5 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Begin Investigation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {/* Example Link */}
            <p className="text-xs text-zinc-500 font-mono">
              Example:{" "}
              <button
                type="button"
                onClick={() => {
                  setUrlInput("https://example.com");
                  router.push(`/overview?url=${encodeURIComponent("https://example.com")}`);
                }}
                className="text-[#c8b082] hover:underline cursor-pointer"
              >
                https://yourwebsite.com
              </button>
            </p>
          </div>

          {/* ══════════════════════════════════════════════════════════════════════════
              RIGHT COLUMN: SEAMLESS FLOATING DETECTIVE SCENE (NO ENCLOSING PANEL)
             ══════════════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 relative w-full min-h-[460px] sm:min-h-[500px] flex items-center justify-center pointer-events-auto select-none">
            {/* Faint Background HTML/JS Code Snippets */}
            <div className="absolute left-4 bottom-6 pointer-events-none font-mono text-[9px] sm:text-[10px] text-[#6b583c]/60 space-y-0.5 select-none z-0">
              <div className="text-zinc-700 text-[8px]">019</div>
              <div className="text-zinc-700 text-[8px]">102</div>
              <div>103 &lt;header class=&quot;site-header&quot;&gt;</div>
              <div className="pl-4">103 &lt;img src=&quot;hero.jpg&quot; alt=&quot;hero&quot; /&gt;</div>
              <div className="pl-4">103 &lt;script src=&quot;tracking.js&quot;&gt;&lt;/script&gt;</div>
              <div>103 &lt;/header&gt;</div>
            </div>

            {/* Subtle Fingerprint in lower center-right of investigation scene */}
            <div className="absolute right-[28%] bottom-2 pointer-events-none opacity-25 z-0">
              <svg
                className="w-40 h-40 text-[#c8b082]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
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

            {/* Connecting Golden Constellation Dotted Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0">
              <line x1="140" y1="90" x2="230" y2="170" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="90" y1="240" x2="220" y2="220" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="140" y1="390" x2="240" y2="310" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="240" y1="220" x2="450" y2="110" stroke="#c8b082" strokeWidth="0.8" strokeDasharray="2 2" />
              <circle cx="230" cy="170" r="3.5" fill="#c8b082" className="animate-pulse" />
              <circle cx="220" cy="220" r="3.5" fill="#c8b082" />
              <circle cx="240" cy="310" r="3.5" fill="#c8b082" />
              <circle cx="450" cy="110" r="2.5" fill="#c8b082" />
            </svg>

            {/* Evidence Node 1 (Top Left) */}
            <div className="absolute top-8 left-6 bg-[#121217]/95 border border-zinc-800/90 rounded-xl px-3 py-1 text-[10px] sm:text-[11px] backdrop-blur-md shadow-xl flex items-center gap-2 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_8px_#c8b082]" />
              <div>
                <div className="text-zinc-200 font-medium leading-tight">Render Blocking</div>
                <div className="text-zinc-500 text-[9px] leading-tight">Potential Cause</div>
              </div>
            </div>

            {/* Evidence Node 2 (Middle Left) */}
            <div className="absolute top-[210px] left-2 bg-[#121217]/95 border border-zinc-800/90 rounded-xl px-3 py-1 text-[10px] sm:text-[11px] backdrop-blur-md shadow-xl flex items-center gap-2 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_8px_#c8b082]" />
              <div>
                <div className="text-zinc-200 font-medium leading-tight">Large Image</div>
                <div className="text-zinc-500 text-[9px] leading-tight">High Impact</div>
              </div>
            </div>

            {/* Evidence Node 3 (Bottom Left) */}
            <div className="absolute bottom-12 left-10 bg-[#121217]/95 border border-zinc-800/90 rounded-xl px-3 py-1 text-[10px] sm:text-[11px] backdrop-blur-md shadow-xl flex items-center gap-2 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_8px_#c8b082]" />
              <div>
                <div className="text-zinc-200 font-medium leading-tight">Third Party Script</div>
                <div className="text-zinc-500 text-[9px] leading-tight">Medium impact</div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                PHYSICAL MAGNIFYING GLASS OVER CONTINUOUS BACKGROUND
               ══════════════════════════════════════════════════════════════════ */}
            <div className="relative z-20 flex items-center justify-center -translate-x-12 sm:-translate-x-16 select-none">
              {/* Outer Metallic Brass Bezel Ring (Round Double-Rim Bezel) */}
              <div className="relative w-[295px] h-[295px] rounded-full p-[7px] bg-gradient-to-br from-[#c8b082] via-[#8c6f48] via-[#45321f] to-[#1a140e] shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_20px_rgba(200,176,130,0.18)] border border-[#c8b082]/70">
                {/* Transparent Convex Glass Lens with Subtle Tint & Refraction */}
                <div className="w-full h-full rounded-full bg-black/35 backdrop-blur-[3px] relative overflow-hidden flex items-center justify-center border border-[#523d24]/60 shadow-[inset_0_0_35px_rgba(0,0,0,0.85)]">
                  {/* Subtle Spherical Lens Shading */}
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_45%_45%,_rgba(25,25,35,0.05)_0%,_rgba(10,10,15,0.45)_70%,_rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />

                  {/* Diagonal Glass Specular Glare (Top-Left Angle) */}
                  <div className="absolute -top-12 -left-12 w-52 h-52 rounded-full bg-gradient-to-br from-white/22 via-white/5 to-transparent pointer-events-none transform rotate-12 blur-[1px] z-20" />

                  {/* Secondary Rim Glare Arcs */}
                  <div className="absolute top-2 right-6 w-24 h-7 rounded-full bg-white/12 pointer-events-none transform rotate-[-25deg] blur-[2px] z-20" />
                  <div className="absolute bottom-3 left-8 w-20 h-5 rounded-full bg-white/8 pointer-events-none transform rotate-[35deg] blur-[3px] z-20" />

                  {/* Scanning Content Floating Directly on Transparent Glass */}
                  <div className="relative z-10 w-[84%] p-1 space-y-1.5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-serif italic text-[#c8b082]">
                        analyzing...
                      </span>
                      <div className="flex items-center gap-1 opacity-60">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      </div>
                    </div>

                    {/* Green Monospace URL */}
                    <span className="text-[15px] font-mono font-bold text-[#86efac] block tracking-tight drop-shadow-[0_0_8px_rgba(134,239,172,0.5)] truncate">
                      {displayUrl}
                    </span>

                    {/* Progress Bar with Scanner Keyframes */}
                    <div className="flex items-center gap-2 py-0.5">
                      <div className="flex-1 h-1.5 bg-zinc-800/90 rounded-full overflow-hidden border border-zinc-700/40">
                        <div className="h-full bg-gradient-to-r from-[#b59a68] to-[#c8b082] rounded-full shadow-[0_0_8px_#c8b082] animate-progress-scan" />
                      </div>
                      <div className="w-3 h-3 border-2 border-[#c8b082] border-t-transparent rounded-full animate-spin shrink-0 opacity-70" />
                    </div>

                    {/* Checklist with Glowing Status Dots */}
                    <ul className="space-y-1 text-[10px] sm:text-[11px] text-zinc-200 font-sans pt-0.5">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#86efac] shrink-0 shadow-[0_0_6px_#86efac]" />
                        <span className="text-zinc-100">Collecting resources</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#86efac] shrink-0 shadow-[0_0_6px_#86efac]" />
                        <span className="text-zinc-100">Measuring performance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#86efac] shrink-0 shadow-[0_0_6px_#86efac]" />
                        <span className="text-zinc-100">Analyzing bottlenecks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                        <span className="text-zinc-400">Compiling evidence</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Co-Axial Physical Brass Collar & Walnut Handle attached naturally at 45° to bottom-right */}
                <div
                  className="absolute pointer-events-none z-30 flex flex-col items-center"
                  style={{
                    top: "50%",
                    left: "50%",
                    width: "34px",
                    transformOrigin: "top center",
                    transform: "translate(-50%, 0) rotate(-45deg) translate(0, 146px)",
                  }}
                >
                  {/* Step 1: Upper Brass Transition Lip */}
                  <div className="w-6 h-2 rounded-t-sm bg-gradient-to-r from-[#7a5328] via-[#c8b082] via-[#ffe0a3] to-[#3a220d] border-t border-x border-[#ffe0a3]/60 shadow-sm" />
                  
                  {/* Step 2: Ribbed Middle Brass Collar Sleeve */}
                  <div className="w-8 h-3.5 bg-gradient-to-r from-[#5c3e1e] via-[#c8b082] via-[#ffe0a3] to-[#3a220d] rounded-sm border border-[#c8b082]/90 shadow-md my-0.5" />
                  
                  {/* Step 3: Base Brass Collar Ring */}
                  <div className="w-6 h-2 bg-gradient-to-r from-[#7a5328] via-[#c8b082] via-[#ffe0a3] to-[#3a220d] rounded-sm shadow-sm" />

                  {/* Step 4: Cylindrical Polished Walnut Wood Handle */}
                  <div
                    className="w-7 h-44 rounded-b-2xl shadow-[0_20px_50px_rgba(0,0,0,0.98)] border-x border-b border-[#3d2415]/80 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(90deg, #1c0e07 0%, #4a2815 30%, #6a3c20 50%, #30170a 75%, #120703 100%)",
                    }}
                  >
                    {/* Cylinder Specular Wood Sheen */}
                    <div className="absolute inset-y-0 left-[32%] w-1.5 bg-white/12 blur-[0.5px]" />
                    {/* Polished Brass End Cap */}
                    <div className="absolute bottom-0 inset-x-0 h-3 rounded-b-2xl bg-gradient-to-r from-[#7a5328] via-[#c8b082] to-[#3a220d] border-t border-[#ffe0a3]/60" />
                  </div>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════════
                CLEAN VERTICAL STACK ON THE RIGHT (CASE FILE -> SCORE -> VITALS)
               ══════════════════════════════════════════════════════════════════════ */}
            <div className="absolute right-0 sm:right-2 top-0 sm:top-2 z-30 flex flex-col gap-2.5 w-44 sm:w-48 select-none">
              {/* 1. TOP-RIGHT: PINNED CASE FILE #0001 */}
              <div className="relative">
                {/* Pushpin */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none">
                  <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-500 via-amber-700 to-zinc-950 border border-amber-400 shadow-[0_3px_6px_rgba(0,0,0,0.9)]" />
                  <div className="w-1 h-1 bg-black/70 rounded-full blur-[1px]" />
                </div>

                {/* Manila Card */}
                <div className="bg-[#dfd7c2] text-zinc-900 rounded-sm p-3 pt-3.5 text-xs font-mono shadow-[0_10px_24px_rgba(0,0,0,0.85)] border border-[#c7beaa] transform rotate-1 hover:rotate-0 transition-transform">
                  <div className="flex items-center justify-between border-b border-zinc-700/40 pb-1 mb-1">
                    <span className="font-bold tracking-widest text-zinc-900 text-[10px]">
                      CASE FILE
                    </span>
                    <span className="text-zinc-700 font-semibold text-[10px]">#0001</span>
                  </div>

                  <div className="space-y-0.5 text-[9px] text-zinc-800">
                    <div className="font-semibold text-zinc-950 tracking-tight text-[11px] truncate">
                      {displayDomain}
                    </div>
                    <div className="text-zinc-600 text-[8px]">Investigated on</div>
                    <div className="text-zinc-800 font-medium">May 21, 2024</div>
                  </div>

                  <div className="mt-1.5 text-right">
                    <span className="inline-block px-2 py-0.5 border-2 border-[#b91c1c] text-[#b91c1c] font-black text-[8px] tracking-widest rounded-xs transform -rotate-6 shadow-sm uppercase">
                      OPEN
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. MIDDLE: PERFORMANCE SCORE CARD */}
              <div className="bg-[#13131a]/95 border border-zinc-800/90 rounded-xl p-2.5 sm:p-3 shadow-[0_14px_30px_rgba(0,0,0,0.9)] backdrop-blur-md">
                <div className="text-[8px] font-bold text-zinc-400 tracking-wider uppercase mb-0.5">
                  PERFORMANCE SCORE
                </div>
                <div className="flex items-baseline gap-1 my-0.5">
                  <span
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                    style={{ color: scoreColor }}
                  >
                    {score}
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">/100</span>
                </div>
                <div
                  className="text-[10px] sm:text-[11px] font-semibold mt-0.5"
                  style={{ color: scoreVerdictColor }}
                >
                  {scoreVerdict}
                </div>
              </div>

              {/* 3. BOTTOM: CORE WEB VITALS CARD */}
              <div className="bg-[#13131a]/95 border border-zinc-800/90 rounded-xl p-2.5 sm:p-3 shadow-[0_14px_30px_rgba(0,0,0,0.9)] backdrop-blur-md">
                <div className="text-[8px] font-bold text-zinc-400 tracking-wider uppercase mb-1.5">
                  CORE WEB VITALS
                </div>
                <div className="space-y-1.5 text-[10px] sm:text-[11px] font-mono">
                  {/* LCP */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">LCP</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#e0524c] font-bold">{lcpValue}</span>
                      <div className="w-3 h-3 rounded-full bg-[#2a1414] border border-[#e0524c]/40 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e0524c] shadow-[0_0_6px_#e0524c]" />
                      </div>
                    </div>
                  </div>

                  {/* INP */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">INP</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#cbb04a] font-bold">{inpValue}</span>
                      <div className="w-3 h-3 rounded-full bg-[#242012] border border-[#cbb04a]/40 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cbb04a] shadow-[0_0_6px_#cbb04a]" />
                      </div>
                    </div>
                  </div>

                  {/* CLS */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">CLS</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#cbb04a] font-bold">{clsValue}</span>
                      <div className="w-3 h-3 rounded-full bg-[#242012] border border-[#cbb04a]/40 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#cbb04a] shadow-[0_0_6px_#cbb04a]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ────────────────── BOTTOM FEATURE STRIP (EDITORIAL ARCHITECTURAL GRID) ────────────────── */}
      <footer className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 pb-3 pt-1 z-20 shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#0a0a0f]/90 border border-zinc-800/80 rounded-2xl divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80 backdrop-blur-md shadow-xl overflow-hidden">
          {/* 01. Deep Investigation */}
          <div className="flex items-center gap-3.5 p-3 sm:p-3.5 hover:bg-zinc-900/30 transition-colors">
            <span className="text-[10px] font-mono font-bold text-[#c8b082]/70 shrink-0">01</span>
            <div>
              <h3 className="text-xs font-bold text-zinc-100 mb-0.5 tracking-tight">
                Deep Investigation
              </h3>
              <p className="text-[11px] text-zinc-400 leading-tight font-normal">
                Identifies root bottlenecks, not just surface metrics.
              </p>
            </div>
          </div>

          {/* 02. Actionable Evidence */}
          <div className="flex items-center gap-3.5 p-3 sm:p-3.5 hover:bg-zinc-900/30 transition-colors">
            <span className="text-[10px] font-mono font-bold text-[#c8b082]/70 shrink-0">02</span>
            <div>
              <h3 className="text-xs font-bold text-zinc-100 mb-0.5 tracking-tight">
                Actionable Evidence
              </h3>
              <p className="text-[11px] text-zinc-400 leading-tight font-normal">
                Pinpoints exact code lines and heavy payload assets.
              </p>
            </div>
          </div>

          {/* 03. Track Progress */}
          <div className="flex items-center gap-3.5 p-3 sm:p-3.5 hover:bg-zinc-900/30 transition-colors">
            <span className="text-[10px] font-mono font-bold text-[#c8b082]/70 shrink-0">03</span>
            <div>
              <h3 className="text-xs font-bold text-zinc-100 mb-0.5 tracking-tight">
                Track Progress
              </h3>
              <p className="text-[11px] text-zinc-400 leading-tight font-normal">
                Continuous chronological audits and delta comparisons.
              </p>
            </div>
          </div>

          {/* 04. Privacy Focused */}
          <div className="flex items-center gap-3.5 p-3 sm:p-3.5 hover:bg-zinc-900/30 transition-colors">
            <span className="text-[10px] font-mono font-bold text-[#c8b082]/70 shrink-0">04</span>
            <div>
              <h3 className="text-xs font-bold text-zinc-100 mb-0.5 tracking-tight">
                Privacy Focused
              </h3>
              <p className="text-[11px] text-zinc-400 leading-tight font-normal">
                Diagnostic audits run cleanly without intrusive tracking.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
