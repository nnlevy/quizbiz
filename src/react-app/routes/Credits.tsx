import { useEffect } from "react";

import { usePageMeta } from "../hooks/usePageMeta";
import { useCreditsModal } from "../context/CreditsModalContext";

const Credits = () => {
  usePageMeta({
    title: "WaterShortcut credits | Save water",
    description:
      "Manage WaterShortcut credits for AI water bill analysis and water-saving tools.",
    canonicalPath: "/credits",
  });
  const { openModal } = useCreditsModal();

  useEffect(() => {
    openModal();
  }, [openModal]);

  return (
    <section className="ws-page" aria-labelledby="credits-title">
      <div className="ws-hero">
        <p className="eyebrow">Credits center</p>
        <h1 id="credits-title">Credits now live in the modal experience.</h1>
        <p>Open the Credits modal to review balances, benefits, and account options.</p>
      </div>

      <div className="ws-info-card" aria-label="Open credits modal">
        <div>
          <h2>Review credits & sign up</h2>
          <p className="ws-subtitle">
            Manage your credits and account perks without leaving your current page.
          </p>
        </div>
        <button className="ws-button" type="button" onClick={() => openModal()}>
          Open credits modal
        </button>
      </div>
    </section>
  );
};

export default Credits;
