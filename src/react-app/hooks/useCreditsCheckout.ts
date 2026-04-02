import { useCallback, useRef } from "react";

import { CREDIT_TOPUP_AMOUNT, CREDIT_TOPUP_FLAG, CREDIT_TOPUP_PRICE } from "../utils/credits";

type StripeClient = {
  redirectToCheckout: (options: {
    sessionId: string;
  }) => Promise<{ error?: { message?: string } | null }>;
};

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeClient;
    __WS_STRIPE_PUBLISHABLE_KEY__?: string;
  }
}

const STRIPE_JS_SRC = "https://js.stripe.com/v3";
const STRIPE_JS_SCRIPT_ID = "stripe-js-sdk";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

type CreditsCheckoutOptions = {
  onNotice?: (message: string) => void;
  onPulse?: () => void;
};

export const useCreditsCheckout = ({ onNotice, onPulse }: CreditsCheckoutOptions = {}) => {
  const stripeClientRef = useRef<StripeClient | null>(null);
  const stripeLoaderRef = useRef<Promise<StripeClient | null> | null>(null);

  const emitNotice = useCallback(
    (message: string) => {
      onNotice?.(message);
      onPulse?.();
    },
    [onNotice, onPulse],
  );

  const loadStripeClient = useCallback(async () => {
    if (stripeClientRef.current) {
      return stripeClientRef.current;
    }

    const publishableKey =
      typeof window !== "undefined" ? window.__WS_STRIPE_PUBLISHABLE_KEY__ : "";
    const envKey =
      typeof import.meta !== "undefined"
        ? (import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined)
        : undefined;
    const resolvedKey = isNonEmptyString(publishableKey)
      ? publishableKey
      : isNonEmptyString(envKey)
        ? envKey
        : "";

    if (!isNonEmptyString(resolvedKey)) {
      return null;
    }

    if (stripeLoaderRef.current) {
      return stripeLoaderRef.current;
    }

    stripeLoaderRef.current = new Promise<StripeClient | null>((resolve) => {
      const existingScript = document.getElementById(
        STRIPE_JS_SCRIPT_ID,
      ) as HTMLScriptElement | null;

      const hydrateStripeClient = () => {
        if (typeof window !== "undefined" && typeof window.Stripe === "function") {
          const client = window.Stripe(resolvedKey);
          stripeClientRef.current = client;
          resolve(client);
          return;
        }

        resolve(null);
      };

      const handleStripeError = () => {
        resolve(null);
      };

      if (existingScript && existingScript.getAttribute("data-ready") === "true") {
        hydrateStripeClient();
        return;
      }

      const script = existingScript ?? document.createElement("script");
      script.id = STRIPE_JS_SCRIPT_ID;
      script.src = STRIPE_JS_SRC;
      script.async = true;

      const handleStripeReady = () => {
        script.setAttribute("data-ready", "true");
        hydrateStripeClient();
      };

      script.addEventListener("load", handleStripeReady);
      script.addEventListener("error", handleStripeError);

      if (!existingScript) {
        document.head.appendChild(script);
      }
    });

    const client = await stripeLoaderRef.current;
    stripeLoaderRef.current = null;
    return client;
  }, []);

  const startCheckout = useCallback(async (packId?: string) => {
    try {
      const response = await fetch("/api/credits/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const payload = (await response
        .json()
        .catch(() => null)) as
        | { id?: string; url?: string; error?: string; details?: string }
        | null;
      if (!response.ok) {
        const serverMessage =
          payload?.error || payload?.details || `Status ${response.status}`;
        throw new Error(serverMessage);
      }

      if (!payload?.id && !payload?.url) {
        throw new Error("Stripe checkout session missing");
      }

      try {
        window.localStorage.setItem(CREDIT_TOPUP_FLAG, "pending");
      } catch (error) {
        console.error("Unable to persist credit purchase flag", error);
      }

      emitNotice(
        `Launching $${CREDIT_TOPUP_PRICE} checkout for ${CREDIT_TOPUP_AMOUNT} credits...`,
      );

      const client = await loadStripeClient();

      if (client && payload?.id) {
        const result = await client.redirectToCheckout({
          sessionId: payload.id,
        });

        if (result.error?.message) {
          if (payload.url) {
            window.location.assign(payload.url);
            return;
          }
          emitNotice(result.error.message);
        }
        return;
      }

      if (payload?.url) {
        window.location.assign(payload.url);
        return;
      }

      emitNotice("Unable to launch checkout. Please try again.");
    } catch (error) {
      console.error("Stripe checkout error", error);
      emitNotice(
        error instanceof Error
          ? `Unable to start checkout: ${error.message}`
          : "Unable to start checkout right now. Please try again.",
      );
    }
  }, [emitNotice, loadStripeClient]);

  return { startCheckout };
};
