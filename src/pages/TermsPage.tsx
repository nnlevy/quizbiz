import PageLayout from "./PageLayout";

const TermsPage = () => (
  <PageLayout
    title="Terms of Service"
    subtitle="Guidelines for using WaterShortcut and understanding our responsibilities to each other."
  >
    <section>
      <h2>Your use of the service</h2>
      <p>
        WaterShortcut provides tools to upload water bills, analyze charges, and access educational content. By using the service,
        you confirm that you have the right to share the files you upload and that you will not submit unlawful or harmful content.
        We grant you a personal, non-transferable right to use the site for household or business bill management.
      </p>
    </section>

    <section>
      <h2>Data handling and security</h2>
      <p>
        Uploaded bills are processed for text extraction and analysis, then removed. We implement access controls and encryption in
        transit. Because we rely on third-party processors such as cloud storage and analytics providers, you agree to their
        standard terms as part of using the service. We do not sell your uploaded information, and we use analytics and ad cookies
        only with consent where required by law.
      </p>
    </section>

    <section>
      <h2>Limitations of liability</h2>
      <p>
        The recommendations and savings estimates presented by WaterShortcut are informational. We do not guarantee specific bill
        reductions or reimbursements from utilities. To the fullest extent permitted by law, the service is provided &quot;as is&quot; and
        we are not liable for indirect or consequential damages. If you are dissatisfied with the service, your sole remedy is to
        stop using it.
      </p>
    </section>

    <section>
      <h2>Contact and disputes</h2>
      <p>
        Questions about these terms or requests related to your data can be sent to support@watershortcut.com. We aim to resolve
        issues quickly; if a dispute remains, it will be governed by the laws of your home jurisdiction unless otherwise required
        by consumer protection rules. Continuing to use the site means you accept any updates we publish here.
      </p>
    </section>
  </PageLayout>
);

export default TermsPage;
