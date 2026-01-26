import { BUILD_DATE, copy } from "../copy";
import PrivacyControls from "../react-app/components/PrivacyControls";
import InfoCard from "../react-app/components/InfoCard";
import { usePageMeta } from "../react-app/hooks/usePageMeta";

const PrivacyPage = () => {
  usePageMeta({
    title: "Privacy policy | WaterShortcut",
    description: copy.trust.privacy.summary,
    canonicalPath: "/privacy",
  });

  return (
    <section className="ws-page" aria-labelledby="privacy-title">
      <div className="ws-hero">
        <p className="eyebrow">Privacy policy</p>
        <h1 id="privacy-title">{copy.trust.privacy.title}</h1>
        <p className="ws-subtitle">{copy.trust.privacy.summary}</p>
      </div>

      <InfoCard variant="cta">
        <h2>TL;DR</h2>
        <ul className="ws-pill-list">
          {copy.trust.privacy.tldr.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <PrivacyControls />
      </InfoCard>

      {copy.trust.privacy.sections.map((section) => (
        <InfoCard key={section.title}>
          <h2>{section.title}</h2>
          <p className="ws-subtitle">{section.body}</p>
        </InfoCard>
      ))}

      <p className="ws-subtitle">Last updated: {BUILD_DATE}</p>
    </section>
  );
};

export default PrivacyPage;
