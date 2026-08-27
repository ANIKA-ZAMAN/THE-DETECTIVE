"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Key,
  UserCheck,
} from "lucide-react";
import { saveSession, DEFAULT_DEMO_INVESTIGATOR, getActiveSession, InvestigatorProfile } from "@/lib/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/overview";

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check if already logged in
  useEffect(() => {
    const existing = getActiveSession();
    if (existing) {
      setSuccessMsg(`Welcome back, ${existing.name}! Redirecting...`);
      const timer = setTimeout(() => {
        router.push(redirectUrl);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [router, redirectUrl]);

  const handleDemoFill = () => {
    setIdentifier("detective@agency.com");
    setPassword("baker-street-221b");
    setError(null);
  };

  const handleGuestLogin = () => {
    setLoading(true);
    setError(null);

    const guestProfile: InvestigatorProfile = {
      id: `guest-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "Guest Detective",
      badgeId: `#GUEST-${Math.floor(100 + Math.random() * 900)}`,
      email: "guest@performance-detective.internal",
      rank: "Field Analyst (Guest Access)",
      clearanceLevel: 1,
      loggedInAt: new Date().toISOString(),
    };

    setTimeout(() => {
      saveSession(guestProfile);
      setSuccessMsg("Guest clearance granted. Accessing case files...");
      setTimeout(() => {
        router.push(redirectUrl);
      }, 700);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError("Please provide your investigator email or badge ID.");
      return;
    }
    if (!password || password.length < 4) {
      setError("Passcode must be at least 4 characters.");
      return;
    }

    setLoading(true);

    // Realistic authentication verification sequence
    setTimeout(() => {
      let displayName = identifier.split("@")[0];
      displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
      if (mode === "signup" && name.trim()) {
        displayName = name.trim();
      } else if (identifier.includes("detective") || identifier.includes("221b")) {
        displayName = "Sherlock Holmes";
      }

      const profile: InvestigatorProfile = {
        id: `det-${Math.floor(1000 + Math.random() * 9000)}`,
        name: displayName,
        badgeId: `#DET-${Math.floor(1000 + Math.random() * 9000)}`,
        email: identifier.includes("@") ? identifier.trim() : `${identifier.trim()}@agency.internal`,
        rank: mode === "signup" ? "Junior Forensic Inspector" : "Senior Performance Detective",
        clearanceLevel: 4,
        loggedInAt: new Date().toISOString(),
      };

      saveSession(profile);
      setLoading(false);
      setSuccessMsg(
        mode === "signup"
          ? "Investigator badge issued! Redirecting..."
          : `Identity verified: Detective ${displayName}. Accessing case room...`
      );

      setTimeout(() => {
        router.push(redirectUrl);
      }, 800);
    }, 850);
  };

  return (
    <div
      className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col justify-between relative overflow-x-hidden"
      style={{
        backgroundImage: "url('/elements/texture.svg'), radial-gradient(circle at 50% 35%, rgba(200,176,130,0.08) 0%, rgba(7,7,9,0) 70%)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover, cover",
        backgroundPosition: "center top, center",
      }}
    >
      {/* ────────────────── TOP NAVBAR ────────────────── */}
      <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 h-18 sm:h-20 flex items-center justify-between z-30 shrink-0 border-b border-zinc-850/60">
        <Link href="/" className="flex items-center gap-3.5 group select-none">
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

          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-[0.24em] text-zinc-400 uppercase leading-tight">
              PERFORMANCE
            </span>
            <span className="text-[13px] font-black uppercase tracking-[0.18em] text-zinc-100 leading-tight">
              DETECTIVE
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-mono text-zinc-400 hover:text-[#c8b082] transition-colors flex items-center gap-1.5"
        >
          <span>Return Home</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* ────────────────── MAIN LOGIN CARD ────────────────── */}
      <main className="w-full max-w-md mx-auto px-6 py-10 z-20 flex-1 flex items-center">
        <div className="w-full bg-[#0c0c11]/95 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl relative">
          {/* Top Dossier Header */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#14141c] border border-[#c8b082]/40 text-[#c8b082] mb-1 shadow-lg shadow-[#c8b082]/5">
              <Shield className="w-6 h-6" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white uppercase">
              {mode === "login" ? "INVESTIGATOR ACCESS" : "REGISTER BADGE"}
            </h1>
            <p className="text-xs text-zinc-400 max-w-xs mx-auto">
              {mode === "login"
                ? "Enter your security credentials to access forensic case files and telemetry data."
                : "Create your detective profile to save investigations and track performance over time."}
            </p>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#121218] border border-zinc-800 rounded-xl text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-[#c8b082] text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                mode === "signup"
                  ? "bg-[#c8b082] text-zinc-950 shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-950/50 border border-red-800/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-200 animate-fade-up">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="bg-emerald-950/50 border border-emerald-800/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-200 animate-fade-up">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-300 block">
                  INVESTIGATOR FULL NAME
                </label>
                <div className="flex items-center gap-2.5 bg-[#14141c] border border-zinc-800 focus-within:border-[#c8b082]/80 rounded-xl px-3.5 py-2.5 transition-colors">
                  <UserCheck className="w-4 h-4 text-zinc-500 shrink-0" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    spellCheck={false}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Detective Holmes"
                    className="bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-none w-full"
                  />
                </div>
              </div>
            )}

            {/* Email / Badge ID Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-zinc-300 block">
                {mode === "login" ? "EMAIL OR BADGE ID" : "WORK EMAIL"}
              </label>
              <div className="flex items-center gap-2.5 bg-[#14141c] border border-zinc-800 focus-within:border-[#c8b082]/80 rounded-xl px-3.5 py-2.5 transition-colors">
                <Mail className="w-4 h-4 text-zinc-500 shrink-0" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  spellCheck={false}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={mode === "login" ? "detective@agency.com or #DET-221B" : "you@company.com"}
                  className="bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-none w-full"
                />
              </div>
            </div>

            {/* Passcode Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-zinc-300">
                  SECURITY KEY / PASSCODE
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={handleDemoFill}
                    className="text-[10px] text-[#c8b082] hover:underline cursor-pointer"
                  >
                    Use Demo Account
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2.5 bg-[#14141c] border border-zinc-800 focus-within:border-[#c8b082]/80 rounded-xl px-3.5 py-2.5 transition-colors">
                <Lock className="w-4 h-4 text-zinc-500 shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  spellCheck={false}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="bg-transparent text-xs text-zinc-100 placeholder-zinc-500 outline-none w-full"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 text-zinc-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 text-[#c8b082] focus:ring-0 accent-[#c8b082]"
                />
                <span>Remember this terminal</span>
              </label>

              <span className="text-[11px] text-zinc-500 font-mono">256-bit TLS</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c8b082] hover:bg-[#b89f71] disabled:opacity-50 text-zinc-950 font-bold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#c8b082]/15 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>{mode === "login" ? "Authorize & Enter Case Room" : "Create Investigator Badge"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Guest Access Divider */}
          <div className="pt-2 border-t border-zinc-800/80 text-center space-y-3">
            <div className="flex items-center gap-3 text-zinc-600 text-xs font-mono">
              <span className="flex-1 h-px bg-zinc-800" />
              <span>OR</span>
              <span className="flex-1 h-px bg-zinc-800" />
            </div>

            <button
              type="button"
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#14141c] hover:bg-[#1a1a24] border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-mono font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Key className="w-3.5 h-3.5 text-[#c8b082]" />
              <span>Continue as Guest Detective (1-Click)</span>
            </button>
          </div>
        </div>
      </main>

      {/* ────────────────── BOTTOM FOOTER ────────────────── */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-[11px] font-mono text-zinc-500 z-20">
        Performance Detective Security Perimeter • Clearance Protocol v2.4
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070709] text-zinc-100 flex items-center justify-center">
          <RefreshCw className="w-6 h-6 animate-spin text-[#c8b082]" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
