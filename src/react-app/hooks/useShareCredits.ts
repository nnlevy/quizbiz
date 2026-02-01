import { useCallback, useEffect, useMemo, useState } from "react";

const SHARE_TOKEN_KEY = "ws_growth_share_token";
const SHARE_VARIANT_KEY = "ws_growth_share_variant";

export type ShareVariant = {
  id: "A" | "B" | "C";
  text: string;
};

export type ShareConfig = {
  platformEnabled: { x: boolean };
  creditAmount: number;
  variants: ShareVariant[];
  rateLimits: {
    shareStartPerHour: number;
    shareFinalizePerDay: number;
    awardWindowDays: number;
    tokenTtlMinutes: number;
  };
};

export type ShareFinalizeResponse = {
  status: "granted" | "rejected";
  credits?: number;
  reason?: string;
  nextUnlockHint?: string;
};

type ShareStartSuccess = {
  intentUrl: string;
  signedToken: string;
  variantId?: "A" | "B" | "C";
};

type ShareStartError = {
  error?: string;
};

const isShareStartSuccess = (payload: unknown): payload is ShareStartSuccess => {
  if (!payload || typeof payload !== "object") return false;
  return (
    "intentUrl" in payload &&
    typeof (payload as ShareStartSuccess).intentUrl === "string" &&
    "signedToken" in payload &&
    typeof (payload as ShareStartSuccess).signedToken === "string"
  );
};

const readSessionValue = (key: string) => {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(key);
};

const writeSessionValue = (key: string, value: string) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(key, value);
};

const removeSessionValue = (key: string) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(key);
};

export const useShareCredits = () => {
  const [config, setConfig] = useState<ShareConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [claimPrompt, setClaimPrompt] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"success" | "error">("success");
  const [showConfetti, setShowConfetti] = useState(false);
  const [nextUnlockHint, setNextUnlockHint] = useState<string | null>(null);

  const pendingToken = useMemo(() => readSessionValue(SHARE_TOKEN_KEY), []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const claimParam = params.get("claimShare");
    setClaimPrompt(Boolean(pendingToken) || claimParam === "1");
  }, [pendingToken]);

  useEffect(() => {
    let isActive = true;
    const fetchConfig = async () => {
      if (typeof window === "undefined") return;
      try {
        const page = window.location.pathname;
        const response = await fetch(`/api/growth/share/config?page=${encodeURIComponent(page)}`);
        if (!response.ok) return;
        const payload = (await response.json()) as ShareConfig;
        if (isActive) {
          setConfig(payload);
        }
      } catch {
        // Best-effort only.
      }
    };
    fetchConfig();
    return () => {
      isActive = false;
    };
  }, []);

  const startShare = useCallback(
    async (variantId?: "A" | "B" | "C") => {
      setIsLoading(true);
      setHint(null);
      setToastMessage(null);
      try {
        const page = typeof window === "undefined" ? "/" : window.location.pathname;
        const response = await fetch("/api/growth/share/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform: "x", page, variantId }),
        });
        const payload = (await response.json().catch(() => null)) as
          | ShareStartSuccess
          | ShareStartError
          | null;
        if (!response.ok || !isShareStartSuccess(payload)) {
          const message =
            payload && typeof payload === "object" && "error" in payload
              ? (payload as ShareStartError).error
              : null;
          throw new Error(message || "Unable to start share.");
        }
        writeSessionValue(SHARE_TOKEN_KEY, payload.signedToken);
        if (payload.variantId) {
          writeSessionValue(SHARE_VARIANT_KEY, payload.variantId);
        }
        setHint("Post your tweet, then come back to claim your credits.");
        setClaimPrompt(true);
        window.open(payload.intentUrl, "_blank", "noopener,noreferrer");
      } catch (error) {
        setToastTone("error");
        setToastMessage(error instanceof Error ? error.message : "Unable to start share.");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const finalizeShare = useCallback(async () => {
    const signedToken = readSessionValue(SHARE_TOKEN_KEY);
    if (!signedToken) {
      setToastTone("error");
      setToastMessage("Credit not granted: missing share token.");
      return null;
    }
    setIsLoading(true);
    setToastMessage(null);
    setNextUnlockHint(null);
    try {
      const response = await fetch("/api/growth/share/finalize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: "x", signedToken }),
      });
      const payload = (await response.json().catch(() => null)) as ShareFinalizeResponse | null;
      if (!payload) {
        throw new Error("Unable to finalize share.");
      }
      if (payload.status === "granted") {
        removeSessionValue(SHARE_TOKEN_KEY);
        removeSessionValue(SHARE_VARIANT_KEY);
        setToastTone("success");
        setToastMessage("You earned 5 credits 💧");
        setShowConfetti(true);
        setClaimPrompt(false);
        setNextUnlockHint(payload.nextUnlockHint ?? null);
      } else {
        setToastTone("error");
        setToastMessage(`Credit not granted${payload.reason ? `: ${payload.reason}` : ""}`);
      }
      return payload;
    } catch (error) {
      setToastTone("error");
      setToastMessage(error instanceof Error ? error.message : "Unable to finalize share.");
      return null;
    } finally {
      setIsLoading(false);
      window.setTimeout(() => setShowConfetti(false), 2200);
    }
  }, []);

  return {
    config,
    isLoading,
    hint,
    claimPrompt,
    toastMessage,
    toastTone,
    showConfetti,
    nextUnlockHint,
    pendingToken,
    startShare,
    finalizeShare,
  };
};
