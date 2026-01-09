import { useCallback } from "react";

import SiteFooter from "../react-app/components/SiteFooter";
import SiteNav from "../react-app/components/SiteNav";
import "../react-app/App.css";
import { useCredits } from "../react-app/context/CreditsContext";
import { useCreditsCheckout } from "../react-app/hooks/useCreditsCheckout";

const PageLayout = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => {
  const { credits, pulse, setPulse } = useCredits();
  const triggerCreditPulse = useCallback(() => {
    setPulse(true);
    setTimeout(() => setPulse(false), 750);
  }, [setPulse]);
  const { startCheckout } = useCreditsCheckout({ onPulse: triggerCreditPulse });

  return (
    <div className="app content-page">
      <SiteNav credits={credits} pulse={pulse} onCreditsClick={startCheckout} />
      <main className="content-wrapper">
        <div className="content-hero">
          <p className="eyebrow">WaterShortcut Learn</p>
          <h1>{title}</h1>
          {subtitle ? <p className="hero-copy">{subtitle}</p> : null}
        </div>
        <div className="content-body">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default PageLayout;
