/**
 * Persistent scan history store.
 * Tracks investigations so the History page and Compare page can reference previous scans.
 * Persists to a local JSON data file with automatic in-memory fallback.
 */

import fs from "fs";
import path from "path";
import type { AnalysisResult, HistoryEntry } from "@/types";

const MAX_HISTORY_ITEMS = 60;
const HISTORY_FILE_PATH = path.join(process.cwd(), ".history_store.json");

// In-memory cache
let historyStore: HistoryEntry[] = [];
let isLoaded = false;

function loadHistoryFromFile(): void {
  if (isLoaded) return;
  try {
    if (fs.existsSync(HISTORY_FILE_PATH)) {
      const data = fs.readFileSync(HISTORY_FILE_PATH, "utf-8");
      historyStore = JSON.parse(data);
    }
  } catch (err) {
    console.warn("[history] Could not read history file, using in-memory store:", err);
  }
  isLoaded = true;
}

function persistHistoryToFile(): void {
  try {
    fs.writeFileSync(HISTORY_FILE_PATH, JSON.stringify(historyStore, null, 2), "utf-8");
  } catch (err) {
    console.warn("[history] Could not write history file:", err);
  }
}

/**
 * Records an analysis result into the persistent history store.
 * Returns the created HistoryEntry.
 */
export function addHistoryEntry(result: AnalysisResult): HistoryEntry {
  loadHistoryFromFile();

  const entry: HistoryEntry = {
    id: `HIST-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    caseId: result.caseId,
    targetUrl: result.targetUrl,
    normalizedUrl: result.normalizedUrl,
    investigatedAt: result.investigatedAt,
    timestamp: Date.now(),
    overallHealthScore: result.overallHealthScore,
    categoryScores: { ...result.categoryScores },
    metrics: {
      ttfbMs: result.metrics.ttfbMs,
      fcpSec: result.metrics.fcpSec,
      lcpSec: result.metrics.lcpSec,
      inpMs: result.metrics.inpMs,
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

  persistHistoryToFile();

  return entry;
}

/**
 * Retrieves all scan history, optionally filtered by a target URL / domain.
 */
export function getHistoryEntries(filterUrl?: string): HistoryEntry[] {
  loadHistoryFromFile();

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
  loadHistoryFromFile();
  historyStore = [];
  persistHistoryToFile();
}
