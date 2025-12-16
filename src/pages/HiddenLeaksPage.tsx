import PageLayout from "./PageLayout";

const HiddenLeaksPage = () => (
  <PageLayout
    title="Finding Hidden Leaks Before They Drain Your Wallet"
    subtitle="Use meter clues, smart sensors, and targeted inspections to catch the leaks you cannot see."
  >
    <section>
      <h2>Where hidden leaks like to hide</h2>
      <p>
        Concealed leaks often lurk in slab foundations, crawlspaces, irrigation lateral lines, or behind seldom-used fixtures.
        They may not leave obvious puddles but will steadily increase your daily average usage. Watching your bill for subtle rises
        and comparing it with meter readings gives you the earliest warnings.
      </p>
    </section>

    <section>
      <h2>Use your meter as a detective tool</h2>
      <ol>
        <li>Pick a time when no water is being used, ideally late at night.</li>
        <li>Record the low-flow indicator or digital leak icon; many meters have a small triangle or drip symbol for this purpose.</li>
        <li>Wait 15–30 minutes and check again. Any movement suggests continuous flow.</li>
        <li>If the meter has a digital screen, scroll to view hourly usage. Unexpected overnight flow patterns are prime suspects.</li>
      </ol>
      <p>
        Upload the resulting bill to WaterShortcut; the AI will estimate leak size from your monthly totals and suggest follow-up
        questions for your utility or plumber.
      </p>
    </section>

    <section>
      <h2>Smart sensors and monitoring</h2>
      <p>
        Pair your manual checks with technology. Battery-powered leak detectors placed under sinks, near the water heater, and by
        washing machines provide audible alarms. Whole-home flow monitors, installed on the main line, deliver app alerts when flow
        exceeds normal ranges. Choose sensors with adjustable thresholds so they match your household&apos;s schedule.
      </p>
    </section>

    <section>
      <h2>Clues from your surroundings</h2>
      <ul>
        <li>Warm spots on floors may signal a hot-water slab leak.</li>
        <li>Mildew smells or peeling paint can point to slow wall leaks near bathrooms.</li>
        <li>Unusually green patches in the yard often indicate a broken irrigation line.</li>
        <li>Air in plumbing lines, heard as sputtering faucets, may follow unnoticed line breaks.</li>
      </ul>
    </section>

    <section>
      <h2>Create a remediation plan</h2>
      <p>
        Once a leak is suspected, isolate zones to narrow the source. Shut off irrigation valves, then retest the meter. Close toilet
        supply valves one at a time. If the leak persists, consider a professional pressure test. Document each step in a log and save
        photos; they strengthen your case for bill adjustments or leak forgiveness credits.
      </p>
      <p>
        After repairs, monitor for 48 hours to confirm the fix. Upload the next bill to WaterShortcut and compare your gallons-per-day
        trend to prior periods. Seeing the downward slope confirms the leak is gone and helps you negotiate any bill credits for the
        wasted water.
      </p>
      <div className="cta-block">
        <a className="primary-button" href="/upload">Upload a bill for a hidden leak review</a>
        <p className="hero-copy">We combine meter math with your observations to estimate leak size and recommend the next call.</p>
      </div>
    </section>
  </PageLayout>
);

export default HiddenLeaksPage;
