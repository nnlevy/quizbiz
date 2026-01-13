import { FormEvent, MouseEvent, useEffect, useMemo, useRef, useState } from "react";

import { logEvent } from "../analytics";
import { useCredits } from "../context/CreditsContext";
import { useSession } from "../context/SessionContext";
import { CREDIT_TOPUP_AMOUNT } from "../utils/credits";

const sendAnonymousEvent = async (event: string, details?: Record<string, unknown>) => {
  try {
    await fetch("/api/analytics/anonymous", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event, details }),
    });
  } catch {
    // Analytics are best-effort only.
  }
};

type CreditsModalProps = {
  isOpen: boolean;
  returnTo: string;
  onClose: () => void;
};

const CreditsModal = ({ isOpen, returnTo, onClose }: CreditsModalProps) => {
  const { credits } = useCredits();
  const { user, refreshSession } = useSession();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const oauthEnabled = typeof window !== "undefined" && window.__WS_OAUTH_ENABLED__ !== false;

  const resolveAuthError = (code: string) => {
    switch (code) {
      case "missing_oauth_params":
        return "We couldn't start Google sign-in. Please try again.";
      case "invalid_oauth_state":
        return "The Google sign-in session expired. Please try again.";
      case "token_exchange_failed":
        return "Google sign-in failed to finish. Please retry.";
      case "missing_id_token":
        return "Google sign-in did not return credentials.";
      case "invalid_id_token":
        return "Google sign-in could not be verified.";
      case "missing_google_profile":
        return "Google sign-in did not include your profile details.";
      case "missing_oauth_client":
        return "Google sign-in is not configured yet. Please try again later.";
      default:
        return "Google sign-in did not complete. Please try again.";
    }
  };

  const benefits = useMemo(
    () => [
      "Persistent dashboard across devices",
      "Top up credits and see your balance instantly",
      "Ad-free experience with clean focus",
      "Track water bill analysis history",
      "Set goals and receive alerts",
    ],
    [],
  );

  useEffect(() => {
    if (!isOpen) return;
    logEvent("credits_modal_viewed");
    sendAnonymousEvent("credits_modal_viewed");
    const timer = window.setTimeout(() => {
      const focusable = modalRef.current?.querySelector<HTMLElement>(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
      );
      focusable?.focus();
    }, 50);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setNotice(null);
    setError(null);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("auth_error");
    if (!authError) return;
    setError(resolveAuthError(authError));
    params.delete("auth_error");
    const trimmed = params.toString();
    const nextUrl = `${window.location.pathname}${trimmed ? `?${trimmed}` : ""}${window.location.hash}`;
    window.history.replaceState({}, document.title, nextUrl);
  }, [isOpen]);

  const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleGoogle = () => {
    if (!oauthEnabled) {
      setError("Google sign-in is currently unavailable. Please use email.");
      return;
    }
    logEvent("credits_modal_google_clicked");
    sendAnonymousEvent("credits_modal_google_clicked", { return_to: returnTo });
    const params = new URLSearchParams({ return_to: returnTo });
    window.location.assign(`/auth/google?${params.toString()}`);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsSubmitting(true);
    logEvent("credits_modal_email_submit");
    sendAnonymousEvent("credits_modal_email_submit");

    try {
      const response = await fetch("/auth/email-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          returnTo,
        }),
      });
      const payload = (await response
        .json()
        .catch(() => null)) as { error?: string; message?: string } | null;
      if (!response.ok) {
        throw new Error(payload?.error || payload?.message || "Unable to create account.");
      }
      setNotice("Account created! Syncing your dashboard...");
      await refreshSession();
      onClose();
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="credits-modal-overlay" onClick={handleOverlayClick} role="presentation">
      <div
        className="credits-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="credits-modal-title"
        aria-describedby="credits-modal-description"
        ref={modalRef}
      >
        <div className="credits-modal__header">
          <div>
            <p className="eyebrow">Credits & account perks</p>
            <h2 id="credits-modal-title">Keep your WaterShortcut insights flowing.</h2>
            <p id="credits-modal-description" className="ws-subtitle">
              Each analysis uses 1 credit. You start with free credits, and we keep your balance
              synced when you create an account.
            </p>
          </div>
          <button
            type="button"
            className="credits-modal__close"
            onClick={onClose}
            aria-label="Close credits modal"
          >
            ×
          </button>
        </div>

        <div className="credits-modal__content">
          <div className="credits-modal__panel">
            <div className="credits-modal__summary">
              <div>
                <p className="ws-subtitle">Credits available right now</p>
                <p className="credits-modal__credits" aria-live="polite">
                  {credits}
                </p>
              </div>
              <div>
                <p className="ws-subtitle">Cost per analysis</p>
                <p className="credits-modal__credits">1 credit</p>
              </div>
            </div>
            <h3>Why create an account?</h3>
            <ul className="credits-modal__list">
              {benefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
            <div className="credits-modal__note">
              <strong>Starter credits included.</strong> Top up {CREDIT_TOPUP_AMOUNT} credits anytime
              to keep exploring deeper insights.
            </div>
          </div>

          <div className="credits-modal__panel credits-modal__cta" aria-label="Create account">
            {user ? (
              <div className="credits-modal__signedin">
                <h3>You're signed in</h3>
                <p className="ws-subtitle">
                  Signed in as {user.name} ({user.email}). Your credits stay synced across devices.
                </p>
                <button
                  type="button"
                  className="ws-button"
                  aria-label="Close credits modal"
                  onClick={onClose}
                >
                  Continue
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="ws-button"
                  onClick={handleGoogle}
                  aria-label="Continue with Google"
                  disabled={!oauthEnabled}
                >
                  Continue with Google
                </button>
                {!oauthEnabled && (
                  <p className="ws-subtitle" role="status">
                    Google sign-in is unavailable right now. Use email to continue.
                  </p>
                )}
                <p className="credits-modal__divider">
                  <span>or create with email</span>
                </p>
                <form className="credits-modal__form" onSubmit={handleSubmit}>
                  <label className="ws-field">
                    Name
                    <input
                      className="ws-input"
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="e.g., Jordan"
                      required
                    />
                  </label>
                  <label className="ws-field">
                    Email
                    <input
                      className="ws-input"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@email.com"
                      required
                    />
                  </label>
                  <label className="ws-field">
                    Password
                    <input
                      className="ws-input"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a password"
                      minLength={8}
                      required
                    />
                  </label>
                  <button
                    className="ws-button-secondary"
                    type="submit"
                    disabled={isSubmitting}
                    aria-label="Create account with email"
                  >
                    {isSubmitting ? "Creating account..." : "Create account with email"}
                  </button>
                </form>
                {notice && (
                  <p className="ws-subtitle" role="status">
                    {notice}
                  </p>
                )}
                {error && (
                  <p className="ws-subtitle" role="alert">
                    {error}
                  </p>
                )}
                <button
                  type="button"
                  className="credits-modal__later"
                  onClick={onClose}
                  aria-label="Maybe later"
                >
                  Maybe later
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditsModal;
