export const trackReferralConversion = async (
  conversionType: string,
  meta?: Record<string, unknown>,
) => {
  try {
    await fetch("/api/growth/referral/convert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversionType, meta }),
    });
  } catch {
    // Best-effort only.
  }
};
