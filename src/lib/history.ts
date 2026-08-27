/**
 * In-memory scan history store.
 * Tracks investigations so the History page and Compare page can reference previous scans.
 * Safe across API calls in the same server runtime.
 */

import type { AnalysisResult, HistoryEntry } from "@/types";

const MAX_HISTORY_ITEMS = 50;

// Module-level array stores recent scan summaries
const historyStore: HistoryEntry[] = [];

/**
 * Records an analysis result into the history store.
 * Returns the created HistoryEntry.
 */
export function addHistoryEntry(result: AnalysisResult): HistoryEntry {
  const entry: HistoryEntry = {
    id: `HIST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    caseId: result.caseId,
    targetUrl: result.targetUrl,
    normalizedUrl: result.normalizedUrl,
    investigatedAt: result.investigatedAt,
    overallHealthScore: result.overallHealthScore,
    categoryScores: { ...result.categoryScores },
    metrics: {
      ttfbMs: result.metrics.ttfbMs,
      fcpSec: result.metrics.fcpSec,
      lcpSec: result.metrics.lcpSec,
      cls: result.metrics.cls,
      pageSizeKb: result.metrics.pageSizeKb,
      requestsCount: result.metrics.requestsCount,
    },
  };

  // Prepend to array
  historyStore.unshift(entry);

  // Keep size bounded
  if (historyStore.length > MAX_HISTORY_ITEMS) {
    historyStore.pop();
  }

  return entry;
}

/**
 * Retrieves all scan history, optionally filtered by a target URL / domain.
 */
export function getHistoryEntries(filterUrl?: string): HistoryEntry[] {
  if (!filterUrl) {
    return [...historyStore];
  }

  const query = filterUrl.toLowerCase().trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  return historyStore.filter((item) => {
    const itemNorm = item.normalizedUrl.toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    return itemNorm.includes(query) || item.targetUrl.toLowerCase().includes(query);
  });
}

/**
 * Clears all stored scan history.
 */
export function clearHistory(): void {
  historyStore.length = 0;
}
