"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  ArrowRight,
  Search,
  Folder,
  TrendingUp,
  Shield,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInvestigate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setIsSubmitting(true);
    router.push(`/overview?url=${encodeURIComponent(urlInput.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid detective-radial-glow relative overflow-hidden flex flex-col justify-between">
      {/* ----------------- NAVBAR ----------------- */}
      <Navbar />

      {/* ----------------- MAIN HERO SECTION ----------------- */}
      <main className="w-full max-w-7xl mx-auto px-6 py-4 my-auto z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-5 flex flex-col items-start pr-2">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-[#c8b082] uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8b082] inline-block shadow-[0_0_8px_#c8b082]" />
              WEB PERFORMANCE INVESTIGATION
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight font-extrabold text-white mb-5">
              <span className="block font-sans">Every website</span>
              <span className="block font-sans">leaves clues.</span>
              <span className="block font-serif font-normal italic text-[#f3eedc] mt-1">
                Find what slows
              </span>
              <span className="block font-serif font-normal italic text-[#f3eedc]">
                it down.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md mb-7 font-normal">
              Performance Detective analyzes your website like a case file,
              uncovering hidden issues, measuring impact, and revealing exactly
              what to fix.
            </p>

            {/* Input Bar Form */}
            <form
              onSubmit={handleInvestigate}
              className="w-full max-w-md bg-[#101015] border border-zinc-800/90 rounded-xl p-1.5 flex items-center shadow-2xl focus-within:border-[#c8b082]/60 transition-all mb-3"
            >
              <div className="flex items-center gap-2 pl-3 pr-2 text-zinc-500 w-full">
                <Globe className="w-4 h-4 shrink-0 text-zinc-400" />
                <input
                  type="url"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter website URL to investigate"
                  className="bg-transparent text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 outline-none w-full py-2"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#c8b082] hover:bg-[#b89f71] text-zinc-950 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shrink-0 cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 text-zinc-950 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Begin Investigation</span>
                    <ArrowRight className="w-4 h-4 text-zinc-950" />
                  </>
                )}
              </button>
            </form>

            {/* Example Link */}
            <p className="text-xs text-zinc-500 font-normal">
              Example:{" "}
              <button
                type="button"
                onClick={() => {
                  setUrlInput("https://example.com");
                  router.push(`/admin?url=${encodeURIComponent("https://example.com")}`);
                }}
                className="text-[#c8b082] hover:underline"
              >
                https://yourwebsite.com
              </button>
            </p>
          </div>

          {/* Right Column: Interactive Detective Visual Canvas */}
          <div className="lg:col-span-7 relative w-full min-h-[560px] rounded-2xl border border-zinc-800/90 bg-[#07070a] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)] flex items-center justify-center p-4">
            {/* Background Noir Ambient Sepia Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_45%,_rgba(45,36,22,0.65)_0%,_rgba(7,7,10,1)_82%)]" />

            {/* Faint Background Detective Code Snippets */}
            <div className="absolute left-6 bottom-6 pointer-events-none font-mono text-[11px] text-[#6e5d42]/70 space-y-1 select-none z-10">
              <div>&lt;header class=&quot;site-header&quot;&gt;</div>
              <div className="pl-4">&lt;img src=&quot;hero.jpg&quot; alt=&quot;...&quot; /&gt;</div>
              <div className="pl-4">&lt;script src=&quot;tracking.js&quot; async&gt;&lt;/script&gt;</div>
              <div>&lt;/header&gt;</div>
            </div>

            {/* Faint Fingerprint Watermark */}
            <div className="absolute left-[34%] bottom-4 pointer-events-none opacity-20 z-0">
              <svg
                className="w-64 h-64 text-[#c8b082]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.1"
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

            {/* Glowing Golden Constellation Network Graph */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-0">
              <line x1="100" y1="80" x2="220" y2="170" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="70" y1="260" x2="230" y2="230" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="120" y1="420" x2="240" y2="330" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="230" y1="230" x2="480" y2="120" stroke="#c8b082" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="380" y1="360" x2="520" y2="440" stroke="#c8b082" strokeWidth="0.8" strokeDasharray="2 2" />
              <circle cx="220" cy="170" r="3.5" fill="#c8b082" className="animate-pulse" />
              <circle cx="230" cy="230" r="3.5" fill="#c8b082" />
              <circle cx="240" cy="330" r="3.5" fill="#c8b082" />
              <circle cx="480" cy="120" r="2.5" fill="#c8b082" />
              <circle cx="520" cy="440" r="3" fill="#c8b082" />
            </svg>

            {/* Node Tag 1 (Top Left) */}
            <div className="absolute top-8 left-6 bg-[#121217]/95 border border-zinc-800/90 rounded-lg px-3 py-1.5 text-[11px] backdrop-blur-md shadow-xl flex items-center gap-2.5 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_8px_#c8b082]" />
              <div>
                <div className="text-zinc-200 font-medium leading-tight">Render Blocking</div>
                <div className="text-zinc-500 text-[10px] leading-tight">Potential Cause</div>
              </div>
            </div>

            {/* Node Tag 2 (Middle Left) */}
            <div className="absolute top-[230px] left-4 bg-[#121217]/95 border border-zinc-800/90 rounded-lg px-3 py-1.5 text-[11px] backdrop-blur-md shadow-xl flex items-center gap-2.5 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_8px_#c8b082]" />
              <div>
                <div className="text-zinc-200 font-medium leading-tight">Large Image</div>
                <div className="text-zinc-500 text-[10px] leading-tight">High Impact</div>
              </div>
            </div>

            {/* Node Tag 3 (Bottom Left) */}
            <div className="absolute bottom-14 left-8 bg-[#121217]/95 border border-zinc-800/90 rounded-lg px-3 py-1.5 text-[11px] backdrop-blur-md shadow-xl flex items-center gap-2.5 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_8px_#c8b082]" />
              <div>
                <div className="text-zinc-200 font-medium leading-tight">Third Party Script</div>
                <div className="text-zinc-500 text-[10px] leading-tight">Medium Impact</div>
              </div>
            </div>

            {/* Top Right PINNED CASE FILE #0001 PARCHMENT NOTE */}
            <div className="absolute top-6 right-6 z-20 select-none">
              {/* 3D Brass Pushpin */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-600 via-amber-800 to-zinc-950 border border-amber-500 shadow-[0_3px_6px_rgba(0,0,0,0.9)]" />
                <div className="w-1 h-1 bg-black/60 rounded-full blur-[1px]" />
              </div>

              {/* Manila Note Card */}
              <div className="bg-[#dfd7c2] text-zinc-900 rounded-sm p-4 pt-5 text-xs font-mono shadow-[0_15px_30px_rgba(0,0,0,0.8)] border border-[#c7beaa] w-48 transform rotate-1">
                <div className="flex items-center justify-between border-b border-zinc-700/40 pb-1 mb-2">
                  <span className="font-bold tracking-widest text-zinc-900 text-xs">
                    CASE FILE
                  </span>
                  <span className="text-zinc-700 font-semibold">#0001</span>
                </div>

                <div className="space-y-1 text-[11px] text-zinc-800">
                  <div className="font-semibold text-zinc-950 tracking-tight text-xs">
                    example.com
                  </div>
                  <div className="text-zinc-600 text-[10px]">Investigated on</div>
                  <div className="text-zinc-800 font-medium">May 21, 2024</div>
                </div>

                <div className="mt-3 text-right">
                  <span className="inline-block px-2 py-0.5 border-2 border-[#b91c1c] text-[#b91c1c] font-black text-[10px] tracking-widest rounded-xs transform -rotate-6 shadow-sm uppercase">
                    OPEN
                  </span>
                </div>
              </div>
            </div>

            {/* CENTERPIECE: SHERLOCK HOLMES MAGNIFYING GLASS */}
            <div className="relative z-20 flex items-center justify-center -translate-x-8 -translate-y-2 select-none">
              {/* Outer Metallic Antique Brass Rim */}
              <div className="relative w-[310px] h-[310px] rounded-full p-[7px] bg-gradient-to-br from-[#c8b082] via-[#8c6f48] via-[#45321f] to-[#1a140e] shadow-[0_30px_70px_rgba(0,0,0,0.98),0_0_20px_rgba(200,176,130,0.15)] border border-[#c8b082]/70">
                {/* Inner Bezel Groove */}
                <div className="w-full h-full rounded-full bg-[#08080c] p-4 relative overflow-hidden flex flex-col justify-center border border-[#523d24]/60 shadow-[inset_0_0_40px_rgba(0,0,0,0.98)]">
                  {/* Realistic Curved Lens Glare Highlights */}
                  <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none transform rotate-45 blur-[1px]" />
                  <div className="absolute top-3 right-5 w-24 h-12 rounded-full bg-white/10 pointer-events-none transform rotate-[-20deg] blur-[2px]" />
                  <div className="absolute bottom-4 left-6 w-20 h-10 rounded-full bg-white/5 pointer-events-none transform rotate-[35deg] blur-[3px]" />

                  {/* UI Window inside Magnifying Glass Lens */}
                  <div className="relative z-10 bg-[#0e0e14]/90 border border-zinc-800/90 rounded-xl p-4 shadow-2xl backdrop-blur-md">
                    {/* Header title */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-serif italic text-[#c8b082]">
                        analyzing...
                      </span>
                      <div className="flex items-center gap-1 opacity-40">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      </div>
                    </div>

                    {/* URL in glowing phosphor green */}
                    <span className="text-base font-mono font-bold text-[#86efac] block tracking-tight mb-2.5 drop-shadow-[0_0_8px_rgba(134,239,172,0.35)]">
                      https://example.com
                    </span>

                    {/* Gold Progress Bar with Spinner Indicator */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 h-1.5 bg-zinc-800/90 rounded-full overflow-hidden border border-zinc-700/40">
                        <div className="h-full w-[58%] bg-gradient-to-r from-[#b59a68] to-[#c8b082] rounded-full shadow-[0_0_8px_#c8b082]" />
                      </div>
                      <div className="w-3 h-3 border-2 border-[#c8b082] border-t-transparent rounded-full animate-spin shrink-0 opacity-70" />
                    </div>

                    {/* Status Checklist with Green Glowing Dots */}
                    <ul className="space-y-1.5 text-[11px] text-zinc-300 font-sans">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#86efac] shrink-0 shadow-[0_0_6px_#86efac]" />
                        <span className="text-zinc-200">Collecting resources</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#86efac] shrink-0 shadow-[0_0_6px_#86efac]" />
                        <span className="text-zinc-200">Measuring performance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#86efac] shrink-0 shadow-[0_0_6px_#86efac]" />
                        <span className="text-zinc-200">Analyzing bottlenecks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                        <span className="text-zinc-400">Compiling evidence</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 42° Stepped Metallic Brass Collar Joint */}
                <div className="absolute -bottom-4 -right-3 z-30 pointer-events-none transform rotate-[-45deg] flex flex-col items-center">
                  {/* Step 1 Brass Ring */}
                  <div className="w-8 h-4 rounded-t-sm bg-gradient-to-r from-[#c8b082] via-[#ffe0a3] to-[#5c3e1e] border-t border-x border-[#ffe0a3]/80 shadow-md" />
                  {/* Step 2 Ribbed Joint Collar */}
                  <div className="w-10 h-6 bg-gradient-to-r from-[#7a5328] via-[#c8b082] via-[#ffe0a3] to-[#3a220d] rounded-sm border border-[#c8b082]/90 shadow-lg" />
                </div>

                {/* Cylindrical Dark Walnut Wood Handle (Extending to Bottom Right at 45°) */}
                <div
                  className="absolute -bottom-36 -right-32 w-10 h-52 pointer-events-none z-20 transform rotate-[-45deg] origin-top-left rounded-b-2xl border-x border-b border-[#3d2415]/70 shadow-[0_25px_60px_rgba(0,0,0,0.98)]"
                  style={{
                    background: "linear-gradient(90deg, #1c0e07 0%, #4a2815 35%, #6a3c20 50%, #30170a 75%, #120703 100%)",
                  }}
                >
                  {/* Handle Gloss Sheen Highlight */}
                  <div className="absolute inset-y-0 left-[35%] w-1.5 bg-white/10 blur-[0.5px]" />
                  {/* Bottom Metal Cap Ring */}
                  <div className="absolute bottom-0 inset-x-0 h-4 rounded-b-2xl bg-gradient-to-r from-[#7a5328] via-[#c8b082] to-[#3a220d] border-t border-[#ffe0a3]/60" />
                </div>
              </div>
            </div>

            {/* FLOATING TILTED METRIC REPORT CARDS (RIGHT SIDE) */}
            <div className="absolute right-6 bottom-7 flex flex-col gap-3.5 z-30 w-52 transform -rotate-[2.5deg] select-none">
              {/* Card 1: PERFORMANCE SCORE */}
              <div className="bg-[#15151c]/95 border border-zinc-800/90 rounded-2xl p-4 shadow-[0_20px_45px_rgba(0,0,0,0.9)] backdrop-blur-md">
                <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1">
                  PERFORMANCE SCORE
                </div>
                <div className="flex items-baseline gap-1.5 my-0.5">
                  <span className="text-4xl font-extrabold text-[#d8a764] tracking-tight">
                    68
                  </span>
                  <span className="text-sm text-zinc-500 font-medium">/100</span>
                </div>
                <div className="text-xs font-semibold text-[#e88d43] mt-0.5">
                  Needs Improvement
                </div>
              </div>

              {/* Card 2: CORE WEB VITALS */}
              <div className="bg-[#15151c]/95 border border-zinc-800/90 rounded-2xl p-4 shadow-[0_20px_45px_rgba(0,0,0,0.9)] backdrop-blur-md">
                <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-2.5">
                  CORE WEB VITALS
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  {/* LCP */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">LCP</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#e0524c] font-bold">4.2s</span>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#2a1414] border border-[#e0524c]/40 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-[#e0524c] shadow-[0_0_6px_#e0524c]" />
                      </div>
                    </div>
                  </div>

                  {/* INP */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">INP</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#cbb04a] font-bold">391ms</span>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#242012] border border-[#cbb04a]/40 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-[#cbb04a] shadow-[0_0_6px_#cbb04a]" />
                      </div>
                    </div>
                  </div>

                  {/* CLS */}
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 font-medium">CLS</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#cbb04a] font-bold">0.28</span>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#242012] border border-[#cbb04a]/40 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-[#cbb04a] shadow-[0_0_6px_#cbb04a]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ----------------- BOTTOM FEATURE GRID (4 COLUMNS) ----------------- */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#0a0a0e]/70 border border-zinc-800/80 rounded-2xl backdrop-blur-md shadow-xl">
          {/* Item 1 */}
          <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-900/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#121218] border border-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
              <Search className="w-4 h-4 text-[#c8b082]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-100 mb-1">
                Deep Investigation
              </h3>
              <p className="text-xs text-zinc-400 leading-snug font-normal">
                We don&apos;t just show metrics. We find the root cause.
              </p>
            </div>
          </div>

          {/* Item 2 */}
          <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-900/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#121218] border border-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
              <Folder className="w-4 h-4 text-[#c8b082]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-100 mb-1">
                Actionable Evidence
              </h3>
              <p className="text-xs text-zinc-400 leading-snug font-normal">
                See exactly what&apos;s wrong and why it matters.
              </p>
            </div>
          </div>

          {/* Item 3 */}
          <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-900/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#121218] border border-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
              <TrendingUp className="w-4 h-4 text-[#c8b082]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-100 mb-1">
                Track Progress
              </h3>
              <p className="text-xs text-zinc-400 leading-snug font-normal">
                Monitor performance over time and improve with confidence.
              </p>
            </div>
          </div>

          {/* Item 4 */}
          <div className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-zinc-900/40 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-[#121218] border border-zinc-800 flex items-center justify-center shrink-0 shadow-sm">
              <Shield className="w-4 h-4 text-[#c8b082]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-100 mb-1">
                Privacy Focused
              </h3>
              <p className="text-xs text-zinc-400 leading-snug font-normal">
                Your data stays yours. Always.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
