"use client";

import React, { useState, useEffect } from "react";
import {
  Share2,
  Copy,
  Check,
  X,
  Globe,
  Printer,
  Mail,
  ExternalLink,
  FileText,
  Shield,
} from "lucide-react";

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl: string;
  caseId: string;
  score: number;
  metrics?: {
    lcpSec?: number;
    ttfbMs?: number;
    pageSizeKb?: number;
  };
}

export function ShareModal({
  isOpen,
  onClose,
  targetUrl,
  caseId,
  score,
  metrics,
}: ShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const scoreVerdict = score >= 90 ? "Good" : score >= 50 ? "Needs Improvement" : "Poor";
  const scoreColor = score >= 90 ? "#4ade80" : score >= 50 ? "#f59e0b" : "#f87171";

  const shareTitle = `Performance Detective Investigation — ${caseId}`;
  const shareText = `Forensic audit report for ${targetUrl}: Overall Performance Score ${score}/100 (${scoreVerdict}). Investigated with Performance Detective.`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl || window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleCopyMarkdown = async () => {
    const md = `### 🕵️ Performance Detective Audit Dossier
- **Case ID**: \`${caseId || "#CASE-AUDIT"}\`
- **Target URL**: [${targetUrl}](${targetUrl})
- **Performance Score**: **${score}/100** (${scoreVerdict})
${metrics?.lcpSec !== undefined ? `- **Largest Contentful Paint (LCP)**: \`${metrics.lcpSec}s\`` : ""}
${metrics?.ttfbMs !== undefined ? `- **Origin TTFB**: \`${metrics.ttfbMs}ms\`` : ""}
${metrics?.pageSizeKb !== undefined ? `- **Payload Wire Transfer**: \`${metrics.pageSizeKb} KB\`` : ""}
- **Report Link**: [View Full Investigation](${currentUrl || window.location.href})`;

    try {
      await navigator.clipboard.writeText(md);
      setCopiedMarkdown(true);
      setTimeout(() => setCopiedMarkdown(false), 2200);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl || window.location.href,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(currentUrl || window.location.href)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      currentUrl || window.location.href
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareEmail = () => {
    const mailto = `mailto:?subject=${encodeURIComponent(
      shareTitle
    )}&body=${encodeURIComponent(`${shareText}\n\nView complete forensic report: ${currentUrl || window.location.href}`)}`;
    window.location.href = mailto;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-up">
      <div className="relative w-full max-w-lg bg-[#0e0e14] border border-zinc-800/90 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 text-zinc-100 font-mono">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#c8b082]/10 border border-[#c8b082]/30 flex items-center justify-center text-[#c8b082]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight uppercase">
                SHARE INVESTIGATION REPORT
              </h3>
              <p className="text-[11px] text-zinc-400 font-sans">
                Export and distribute forensic case file findings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mini Case Dossier Preview Box */}
        <div className="bg-[#14141c] border border-zinc-800/90 rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded bg-[#dfd7c2] text-zinc-950 text-[10px] font-black tracking-widest uppercase border border-[#c7beaa]">
              {caseId || "#CASE-AUDIT"}
            </span>
            <div className="flex items-baseline gap-1 text-xs">
              <span className="text-zinc-400 text-[10px]">SCORE:</span>
              <strong className="font-black text-sm" style={{ color: scoreColor }}>
                {score}/100
              </strong>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-white truncate">
            <Globe className="w-3.5 h-3.5 text-[#c8b082] shrink-0" />
            <span className="truncate">{targetUrl || "https://example.com"}</span>
          </div>

          {metrics && (
            <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] border-t border-zinc-800/60 text-zinc-400">
              <div>
                <span>LCP: </span>
                <strong className="text-white">{metrics.lcpSec ?? 0}s</strong>
              </div>
              <div>
                <span>TTFB: </span>
                <strong className="text-white">{metrics.ttfbMs ?? 0}ms</strong>
              </div>
              <div>
                <span>SIZE: </span>
                <strong className="text-white">{metrics.pageSizeKb ?? 0}KB</strong>
              </div>
            </div>
          )}
        </div>

        {/* 1-Click Copy Link Box */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-zinc-300 tracking-wider uppercase block">
            DIRECT REPORT URL
          </label>
          <div className="flex items-center gap-2 bg-[#121218] border border-zinc-800 focus-within:border-[#c8b082]/70 rounded-xl px-3 py-2">
            <input
              type="text"
              readOnly
              value={currentUrl}
              className="bg-transparent text-xs text-zinc-300 outline-none w-full font-mono truncate select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                copiedLink
                  ? "bg-emerald-500 text-zinc-950 shadow-md"
                  : "bg-[#c8b082] hover:bg-[#b89f71] text-zinc-950"
              }`}
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Social & Export Actions Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {/* X / Twitter */}
          <button
            type="button"
            onClick={handleShareTwitter}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#14141c] hover:bg-[#1a1a24] border border-zinc-800 hover:border-zinc-700 transition-colors text-zinc-300 hover:text-white gap-1.5 cursor-pointer text-center"
          >
            <span className="text-sm font-bold">𝕏</span>
            <span className="text-[10px] font-sans">Share to X</span>
          </button>

          {/* LinkedIn */}
          <button
            type="button"
            onClick={handleShareLinkedIn}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#14141c] hover:bg-[#1a1a24] border border-zinc-800 hover:border-zinc-700 transition-colors text-zinc-300 hover:text-white gap-1.5 cursor-pointer text-center"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#0077b5]" />
            <span className="text-[10px] font-sans">LinkedIn</span>
          </button>

          {/* Email */}
          <button
            type="button"
            onClick={handleShareEmail}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#14141c] hover:bg-[#1a1a24] border border-zinc-800 hover:border-zinc-700 transition-colors text-zinc-300 hover:text-white gap-1.5 cursor-pointer text-center"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-sans">Email</span>
          </button>

          {/* Print PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#14141c] hover:bg-[#1a1a24] border border-zinc-800 hover:border-zinc-700 transition-colors text-zinc-300 hover:text-white gap-1.5 cursor-pointer text-center"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-sans">Print / PDF</span>
          </button>
        </div>

        {/* Secondary Action: Copy Markdown Dossier */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className={`text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              copiedMarkdown ? "text-emerald-400 font-bold" : "text-zinc-400 hover:text-[#c8b082]"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{copiedMarkdown ? "Markdown Dossier Copied!" : "Copy Markdown Summary (Jira/Slack)"}</span>
          </button>

          {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="text-xs text-[#c8b082] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>System Share</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
