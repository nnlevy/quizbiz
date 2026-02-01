export type RateLimitResult = {
  allowed: boolean;
  count: number;
};

const parseCount = (value: string | null): number => {
  const parsed = Number.parseInt(value ?? "0", 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const incrementRateLimit = async (
  kv: KVNamespace,
  key: string,
  limit: number,
  ttlSeconds: number,
): Promise<RateLimitResult> => {
  const current = parseCount(await kv.get(key));
  const next = current + 1;
  await kv.put(key, String(next), { expirationTtl: ttlSeconds });
  return { allowed: next <= limit, count: next };
};

export const incrementCounter = async (
  kv: KVNamespace,
  key: string,
  ttlSeconds: number,
): Promise<number> => {
  const current = parseCount(await kv.get(key));
  const next = current + 1;
  await kv.put(key, String(next), { expirationTtl: ttlSeconds });
  return next;
};
