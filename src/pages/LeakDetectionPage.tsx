import PageLayout from "./PageLayout";

const LeakDetectionPage = () => (
  <PageLayout
    title="Leak Detection Playbook for Homes and Small Buildings"
    subtitle="Find silent drips, irrigation failures, and plumbing surprises before they inflate your bill."
  >
    <section>
      <h2>Why early leak detection matters</h2>
      <p>
        Leaks multiply costs quickly: you pay for the wasted water, risk property damage, and may cross into a higher pricing tier.
        WaterShortcut&apos;s AI looks for leak signals inside your uploaded bill, but pairing digital checks with physical inspections
        gives you faster results and protects your budget.
      </p>
    </section>

    <section>
      <h2>Fast household checks you can perform this week</h2>
      <ul>
        <li>
          <strong>Observe the meter:</strong> Turn off all fixtures, note the dial position, and check again after 30 minutes. Movement
          signals a hidden leak.
        </li>
        <li>
          <strong>Toilet dye test:</strong> Add food coloring to the toilet tank; if color seeps into the bowl within 15 minutes, the flapper
          needs attention.
        </li>
        <li>
          <strong>Listen at night:</strong> Stand near walls with plumbing just before bed. Consistent hiss sounds often mean a pressurized leak.
        </li>
        <li>
          <strong>Inspect irrigation:</strong> Walk sprinkler lines for soggy patches or spurting heads. A broken lateral line can waste hundreds of
          gallons per day.
        </li>
      </ul>
    </section>

    <section>
      <h2>Using data to pinpoint problem zones</h2>
      <p>
        Bills contain clues about leak timing and severity. Upload yours to WaterShortcut and compare the AI&apos;s findings with these
        observations:
      </p>
      <ol>
        <li><strong>Seasonality:</strong> Spikes during dry months often implicate irrigation; spikes in winter suggest interior plumbing.</li>
        <li><strong>Meter class:</strong> If you recently received a smart meter, continuous small flows overnight often indicate running toilets.</li>
        <li><strong>Wastewater charges:</strong> Higher sewer charges without matching water use can reveal calculation errors or faulty averaging.</li>
        <li><strong>Customer notes:</strong> Rate codes sometimes change after service visits. Mis-coded meters may bill multi-family rates to single homes.</li>
      </ol>
    </section>

    <section>
      <h2>Low-cost fixes that prevent future leaks</h2>
      <ul>
        <li>Replace worn toilet flappers and fill valves every 5 years; they are inexpensive and stop silent leaks.</li>
        <li>Add drip trays and moisture alarms under sinks, water heaters, and washing machines to get alerts before damage spreads.</li>
        <li>Insulate exposed pipes in garages and crawlspaces to prevent freeze-thaw cracks.</li>
        <li>Schedule annual irrigation tune-ups: clean filters, align spray heads, and cap unused lines.</li>
      </ul>
      <p>
        Document each fix in a simple log. When you upload future bills, you will see how each repair influences the blended cost per
        gallon, proving ROI and motivating the next upgrade.
      </p>
    </section>

    <section>
      <h2>When to call a professional</h2>
      <p>
        If your meter moves quickly with all fixtures off, or you notice warm spots on flooring near water lines, contact a licensed
        plumber. Mention specific findings from your WaterShortcut report—such as continuous flow estimates or abnormal wastewater
        surcharges—to guide their investigation. For large properties, a leak detection specialist with acoustic gear can sweep
        long pipe runs without demolition.
      </p>
    </section>

    <section>
      <h2>Special considerations for multi-family buildings</h2>
      <p>
        In condos and duplexes, a leak in one unit can inflate shared utility bills. Coordinate meter checks with neighbors and ask
        your property manager whether sub-meters are available. If not, document your own usage patterns and submit the records when
        seeking reimbursement for shared spikes. Smart flow monitors that send alerts by email can be shared across households to
        catch anomalies quickly.
      </p>
      <p>
        If your community bills through a ratio-utility-billing system (RUBS), upload consecutive statements to WaterShortcut. The
        AI will flag per-unit charges that diverge from the expected allocation, giving you a transparent basis for disputes.
      </p>
    </section>

    <section>
      <h2>Stay proactive between billing cycles</h2>
      <p>
        Set monthly reminders to log meter reads and upload fresh bills. Combine that data with simple habits—shorter showers,
        smarter irrigation schedules, and appliance maintenance—to keep usage predictable. If your next statement rises unexpectedly,
        you will have baseline records ready for a dispute or a repair ticket.
      </p>
      <div className="cta-block">
        <a className="primary-button" href="/analyze-water-bill">Upload your bill to check for leak signals</a>
        <p className="hero-copy">Our AI flags overnight flow patterns and tier jumps so you can act before the next billing cycle.</p>
      </div>
    </section>
  </PageLayout>
);

export default LeakDetectionPage;
