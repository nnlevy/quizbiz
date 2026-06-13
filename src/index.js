const SITE = "https://quizbiz.org";
const CONTACT_EMAIL = "hello@growth.business";

const styles = `
  :root {
    color-scheme: light;
    --bg: #f6f7f2;
    --ink: #11131f;
    --muted: #596072;
    --line: #d9dfd4;
    --surface: #ffffff;
    --soft: #eef6f5;
    --navy: #141a3a;
    --teal: #1b9aaa;
    --green: #89b94c;
    --coral: #f0704f;
    --gold: #f2c14e;
    --radius: 8px;
    --width: 1160px;
  }
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    margin: 0;
    background:
      linear-gradient(rgba(20,26,58,.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(20,26,58,.04) 1px, transparent 1px),
      radial-gradient(circle at top left, rgba(27,154,170,.16), transparent 34rem),
      var(--bg);
    background-size: 34px 34px, 34px 34px, auto, auto;
    color: var(--ink);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    line-height: 1.6;
  }
  a { color: inherit; }
  button, input, select { font: inherit; }
  .wrap, header, footer { width: min(calc(100% - 32px), var(--width)); margin: 0 auto; }
  header {
    display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 18px 0;
  }
  .brand { display: inline-flex; align-items: center; gap: 12px; text-decoration: none; }
  .mark {
    display: grid; width: 42px; height: 42px; place-items: center; border: 2px solid var(--ink);
    border-radius: var(--radius); background: var(--navy); color: #cde86b; box-shadow: 5px 5px 0 var(--coral);
    font-size: 1.45rem; font-weight: 900; line-height: 1;
  }
  .brand strong { display: block; line-height: 1.1; }
  .brand small { display: block; color: var(--muted); font-size: .78rem; line-height: 1.3; }
  nav, .actions { display: flex; flex-wrap: wrap; gap: 8px; }
  header nav { justify-content: flex-end; }
  nav a, .button {
    min-height: 42px; display: inline-flex; align-items: center; justify-content: center;
    border: 1px solid var(--line); border-radius: var(--radius); background: rgba(255,255,255,.88);
    color: var(--ink); cursor: pointer; font-size: .9rem; font-weight: 800; line-height: 1.1;
    padding: 10px 14px; text-decoration: none; transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
  }
  nav a:hover, .button:hover { border-color: var(--ink); box-shadow: 3px 3px 0 rgba(20,26,58,.18); transform: translate(-1px,-1px); }
  .button.primary { background: var(--navy); border-color: var(--navy); color: #fff; }
  .button.secondary { background: #fff; color: var(--navy); }
  .hero {
    display: grid; grid-template-columns: minmax(0,1.02fr) minmax(360px,.98fr); gap: 22px;
    align-items: stretch; min-height: min(72vh,680px); padding: 24px 0 12px;
  }
  .panel, .product, .card, .builder, .result, .consent, .table, .final, .legal {
    border: 1px solid var(--line); border-radius: var(--radius); background: rgba(255,255,255,.94);
    box-shadow: 0 18px 55px rgba(20,26,58,.12);
  }
  .hero-copy { display: flex; flex-direction: column; justify-content: center; padding: clamp(24px,4vw,52px); }
  .eyebrow {
    margin: 0 0 12px; color: #536014; font-size: .76rem; font-weight: 900;
    letter-spacing: .12em; line-height: 1.35; text-transform: uppercase;
  }
  h1, h2, h3, h4 { margin: 0; color: var(--ink); letter-spacing: 0; }
  h1 { max-width: 11ch; font-size: clamp(3rem,5.6vw,5.8rem); font-weight: 900; line-height: .92; }
  h2 { max-width: 12ch; font-size: clamp(2.2rem,4.4vw,4.4rem); font-weight: 900; line-height: .98; }
  h3 { font-size: 1.35rem; line-height: 1.08; }
  h4 { margin-top: 18px; font-size: .96rem; }
  p, li, .row span { color: var(--muted); }
  .hero-copy > p:not(.eyebrow) { max-width: 62ch; margin: 18px 0 0; font-size: 1.08rem; }
  .actions { margin-top: 22px; }
  .product {
    position: relative; display: grid; align-content: center; gap: 18px; overflow: hidden; padding: clamp(22px,4vw,42px);
    background: linear-gradient(135deg, rgba(27,154,170,.15), transparent 45%), linear-gradient(315deg, rgba(240,112,79,.16), transparent 42%), #fff;
  }
  .product::before {
    position: absolute; inset: -30% auto -30% -24%; width: 42%; content: "";
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.74), transparent);
    transform: rotate(10deg); animation: scan 5s ease-in-out infinite;
  }
  .product-top, .command, .metrics, .flow { position: relative; }
  .product-top { display: flex; justify-content: space-between; gap: 10px; }
  .product-top span { color: var(--muted); font-weight: 800; }
  .product-top strong { color: var(--green); }
  .flow { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
  .flow-step {
    min-height: 118px; display: grid; align-content: space-between; gap: 14px; border: 2px solid var(--ink);
    border-radius: var(--radius); background: #fff; padding: 14px; animation: float 5.5s ease-in-out infinite;
  }
  .flow-step:nth-child(2) { animation-delay: .35s; background: var(--teal); color: #fff; }
  .flow-step:nth-child(3) { animation-delay: .7s; background: #d9ef80; }
  .flow-step:nth-child(4) { animation-delay: 1.05s; background: var(--coral); color: #fff; }
  .flow-step span {
    width: 30px; height: 30px; display: grid; place-items: center; border: 1px solid currentColor;
    border-radius: 999px; font-weight: 900;
  }
  .flow-step strong { font-size: clamp(1.05rem,2vw,1.45rem); line-height: 1.05; }
  .command { border: 1px solid var(--line); border-radius: var(--radius); background: rgba(255,255,255,.9); padding: 16px; }
  .command span { display: block; width: 36%; height: 5px; margin-bottom: 12px; border-radius: 999px; background: var(--teal); animation: progress 4s ease-in-out infinite; }
  .command p { margin: 0; color: var(--ink); font-weight: 750; }
  .metrics { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 10px; }
  .metrics div { border: 1px solid var(--line); border-radius: var(--radius); background: rgba(255,255,255,.82); padding: 12px; }
  .metrics strong, .metrics span { display: block; }
  .metrics strong { font-size: 1.35rem; }
  .metrics span { color: var(--muted); font-size: .78rem; line-height: 1.25; }
  .proof {
    display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 1px; overflow: hidden;
    margin-top: 12px; border: 1px solid var(--line); border-radius: var(--radius); background: var(--line);
  }
  .proof span { display: grid; min-height: 76px; place-items: center; background: var(--navy); color: #fff; font-weight: 850; padding: 14px; text-align: center; }
  section { padding-top: clamp(56px,8vw,96px); }
  .section-head { max-width: 780px; margin-bottom: 24px; }
  .section-head p:not(.eyebrow) { max-width: 68ch; margin: 16px 0 0; font-size: 1.02rem; }
  .outcomes, .use-cases { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 14px; }
  .use-cases { grid-template-columns: repeat(3,minmax(0,1fr)); }
  .card { min-height: 190px; padding: 18px; }
  .card .label { display: block; margin-bottom: 10px; color: #536014; font-size: .74rem; font-weight: 900; letter-spacing: .1em; text-transform: uppercase; }
  .card p { margin-bottom: 0; }
  .timeline { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 1px; overflow: hidden; border: 1px solid var(--line); border-radius: var(--radius); background: var(--line); }
  .timeline article { min-height: 240px; background: #fff; padding: 20px; }
  .timeline span { width: 34px; height: 34px; display: grid; place-items: center; margin-bottom: 18px; border-radius: 999px; background: var(--navy); color: #fff; font-weight: 900; }
  .brief-grid, .trust-grid { display: grid; grid-template-columns: minmax(0,.9fr) minmax(360px,1.1fr); gap: 16px; align-items: start; }
  .builder, .result, .consent { padding: 20px; }
  .builder { display: grid; gap: 16px; }
  .builder label, .builder fieldset { display: grid; gap: 8px; min-width: 0; margin: 0; border: 0; padding: 0; color: var(--ink); font-weight: 850; }
  .builder input, .builder select { width: 100%; min-height: 46px; border: 1px solid var(--line); border-radius: var(--radius); background: #fff; color: var(--ink); padding: 10px 12px; }
  .segmented { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; }
  .segmented button { min-height: 44px; border: 1px solid var(--line); border-radius: var(--radius); background: #fff; cursor: pointer; font-weight: 800; line-height: 1.15; padding: 10px; }
  .segmented button.is-active { border-color: var(--navy); background: var(--navy); color: #fff; }
  .toggle { grid-template-columns: 20px minmax(0,1fr) !important; align-items: center; }
  .result { position: sticky; top: 12px; overflow: hidden; }
  .score { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; border-bottom: 1px solid var(--line); padding-bottom: 18px; }
  .score span { width: 76px; height: 76px; display: grid; place-items: center; border-radius: 50%; background: conic-gradient(var(--green) 0 76%, #e6e9df 76% 100%); color: var(--ink); font-size: 1.55rem; font-weight: 900; }
  .score strong { font-size: 1.2rem; }
  .result ol, .result ul { display: grid; gap: 8px; margin: 10px 0 0; padding-left: 20px; }
  .table { display: grid; overflow: hidden; }
  .row { display: grid; grid-template-columns: 170px minmax(0,1fr); gap: 16px; padding: 14px 16px; }
  .row + .row { border-top: 1px solid var(--line); }
  .consent { background: linear-gradient(180deg,#fff,var(--soft)); }
  .consent p:not(.eyebrow) { color: var(--ink); }
  .final { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 24px; align-items: center; margin-top: clamp(56px,8vw,96px); padding: clamp(22px,4vw,36px); }
  .final h2 { max-width: 14ch; }
  footer { display: flex; justify-content: space-between; gap: 24px; margin-top: 52px; border-top: 1px solid var(--line); padding: 28px 0 36px; }
  footer p { max-width: 58ch; margin: 8px 0 0; }
  .legal { max-width: 860px; margin-top: 36px; padding: clamp(24px,5vw,48px); }
  .legal h1 { max-width: none; font-size: clamp(2.4rem,5vw,4.8rem); }
  .legal section { padding-top: 20px; margin-top: 20px; border-top: 1px solid var(--line); }
  .legal h2 { max-width: none; font-size: 1.35rem; line-height: 1.15; }
  .reveal { animation: rise .7s ease both; }
  @keyframes rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scan { 0%,42% { transform: translateX(0) rotate(10deg); } 74%,100% { transform: translateX(370%) rotate(10deg); } }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
  @keyframes progress { 0%,100% { width: 28%; } 50% { width: 78%; } }
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; }
  }
  @media (max-width: 980px) {
    header, footer { align-items: flex-start; flex-direction: column; }
    header nav { justify-content: flex-start; }
    .hero, .brief-grid, .trust-grid, .final { grid-template-columns: 1fr; }
    .outcomes, .timeline { grid-template-columns: repeat(2,minmax(0,1fr)); }
    .result { position: static; }
  }
  @media (max-width: 740px) {
    .wrap, header, footer, .legal { width: min(calc(100% - 20px), var(--width)); }
    h1 { max-width: none; font-size: clamp(2.25rem,12vw,3.25rem); line-height: .96; overflow-wrap: break-word; }
    h2 { max-width: none; font-size: clamp(1.85rem,9vw,2.7rem); }
    .flow, .proof, .outcomes, .use-cases, .timeline, .metrics, .segmented { grid-template-columns: 1fr; }
    .row { grid-template-columns: 1fr; gap: 4px; }
    .button, nav a { width: 100%; }
  }
`;

const script = `
  const labels = {
    priority: { capture: "Lead capture", followup: "Follow-up", pipeline: "Pipeline routing", content: "Content ops" },
    volume: { low: "Under 50 leads/mo", medium: "50-250 leads/mo", high: "250+ leads/mo" },
    speed: { instant: "Instant response", "same-day": "Same-day response", weekly: "Weekly operating rhythm" }
  };
  function state() {
    return {
      company: document.querySelector("#company").value || "Service business",
      market: document.querySelector("#market").value || "Your audience",
      priority: document.querySelector("[data-priority].is-active").dataset.priority,
      volume: document.querySelector("[data-volume].is-active").dataset.volume,
      speed: document.querySelector("#speed").value,
      sms: document.querySelector("#sms").checked
    };
  }
  function buildBrief(s) {
    const priorityScore = s.priority === "capture" || s.priority === "followup" ? 28 : 22;
    const volumeScore = s.volume === "high" ? 26 : s.volume === "medium" ? 21 : 16;
    const speedScore = s.speed === "instant" ? 24 : s.speed === "same-day" ? 19 : 13;
    const score = Math.min(97, priorityScore + volumeScore + speedScore + (s.sms ? 12 : 8));
    const title = s.priority === "capture" ? "AI intake and booking workflow" : s.priority === "followup" ? "AI follow-up and status workflow" : s.priority === "pipeline" ? "AI routing and pipeline workflow" : "AI content operations workflow";
    const automation = s.priority === "content" ? "Convert qualified questions into concise pages, reply drafts, and sales enablement notes." : s.priority === "pipeline" ? "Classify each inquiry by offer fit, urgency, source, and owner before a human reviews it." : s.priority === "followup" ? "Draft next-step replies, reminders, and status updates from the intake record." : "Capture the request, identify missing fields, and recommend the fastest booking path.";
    return { score, title, automation, summary: (s.market || "Your audience") + " should receive a faster, clearer response path built around " + labels.priority[s.priority].toLowerCase() + ", " + labels.volume[s.volume].toLowerCase() + ", and a " + labels.speed[s.speed].toLowerCase() + " expectation.", firstSteps: ["Map the top 3 " + (s.company || "business") + " inquiry types and the exact next step each one deserves.", "Create a single intake record with source, urgency, offer fit, consent status, and owner.", s.sms ? "Add optional SMS language with STOP/HELP instructions and a consent timestamp." : "Keep email as the primary follow-up channel until SMS consent is explicitly collected."] };
  }
  function render() {
    const brief = buildBrief(state());
    document.querySelector("#score").textContent = brief.score;
    document.querySelector("#hero-score").textContent = brief.score + "% ready";
    document.querySelector("#brief-title-out").textContent = brief.title;
    document.querySelector("#brief-summary").textContent = brief.summary;
    document.querySelector("#command-copy").textContent = brief.automation;
    document.querySelector("#steps").innerHTML = brief.firstSteps.map((item) => "<li>" + item + "</li>").join("");
  }
  document.querySelectorAll("[data-priority]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-priority]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    render();
  }));
  document.querySelectorAll("[data-volume]").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll("[data-volume]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    render();
  }));
  document.querySelectorAll("input, select").forEach((item) => item.addEventListener("input", render));
  render();
`;

const csp = [
  "default-src 'self'",
  "img-src 'self' data:",
  "style-src 'unsafe-inline'",
  "script-src 'unsafe-inline'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
].join("; ");

const html = (title, description, body, pagePath = "/") => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${SITE}${pagePath}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${SITE}${pagePath}" />
  <meta property="og:image" content="${SITE}/og/quizbiz-og.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <style>${styles}</style>
</head>
<body>
  <header>
    <a class="brand" href="/" aria-label="Quizbiz home">
      <span class="mark" aria-hidden="true">Q</span>
      <span><strong>Growth.business</strong><small>by Quizbiz LLC</small></span>
    </a>
    <nav aria-label="Primary">
      <a href="/#platform">Platform</a>
      <a href="/#brief">Brief</a>
      <a href="/#trust">Trust</a>
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
    </nav>
  </header>
  ${body}
  <footer>
    <div>
      <strong>Quizbiz LLC</strong>
      <p>Public trust home for Growth.business, customer messaging disclosures, and AI-assisted business workflow initiatives.</p>
    </div>
    <nav aria-label="Footer">
      <a href="/privacy">Privacy</a>
      <a href="/terms">Terms</a>
      <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
    </nav>
  </footer>
</body>
</html>`;

const home = html(
  "Growth.business by Quizbiz LLC | AI Growth Workflows",
  "B2B AI-assisted intake, follow-up, and customer messaging workflows from Quizbiz LLC doing business as Growth.business.",
  `<main class="wrap">
    <section class="hero" aria-labelledby="home-title">
      <div class="panel hero-copy reveal">
        <p class="eyebrow">Growth.business by Quizbiz LLC</p>
        <h1 id="home-title">Turn missed demand into booked work.</h1>
        <p>A B2B growth workflow studio for teams that need faster intake, clearer follow-up, and compliant customer messaging without adding operational drag.</p>
        <div class="actions">
          <a class="button primary" href="#brief">Generate a growth brief</a>
          <a class="button secondary" href="#trust">Review messaging terms</a>
        </div>
      </div>
      <div class="product reveal" aria-label="Growth workflow preview">
        <div class="product-top"><span>Live workflow</span><strong id="hero-score">80% ready</strong></div>
        <div class="flow">
          <div class="flow-step"><span>1</span><strong>Intent capture</strong></div>
          <div class="flow-step"><span>2</span><strong>AI brief</strong></div>
          <div class="flow-step"><span>3</span><strong>Human review</strong></div>
          <div class="flow-step"><span>4</span><strong>Follow-up loop</strong></div>
        </div>
        <div class="command"><span></span><p id="command-copy">Capture the request, identify missing fields, and recommend the fastest booking path.</p></div>
        <div class="metrics" aria-label="Operating metrics">
          <div><strong>8 min</strong><span>target first response</span></div>
          <div><strong>4</strong><span>review checkpoints</span></div>
          <div><strong>0</strong><span>shared opt-in lists</span></div>
        </div>
      </div>
    </section>
    <div class="proof" aria-label="Quizbiz service promises">
      <span>Lead intake</span><span>AI brief generation</span><span>Human review</span><span>Optional SMS</span>
    </div>

    <section id="platform">
      <div class="section-head">
        <p class="eyebrow">Platform</p>
        <h2>Built for revenue teams that need useful follow-up, not more software theater.</h2>
        <p>Quizbiz LLC packages Growth.business workflows around a simple operating loop: capture demand, generate a useful brief, review the next action, and keep the customer informed.</p>
      </div>
      <div class="outcomes">
        <article class="card reveal"><h3>Capture demand</h3><p>Convert calls, forms, email, and campaign clicks into structured intake that a team can act on.</p></article>
        <article class="card reveal"><h3>Respond fast</h3><p>Generate useful first replies, reminders, and status updates while customer intent is still warm.</p></article>
        <article class="card reveal"><h3>Route work</h3><p>Match the request to the right offer, domain property, owner, or next step without manual sorting.</p></article>
        <article class="card reveal"><h3>Keep consent clear</h3><p>Make opt-in, opt-out, privacy, and messaging expectations visible before any text program scales.</p></article>
      </div>
    </section>

    <section aria-labelledby="workflow-title">
      <div class="section-head">
        <p class="eyebrow">Operating model</p>
        <h2 id="workflow-title">Every workflow is designed to be auditable before it scales.</h2>
      </div>
      <div class="timeline">
        <article><span>1</span><h3>Intent capture</h3><p>Forms, calls, landing pages, and campaign responses become one clean intake stream.</p></article>
        <article><span>2</span><h3>AI brief</h3><p>Each inquiry is summarized with fit, urgency, missing context, and recommended next action.</p></article>
        <article><span>3</span><h3>Human review</h3><p>Teams approve customer-facing language, offers, and edge-case handling before escalation.</p></article>
        <article><span>4</span><h3>Follow-up loop</h3><p>Email and optional SMS updates keep buyers informed with clear consent records.</p></article>
      </div>
    </section>

    <section id="brief" aria-labelledby="brief-title">
      <div class="section-head">
        <p class="eyebrow">AI growth brief</p>
        <h2 id="brief-title">Generate a practical starting point in under a minute.</h2>
        <p>This interactive brief builder turns a business situation into a recommended workflow, launch checklist, and risk notes. It runs client-side and does not require an account.</p>
      </div>
      <div class="brief-grid">
        <form class="builder">
          <label>Business type <input id="company" value="Service business" placeholder="e.g. HVAC company, search firm, SaaS agency" /></label>
          <label>Audience <input id="market" value="Local and B2B buyers" placeholder="e.g. local homeowners, B2B buyers" /></label>
          <fieldset><legend>Priority</legend><div class="segmented">
            <button class="is-active" type="button" data-priority="capture">Lead capture</button>
            <button type="button" data-priority="followup">Follow-up</button>
            <button type="button" data-priority="pipeline">Pipeline routing</button>
            <button type="button" data-priority="content">Content ops</button>
          </div></fieldset>
          <fieldset><legend>Monthly volume</legend><div class="segmented">
            <button type="button" data-volume="low">Under 50 leads/mo</button>
            <button class="is-active" type="button" data-volume="medium">50-250 leads/mo</button>
            <button type="button" data-volume="high">250+ leads/mo</button>
          </div></fieldset>
          <label>Response expectation <select id="speed"><option value="instant">Instant response</option><option selected value="same-day">Same-day response</option><option value="weekly">Weekly operating rhythm</option></select></label>
          <label class="toggle"><input id="sms" checked type="checkbox" /> Include optional SMS readiness</label>
        </form>
        <article class="result" aria-live="polite">
          <div class="score"><span id="score">80</span><strong>Readiness score</strong></div>
          <p class="eyebrow">Recommended workflow</p>
          <h3 id="brief-title-out">AI intake and booking workflow</h3>
          <p id="brief-summary">Local and B2B buyers should receive a faster, clearer response path.</p>
          <h4>First 7 days</h4>
          <ol id="steps"></ol>
          <h4>Launch checks</h4>
          <ul>
            <li>Publish privacy and messaging terms before launching outbound text updates.</li>
            <li>Keep human review on offer terms, pricing, sensitive requests, and unclear consent.</li>
            <li>Track response time, qualified rate, booked rate, opt-out rate, and unresolved requests.</li>
          </ul>
        </article>
      </div>
    </section>

    <section id="use-cases">
      <div class="section-head">
        <p class="eyebrow">Use cases</p>
        <h2>Focused workflows for service, search, and content-led growth.</h2>
      </div>
      <div class="use-cases">
        <article class="card reveal"><span class="label">Service teams</span><h3>From inquiry to booked work</h3><p>Qualify requests, explain the next step, and reduce missed follow-up across high-intent leads.</p></article>
        <article class="card reveal"><span class="label">Recruiting and search</span><h3>Cleaner candidate and client intake</h3><p>Turn vague messages into structured briefs that make specialization, urgency, and fit easier to see.</p></article>
        <article class="card reveal"><span class="label">Content operations</span><h3>Authority pages with a reason to exist</h3><p>Convert operational knowledge into useful explainers, comparison pages, and buyer guidance.</p></article>
      </div>
    </section>

    <section id="trust">
      <div class="section-head">
        <p class="eyebrow">Trust and messaging</p>
        <h2>Clear public disclosures for customer communication programs.</h2>
        <p>Quizbiz.org is the public policy surface for Quizbiz LLC and Growth.business. Text messaging is used only for requested updates and service communication.</p>
      </div>
      <div class="trust-grid">
        <div class="table">
          ${[
            ["Business identity", "Quizbiz LLC, doing business as Growth.business."],
            ["Messaging purpose", "Requested project updates, onboarding reminders, support follow-ups, and service notifications."],
            ["Audience", "Customers, leads, and collaborators who explicitly ask to receive text messages."],
            ["Frequency", "Message frequency varies by request; recurring programs disclose expected frequency at opt-in."],
            ["Costs", "Message and data rates may apply."],
            ["Opt-out", "Reply STOP to unsubscribe. Reply HELP for help."],
            ["Consent", "Text consent is optional and is not a condition of purchase or service."],
            ["Data sharing", "Mobile opt-in data and consent are not shared or sold to third parties."],
          ].map(([label, value]) => `<div class="row"><strong>${label}</strong><span>${value}</span></div>`).join("")}
        </div>
        <aside class="consent">
          <p class="eyebrow">Sample opt-in language</p>
          <p>By submitting a request, you agree to receive text messages from Quizbiz LLC / Growth.business about your project or service request. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe or HELP for help.</p>
          <div class="actions"><a class="button primary" href="/privacy">Privacy</a><a class="button secondary" href="/terms">Terms</a></div>
        </aside>
      </div>
    </section>

    <section class="final">
      <div>
        <p class="eyebrow">Next step</p>
        <h2>Launch a workflow customers can understand.</h2>
        <p>Start with one painful follow-up moment, one clear consent path, and one measurable operating loop.</p>
      </div>
      <a class="button primary" href="mailto:${CONTACT_EMAIL}?subject=Growth.business workflow request">Start a workflow</a>
    </section>
  </main>
  <script>${script}</script>`,
);

const legalPages = {
  "/privacy": {
    title: "Privacy Policy | Quizbiz LLC",
    description: "Privacy policy for Quizbiz LLC, Growth.business, Quizbiz.org, and optional text messaging services.",
    heading: "Privacy Policy",
    intro: "Quizbiz LLC operates Quizbiz.org as the public trust and policy home for Growth.business services and related business initiatives.",
    sections: [
      ["Who Operates This Site", [`Quizbiz LLC operates Quizbiz.org and does business as Growth.business for AI-assisted growth systems, intake workflows, and related business services.`, `Questions about privacy can be sent to ${CONTACT_EMAIL}.`]],
      ["Information We Collect", ["We may collect information you choose to send, such as your name, email address, business details, message, and phone number when you request a follow-up.", "Interactive tools on this site can run in your browser to generate a recommendation. Submitting a tool is not required to browse the site."]],
      ["Text Messaging Privacy", ["If you opt in to text messages, we use your phone number and consent record only to send the messages you requested, such as project updates, onboarding reminders, support follow-ups, and service notifications.", "No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.", "You can opt out at any time by replying STOP. You can request help by replying HELP."]],
      ["Service Providers", ["We may use vendors for hosting, analytics, security, messaging delivery, and operations. These vendors are authorized to use information only to provide services to Quizbiz LLC.", "We do not sell personal information or mobile opt-in consent data."]],
      ["Updates", ["We may update this policy as services change. The public version on Quizbiz.org is the current version."]],
    ],
  },
  "/terms": {
    title: "Terms and Messaging Terms | Quizbiz LLC",
    description: "Terms of service and mobile messaging terms for Quizbiz LLC, Growth.business, and Quizbiz.org.",
    heading: "Terms and Messaging Terms",
    intro: "These terms govern Quizbiz.org, Growth.business services, and optional text messaging programs operated by Quizbiz LLC.",
    sections: [
      ["Use of the Site", ["Quizbiz.org provides service information, business policies, and educational material about AI-assisted growth systems.", "The site is not legal, tax, financial, or compliance advice. You are responsible for decisions you make based on the content."]],
      ["Mobile Messaging Terms", ["By opting in, you agree to receive text messages from Quizbiz LLC / Growth.business about requested project updates, onboarding reminders, support follow-ups, and service notifications.", "Message frequency varies based on your request or active project. Message and data rates may apply.", "Reply STOP to unsubscribe. Reply HELP for help.", "Text consent is optional and is not a condition of purchase or service."]],
      ["Acceptable Use", ["Do not use the site or messaging channels for unlawful, abusive, misleading, or harmful activity.", "Do not submit information that you do not have permission to share."]],
      ["No Guaranteed Outcomes", ["AI-assisted workflows can help organize work, generate recommendations, and improve follow-up, but Quizbiz LLC does not guarantee business growth, revenue, ranking, deliverability, or approval by any third-party platform."]],
      ["Contact", [`Questions about these terms can be sent to ${CONTACT_EMAIL}.`]],
    ],
  },
};

function renderLegal(page, path) {
  const sections = page.sections
    .map(([heading, paragraphs]) => `<section><h2>${heading}</h2>${paragraphs.map((p) => `<p>${p}</p>`).join("")}</section>`)
    .join("");

  return html(
    page.title,
    page.description,
    `<main class="legal">
      <p class="eyebrow">Quizbiz LLC</p>
      <h1>${page.heading}</h1>
      <p>${page.intro}</p>
      ${sections}
    </main>`,
    path,
  );
}

function textResponse(body, contentType = "text/html; charset=utf-8") {
  return new Response(body, {
    headers: {
      "content-type": contentType,
      "content-security-policy": csp,
      "x-content-type-options": "nosniff",
      "referrer-policy": "strict-origin-when-cross-origin",
      "permissions-policy": "camera=(), microphone=(), geolocation=()",
    },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, "") || "/";

    if (pathname === "/robots.txt") {
      return textResponse(`User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`, "text/plain; charset=utf-8");
    }

    if (pathname === "/sitemap.xml") {
      return textResponse(
        `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE}/</loc></url><url><loc>${SITE}/privacy</loc></url><url><loc>${SITE}/terms</loc></url></urlset>`,
        "application/xml; charset=utf-8",
      );
    }

    if (pathname === "/security.txt" || pathname === "/.well-known/security.txt") {
      return textResponse(`Contact: mailto:${CONTACT_EMAIL}\nPreferred-Languages: en\nCanonical: ${SITE}/.well-known/security.txt\n`, "text/plain; charset=utf-8");
    }

    if (legalPages[pathname]) {
      return textResponse(renderLegal(legalPages[pathname], pathname));
    }

    return textResponse(home);
  },
};
