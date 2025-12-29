export type AnalysisMove = {
  title: string;
  why: string;
  effort: string;
  impact: string;
  steps: string[];
  ctaLabel: string;
  ctaHref: string;
};

export type AnalysisResult = {
  topMoves: AnalysisMove[];
  payingFor: string;
  nextStep: string;
  confidenceNote?: string;
};
