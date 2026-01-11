import type { AnalysisResult } from "../types";
import type { AnalysisRecord } from "./dashboard";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((entry) => isNonEmptyString(entry));

const isAnalysisMove = (value: unknown): boolean => {
  if (!value || typeof value !== "object") return false;
  const move = value as Record<string, unknown>;
  return (
    isNonEmptyString(move.title) &&
    isNonEmptyString(move.why) &&
    isNonEmptyString(move.effort) &&
    isNonEmptyString(move.impact) &&
    isStringArray(move.steps) &&
    isNonEmptyString(move.ctaLabel) &&
    isNonEmptyString(move.ctaHref)
  );
};

export const isAnalysisResult = (value: unknown): value is AnalysisResult => {
  if (!value || typeof value !== "object") return false;
  const result = value as Record<string, unknown>;
  const billingSummary = result.billingSummary as Record<string, unknown> | undefined;
  const totalUsage = billingSummary?.totalUsage as Record<string, unknown> | undefined;

  return (
    isNonEmptyString(result.analysisId) &&
    Array.isArray(result.topMoves) &&
    result.topMoves.length === 3 &&
    result.topMoves.every((move) => isAnalysisMove(move)) &&
    isNonEmptyString(result.payingFor) &&
    isNonEmptyString(result.nextStep) &&
    isNonEmptyString(result.savingsSummary) &&
    Array.isArray(result.alerts) &&
    Array.isArray(result.usageHistory) &&
    Array.isArray(billingSummary?.rateTiers) &&
    isNonEmptyString(billingSummary?.billingPeriod) &&
    isNumber(totalUsage?.value) &&
    isNonEmptyString(totalUsage?.unit) &&
    isNumber(billingSummary?.totalCost)
  );
};

export const toAnalysisRecord = (analysis: AnalysisResult, mode: "upload" | "manual"): AnalysisRecord => ({
  ...analysis,
  id: analysis.analysisId,
  createdAt: new Date().toISOString(),
  mode,
});
