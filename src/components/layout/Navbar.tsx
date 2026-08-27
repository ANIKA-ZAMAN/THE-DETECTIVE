"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  Globe,
  Search,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";

export interface NavbarProps {
  /** Optional custom class name */
  className?: string;
}

function NavbarContent({ className = "" }: NavbarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState("");

  const currentUrlParam = searchParams.get("url") || "";

  // Helper to preserve active url param across tabs
  const getHref = (basePath: string) => {
    if (
      currentUrlParam &&
      (basePath === "/overview" ||
        basePath === "/admin" ||
        basePath === "/details" ||
        basePath === "/investigation")
    ) {
      return `${basePath}?url=${encodeURIComponent(currentUrlParam)}`;
    }
    return basePath;
  };

  const navItems = [
    { label: "Overview", path: "/overview" },
    { label: "Details", path: "/details" },
    { label: "Investigation", path: "/investigation" },
    { label: "Compare", path: "/compare" },
    { label: "History", path: "/history" },
  ];

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalUrl.trim()) return;
    setModalOpen(false);
    setMobileMenuOpen(false);
    router.push(`/overview?url=${encodeURIComponent(modalUrl.trim())}`);
  };

  const isItemActive = (path: string) => {
    if (path === "/investigation" || path === "/admin") {
      return pathname === "/investigation" || pathname === "/admin";
    }
    return pathname === path;
  };

  return (
    <>
      <header
        className={`w-full bg-[#070709]/90 border-b border-zinc-800/80 sticky top-0 z-50 backdrop-blur-md transition-all ${className}`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 h-18 sm:h-20 flex items-center justify-between">
          {/* Brand Logo → Home/Landing */}
          <Link href="/" className="flex items-center gap-3.5 group select-none">
            {/* Framed Fingerprint Logo Icon */}
            <div className="relative w-9 h-9 flex items-center justify-center bg-[#0d0d12] rounded-lg border border-zinc-800/90 group-hover:border-[#c8b082]/60 transition-colors shadow-sm">
              <span className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-[#c8b082]" />
              <span className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-[#c8b082]" />
              <span className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-[#c8b082]" />
              <span className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-[#c8b082]" />

              <svg
                className="w-4.5 h-4.5 text-[#c8b082] group-hover:scale-105 transition-transform"
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

            {/* Brand Title */}
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.24em] text-zinc-400 uppercase leading-tight">
                PERFORMANCE
              </span>
              <span className="text-[13px] font-black uppercase tracking-[0.18em] text-zinc-100 leading-tight">
                DETECTIVE
              </span>
            </div>
          </Link>

          {/* Clean Text-Only Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-9 text-sm font-medium tracking-wide">
            {navItems.map((item) => {
              const active = isItemActive(item.path);
              return (
                <Link
                  key={item.label}
                  href={getHref(item.path)}
                  className={`py-1.5 transition-colors ${
                    active
                      ? "text-[#c8b082] font-semibold"
                      : "text-zinc-300 hover:text-[#c8b082]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Clean Log in link + subtle Start Investigation CTA */}
          <div className="hidden sm:flex items-center gap-6">
            <Link
              href="/overview"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Log in
            </Link>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-sm font-semibold text-zinc-200 hover:text-white bg-[#0e0e14]/90 hover:bg-[#161622] border border-zinc-800 hover:border-zinc-700 transition-all shadow-sm cursor-pointer"
            >
              <span>Start Investigation</span>
              <ArrowRight className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#121218] border border-zinc-800 text-zinc-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0f] border-b border-zinc-800 px-6 py-4 space-y-3 animate-fade-up">
            <div className="space-y-1">
              {navItems.map((item) => {
                const active = isItemActive(item.path);
                return (
                  <Link
                    key={item.label}
                    href={getHref(item.path)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium ${
                      active
                        ? "bg-[#14141c] text-[#c8b082] font-semibold"
                        : "text-zinc-300 hover:bg-zinc-900"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-[#c8b082]" />}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
              <Link
                href="/overview"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-medium text-zinc-400 hover:text-white"
              >
                Log in
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-200 bg-[#121218] border border-zinc-800"
              >
                <span>Investigate</span>
                <ArrowRight className="w-3 h-3 text-zinc-400" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ────────────────── QUICK ANALYZE MODAL ────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-up">
          <div className="relative w-full max-w-lg bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#c8b082]/10 border border-[#c8b082]/30 flex items-center justify-center text-[#c8b082]">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight font-mono">
                    NEW INVESTIGATION
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Enter target URL to run deep performance audit
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Input Form */}
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-300 font-mono">
                  TARGET URL
                </label>
                <div className="flex items-center gap-2 bg-[#14141b] border border-zinc-800 focus-within:border-[#c8b082]/70 rounded-xl px-3 py-2.5 transition-colors">
                  <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    spellCheck={false}
                    value={modalUrl}
                    onChange={(e) => setModalUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-none w-full font-mono"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#c8b082] hover:bg-[#b89f71] text-zinc-950 transition-colors flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <span>Start Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function Navbar(props: NavbarProps) {
  return (
    <Suspense
      fallback={
        <header className="w-full bg-[#070709] border-b border-zinc-800/80 h-16 flex items-center px-6">
          <div className="w-32 h-6 bg-zinc-800/50 rounded animate-pulse" />
        </header>
      }
    >
      <NavbarContent {...props} />
    </Suspense>
  );
}
