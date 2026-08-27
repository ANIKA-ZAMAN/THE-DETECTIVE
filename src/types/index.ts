/**
 * Shared TypeScript interfaces for Performance Detective.
 * Safe to import from client components and server-side route handlers alike.
 */

export interface FaultItem {
  id: string;
  title: string;
  category: "Performance" | "SEO" | "Security" | "Accessibility" | "Best Practices";
  impact: "Critical" | "Warning" | "Info";
  description: string;
  recommendation: string;
  clueCode?: string;
}

export interface WaterfallItem {
  id: string;
  url: string;
  filename: string;
  type: "document" | "script" | "stylesheet" | "image" | "font" | "media" | "other";
  status: number;
  sizeKb: number;
  ttfbMs: number;
  durationMs: number;
  isRenderBlocking: boolean;
  isThirdParty: boolean;
  domain: string;
}

export interface ThirdPartyResource {
  domain: string;
  category: "Analytics" | "CDN" | "Ads" | "Social" | "Fonts" | "Utility" | "Other";
  requestCount: number;
  sizeKb: number;
  urls: string[];
}

export interface OpportunityItem {
  id: string;
  title: string;
  description: string;
  savingsKb?: number;
  savingsMs?: number;
  impact: "High" | "Medium" | "Low";
}

export interface MetricsSummary {
  ttfbMs: number;
  fcpSec: number;
  lcpSec: number;
  inpMs: number;
  tbtMs: number;
  cls: number;
  speedIndex?: number;
  pageSizeKb: number;
  requestsCount: number;
  domNodesCount: number;
}

export interface ResourceBreakdown {
  htmlKb: number;
  jsKb: number;
  cssKb: number;
  imageKb: number;
  fontKb: number;
  otherKb: number;
  thirdPartyCount: number;
  counts: {
    html: number;
    js: number;
    css: number;
    image: number;
    font: number;
    other: number;
    thirdParty: number;
  };
}

export interface AnalysisResult {
  caseId: string;
  targetUrl: string;
  normalizedUrl: string;
  investigatedAt: string;
  overallHealthScore: number;
  categoryScores: {
    performance: number;
    seo: number;
    security: number;
    accessibility: number;
  };
  metrics: MetricsSummary;
  resourceBreakdown: ResourceBreakdown;
  thirdPartyResources: ThirdPartyResource[];
  opportunities: OpportunityItem[];
  waterfall: WaterfallItem[];
  faults: FaultItem[];
}

export interface HistoryEntry {
  id: string;
  caseId: string;
  targetUrl: string;
  normalizedUrl: string;
  investigatedAt: string;
  overallHealthScore: number;
  categoryScores: {
    performance: number;
    seo: number;
    security: number;
    accessibility: number;
  };
  metrics: {
    ttfbMs: number;
    fcpSec: number;
    lcpSec: number;
    cls: number;
    pageSizeKb: number;
    requestsCount: number;
  };
}

export interface CompareSummary {
  bestOverall: string;
  fastestTTFB: string;
  smallestPayload: string;
  scoresDiff: Record<string, number>;
}

export interface CompareResult {
  sites: AnalysisResult[];
  summary: CompareSummary;
}

// API Response Models
export interface ApiSuccessResponse<T = AnalysisResult> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T = AnalysisResult> = ApiSuccessResponse<T> | ApiErrorResponse;
