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
      <main className="w-full max-w-7xl mx-auto px-6 py-6 my-auto z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-5 flex flex-col items-start">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-[#c8b082] uppercase mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c8b082] inline-block shadow-[0_0_8px_#c8b082]" />
              WEB PERFORMANCE INVESTIGATION
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] leading-[1.08] tracking-tight font-extrabold text-white mb-6">
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
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md mb-8 font-normal">
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
          <div className="lg:col-span-7 relative w-full h-[520px] rounded-2xl border border-zinc-800/80 bg-[#08080c] overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Dark Canvas Ambient Background Graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#08080c] to-[#08080c]" />

            {/* Faint Background Noir Grid & Code Snippets */}
            <div className="absolute inset-0 opacity-20 pointer-events-none p-6 font-mono text-[10px] text-[#9a8662] space-y-4 overflow-hidden select-none">
              <div>&lt;header class=&quot;site-header&quot;&gt;</div>
              <div className="pl-4">&lt;img src=&quot;hero.jpg&quot; srcSet=&quot;...&quot; /&gt;</div>
              <div className="pl-4">&lt;script src=&quot;tracking.js&quot; async&gt;&lt;/script&gt;</div>
              <div>&lt;/header&gt;</div>
              <div className="pt-8 pl-12 text-zinc-700">/* Performance audit timeline traces */</div>
            </div>

            {/* Glowing Golden Node Graph Lines & Pins */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <line x1="260" y1="110" x2="330" y2="200" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="220" y1="280" x2="310" y2="240" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="270" y1="410" x2="350" y2="300" stroke="#c8b082" strokeWidth="1" strokeDasharray="3 3" />
            </svg>

            {/* Node Tag 1 (Top Middle) */}
            <div className="absolute top-16 left-[44%] -translate-x-1/2 bg-[#121217]/90 border border-zinc-800/90 rounded-lg px-3 py-1.5 text-[11px] backdrop-blur-md shadow-lg flex items-center gap-2 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_6px_#c8b082]" />
              <span className="text-zinc-300 font-medium">Render Blocking</span>
              <span className="text-zinc-500 text-[10px]">Potential Cause</span>
            </div>

            {/* Node Tag 2 (Left) */}
            <div className="absolute top-[260px] left-8 bg-[#121217]/90 border border-zinc-800/90 rounded-lg px-3 py-1.5 text-[11px] backdrop-blur-md shadow-lg flex items-center gap-2 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_6px_#c8b082]" />
              <span className="text-zinc-300 font-medium">Large Image</span>
              <span className="text-zinc-500 text-[10px]">High Impact</span>
            </div>

            {/* Node Tag 3 (Bottom) */}
            <div className="absolute bottom-12 left-[36%] bg-[#121217]/90 border border-zinc-800/90 rounded-lg px-3 py-1.5 text-[11px] backdrop-blur-md shadow-lg flex items-center gap-2 z-10">
              <span className="w-2 h-2 rounded-full bg-[#c8b082] shadow-[0_0_6px_#c8b082]" />
              <span className="text-zinc-300 font-medium">Third Party Script</span>
              <span className="text-zinc-500 text-[10px]">Medium Impact</span>
            </div>

            {/* Top Right Manila CASE FILE #0001 Tag */}
            <div className="absolute top-6 right-6 bg-[#ebe4d4] text-zinc-900 rounded p-3 text-[11px] font-mono shadow-2xl border border-[#d3cbb9] w-48 z-20 select-none rotate-1">
              <div className="flex items-center justify-between border-b border-zinc-400/50 pb-1.5 mb-2">
                <span className="font-bold tracking-wider text-zinc-900">CASE FILE</span>
                <span className="text-zinc-600 font-semibold">#0001</span>
              </div>
              <div className="space-y-0.5 text-[10px] text-zinc-800">
                <div className="font-semibold text-zinc-900">example.com</div>
                <div className="text-zinc-600 text-[9px]">Investigated on</div>
                <div className="text-zinc-700">May 21, 2024</div>
              </div>
              <div className="mt-2 text-right">
                <span className="inline-block px-1.5 py-0.5 border border-[#b91c1c] text-[#b91c1c] font-bold text-[9px] tracking-widest rounded-xs transform -rotate-3">
                  OPEN
                </span>
              </div>
            </div>

            {/* CENTERPIECE: MAGNIFYING GLASS */}
            <div className="relative z-20 flex items-center justify-center">
              {/* Outer Magnifying Glass Frame */}
              <div className="relative w-[280px] h-[280px] rounded-full p-1 bg-gradient-to-br from-zinc-500 via-zinc-800 to-zinc-950 shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-zinc-600/40">
                {/* Metallic Lens Ring */}
                <div className="w-full h-full rounded-full bg-[#0b0b0f] p-5 relative overflow-hidden flex flex-col justify-center border border-zinc-700/60 magnifier-lens-glow">
                  {/* Subtle fingerprint watermark inside lens */}
                  <svg
                    className="absolute inset-0 w-full h-full text-[#c8b082]/[0.05] pointer-events-none scale-125 transform translate-y-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                    <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                    <path d="M17.29 21.02c.12-.6.43-2.3.43-5.02 0-3.04-1.28-5.32-3.72-6.49" />
                    <path d="M7 11.23a4 4 0 0 1 7.24-2.22" />
                    <path d="M6 15c.34 2.87 1.5 5.5 2 6" />
                    <path d="M9 6.8a6 6 0 0 1 9 4.2c0 2.66.5 6 1 7" />
                    <path d="M12 2a10 10 0 0 0-8 10c0 3.51.5 7 1.5 10" />
                  </svg>

                  {/* Inside Lens Text Content */}
                  <div className="relative z-10 space-y-2.5">
                    <span className="text-[11px] font-serif italic text-[#c8b082] block">
                      analyzing...
                    </span>
                    <span className="text-base font-mono font-semibold text-white block tracking-tight">
                      https://example.com
                    </span>

                    {/* Status checklist */}
                    <ul className="space-y-1.5 text-[11px] text-zinc-300 font-sans pt-1">
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8b082] shrink-0" />
                        <span>Collecting resources</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8b082] shrink-0" />
                        <span>Measuring performance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8b082] shrink-0" />
                        <span>Analyzing bottlenecks</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c8b082] shrink-0" />
                        <span>Compiling evidence</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Glass Handle extending down-right */}
                <div className="absolute -bottom-20 -right-16 w-6 h-36 bg-gradient-to-b from-zinc-700 via-zinc-900 to-black rounded-full border border-zinc-700 shadow-2xl transform rotate-[-40deg] pointer-events-none -z-10" />
              </div>
            </div>

            {/* FLOATING METRIC CARDS (RIGHT SIDE) */}
            <div className="absolute right-6 bottom-6 flex flex-col gap-3 z-30 w-48">
              {/* Card 1: PERFORMANCE SCORE */}
              <div className="bg-[#0f0f14]/95 border border-zinc-800/90 rounded-xl p-3.5 shadow-2xl backdrop-blur-md">
                <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-1">
                  PERFORMANCE SCORE
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#e06a3b]">68</span>
                  <span className="text-xs text-zinc-500 font-medium">/100</span>
                </div>
                <div className="text-[11px] font-semibold text-[#e06a3b] mt-0.5">
                  Needs Improvement
                </div>
              </div>

              {/* Card 2: CORE WEB VITALS */}
              <div className="bg-[#0f0f14]/95 border border-zinc-800/90 rounded-xl p-3.5 shadow-2xl backdrop-blur-md">
                <div className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase mb-2">
                  CORE WEB VITALS
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between font-mono">
                    <span className="text-zinc-400">LCP</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-100 font-semibold">4.2s</span>
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block shadow-[0_0_6px_#ef4444]" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-mono">
                    <span className="text-zinc-400">INP</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-100 font-semibold">391ms</span>
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block shadow-[0_0_6px_#f59e0b]" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-mono">
                    <span className="text-zinc-400">CLS</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-zinc-100 font-semibold">0.28</span>
                      <span className="w-2 h-2 rounded-full bg-red-500 inline-block shadow-[0_0_6px_#ef4444]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ----------------- BOTTOM FEATURE GRID (4 COLUMNS) ----------------- */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 z-20">
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
