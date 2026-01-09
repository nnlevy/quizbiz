import type { WaterIqAnswers, WaterIqComputed, WaterIqVariant } from "./waterIq";

export type WaterIqEventType =
  | "ref_landing"
  | "quiz_start"
  | "impact_view"
  | "impact_continue"
  | "quiz_complete"
  | "share_click"
  | "cta_click"
  | "city_set"
  | "followup_optin";

export type WaterIqRecord = {
  id: string;
  token: string;
  createdAt: number;
  variant: WaterIqVariant;
  answers: WaterIqAnswers;
  computed: WaterIqComputed;
  ref?: string | null;
  ua?: string | null;
  city?: string | null;
};

export type WaterIqFollowup = {
  id: string;
  token: string;
  email: string;
  days: 7 | 21;
  createdAt: number;
  dueAt: number;
  consent: true;
};

type StoreState = {
  recordsByToken: Map<string, WaterIqRecord>;
  refStats: Map<string, { landings: number; starts: number; completes: number }>;
  globalCounts: Record<WaterIqEventType, number>;
  followups: WaterIqFollowup[];
  rewardsByToken: Map<string, Set<string>>;
  rewardCount: number;
};

function state(): StoreState {
  const g = globalThis as typeof globalThis & { __WS_WATER_IQ_STORE_V2__?: StoreState };
  if (!g.__WS_WATER_IQ_STORE_V2__) {
    g.__WS_WATER_IQ_STORE_V2__ = {
      recordsByToken: new Map(),
      refStats: new Map(),
      globalCounts: {
        ref_landing: 0,
        quiz_start: 0,
        impact_view: 0,
        impact_continue: 0,
        quiz_complete: 0,
        share_click: 0,
        cta_click: 0,
        city_set: 0,
        followup_optin: 0,
      },
      followups: [],
      rewardsByToken: new Map(),
      rewardCount: 0,
    };
  }
  return g.__WS_WATER_IQ_STORE_V2__;
}

export function storeEvent(input: { type: WaterIqEventType; ref?: string | null }) {
  const st = state();
  st.globalCounts[input.type] = (st.globalCounts[input.type] ?? 0) + 1;

  if (input.ref) {
    const cur = st.refStats.get(input.ref) ?? { landings: 0, starts: 0, completes: 0 };
    if (input.type === "ref_landing") cur.landings += 1;
    if (input.type === "quiz_start") cur.starts += 1;
    if (input.type === "quiz_complete") cur.completes += 1;
    st.refStats.set(input.ref, cur);
  }
}

export function storeSubmit(rec: Omit<WaterIqRecord, "id">): WaterIqRecord {
  const st = state();
  const id = randomId();
  const full: WaterIqRecord = { id, ...rec };
  st.recordsByToken.set(rec.token, full);
  return full;
}

export function storeCity(token: string, cityRaw: string): { ok: true; city: string } | { ok: false; error: string } {
  const st = state();
  const rec = st.recordsByToken.get(token);
  const city = normalizeCity(cityRaw);
  if (!city) return { ok: false, error: "Invalid city" };

  if (rec) {
    rec.city = city;
    st.recordsByToken.set(token, rec);
  }
  st.globalCounts.city_set += 1;
  return { ok: true, city };
}

export function storeFollowup(input: { token: string; email: string; days: 7 | 21; consent: true }) {
  const st = state();
  const id = randomId();
  const now = Date.now();
  const dueAt = now + input.days * 24 * 60 * 60 * 1000;
  const f: WaterIqFollowup = {
    id,
    token: input.token,
    email: input.email.trim(),
    days: input.days,
    createdAt: now,
    dueAt,
    consent: true,
  };
  st.followups.push(f);
  st.globalCounts.followup_optin += 1;
  return f;
}

export function getFollowupsDue(now: number): WaterIqFollowup[] {
  const st = state();
  return st.followups.filter((f) => f.dueAt <= now);
}

export function getStats() {
  const st = state();
  const records = Array.from(st.recordsByToken.values());
  const count = records.length;
  const avgScore = count ? records.reduce((s, r) => s + r.computed.score.total, 0) / count : 0;
  const share = st.globalCounts.share_click ?? 0;
  const starts = st.globalCounts.quiz_start ?? 0;

  return {
    count,
    avgScore: Math.round(avgScore * 10) / 10,
    events: st.globalCounts,
    completionRate: starts ? Math.round((st.globalCounts.quiz_complete / starts) * 1000) / 10 : 0,
    shareRate: count ? Math.round((share / count) * 1000) / 10 : 0,
    refAttribution: Array.from(st.refStats.entries()).map(([ref, v]) => ({ ref, ...v })),
    rewardsClaimed: st.rewardCount,
  };
}

export function getSocialProofFor(token: string):
  | { ok: true; segmentKey: string; n: number; topPledge: { id: string; label: string; pct: number } }
  | { ok: false; error: string } {
  const st = state();
  const rec = st.recordsByToken.get(token);
  if (!rec) return { ok: false, error: "No record (maybe analytics opted out)." };

  const segmentKey = rec.computed.segmentKey;
  const peers = Array.from(st.recordsByToken.values()).filter((r) => r.computed.segmentKey === segmentKey);
  const n = peers.length;

  const counts: Record<string, number> = {};
  for (const p of peers) {
    const pledge = String(p.answers["p_pledge"] ?? "");
    if (!pledge) continue;
    counts[pledge] = (counts[pledge] ?? 0) + 1;
  }

  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  if (!top) {
    return {
      ok: true,
      segmentKey,
      n,
      topPledge: { id: "leak_check", label: "Run the 3‑minute leak check", pct: 0 },
    };
  }

  const pct = n ? Math.round((top[1] / n) * 100) : 0;
  const label = pledgeLabel(top[0]);

  return { ok: true, segmentKey, n, topPledge: { id: top[0], label, pct } };
}

export function getCityAverage(cityRaw: string):
  | { ok: true; city: string; n: number; avgScore: number }
  | { ok: false; error: string } {
  const st = state();
  const city = normalizeCity(cityRaw);
  if (!city) return { ok: false, error: "Invalid city" };

  const records = Array.from(st.recordsByToken.values()).filter((r) => r.city === city);
  const n = records.length;
  const avg = n ? records.reduce((s, r) => s + r.computed.score.total, 0) / n : 0;

  return { ok: true, city, n, avgScore: Math.round(avg * 10) / 10 };
}

export function storeReward(token: string, action: string) {
  const st = state();
  const set = st.rewardsByToken.get(token) ?? new Set<string>();
  if (set.has(action)) {
    return { ok: false, error: "Credit already claimed for this step." };
  }
  set.add(action);
  st.rewardsByToken.set(token, set);
  st.rewardCount += 1;
  return { ok: true, awarded: 1, totalRewards: st.rewardCount };
}

function pledgeLabel(id: string): string {
  const map: Record<string, string> = {
    leak_check: "Run the 3‑minute leak check",
    toilet_dye_test: "Dye-test my toilet",
    sprinkler_check: "Walk sprinklers and fix leaks/overspray",
    shower_timer: "Set a shower timer",
    install_aerator: "Install a faucet aerator",
    savings_plan: "Build a WaterShortcut savings plan",
    analyze_bill: "Analyze my water bill",
  };
  return map[id] ?? id;
}

function normalizeCity(raw: string): string | null {
  const s = String(raw ?? "").trim();
  if (s.length < 2 || s.length > 64) return null;
  const cleaned = s.toLowerCase().replace(/[^a-z0-9\s\-']/g, "").replace(/\s+/g, " ").trim();
  return cleaned || null;
}

function randomId(): string {
  return Math.random().toString(36).slice(2) + "-" + Date.now().toString(36);
}
