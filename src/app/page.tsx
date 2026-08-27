"use client";

import React, { useState } from "react";
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
} from "lucide-react";

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
    <div
      className="min-h-screen bg-[#070709] text-zinc-100 relative overflow-x-hidden flex flex-col justify-between"
      style={{
        backgroundImage: "url('/elements/texture.svg'), radial-gradient(circle at 68% 42%, rgba(200,176,130,0.06) 0%, rgba(7,7,9,0) 70%)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover, cover",
        backgroundPosition: "center top, center",
      }}
    >
      {/* ────────────────── TOP NAVBAR (EXACT REFERENCE SPEC) ────────────────── */}
      <header className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 h-20 flex items-center justify-between z-30">
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

        {/* Centered Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-zinc-400">
          <Link href="/overview" className="hover:text-zinc-100 transition-colors">
            How it works
          </Link>
          <Link href="/details" className="hover:text-zinc-100 transition-colors">
            Features
          </Link>
          <Link href="/history" className="hover:text-zinc-100 transition-colors">
            Cases
          </Link>
          <Link href="/compare" className="hover:text-zinc-100 transition-colors">
            Pricing
          </Link>
          <Link href="/investigation" className="hover:text-zinc-100 transition-colors">
            Docs
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

      {/* ────────────────── MAIN HERO BODY (80-85vh) ────────────────── */}
      <main className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 flex-1 flex items-center z-20 py-2 sm:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          {/* ══════════════════════════════════════════════════
              LEFT COLUMN: HEADLINE, DESCRIPTION & URL INPUT
             ══════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 flex flex-col items-start pr-0 lg:pr-4 z-20">
            {/* Top Tag Badge */}
            <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#c8b082] uppercase mb-4 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8b082] inline-block shadow-[0_0_6px_#c8b082]" />
              WEB PERFORMANCE INVESTIGATION
            </div>

            {/* Main Dramatic Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] leading-[1.08] tracking-tight font-extrabold text-white mb-5 select-none">
              <span className="block font-sans">Every website</span>
              <span className="block font-sans">leaves clues.</span>
              <span className="block font-serif font-normal italic text-[#f3eedc] mt-1">
                Find what slows
              </span>
              <span className="block font-serif font-normal italic text-[#f3eedc]">
                it down.
              </span>
            </h1>

            {/* Subtitle Paragraph */}
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-md mb-7 font-normal">
              Performance Detective analyzes your website like a case file,
              uncovering hidden issues, measuring impact, and revealing exactly
              what to fix.
            </p>

            {/* URL Investigation Input Bar */}
            <form
              onSubmit={handleInvestigate}
              className="w-full max-w-md bg-[#101015] border border-zinc-800/90 rounded-xl p-1.5 flex items-center shadow-2xl focus-within:border-[#c8b082]/70 transition-all mb-3"
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
          <div className="lg:col-span-7 relative w-full min-h-[540px] sm:min-h-[580px] flex items-center justify-center pointer-events-auto select-none">
            {/* Faint Background HTML/JS Code Snippets */}
            <div className="absolute left-4 bottom-8 pointer-events-none font-mono text-[10px] sm:text-[11px] text-[#6b583c]/60 space-y-1 select-none z-0">
              <div className="text-zinc-700 text-[9px]">019</div>
              <div className="text-zinc-700 text-[9px]">102</div>
              <div>103 &lt;header class=&quot;site-header&quot;&gt;</div>
              <div className="pl-6">103 &lt;img src=&quot;hero.jpg&quot; alt=&quot;hero&quot; /&gt;</div>
              <div className="pl-6">103 &lt;script src=&quot;tracking.js&quot;&gt;&lt;/script&gt;</div>
              <div>103 &lt;/header&gt;</div>
            </div>

            {/* Subtle Fingerprint in lower center-right of investigation scene */}
            <div className="absolute right-[22%] bottom-4 pointer-events-none opacity-25 z-0">
              <svg
                className="w-48 h-48 text-[#c8b082]"
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
              <line x1="160" y1="110" x2="270" y2="190" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="110" y1="280" x2="260" y2="250" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="160" y1="440" x2="280" y2="350" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="280" y1="250" x2="520" y2="150" stroke="#c8b082" strokeWidth="0.8" strokeDasharray="2 2" />
              <circle cx="270" cy="190" r="3.5" fill="#c8b082" className="animate-pulse" />
              <circle cx="260" cy="250" r="3.5" fill="#c8b082" />
              <circle cx="280" cy="350" r="3.5" fill="#c8b082" />
              <circle cx="520" cy="150" r="2.5" fill="#c8b082" />
            </svg>

            {/* Evidence Node 1 (Top Left) */}
            <div className="absolute top-12 left-8 bg-[#121217]/95 border border-zinc-800/90 rounded-xl px-3.5 py-1.5 text-[11px] backdrop-blur-md shadow-xl flex items-center gap-2.5 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_8px_#c8b082]" />
              <div>
                <div className="text-zinc-200 font-medium leading-tight">Render Blocking</div>
                <div className="text-zinc-500 text-[10px] leading-tight">Potential Cause</div>
              </div>
            </div>

            {/* Evidence Node 2 (Middle Left) */}
            <div className="absolute top-[245px] left-4 bg-[#121217]/95 border border-zinc-800/90 rounded-xl px-3.5 py-1.5 text-[11px] backdrop-blur-md shadow-xl flex items-center gap-2.5 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_8px_#c8b082]" />
              <div>
                <div className="text-zinc-200 font-medium leading-tight">Large Image</div>
                <div className="text-zinc-500 text-[10px] leading-tight">High Impact</div>
              </div>
            </div>

            {/* Evidence Node 3 (Bottom Left) */}
            <div className="absolute bottom-16 left-12 bg-[#121217]/95 border border-zinc-800/90 rounded-xl px-3.5 py-1.5 text-[11px] backdrop-blur-md shadow-xl flex items-center gap-2.5 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_8px_#c8b082]" />
              <div>
                <div className="text-zinc-200 font-medium leading-tight">Third Party Script</div>
                <div className="text-zinc-500 text-[10px] leading-tight">Medium impact</div>
              </div>
            </div>

            {/* Pinned Manila Case File #0001 Note Card (Top Right) */}
            <div className="absolute top-4 right-8 z-20 select-none">
              {/* Pushpin */}
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 via-amber-700 to-zinc-950 border border-amber-400 shadow-[0_4px_8px_rgba(0,0,0,0.9)]" />
                <div className="w-1.5 h-1.5 bg-black/70 rounded-full blur-[1px]" />
              </div>

              {/* Manila Card */}
              <div className="bg-[#dfd7c2] text-zinc-900 rounded-sm p-4 pt-5 text-xs font-mono shadow-[0_15px_35px_rgba(0,0,0,0.85)] border border-[#c7beaa] w-52 transform rotate-1">
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
                  <span className="inline-block px-2.5 py-0.5 border-2 border-[#b91c1c] text-[#b91c1c] font-black text-[10px] tracking-widest rounded-xs transform -rotate-6 shadow-sm uppercase">
                    OPEN
                  </span>
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                PHYSICAL MAGNIFYING GLASS OVER CONTINUOUS BACKGROUND
               ══════════════════════════════════════════════════════════════════ */}
            <div className="relative z-20 flex items-center justify-center -translate-x-6 select-none">
              {/* Outer Metallic Brass Bezel Ring (Round Double-Rim Bezel) */}
              <div className="relative w-[315px] h-[315px] rounded-full p-[8px] bg-gradient-to-br from-[#c8b082] via-[#8c6f48] via-[#45321f] to-[#1a140e] shadow-[0_35px_80px_rgba(0,0,0,0.95),0_0_25px_rgba(200,176,130,0.18)] border border-[#c8b082]/70">
                {/* Transparent Convex Glass Lens with Subtle Tint & Refraction */}
                <div className="w-full h-full rounded-full bg-black/35 backdrop-blur-[3px] relative overflow-hidden flex items-center justify-center border border-[#523d24]/60 shadow-[inset_0_0_35px_rgba(0,0,0,0.85)]">
                  {/* Subtle Spherical Lens Shading */}
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_45%_45%,_rgba(25,25,35,0.05)_0%,_rgba(10,10,15,0.45)_70%,_rgba(0,0,0,0.8)_100%)] pointer-events-none z-10" />

                  {/* Diagonal Glass Specular Glare (Top-Left Angle) */}
                  <div className="absolute -top-14 -left-14 w-56 h-56 rounded-full bg-gradient-to-br from-white/22 via-white/5 to-transparent pointer-events-none transform rotate-12 blur-[1px] z-20" />

                  {/* Secondary Rim Glare Arcs */}
                  <div className="absolute top-2 right-6 w-28 h-8 rounded-full bg-white/12 pointer-events-none transform rotate-[-25deg] blur-[2px] z-20" />
                  <div className="absolute bottom-3 left-8 w-24 h-6 rounded-full bg-white/8 pointer-events-none transform rotate-[35deg] blur-[3px] z-20" />

                  {/* Scanning Content Floating Directly on Transparent Glass */}
                  <div className="relative z-10 w-[84%] p-1 space-y-2">
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
                    <span className="text-base font-mono font-bold text-[#86efac] block tracking-tight drop-shadow-[0_0_8px_rgba(134,239,172,0.5)]">
                      https://example.com
                    </span>

                    {/* Progress Bar with Scanner Keyframes */}
                    <div className="flex items-center gap-2 py-0.5">
                      <div className="flex-1 h-1.5 bg-zinc-800/90 rounded-full overflow-hidden border border-zinc-700/40">
                        <div className="h-full bg-gradient-to-r from-[#b59a68] to-[#c8b082] rounded-full shadow-[0_0_8px_#c8b082] animate-progress-scan" />
                      </div>
                      <div className="w-3 h-3 border-2 border-[#c8b082] border-t-transparent rounded-full animate-spin shrink-0 opacity-70" />
                    </div>

                    {/* Checklist with Glowing Status Dots */}
                    <ul className="space-y-1.5 text-[11px] text-zinc-200 font-sans pt-1">
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

                {/* 45° Stepped Brass Joint Collar */}
                <div className="absolute -bottom-4 -right-3 z-30 pointer-events-none transform rotate-[-45deg] flex flex-col items-center">
                  <div className="w-8 h-4 rounded-t-sm bg-gradient-to-r from-[#c8b082] via-[#ffe0a3] to-[#5c3e1e] border-t border-x border-[#ffe0a3]/80 shadow-md" />
                  <div className="w-10 h-6 bg-gradient-to-r from-[#7a5328] via-[#c8b082] via-[#ffe0a3] to-[#3a220d] rounded-sm border border-[#c8b082]/90 shadow-lg" />
                </div>

                {/* Cylindrical Dark Walnut Wood Handle */}
                <div
                  className="absolute -bottom-36 -right-32 w-10 h-52 pointer-events-none z-20 transform rotate-[-45deg] origin-top-left rounded-b-2xl border-x border-b border-[#3d2415]/70 shadow-[0_25px_60px_rgba(0,0,0,0.98)]"
                  style={{
                    background: "linear-gradient(90deg, #1c0e07 0%, #4a2815 35%, #6a3c20 50%, #30170a 75%, #120703 100%)",
                  }}
                >
                  <div className="absolute inset-y-0 left-[35%] w-1.5 bg-white/10 blur-[0.5px]" />
                  <div className="absolute bottom-0 inset-x-0 h-4 rounded-b-2xl bg-gradient-to-r from-[#7a5328] via-[#c8b082] to-[#3a220d] border-t border-[#ffe0a3]/60" />
                </div>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                FLOATING REPORT CARDS (PERFORMANCE SCORE & VITALS)
               ══════════════════════════════════════════════════ */}
            <div className="absolute right-4 bottom-6 flex flex-col gap-3.5 z-30 w-52 transform -rotate-[2.5deg] select-none animate-float-slow">
              {/* Card 1: PERFORMANCE SCORE */}
              <div className="bg-[#13131a]/95 border border-zinc-800/90 rounded-2xl p-4 shadow-[0_20px_45px_rgba(0,0,0,0.9)] backdrop-blur-md">
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
              <div className="bg-[#13131a]/95 border border-zinc-800/90 rounded-2xl p-4 shadow-[0_20px_45px_rgba(0,0,0,0.9)] backdrop-blur-md">
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

      {/* ────────────────── BOTTOM FEATURE STRIP (4 COLUMNS) ────────────────── */}
      <footer className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 py-6 z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-[#0a0a0f]/80 border border-zinc-800/80 rounded-2xl backdrop-blur-md shadow-xl">
          {/* 1. Deep Investigation */}
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

          {/* 2. Actionable Evidence */}
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

          {/* 3. Track Progress */}
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

          {/* 4. Privacy Focused */}
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
