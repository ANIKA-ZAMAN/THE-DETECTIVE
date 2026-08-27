/**
 * Shared TypeScript interfaces for the Performance Detective analysis engine.
 * Kept separate from server logic so client components can safely import types
 * without pulling in server-only code (fetch, Node APIs, etc.).
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
  metrics: {
    ttfbMs: number;
    lcpSec: number;
    inpMs: number;
    cls: number;
    pageSizeKb: number;
    requestsCount: number;
    domNodesCount: number;
  };
  resourceBreakdown: {
    htmlKb: number;
    jsKb: number;
    cssKb: number;
    imageKb: number;
    thirdPartyCount: number;
  };
  faults: FaultItem[];
}

export interface ApiSuccessResponse {
  success: true;
  data: AnalysisResult;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;
