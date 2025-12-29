import { BUILD_DATE, copy } from "../copy";
import PageLayout from "./PageLayout";

const TermsPage = () => (
  <PageLayout title={copy.trust.terms.title} subtitle={copy.trust.terms.summary}>
    {copy.trust.terms.sections.map((section) => (
      <section key={section.title}>
        <h2>{section.title}</h2>
        <p>{section.body}</p>
      </section>
    ))}
    <p className="muted">Last updated: {BUILD_DATE}</p>
  </PageLayout>
);

export default TermsPage;
