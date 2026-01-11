export type AnalysisMove = {
  title: string;
  why: string;
  effort: string;
  impact: string;
  steps: string[];
  ctaLabel: string;
  ctaHref: string;
};

export type AnalysisTier = {
  name: string;
  usageLimit: string;
  rate: string;
  cost: number;
};

export type UsageHistoryPoint = {
  label: string;
  usage: number;
  cost: number;
  average: number;
};

export type AnalysisAlert = {
  id: string;
  title: string;
  detail: string;
};

export type AnalysisSummary = {
  billingPeriod: string;
  totalUsage: {
    value: number;
    unit: string;
  };
  totalCost: number;
  rateTiers: AnalysisTier[];
};

export type AnalysisResult = {
  analysisId: string;
  billingSummary: AnalysisSummary;
  usageHistory: UsageHistoryPoint[];
  alerts: AnalysisAlert[];
  savingsSummary: string;
  topMoves: AnalysisMove[];
  payingFor: string;
  nextStep: string;
  confidenceNote?: string;
};
