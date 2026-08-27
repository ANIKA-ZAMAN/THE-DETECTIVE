import React from "react";
import {
  Globe,
  ArrowRight,
  Search,
  Folder,
  TrendingUp,
  Shield,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 detective-grid detective-radial-glow relative overflow-hidden flex flex-col justify-between">
      {/* ----------------- NAVBAR ----------------- */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-30 relative">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group">
          {/* Fingerprint logo inside corner brackets frame */}
          <div className="relative w-9 h-9 flex items-center justify-center bg-[#101014] rounded border border-zinc-800/80 group-hover:border-[#c8b082]/50 transition-colors">
            {/* Top-left corner bracket */}
            <span className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-[#c8b082]" />
            {/* Top-right corner bracket */}
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r border-[#c8b082]" />
            {/* Bottom-left corner bracket */}
            <span className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b border-l border-[#c8b082]" />
            {/* Bottom-right corner bracket */}
            <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-[#c8b082]" />

            <svg
              className="w-5 h-5 text-[#c8b082]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
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
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400 leading-tight">
              PERFORMANCE
            </span>
            <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-zinc-100 leading-tight">
              DETECTIVE
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#how-it-works" className="hover:text-zinc-100 transition-colors">
            How it works
          </a>
          <a href="#features" className="hover:text-zinc-100 transition-colors">
            Features
          </a>
          <a href="#cases" className="hover:text-zinc-100 transition-colors">
            Cases
          </a>
          <a href="#pricing" className="hover:text-zinc-100 transition-colors">
            Pricing
          </a>
          <a href="#docs" className="hover:text-zinc-100 transition-colors">
            Docs
          </a>
        </nav>

        {/* Right CTA */}
        <div className="flex items-center gap-6">
          <a
            href="#login"
            className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
          >
            Log in
          </a>
          <a
            href="#investigate"
            className="px-4 py-2 text-xs font-medium text-zinc-200 border border-zinc-800 hover:border-zinc-700 bg-[#0d0d12]/80 hover:bg-zinc-900 rounded-lg flex items-center gap-2 transition-all shadow-sm"
          >
            Start Investigation
            <ArrowRight className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </header>

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

            {/* Input Bar */}
            <div className="w-full max-w-md bg-[#101015] border border-zinc-800/90 rounded-xl p-1.5 flex items-center shadow-2xl focus-within:border-[#c8b082]/60 transition-all mb-3">
              <div className="flex items-center gap-2 pl-3 pr-2 text-zinc-500 w-full">
                <Globe className="w-4 h-4 shrink-0 text-zinc-400" />
                <input
                  type="url"
                  placeholder="Enter website URL to investigate"
                  className="bg-transparent text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 outline-none w-full py-2"
                />
              </div>

              <button className="bg-[#c8b082] hover:bg-[#b89f71] text-zinc-950 font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shrink-0 cursor-pointer shadow-md">
                <span>Begin Investigation</span>
                <ArrowRight className="w-4 h-4 text-zinc-950" />
              </button>
            </div>

            {/* Example Link */}
            <p className="text-xs text-zinc-500 font-normal">
              Example:{" "}
              <a
                href="https://example.com"
                target="_blank"
                rel="noreferrer"
                className="text-[#c8b082] hover:underline"
              >
                https://yourwebsite.com
              </a>
            </p>
          </div>

          {/* Right Column: Interactive Detective Visual Canvas */}
          <div className="lg:col-span-7 relative w-full h-[540px] rounded-2xl border border-zinc-800/80 bg-[#09090d] overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Background Noir Radial Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_45%,_rgba(35,30,22,0.6)_0%,_rgba(9,9,13,1)_80%)]" />

            {/* Faint Background Code & Detective Notes */}
            <div className="absolute left-6 bottom-8 pointer-events-none font-mono text-[11px] text-[#5e533d]/70 space-y-1 select-none z-10">
              <div>&lt;header class=&quot;site-header&quot;&gt;</div>
              <div className="pl-4">&lt;img src=&quot;hero.jpg&quot; alt=&quot;...&quot; /&gt;</div>
              <div className="pl-4">&lt;script src=&quot;tracking.js&quot; async&gt;&lt;/script&gt;</div>
              <div>&lt;/header&gt;</div>
            </div>

            {/* Faint Background Fingerprint Graphic under Magnifier */}
            <div className="absolute left-[38%] bottom-6 pointer-events-none opacity-20 z-0">
              <svg
                className="w-56 h-56 text-[#c8b082]"
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
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0">
              {/* Lines */}
              <line x1="120" y1="90" x2="230" y2="180" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="80" y1="260" x2="240" y2="230" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="130" y1="410" x2="250" y2="330" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="240" y1="230" x2="480" y2="120" stroke="#c8b082" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="380" y1="360" x2="520" y2="440" stroke="#c8b082" strokeWidth="0.8" strokeDasharray="2 2" />
              {/* Constellation dots */}
              <circle cx="230" cy="180" r="3.5" fill="#c8b082" className="animate-pulse" />
              <circle cx="240" cy="230" r="3.5" fill="#c8b082" />
              <circle cx="250" cy="330" r="3.5" fill="#c8b082" />
              <circle cx="480" cy="120" r="2.5" fill="#c8b082" />
              <circle cx="520" cy="440" r="3" fill="#c8b082" />
            </svg>

            {/* Node Tag 1 (Top Left) */}
            <div className="absolute top-10 left-10 bg-[#121217]/95 border border-zinc-800/90 rounded-lg px-3 py-1.5 text-[11px] backdrop-blur-md shadow-xl flex items-center gap-2.5 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_8px_#c8b082]" />
              <div>
                <div className="text-zinc-200 font-medium leading-tight">Render Blocking</div>
                <div className="text-zinc-500 text-[10px] leading-tight">Potential Cause</div>
              </div>
            </div>

            {/* Node Tag 2 (Middle Left) */}
            <div className="absolute top-[220px] left-4 bg-[#121217]/95 border border-zinc-800/90 rounded-lg px-3 py-1.5 text-[11px] backdrop-blur-md shadow-xl flex items-center gap-2.5 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_8px_#c8b082]" />
              <div>
                <div className="text-zinc-200 font-medium leading-tight">Large Image</div>
                <div className="text-zinc-500 text-[10px] leading-tight">High Impact</div>
              </div>
            </div>

            {/* Node Tag 3 (Bottom Left) */}
            <div className="absolute bottom-16 left-12 bg-[#121217]/95 border border-zinc-800/90 rounded-lg px-3 py-1.5 text-[11px] backdrop-blur-md shadow-xl flex items-center gap-2.5 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_8px_#c8b082]" />
              <div>
                <div className="text-zinc-200 font-medium leading-tight">Third Party Script</div>
                <div className="text-zinc-500 text-[10px] leading-tight">Medium Impact</div>
              </div>
            </div>

            {/* Top Right PINNED CASE FILE #0001 PARCHMENT NOTE */}
            <div className="absolute top-6 right-8 z-20 select-none">
              {/* 3D Pin / Pushpin */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none">
                <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-amber-700 via-amber-900 to-zinc-950 border border-amber-600 shadow-[0_3px_6px_rgba(0,0,0,0.9)]" />
                <div className="w-1 h-1 bg-black/60 rounded-full blur-[1px]" />
              </div>

              {/* Manila Parchment Note Card */}
              <div className="bg-[#dfd7c2] text-zinc-900 rounded-sm p-4 pt-5 text-xs font-mono shadow-[0_15px_30px_rgba(0,0,0,0.7)] border border-[#c7beaa] w-52 transform rotate-1">
                {/* Underlined CASE FILE header */}
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

                {/* Stamped OPEN badge */}
                <div className="mt-3 text-right">
                  <span className="inline-block px-2 py-0.5 border-2 border-[#b91c1c] text-[#b91c1c] font-black text-[10px] tracking-widest rounded-xs transform -rotate-6 shadow-sm uppercase">
                    OPEN
                  </span>
                </div>
              </div>
            </div>

            {/* CENTERPIECE: REALISTIC 3D MAGNIFYING GLASS */}
            <div className="relative z-20 flex items-center justify-center -translate-x-6 -translate-y-2">
              {/* Glass Rim Container */}
              <div className="relative w-[310px] h-[310px] rounded-full p-2 bg-gradient-to-br from-zinc-400 via-zinc-700 to-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.95)] border-2 border-zinc-500/50">
                {/* Inner Bezel Groove */}
                <div className="w-full h-full rounded-full bg-[#0a0a0e] p-5 relative overflow-hidden flex flex-col justify-center border border-zinc-700/80 shadow-[inset_0_0_30px_rgba(0,0,0,0.9)]">
                  {/* Top-Right Curved Glass Glare Sheen Reflection */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none transform rotate-45 blur-[1px]" />
                  <div className="absolute top-2 right-6 w-24 h-12 rounded-full bg-white/10 pointer-events-none transform rotate-[-25deg] blur-[2px]" />

                  {/* UI Window inside Lens */}
                  <div className="relative z-10 bg-[#0d0d12]/90 border border-zinc-800/80 rounded-xl p-4 shadow-2xl backdrop-blur-sm">
                    {/* Window Title & Dots */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-serif italic text-[#c8b082]">
                        analyzing...
                      </span>
                      <div className="flex items-center gap-1 opacity-40">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                      </div>
                    </div>

                    {/* URL */}
                    <span className="text-base font-mono font-semibold text-white block tracking-tight mb-2.5">
                      https://example.com
                    </span>

                    {/* Gold Progress Bar */}
                    <div className="w-full h-1.5 bg-zinc-800/90 rounded-full overflow-hidden mb-3.5 border border-zinc-700/40">
                      <div className="h-full w-[58%] bg-gradient-to-r from-[#b59a68] to-[#c8b082] rounded-full shadow-[0_0_8px_#c8b082]" />
                    </div>

                    {/* Checklist */}
                    <ul className="space-y-1.5 text-[11px] text-zinc-300 font-sans">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8b082] shrink-0 shadow-[0_0_4px_#c8b082]" />
                        <span className="text-zinc-200">Collecting resources</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8b082] shrink-0 shadow-[0_0_4px_#c8b082]" />
                        <span className="text-zinc-200">Measuring performance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 shrink-0" />
                        <span className="text-zinc-400">Analyzing bottlenecks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0" />
                        <span className="text-zinc-500">Compiling evidence</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Metallic Joint / Collar Ring */}
                <div className="absolute -bottom-4 -right-2 w-10 h-8 bg-gradient-to-r from-zinc-600 via-amber-900/60 to-zinc-900 rounded-md border border-zinc-600 shadow-lg transform rotate-[-42deg] z-10" />

                {/* Wood/Bronze Handle extending to bottom right */}
                <div className="absolute -bottom-24 -right-20 w-8 h-44 bg-gradient-to-b from-amber-950 via-zinc-900 to-black rounded-b-xl border border-zinc-800 shadow-[0_20px_40px_rgba(0,0,0,0.95)] transform rotate-[-42deg] pointer-events-none -z-10" />
              </div>
            </div>

            {/* FLOATING METRIC CARDS (RIGHT SIDE) */}
            <div className="absolute right-6 bottom-8 flex flex-col gap-3.5 z-30 w-52">
              {/* Card 1: PERFORMANCE SCORE */}
              <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-xl p-4 shadow-2xl backdrop-blur-md">
                <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1.5">
                  PERFORMANCE SCORE
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#e06a3b] tracking-tight">
                    68
                  </span>
                  <span className="text-xs text-zinc-500 font-medium">/100</span>
                </div>
                <div className="text-xs font-semibold text-[#e06a3b] mt-1">
                  Needs Improvement
                </div>
              </div>

              {/* Card 2: CORE WEB VITALS */}
              <div className="bg-[#0e0e13]/95 border border-zinc-800/90 rounded-xl p-4 shadow-2xl backdrop-blur-md">
                <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-3">
                  CORE WEB VITALS
                </div>
                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">LCP</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-100 font-semibold">4.2s</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-[0_0_8px_#ef4444]" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">INP</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-100 font-semibold">391ms</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-[0_0_8px_#f59e0b]" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">CLS</span>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-100 font-semibold">0.28</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-[0_0_8px_#ef4444]" />
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
