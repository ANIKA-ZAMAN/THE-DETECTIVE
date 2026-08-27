/**
 * GET /api/history
 * DELETE /api/history
 *
 * Provides historical scan records and metrics over time for the History and Compare pages.
 */

import { NextRequest, NextResponse } from "next/server";
import { getHistoryEntries, clearHistory } from "@/lib/history";
import type { ApiResponse, HistoryEntry } from "@/types";

export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse<HistoryEntry[]>>> {
  const { searchParams } = new URL(req.url);
  const filterUrl = searchParams.get("url") || undefined;

  const entries = getHistoryEntries(filterUrl);
  return NextResponse.json<ApiResponse<HistoryEntry[]>>({
    success: true,
    data: entries,
  });
}

export async function DELETE(): Promise<NextResponse<{ success: boolean; message: string }>> {
  clearHistory();
  return NextResponse.json({
    success: true,
    message: "History successfully cleared.",
  });
}
