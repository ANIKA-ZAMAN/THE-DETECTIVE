"use client";

import React, { Suspense } from "react";
import { RefreshCw } from "lucide-react";
import { InvestigationContent } from "@/app/admin/page";

export default function InvestigationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070709] text-zinc-400 p-8 flex items-center justify-center">
          <div className="flex items-center gap-3 text-sm">
            <RefreshCw className="w-5 h-5 animate-spin text-[#c8b082]" />
            <span>Loading Investigation Dossier...</span>
          </div>
        </div>
      }
    >
      <InvestigationContent />
    </Suspense>
  );
}
