import { CSSProperties, useMemo, useState } from "react";

import { useCredits } from "../context/CreditsContext";
import { useShareCredits } from "../hooks/useShareCredits";
import { appendReferralToUrl, fetchReferralToken } from "../utils/referral";

const unlockHintForCredits = (credits: number) => {
  if (credits < 5) {
    return "You’re 5 credits away from unlocking leak alerts.";
  }
  if (credits < 10) {
    return "You’re 5 credits away from deeper bill analysis insights.";
  }
  return "You’re stacking credits toward even deeper savings insights.";
};

const EarnCreditsCard = () => {
  const { credits, setCredits } = useCredits();
  const {
    config,
    isLoading,
    hint,
    claimPrompt,
    toastMessage,
    toastTone,
    showConfetti,
    nextUnlockHint,
    startShare,
    finalizeShare,
  } = useShareCredits();
  const [isClaiming, setIsClaiming] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);

  const handleStartShare = () => {
    const variants = config?.variants ?? [];
    const random = variants[Math.floor(Math.random() * Math.max(variants.length, 1))];
    startShare(random?.id);
  };

  const handleFinalize = async () => {
    setIsClaiming(true);
    const result = await finalizeShare();
    if (result?.status === "granted" && typeof result.credits === "number") {
      setCredits(result.credits);
    }
    setIsClaiming(false);
  };

  const handleInviteFriend = async () => {
    if (typeof window === "undefined") return;
    setInviteMessage(null);
    setIsInviting(true);
    try {
      const token = await fetchReferralToken();
      if (!token) {
        throw new Error("Unable to generate your invite link right now.");
      }

      const inviteUrl = appendReferralToUrl(window.location.origin, token);
      const inviteText = "I use WaterShortcut to cut my water bill. Try it:";

      if (navigator.share) {
        await navigator.share({
          title: "WaterShortcut",
          text: inviteText,
          url: inviteUrl,
        });
        setInviteMessage("Invite sent. Your friend will get a personalized referral link.");
        return;
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(inviteUrl);
        setInviteMessage("Invite link copied. Share it with a friend to spread savings.");
        return;
      }

      setInviteMessage(`Share this invite link: ${inviteUrl}`);
    } catch (error) {
      setInviteMessage(error instanceof Error ? error.message : "Unable to create an invite link.");
    } finally {
      setIsInviting(false);
    }
  };

  const socialProof = useMemo(() => {
    return "Every analysis helps you use less and pay less.";
  }, []);

  return (
    <section className="ws-section" aria-labelledby="earn-credits-title">
      <div className="earn-credits-card">
        <div className="earn-credits-card__header">
          <p className="eyebrow">Earn rewards for sharing</p>
          <h2 id="earn-credits-title">Earn Water Credits</h2>
          <p className="ws-subtitle">Credits unlock personalized fixes and deeper savings insights.</p>
        </div>

        <div className="earn-credits-card__actions">
          <button
            type="button"
            className="ws-button"
            onClick={handleStartShare}
            disabled={isLoading || config?.platformEnabled?.x === false}
          >
            Tweet → Earn 5 Credits
          </button>
          {hint && <p className="earn-credits-card__hint">{hint}</p>}
        </div>

        {claimPrompt && (
          <div className="earn-credits-card__claim" role="status">
            <p>Welcome back — claim your 5 credits</p>
            <button
              type="button"
              className="ws-button-secondary"
              onClick={handleFinalize}
              disabled={isLoading || isClaiming}
            >
              {isClaiming ? "Claiming..." : "Claim credits"}
            </button>
          </div>
        )}

        <div className="earn-credits-card__secondary">
          <button
            type="button"
            className="ws-button-secondary"
            onClick={handleInviteFriend}
            disabled={isInviting}
          >
            {isInviting ? "Preparing invite..." : "Invite a friend"}
          </button>
          <a className="ws-button-secondary" href="/analyze-water-bill">
            Complete a mission
          </a>
        </div>
        {inviteMessage && <p className="earn-credits-card__hint">{inviteMessage}</p>}

        <div className="earn-credits-card__footer">
          <p className="earn-credits-card__social">{socialProof}</p>
          <p className="earn-credits-card__unlock" aria-live="polite">
            {nextUnlockHint ?? unlockHintForCredits(credits)}
          </p>
        </div>

        {toastMessage && (
          <div
            className={`earn-credits-card__toast ${toastTone === "success" ? "is-success" : "is-error"}`}
            role="status"
          >
            {toastMessage}
          </div>
        )}

        {showConfetti && (
          <div className="earn-credits-card__confetti" aria-hidden>
            {Array.from({ length: 10 }).map((_, index) => (
              <span key={`confetti-${index}`} style={{ ["--i" as string]: index } as CSSProperties} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EarnCreditsCard;
