import PageLayout from "./PageLayout";

const ReadWaterBillPage = () => (
  <PageLayout
    title="How to Read and Understand Your Water Bill"
    subtitle="Decode line items, meter reads, and seasonal charges so you can spot errors before they drain your budget."
  >
    <section>
      <h2>Why mastering your water bill matters</h2>
      <p>
        A single unexpected surcharge or misread meter can inflate your utility costs for months. When you know how to read the
        document, you gain leverage to dispute incorrect charges, plan for seasonal swings, and track the impact of conservation
        upgrades. The WaterShortcut upload tool is designed to surface that context instantly, but it helps to understand the
        structure of the bill you are scanning.
      </p>
      <ul>
        <li><strong>Billing periods:</strong> Confirm the start and end dates match your household&apos;s occupancy and meter access.</li>
        <li><strong>Service vs. consumption:</strong> Separate fixed service fees from usage-based charges so you can control what&apos;s variable.</li>
        <li><strong>Tier thresholds:</strong> Many utilities charge higher rates once you cross a volume threshold; these tiers hide in fine print.</li>
        <li><strong>Adjustments and credits:</strong> Look for drought surcharges, leak forgiveness, rebates, and conservation incentives.</li>
      </ul>
    </section>

    <section>
      <h2>Key sections you should audit every month</h2>
      <p>
        Most utilities follow a predictable layout. Use this checklist to flag anomalies before they become expensive patterns.
      </p>
      <ol>
        <li>
          <strong>Account overview:</strong> Verify your service address, billing period, and customer identifier. If the meter
          serial number changed, it could signal a replacement that needs a reset reading.
        </li>
        <li>
          <strong>Meter readings:</strong> Compare the current and previous read, and note whether the meter is measured in gallons,
          cubic feet, or liters. If the difference seems inconsistent with your lifestyle, request a reread.
        </li>
        <li>
          <strong>Usage history graphs:</strong> Review the 12-month chart; sudden jumps outside of seasonal weather shifts can be
          early leak indicators.
        </li>
        <li>
          <strong>Rate table:</strong> Capture the per-unit cost at each tier. Mark where your household falls today and what you
          would save by dropping to the next tier.
        </li>
        <li>
          <strong>Taxes and fees:</strong> Utility taxes, drought surcharges, wastewater impact fees, and stormwater line items
          often move independently of usage. Track each one separately.
        </li>
      </ol>
    </section>

    <section>
      <h2>Practical math for confident bill reviews</h2>
      <p>
        The numbers on a bill can look intimidating, but a few quick calculations help you validate accuracy and project savings.
      </p>
      <ul>
        <li>
          <strong>Convert units:</strong> If the utility measures in CCF (hundred cubic feet), multiply by 748 to translate into gallons.
        </li>
        <li>
          <strong>Daily average:</strong> Divide total gallons by the billing-period days to set a baseline for household consumption.
        </li>
        <li>
          <strong>Cost per gallon:</strong> Divide your total charge by gallons used to understand the true blended rate, including fees.
        </li>
        <li>
          <strong>Tier proximity:</strong> If you are near a higher tier, a modest reduction—skipping one outdoor watering—may push you below it.
        </li>
      </ul>
      <p>
        After you upload a bill to WaterShortcut, our AI performs these calculations automatically, highlights your cost-per-gallon,
        and flags tier thresholds worth targeting.
      </p>
    </section>

    <section>
      <h2>Red flags that deserve a closer look</h2>
      <p>
        Certain patterns reliably indicate hidden problems. When you see them, take action quickly to avoid compounding charges.
      </p>
      <ul>
        <li>
          <strong>Estimated reads:</strong> A bill marked as &quot;estimated&quot; may be replaced later with a true-up that wipes out your
          savings. Request an actual read if it happens more than once.
        </li>
        <li>
          <strong>Seasonal surcharges:</strong> Drought or irrigation fees often show up in warm months. If they persist into winter,
          it may be an error.
        </li>
        <li>
          <strong>Wastewater charges tied to water use:</strong> Some utilities peg sewer fees to winter consumption. A spike in
          those months has a double cost.
        </li>
        <li>
          <strong>Unfamiliar programs:</strong> Line-item names like &quot;capital recovery&quot; or &quot;environmental compliance&quot; should align
          with public rate announcements. If not, ask for documentation.
        </li>
      </ul>
    </section>

    <section>
      <h2>Organize your data for disputes and savings</h2>
      <p>
        Keep a running log of meter readings, notes on unusual events (house guests, irrigation repairs, appliance upgrades), and
        photos of your bill. This documentation strengthens dispute cases and helps you prioritize upgrades.
      </p>
      <ul>
        <li>Store PDF copies of each bill and screenshots of meter displays before and after maintenance.</li>
        <li>Tag months with atypical behavior, like vacations or landscaping projects, to contextualize usage swings.</li>
        <li>Maintain a list of rebates you have claimed and their expiration dates to avoid missing out.</li>
        <li>Record follow-ups with customer service so you have a paper trail when charges need to be reversed.</li>
      </ul>
      <p>
        WaterShortcut&apos;s uploader keeps this organized by extracting line items and crafting a personalized checklist you can act on
        immediately.
      </p>
    </section>

    <section>
      <h2>Frequently asked questions about statements</h2>
      <p>
        Customers often ask whether rounding errors or meter replacements can change totals. The short answer: yes, tiny changes
        accumulate. If your utility upgraded meters to radio-read units, the read schedule may shift and temporarily exaggerate
        usage. If your bill rounds to the nearest hundred gallons, small leaks can hide for several cycles before appearing as a
        spike. Always compare the number of days in the billing period and keep an eye on footnotes that explain adjustments.
      </p>
      <p>
        Another common concern is how irrigation impacts sewer charges. Many utilities assume winter water use equals wastewater
        discharge and base sewer fees on that average. If you irrigate heavily in the winter, that assumption overstates what you
        send to the sewer system. Uploading a winter bill to WaterShortcut helps our AI recommend whether to ask for a sewer cap
        adjustment or a dedicated irrigation meter.
      </p>
    </section>

    <section>
      <h2>Next steps: get a bill health report in minutes</h2>
      <p>
        Upload a recent statement to generate a custom report that highlights suspect fees, potential leaks, and rebate matches for
        your region. You will see projected savings from simple changes like shorter showers or adjusted irrigation schedules, and
        get language you can use when contacting your utility.
      </p>
      <div className="cta-block">
        <a className="primary-button" href="/upload">
          Upload your water bill
        </a>
        <p className="hero-copy">Free analysis with privacy controls and compliance-ready consent options.</p>
      </div>
    </section>
  </PageLayout>
);

export default ReadWaterBillPage;
