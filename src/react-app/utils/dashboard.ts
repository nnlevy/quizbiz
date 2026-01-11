import type { AnalysisResult } from "../types";

export type AnalysisRecord = AnalysisResult & {
  id: string;
  createdAt: string;
  mode: "upload" | "manual";
};

export type SavingsPlanItem = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  source: string;
};

export type Goal = {
  id: string;
  title: string;
  target: string;
  progress: number;
};

export type Badge = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  provider: "email" | "google";
};

const ANALYSIS_HISTORY_KEY = "ws-analysis-history";
const SAVINGS_PLAN_KEY = "ws-savings-plan";
const GOALS_KEY = "ws-goals";
const BADGES_KEY = "ws-badges";
const USER_KEY = "ws-user";

const safeRead = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    if (!value) return fallback;
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const safeWrite = <T>(key: string, value: T) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write errors.
  }
};

export const getAnalysisHistory = () =>
  safeRead<AnalysisRecord[]>(ANALYSIS_HISTORY_KEY, []).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

export const saveAnalysisRecord = (record: AnalysisRecord) => {
  const history = getAnalysisHistory();
  const next = [record, ...history.filter((item) => item.id !== record.id)];
  safeWrite(ANALYSIS_HISTORY_KEY, next);
  return next;
};

export const getSavingsPlan = () => safeRead<SavingsPlanItem[]>(SAVINGS_PLAN_KEY, []);

export const addSavingsPlanItem = (item: SavingsPlanItem) => {
  const current = getSavingsPlan();
  const exists = current.some((entry) => entry.id === item.id);
  const next = exists ? current : [item, ...current];
  safeWrite(SAVINGS_PLAN_KEY, next);
  return next;
};

export const getGoals = () => safeRead<Goal[]>(GOALS_KEY, []);

export const saveGoals = (goals: Goal[]) => {
  safeWrite(GOALS_KEY, goals);
};

const defaultBadges: Badge[] = [
  {
    id: "water-iq-starter",
    title: "Water IQ Starter",
    description: "Completed the Water IQ Challenge intro round.",
    earned: true,
  },
  {
    id: "leak-patrol-scout",
    title: "Leak Patrol Scout",
    description: "Found the hidden leak in under 3 minutes.",
    earned: true,
  },
  {
    id: "conservation-champion",
    title: "Conservation Champion",
    description: "Logged 3 consecutive months of reduced usage.",
    earned: false,
  },
];

export const getBadges = () => {
  const stored = safeRead<Badge[] | null>(BADGES_KEY, null);
  if (!stored || stored.length === 0) return defaultBadges;
  return stored;
};

export const saveBadges = (badges: Badge[]) => {
  safeWrite(BADGES_KEY, badges);
};

export const getStoredUser = () => safeRead<UserProfile | null>(USER_KEY, null);

export const storeUser = (user: UserProfile) => {
  safeWrite(USER_KEY, user);
  return user;
};

export const clearUser = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(USER_KEY);
  } catch {
    // Ignore errors.
  }
};
