import { BUILD_DATE, copy } from "../copy";
import PrivacyControls from "../react-app/components/PrivacyControls";
import PageLayout from "./PageLayout";

const PrivacyPage = () => (
  <PageLayout title={copy.trust.privacy.title} subtitle={copy.trust.privacy.summary}>
    <section>
      <h2>TL;DR</h2>
      <ul>
        {copy.trust.privacy.tldr.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <PrivacyControls />
    </section>
    {copy.trust.privacy.sections.map((section) => (
      <section key={section.title}>
        <h2>{section.title}</h2>
        <p>{section.body}</p>
      </section>
    ))}
    <p className="muted">Last updated: {BUILD_DATE}</p>
  </PageLayout>
);

export default PrivacyPage;
