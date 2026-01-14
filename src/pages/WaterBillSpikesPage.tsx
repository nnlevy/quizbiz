import PageLayout from "./PageLayout";

const WaterBillSpikesPage = () => (
  <PageLayout
    title="What to Do When Your Water Bill Spikes"
    subtitle="Use structured troubleshooting to find the cause, dispute charges, and prevent repeat surprises."
  >
    <section>
      <h2>Map out the spike</h2>
      <p>
        Start by quantifying the change. Compare the latest bill to the prior three billing periods and the same period last year.
        Note the difference in gallons, the number of days in each period, and any new fees. Upload both bills to WaterShortcut so
        the AI can generate a side-by-side comparison and highlight the largest deltas.
      </p>
    </section>

    <section>
      <h2>Common culprits to investigate</h2>
      <ul>
        <li><strong>Silent leaks:</strong> Running toilets and irrigation breaks often generate steady, round-the-clock usage.</li>
        <li><strong>Seasonal irrigation:</strong> Controllers that failed to scale back after summer can keep running in cool months.</li>
        <li><strong>Estimated meter reads:</strong> Utilities sometimes estimate when meters are inaccessible; the catch-up bill is higher.</li>
        <li><strong>Tier crossover:</strong> Crossing a usage threshold can raise per-gallon prices even if gallons only rose slightly.</li>
        <li><strong>Rate changes or surcharges:</strong> Drought fees, wastewater surcharges, and stormwater adjustments may be new.</li>
      </ul>
    </section>

    <section>
      <h2>Actions you can take immediately</h2>
      <ol>
        <li>
          <strong>Check the meter today:</strong> If it moves with fixtures off, shut off water to toilets or irrigation zones one by one to isolate the leak.
        </li>
        <li>
          <strong>Document evidence:</strong> Take photos of meter readings, wet spots, or faulty valves. Save screenshots of the bill and notes about household changes.
        </li>
        <li>
          <strong>Call your utility:</strong> Ask whether the bill was estimated, whether rates changed, and if leak forgiveness programs exist.
        </li>
        <li>
          <strong>Submit a dispute if needed:</strong> Provide evidence and request an adjustment or payment plan while repairs occur.
        </li>
      </ol>
    </section>

    <section>
      <h2>Prevent future spikes</h2>
      <p>
        Once the immediate issue is contained, set up a routine to avoid a repeat. Install smart leak detectors, schedule quarterly
        meter checks, and revisit irrigation schedules as seasons change. Keep a log of actions in the same place you store bill
        uploads so trends are easy to spot.
      </p>
      <p>
        Consider setting threshold alerts on smart meters or flow monitors. A simple rule—text me when hourly usage exceeds a set
        number—can stop a surprise within hours instead of weeks. Pair alerts with a response plan: who will shut off the main
        valve, which plumber to call, and how to contact the utility after hours.
      </p>
      <div className="cta-block">
        <a className="primary-button" href="/analyze-water-bill">Upload two bills for a spike investigation</a>
        <p className="hero-copy">WaterShortcut highlights line items that changed most, then recommends fixes and talking points for your utility.</p>
      </div>
    </section>
  </PageLayout>
);

export default WaterBillSpikesPage;
