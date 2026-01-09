import { FLOW, QUESTIONS, COPY, IMPACT_STATS, WATER_IQ_VERSION } from "./waterIq";

export type AuditCheck = { id: string; pass: boolean; detail: string };

export function runWaterIqAudit(): { version: number; checks: AuditCheck[]; pass: boolean } {
  const checks: AuditCheck[] = [];

  const questionCount = QUESTIONS.length;
  checks.push({
    id: "quiz_question_count_10_12",
    pass: questionCount >= 10 && questionCount <= 12,
    detail: `QUESTIONS.length=${questionCount} (expected 10–12)`,
  });

  const hasImpact = FLOW.includes("__impact_reveal__");
  checks.push({
    id: "impact_reveal_in_flow",
    pass: hasImpact,
    detail: `FLOW includes "__impact_reveal__" = ${hasImpact}`,
  });

  const hasRanking = QUESTIONS.some((q) => q.kind === "top2" || q.tags.includes("action-ranking"));
  checks.push({ id: "action_ranking_present", pass: hasRanking, detail: `Found ranking question = ${hasRanking}` });

  const hasEstimation = QUESTIONS.some((q) => q.tags.includes("estimation"));
  const hasMisconception = QUESTIONS.some((q) => q.tags.includes("misconception"));
  checks.push({ id: "estimation_present", pass: hasEstimation, detail: `estimation tags present = ${hasEstimation}` });
  checks.push({ id: "misconception_present", pass: hasMisconception, detail: `misconception tags present = ${hasMisconception}` });

  const hasDripPre = QUESTIONS.some((q) => q.id === "k_drip_pre");
  const hasDripPost = QUESTIONS.some((q) => q.id === "k_drip_post");
  const hasIrrPre = QUESTIONS.some((q) => q.id === "k_irrig_pre");
  const hasIrrPost = QUESTIONS.some((q) => q.id === "k_irrig_post");
  checks.push({
    id: "knowledge_delta_pre_post_pairs",
    pass: hasDripPre && hasDripPost && hasIrrPre && hasIrrPost,
    detail: `drip(pre/post)=${hasDripPre}/${hasDripPost}, irrig(pre/post)=${hasIrrPre}/${hasIrrPost}`,
  });

  const statsSourced = IMPACT_STATS.every((s) => s.sources?.length);
  checks.push({
    id: "impact_stats_sourced",
    pass: statsSourced,
    detail: `All IMPACT_STATS have sources = ${statsSourced}`,
  });

  const abCopy = Boolean(COPY.A?.landingSubtitle) && Boolean(COPY.B?.landingSubtitle);
  checks.push({ id: "ab_copy_present", pass: abCopy, detail: `COPY arms present = ${Boolean(COPY.A)} / ${Boolean(COPY.B)}` });

  const hasConstraintQ = QUESTIONS.some((q) => q.id === "c_budget" && q.tags.includes("ethics"));
  checks.push({
    id: "ethics_constraint_question_present",
    pass: hasConstraintQ,
    detail: `Constraint question present = ${hasConstraintQ}`,
  });

  checks.push({
    id: "water_iq_version_v2",
    pass: WATER_IQ_VERSION === 2,
    detail: `WATER_IQ_VERSION=${WATER_IQ_VERSION}`,
  });

  const pass = checks.every((c) => c.pass);
  return { version: WATER_IQ_VERSION, checks, pass };
}
