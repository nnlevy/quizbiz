import PageLayout from "./PageLayout";

const WaterSavingTipsPage = () => (
  <PageLayout
    title="Water-Saving Tips That Cut Bills and Protect Your Community"
    subtitle="Blend quick wins with long-term upgrades to lower consumption without sacrificing comfort."
  >
    <section>
      <h2>Start with habits that cost nothing</h2>
      <ul>
        <li>Shorten daily showers by 2–3 minutes to save dozens of gallons per person every week.</li>
        <li>Run dishwashers and washing machines with full loads and eco modes enabled.</li>
        <li>Use a bowl to rinse produce instead of running water continuously over the sink.</li>
        <li>Set irrigation controllers to skip watering after rainfall, or water before sunrise to reduce evaporation.</li>
      </ul>
      <p>
        WaterShortcut&apos;s usage calculator on the homepage lets you model the savings from each change. Uploading your bill gives
        you a custom plan that prioritizes the highest-impact habits for your region.
      </p>
    </section>

    <section>
      <h2>Target fixtures with the best payback</h2>
      <p>
        Upgrading fixtures can cut thousands of gallons each year. Focus on items that combine high flow rates with frequent use.
      </p>
      <ol>
        <li><strong>Toilets:</strong> Replace legacy 3.5+ gpf units with WaterSense-certified 1.28 gpf models.</li>
        <li><strong>Showerheads:</strong> Swap to 1.5–2.0 gpm designs with pause buttons for shaving or shampooing.</li>
        <li><strong>Faucet aerators:</strong> Install 0.5–1.0 gpm aerators in bathrooms and 1.5 gpm aerators in kitchens.</li>
        <li><strong>Appliances:</strong> Choose ENERGY STAR dishwashers and washers; they lower both water and power bills.</li>
      </ol>
      <p>
        Keep receipts and model numbers. WaterShortcut&apos;s report can reference them when you ask utilities for rebates or tier
        adjustments.
      </p>
    </section>

    <section>
      <h2>Smart irrigation for landscapes that stay green</h2>
      <ul>
        <li>Convert spray zones to drip lines around shrubs and trees to reduce wind loss.</li>
        <li>Install a soil moisture sensor to automate skip days during damp weather.</li>
        <li>Group plants by water needs and adjust run times seasonally instead of using a fixed schedule.</li>
        <li>Audit irrigation annually for broken heads, tilted risers, and clogged filters.</li>
      </ul>
      <p>
        Every gallon saved outdoors prevents tier jumps in summer, when rates often peak. Upload an early-summer bill and a late-summer
        bill to see the impact of irrigation tuning and catch anomalies before fall.
      </p>
    </section>

    <section>
      <h2>Reduce hot water waste and energy at the same time</h2>
      <p>
        Heating water consumes significant energy. Insulate hot water pipes, set the water heater to 120°F, and fix dripping hot
        taps immediately. If you own your water heater, flush sediment annually to maintain efficiency. These steps lower both your
        water and energy bills, and they make hot water available faster—cutting the wait time that sends clean water down the drain.
      </p>
    </section>

    <section>
      <h2>Make conservation a team sport</h2>
      <p>
        Success sticks when everyone participates. Post a simple leaderboard on the fridge that tracks weekly shower times or the
        number of skipped irrigation cycles. Celebrate milestones with a reward funded by the savings—low-flow upgrades or a free
        car wash that uses recycled water. If you manage a small business, assign champions for the break room, restrooms, and
        landscaping and rotate responsibilities monthly.
      </p>
      <p>
        Uploading a bill after each challenge lets WaterShortcut show how habits convert into lower gallons per day and lower
        wastewater charges. Seeing the graph move keeps the momentum alive.
      </p>
    </section>

    <section>
      <h2>Build a yearly upgrade roadmap</h2>
      <p>
        Instead of replacing everything at once, build a calendar of upgrades: aerators this month, showerheads next quarter,
        irrigation tune-up before summer, and appliance replacements aligned with rebates. Capture each change in a log alongside
        your bill uploads so you can measure the savings trend.
      </p>
      <div className="cta-block">
        <a className="primary-button" href="/upload">Upload a bill for a personalized savings plan</a>
        <p className="hero-copy">Our AI highlights the top three actions that drop you into cheaper tiers and lower wastewater fees.</p>
      </div>
    </section>
  </PageLayout>
);

export default WaterSavingTipsPage;
