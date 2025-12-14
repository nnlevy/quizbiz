import PageLayout from "./PageLayout";

const PrivacyPage = () => (
  <PageLayout
    title="Privacy at WaterShortcut"
    subtitle="We protect the water bills you upload, limit data sharing, and honor regional consent requirements."
  >
    <section>
      <h2>How we handle uploads</h2>
      <p>
        WaterShortcut processes your uploaded water bill to extract text and deliver a customized report. Files are stored
        temporarily for analysis, then removed. We do not sell or rent your documents. Access is restricted to essential staff for
        support and abuse prevention.
      </p>
    </section>

    <section>
      <h2>Analytics and advertising</h2>
      <p>
        We use Google Analytics 4 (Measurement ID G-98170RDCDD) to understand feature usage and improve the product. Google AdSense
        may display ads when you grant consent; cookies from these services track ad performance and personalization. You can
        withdraw consent at any time by clearing the consent setting in your browser. EU users see a consent banner before any ad
        scripts load, and California residents may opt out of sale or sharing through the same control.
      </p>
    </section>

    <section>
      <h2>Your choices and rights</h2>
      <ul>
        <li>Request deletion of your uploaded files by contacting support@watershortcut.com.</li>
        <li>Turn off personalized ads via the cookie banner or your browser settings.</li>
        <li>Access or correct basic account details if you create an account in the future.</li>
        <li>Expect transparent updates when our data practices change.</li>
      </ul>
      <p>
        We align with GDPR and CCPA standards by limiting data collection, honoring consent, and providing clear disclosures on every
        page that uses cookies.
      </p>
    </section>
  </PageLayout>
);

export default PrivacyPage;
