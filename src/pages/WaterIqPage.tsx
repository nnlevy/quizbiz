import { useCallback, useEffect, useState } from "react";

import SiteFooter from "../react-app/components/SiteFooter";
import SiteNav from "../react-app/components/SiteNav";
import WaterIQQuiz from "../react-app/components/WaterIQQuiz";
import "../react-app/App.css";
import { useCredits } from "../react-app/context/CreditsContext";
import { useCreditsCheckout } from "../react-app/hooks/useCreditsCheckout";

const COMPLETION_KEY = "ws_water_iq_completed";
const VISIT_KEY = "ws_water_iq_visited";

const WaterIqPage = () => {
  const { credits, pulse, setPulse } = useCredits();
  const triggerCreditPulse = useCallback(() => {
    setPulse(true);
    setTimeout(() => setPulse(false), 750);
  }, [setPulse]);
  const { startCheckout } = useCreditsCheckout({ onPulse: triggerCreditPulse });
  const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);

  useEffect(() => {
    // Read localStorage to see if this is a first visit and whether the quiz was completed.
    try {
      const completed = window.localStorage.getItem(COMPLETION_KEY) === "true";
      const hasVisited = window.localStorage.getItem(VISIT_KEY) === "true";
      if (!hasVisited) {
        window.localStorage.setItem(VISIT_KEY, "true");
      }
      setHasCompletedQuiz(completed);
    } catch {
      setHasCompletedQuiz(false);
    }
  }, []);

  const handleQuizComplete = useCallback(() => {
    // Persist completion so ads + credits stay visible on future visits.
    setHasCompletedQuiz(true);
    try {
      window.localStorage.setItem(COMPLETION_KEY, "true");
    } catch {
      // Ignore storage failures (privacy mode, etc.).
    }
  }, []);

  return (
    <div className="app">
      <SiteNav
        credits={credits}
        pulse={pulse}
        onCreditsClick={startCheckout}
        hideCredits={!hasCompletedQuiz}
      />
      <main className="main-wrapper">
        {/* Hidden nav keeps the Water IQ route discoverable for crawlers. */}
        <nav className="ws-hidden-nav" aria-hidden="true">
          <a href="/water-iq">Water IQ Challenge</a>
        </nav>
        <WaterIQQuiz onComplete={handleQuizComplete} />
      </main>
      <SiteFooter hideAds={!hasCompletedQuiz} />
    </div>
  );
};

export default WaterIqPage;
