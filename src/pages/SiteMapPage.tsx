import PageLayout from "./PageLayout";

const SiteMapPage = () => (
  <PageLayout title="Site map" subtitle="Navigate every major WaterShortcut destination.">
    <section>
      <h2>Primary</h2>
      <ul>
        <li>
          <a href="/landing">Mobile-first landing page</a>
        </li>
        <li>
          <a href="/analyze-water-bill">Upload a bill</a>
        </li>
        <li>
          <a href="/manual-entry">Manual entry</a>
        </li>
        <li>
          <a href="/find-water-provider">Find your water provider</a>
        </li>
        <li>
          <a href="/research">Research plan</a>
        </li>
        <li>
          <a href="/analyze-water-bill">Savings plan (from bill analysis)</a>
        </li>
        <li>
          <a href="/calculators">Calculators</a>
        </li>
        <li>
          <a href="/water-iq">Water IQ Challenge</a>
        </li>
      </ul>
    </section>
    <section>
      <h2>Checks & tools</h2>
      <ul>
        <li>
          <a href="/leak-check">Leak check</a>
        </li>
        <li>
          <a href="/tools">Rebates and tools</a>
        </li>
        <li>
          <a href="/learn/water-saving-tips">Guides</a>
        </li>
        <li>
          <a href="/calculators/shower">Shower calculator</a>
        </li>
      </ul>
    </section>
    <section>
      <h2>Learn</h2>
      <ul>
        <li>
          <a href="/learn/read-water-bill">How to read a water bill</a>
        </li>
        <li>
          <a href="/learn/leak-detection">Leak detection guide</a>
        </li>
        <li>
          <a href="/learn/water-saving-tips">Water-saving tips</a>
        </li>
        <li>
          <a href="/learn/water-bill-spikes">Water bill spikes</a>
        </li>
        <li>
          <a href="/learn/hidden-leaks">Hidden leaks</a>
        </li>
      </ul>
    </section>
    <section>
      <h2>Policies</h2>
      <ul>
        <li>
          <a href="/privacy">Privacy policy</a>
        </li>
        <li>
          <a href="/terms">Terms of service</a>
        </li>
      </ul>
    </section>
  </PageLayout>
);

export default SiteMapPage;
