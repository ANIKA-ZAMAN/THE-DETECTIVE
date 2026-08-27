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
  Activity,
  Layers,
  FileSearch,
  Scale,
  History as HistoryIcon,
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
    { label: "Overview", path: "/overview", icon: Activity },
    { label: "Details", path: "/details", icon: Layers },
    { label: "Investigation", path: "/admin", icon: FileSearch },
    { label: "Compare", path: "/compare", icon: Scale },
    { label: "History", path: "/history", icon: HistoryIcon },
  ];

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalUrl.trim()) return;
    setModalOpen(false);
    setMobileMenuOpen(false);
    router.push(`/overview?url=${encodeURIComponent(modalUrl.trim())}`);
  };

  const isItemActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin" || pathname === "/investigation";
    }
    return pathname === path;
  };

  return (
    <>
      <header
        className={`w-full bg-[#0a0a0f]/95 border-b border-zinc-800/80 sticky top-0 z-50 backdrop-blur-md transition-all ${className}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Brand Logo → Home/Landing */}
          <Link href="/" className="flex items-center gap-3 group select-none">
            {/* Framed Fingerprint Logo Icon */}
            <div className="relative w-8 h-8 flex items-center justify-center bg-[#101014] rounded border border-zinc-800/90 group-hover:border-[#c8b082]/60 transition-colors shadow-sm">
              <span className="absolute top-0.5 left-0.5 w-1 h-1 border-t border-l border-[#c8b082]" />
              <span className="absolute top-0.5 right-0.5 w-1 h-1 border-t border-r border-[#c8b082]" />
              <span className="absolute bottom-0.5 left-0.5 w-1 h-1 border-b border-l border-[#c8b082]" />
              <span className="absolute bottom-0.5 right-0.5 w-1 h-1 border-b border-r border-[#c8b082]" />

              <svg
                className="w-4 h-4 text-[#c8b082] group-hover:scale-105 transition-transform"
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

            {/* Brand Title */}
            <div className="flex flex-col">
              <span className="text-[9px] font-bold tracking-[0.2em] text-[#c8b082] uppercase leading-tight">
                PERFORMANCE
              </span>
              <span className="text-xs font-extrabold uppercase tracking-[0.16em] text-zinc-100 leading-tight">
                DETECTIVE
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#101015] p-1 rounded-xl border border-zinc-800/80">
            {navItems.map((item) => {
              const active = isItemActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={getHref(item.path)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all relative ${
                    active
                      ? "bg-[#c8b082] text-zinc-950 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? "text-zinc-950" : "text-zinc-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Analyze URL CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#c8b082] hover:bg-[#b89f71] text-zinc-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-[0_2px_12px_rgba(200,176,130,0.25)] hover:shadow-[0_4px_18px_rgba(200,176,130,0.4)] active:scale-95 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Analyze URL</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-80" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setModalOpen(true)}
              className="p-2 rounded-lg bg-[#121218] border border-zinc-800 text-[#c8b082]"
              title="Quick Analyze"
            >
              <Search className="w-4 h-4" />
            </button>
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
          <div className="md:hidden bg-[#0a0a0f] border-b border-zinc-800 px-6 py-4 space-y-3 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="space-y-1">
              {navItems.map((item) => {
                const active = isItemActive(item.path);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={getHref(item.path)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold ${
                      active
                        ? "bg-[#c8b082] text-zinc-950"
                        : "text-zinc-300 hover:bg-zinc-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {active && <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-zinc-800/80">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setModalOpen(true);
                }}
                className="w-full bg-[#c8b082] text-zinc-950 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2 shadow cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Analyze URL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ────────────────── QUICK ANALYZE MODAL ────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#0e0e13] border border-zinc-800/90 rounded-2xl p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#c8b082]/10 border border-[#c8b082]/30 flex items-center justify-center text-[#c8b082]">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">Initiate Web Investigation</h3>
                  <p className="text-[11px] text-zinc-400">Enter any website URL to run live diagnostic probes</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-400">Target Web Address</label>
                <div className="flex items-center gap-2 bg-[#14141b] border border-zinc-700/80 rounded-xl px-3 py-2 focus-within:border-[#c8b082] transition-colors">
                  <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                  <input
                    type="text"
                    value={modalUrl}
                    onChange={(e) => setModalUrl(e.target.value)}
                    placeholder="https://yourwebsite.com or example.com"
                    autoFocus
                    className="w-full bg-transparent text-xs text-white placeholder-zinc-500 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-900 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!modalUrl.trim()}
                  className="bg-[#c8b082] hover:bg-[#b89f71] disabled:opacity-50 text-zinc-950 font-bold text-xs px-5 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow cursor-pointer"
                >
                  <span>Begin Investigation</span>
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
    <Suspense fallback={<div className="w-full h-16 bg-[#0a0a0f]/95 border-b border-zinc-800/80" />}>
      <NavbarContent {...props} />
    </Suspense>
  );
}
