/**
 * Performance Detective — Client-Side Authentication & Session Manager
 */

export interface InvestigatorProfile {
  id: string;
  name: string;
  badgeId: string;
  email: string;
  rank: string;
  clearanceLevel: number;
  avatarUrl?: string;
  loggedInAt: string;
}

const STORAGE_KEY = "performance_detective_session";

export const DEFAULT_DEMO_INVESTIGATOR: InvestigatorProfile = {
  id: "inv-8492",
  name: "Sherlock Holmes",
  badgeId: "#DET-221B",
  email: "detective@agency.com",
  rank: "Chief Forensic Analyst",
  clearanceLevel: 5,
  loggedInAt: new Date().toISOString(),
};

/**
 * Retrieves the currently authenticated investigator profile from localStorage.
 */
export function getActiveSession(): InvestigatorProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as InvestigatorProfile;
  } catch {
    return null;
  }
}

/**
 * Saves an active investigator session to localStorage and dispatches a custom event.
 */
export function saveSession(profile: InvestigatorProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new Event("auth_state_changed"));
  } catch (err) {
    console.error("Failed to save investigator session", err);
  }
}

/**
 * Clears the active investigator session.
 */
export function clearSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("auth_state_changed"));
  } catch (err) {
    console.error("Failed to clear investigator session", err);
  }
}
