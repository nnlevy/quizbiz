export const stylesCss = `:root{color-scheme:light;font-family:"Inter",system-ui,-apple-system,Segoe UI,sans-serif;background:#f7fbff;}
*{box-sizing:border-box;}body{margin:0;color:#0f172a;background:#f7fbff;}a{color:#0d6efd;text-decoration:none;}a:hover{text-decoration:underline;}header,main,footer{width:100%;}img{max-width:100%;display:block;}button,input,select,textarea{font-family:inherit;}button{cursor:pointer;}body.prefers-reduced-motion *{transition:none!important;animation:none!important;}
.app-shell{min-height:100vh;display:flex;flex-direction:column;} .site-header{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.92);backdrop-filter:blur(6px);border-bottom:1px solid #e2e8f0;} .nav-bar{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:14px 18px;gap:12px;} .brand a{font-weight:700;color:#0f172a;font-size:18px;display:flex;align-items:center;gap:8px;} .brand span{display:inline-block;padding:6px 10px;border-radius:12px;background:#e0f2ff;color:#075985;font-weight:700;} .nav-links{display:flex;align-items:center;gap:12px;flex-wrap:wrap;} .nav-links a{padding:8px 10px;border-radius:10px;color:#0f172a;font-weight:600;transition:all .2s ease;} .nav-links a:hover,.nav-links a:focus-visible{background:#e0f2ff;outline:none;} .primary-cta{background:#0ea5e9;color:white;} .primary-cta:hover,.primary-cta:focus-visible{background:#0284c7;color:white;}
main{flex:1;} .hero{max-width:1100px;margin:0 auto;padding:40px 18px 18px;display:grid;gap:14px;} .hero h1{margin:0;font-size:32px;color:#0f172a;} .hero p{margin:0;color:#1f2937;font-size:17px;max-width:70ch;} .hero .actions{display:flex;gap:12px;flex-wrap:wrap;} .btn{padding:12px 14px;border-radius:12px;border:1px solid #0ea5e9;background:white;color:#0ea5e9;font-weight:700;transition:transform .2s ease,box-shadow .2s ease;} .btn:hover,.btn:focus-visible{transform:translateY(-1px);box-shadow:0 10px 30px rgba(14,165,233,0.18);outline:none;} .btn.primary{background:#0ea5e9;color:white;border-color:#0ea5e9;} .btn.secondary{border-color:#e2e8f0;color:#0f172a;} .badge{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;background:#e0f2ff;color:#075985;font-weight:700;font-size:13px;}
.section{max-width:1100px;margin:0 auto;padding:28px 18px;} .section h2{margin:0 0 12px;font-size:24px;} .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;} .card{padding:16px;border:1px solid #e2e8f0;border-radius:14px;background:white;box-shadow:0 8px 24px rgba(15,23,42,0.05);display:flex;flex-direction:column;gap:10px;} .card h3{margin:0;font-size:18px;} .card p{margin:0;color:#334155;} .card .small{font-size:14px;color:#475569;} .inline-list{display:flex;gap:10px;flex-wrap:wrap;} .inline-list a{padding:8px 10px;border-radius:10px;background:#e0f2ff;color:#075985;font-weight:700;}
.blog-page main{display:flex;justify-content:center;} .blog-shell{max-width:800px;width:100%;margin:0 auto;padding:28px 18px;} .blog-article{background:white;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 12px 36px rgba(15,23,42,0.08);display:grid;gap:18px;padding:22px;} .blog-header h1{margin:0;font-size:32px;color:#0f172a;} .blog-header .lead{margin:8px 0 0;color:#1f2937;font-size:17px;line-height:1.6;} .blog-section{display:grid;gap:10px;} .blog-section h2{margin:0;font-size:22px;color:#0f172a;} .blog-section p,.blog-section li{color:#1f2937;line-height:1.6;} .blog-section ol{padding-left:20px;display:grid;gap:8px;} .blog-footer{margin-top:6px;} .eyebrow{letter-spacing:0.08em;text-transform:uppercase;font-weight:800;color:#075985;margin:0;} .lead{font-weight:600;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;} .bullet-list{padding-left:18px;display:grid;gap:8px;color:#1f2937;} .faq{border:1px solid #e2e8f0;border-radius:12px;background:white;} .faq-item{border-top:1px solid #e2e8f0;} .faq-item:first-of-type{border-top:none;} .faq button{width:100%;text-align:left;padding:14px;border:none;background:none;font-weight:700;display:flex;justify-content:space-between;align-items:center;} .faq .answer{padding:0 14px 14px;color:#334155;display:none;} .faq .answer.open{display:block;}
.layout-slab{background:white;border-radius:18px;border:1px solid #e2e8f0;box-shadow:0 10px 40px rgba(15,23,42,0.06);padding:18px;} .meta-line{font-size:14px;color:#475569;}
.footer{margin-top:30px;background:#0f172a;color:white;} .footer .footer-inner{max-width:1100px;margin:0 auto;padding:24px 18px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;} .footer a{color:#bae6fd;} .footer-links{display:flex;gap:12px;flex-wrap:wrap;} .footnote{font-size:13px;color:#cbd5e1;} .ad-slot-placeholder{min-height:250px;border:1px dashed #cbd5e1;border-radius:12px;background:linear-gradient(135deg,#f0f9ff,#e2e8f0);display:flex;align-items:center;justify-content:center;color:#475569;font-weight:600;} .ad-slot{display:block;min-height:250px;width:100%;margin:12px auto;text-align:center;}
.table{width:100%;border-collapse:collapse;} .table td,.table th{border:1px solid #e2e8f0;padding:10px;} .table th{background:#f0f9ff;text-align:left;}
label{display:block;font-weight:700;margin-bottom:6px;color:#0f172a;} input,select,textarea{width:100%;padding:11px;border-radius:10px;border:1px solid #e2e8f0;background:white;color:#0f172a;} input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #0ea5e9;} .form-row{display:grid;gap:8px;margin-bottom:12px;} .form-inline{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;} .muted{color:#475569;font-size:14px;} .tag{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;background:#e0f2ff;border-radius:10px;color:#075985;font-weight:700;font-size:13px;}
.wizard{display:grid;gap:12px;} .wizard-steps{display:flex;gap:8px;flex-wrap:wrap;} .step-pill{padding:8px 10px;border-radius:999px;border:1px solid #e2e8f0;font-weight:700;color:#475569;background:white;} .step-pill.active{background:#0ea5e9;color:white;border-color:#0ea5e9;} .wizard-step{display:none;gap:10px;} .wizard-step.active{display:grid;} .wizard-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
.callout{padding:14px;border-radius:12px;border:1px solid #bae6fd;background:#eff6ff;color:#0f172a;} .callout strong{display:block;margin-bottom:6px;}
.calc-result{padding:14px;border-radius:12px;border:1px solid #e2e8f0;background:#f8fafc;display:grid;gap:6px;font-weight:700;} .result-number{font-size:22px;color:#0ea5e9;}
.sources{margin-top:18px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:14px;color:#334155;} .breadcrumbs{display:flex;gap:8px;flex-wrap:wrap;font-size:14px;color:#475569;} .breadcrumbs a{color:#0f172a;}
.modal-trigger{cursor:pointer;} dialog{border:none;border-radius:14px;max-width:520px;width:90%;padding:0;box-shadow:0 10px 40px rgba(15,23,42,0.25);} dialog::backdrop{background:rgba(15,23,42,0.45);} .modal-inner{padding:18px;display:grid;gap:10px;} .modal-inner h2{margin:0;} .modal-actions{text-align:right;} .chip-list{display:flex;gap:8px;flex-wrap:wrap;}
@media (min-width:768px){.hero{grid-template-columns:2fr 1fr;align-items:center;} .hero h1{font-size:40px;} }
@media print{.site-header,.footer,.ad-slot-placeholder,.actions,.wizard-actions,.nav-links{display:none!important;} body{background:white;} .layout-slab{box-shadow:none;border-color:#e2e8f0;} .hero{padding-top:0;}}
`;

function clientScript() {
  const ADSENSE_CLIENT = 'ca-pub-1860356577073395';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.body.classList.add('prefers-reduced-motion');
  }

  const fmt = (num: number) => (Number.isFinite(num) ? num.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—');
  const dollars = (num: number) =>
    Number.isFinite(num)
      ? num.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
      : '';

  function track(eventName: string, params: Record<string, unknown> = {}) {
    const gtagFn = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtagFn === 'function') {
      gtagFn('event', eventName, params);
    }
  }

  function initFaq() {
    document.querySelectorAll('.faq button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const answer = btn.parentElement?.querySelector('.answer');
        if (answer) {
          answer.classList.toggle('open');
        }
      });
    });
  }

  function showStep(wizard: HTMLElement, target: string) {
    wizard.querySelectorAll<HTMLElement>('.wizard-step').forEach((step) => {
      const active = step.dataset.step === target;
      step.classList.toggle('active', active);
      const pill = wizard.querySelector<HTMLElement>('.step-pill[data-step="' + step.dataset.step + '"]');
      if (pill) pill.classList.toggle('active', active);
      if (active && step.dataset.stepIndex) {
        wizard.dataset.currentStep = step.dataset.stepIndex;
      }
    });
  }

  function initWizards() {
    document.querySelectorAll<HTMLElement>('.wizard').forEach((wizard) => {
      wizard.dataset.currentStep = '1';
      showStep(wizard, '1');

      wizard.addEventListener('click', (e) => {
        const target = e.target as Element | null;
        const btn = target?.closest<HTMLElement>('[data-action]');
        if (!btn) return;
        e.preventDefault();
        const action = btn.dataset.action;
        const steps = Array.from(wizard.querySelectorAll<HTMLElement>('.wizard-step'));
        const currentIndex = steps.findIndex((s) => s.classList.contains('active'));
        if (action === 'next' && currentIndex < steps.length - 1) {
          const nextStep = steps[currentIndex + 1].dataset.step;
          if (nextStep) showStep(wizard, nextStep);
          if (currentIndex === 0) track('ws_wizard_start', { wizard: wizard.dataset.wizard });
          if (currentIndex === steps.length - 2) {
            if (wizard.dataset.wizard === 'savings') {
              buildSavingsPlan(wizard);
            }
            track('ws_wizard_complete', { wizard: wizard.dataset.wizard });
          }
        }
        if (action === 'back' && currentIndex > 0) {
          const prevStep = steps[currentIndex - 1].dataset.step;
          if (prevStep) showStep(wizard, prevStep);
        }
      });
    });
  }

  function buildSavingsPlan(wizard: HTMLElement) {
    const indoorOutdoor = (wizard.querySelector('[name="focus-area"]:checked') as HTMLInputElement | null)?.value || 'Both';
    const household = Number((wizard.querySelector('#household-size') as HTMLInputElement | null)?.value) || 2;
    const homeType = (wizard.querySelector('#home-type') as HTMLSelectElement | null)?.value || 'House';
    const showersPerDay = Number((wizard.querySelector('#showers-per-day') as HTMLInputElement | null)?.value) || 2;
    const minutesPerShower = Number((wizard.querySelector('#minutes-per-shower') as HTMLInputElement | null)?.value) || 8;
    const laundryLoads = Number((wizard.querySelector('#laundry-loads') as HTMLInputElement | null)?.value) || 5;
    const rateInput = wizard.querySelector<HTMLInputElement>('#water-rate');
    const rate = Number(rateInput?.value) || 0;
    const upgrades = Array.from(wizard.querySelectorAll<HTMLInputElement>('[name="upgrade"]:checked')).map((c) => c.value);

    const showerSavings = Math.max(showersPerDay * minutesPerShower * household * 365 * 0.5, 0);
    const laundrySavings = laundryLoads * 52 * 8;
    const outdoorSavings = indoorOutdoor === 'Outdoor' || indoorOutdoor === 'Both' ? 6000 : 0;
    const leakSavings = upgrades.includes('toilet-fix') ? 3000 : 1500;

    const impact = (g: number) =>
      rate ? `≈ ${fmt(g)} gallons/yr (≈ ${dollars((g / 1000) * rate)}/yr)` : `≈ ${fmt(g)} gallons/yr`;

    const sections = wizard.querySelector<HTMLElement>('.plan-output');
    if (!sections) return;
    sections.innerHTML = `
      <div>
        <h3>Start this weekend</h3>
        <ul class="bullet-list">
          <li>Swap in a WaterSense showerhead — ${impact(showerSavings)}</li>
          <li>Run a toilet dye test — ${impact(leakSavings)}</li>
        </ul>
      </div>
      <div>
        <h3>Next 30 days</h3>
        <ul class="bullet-list">
          <li>Dial showers to ${fmt(minutesPerShower)} minutes — ${impact(showerSavings * 0.25)}</li>
          <li>Match laundry loads to full baskets — ${impact(laundrySavings)}</li>
        </ul>
      </div>
      <div>
        <h3>Replace-when-needed</h3>
        <ul class="bullet-list">
          <li>High-efficiency washer — ${impact(laundrySavings * 1.5)}</li>
          <li>Smarter outdoor watering — ${impact(outdoorSavings)}</li>
        </ul>
      </div>
      <p class="muted">Household: ${household} · Home: ${homeType} · Focus: ${indoorOutdoor}</p>
      <div class="callout">Estimates only. Your rates and usage vary.</div>
      <div class="inline-list">
        <a class="btn secondary" href="/analyze-water-bill">Analyze a bill</a>
        <button class="btn primary" data-copy-plan>Copy plan</button>
        <button class="btn secondary" data-print-plan>Print-friendly view</button>
      </div>
    `;

    const copyBtn = sections.querySelector<HTMLButtonElement>('[data-copy-plan]');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const text = sections.innerText || '';
        navigator.clipboard?.writeText(text).then(() => {
          copyBtn.textContent = 'Copied';
          setTimeout(() => (copyBtn.textContent = 'Copy plan'), 1500);
        });
      });
    }
    const printBtn = sections.querySelector<HTMLButtonElement>('[data-print-plan]');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }
  }

  type CalcConfig = {
    type: string;
    form: HTMLFormElement;
    resultEl: HTMLElement | null;
  };

  function calculateSavings(config: CalcConfig) {
    const { type, form } = config;
    if (!form) return;
    form.addEventListener('input', () => runCalc(config));
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      runCalc(config);
      track('ws_calc_run', { calc: type });
    });
    runCalc(config);
  }

  function runCalc({ type, resultEl, form }: CalcConfig) {
    const getNum = (selector: string, fallback = 0) =>
      Number((form.querySelector(selector) as HTMLInputElement | HTMLSelectElement | null)?.value) || fallback;
    const rate = getNum('[name="rate"]', 0);
    let gallonsDay = 0;

    if (type === 'shower') {
      const current = getNum('[name="current-flow"]', 2.5);
      const next = getNum('[name="new-flow"]', 2);
      const minutes = getNum('[name="minutes"]', 8);
      const showers = getNum('[name="showers"]', 2);
      const people = getNum('[name="people"]', 2);
      gallonsDay = (current - next) * minutes * showers * people;
    }
    if (type === 'faucet') {
      const current = getNum('[name="current-flow"]', 2.2);
      const next = getNum('[name="new-flow"]', 1.5);
      const minutes = getNum('[name="minutes"]', 5);
      const people = getNum('[name="people"]', 2);
      gallonsDay = (current - next) * minutes * people;
    }
    if (type === 'toilet') {
      const toilets = getNum('[name="toilets"]', 2);
      const current = getNum('[name="current-gpf"]', 1.6);
      const next = getNum('[name="new-gpf"]', 1.28);
      const flushes = getNum('[name="flushes"]', 5);
      const people = getNum('[name="people"]', 2);
      gallonsDay = (current - next) * flushes * people * toilets;
    }
    if (type === 'laundry') {
      const loads = getNum('[name="loads"]', 6);
      const washer = (form.querySelector('[name="washer"]') as HTMLSelectElement | null)?.value || 'Standard';
      const baselinePerLoad = 41; // gallons typical top-loader
      const savingsPerLoad = washer === 'ENERGY STAR' ? baselinePerLoad * 0.3 : 0;
      gallonsDay = (savingsPerLoad * loads * 52) / 365;
    }

    const gallonsYear = gallonsDay * 365;
    const money = rate ? (gallonsYear / 1000) * rate : null;
    if (resultEl) {
      resultEl.innerHTML = `
        <div class="result-number">Saved: ${fmt(gallonsDay)} gallons/day</div>
        <div class="result-number">Saved: ${fmt(gallonsYear)} gallons/year</div>
        ${money ? `<div class="result-number">≈ ${dollars(money)}/year</div>` : ''}
      `;
    }
  }

  function initCalculators() {
    document.querySelectorAll<HTMLFormElement>('[data-calc]').forEach((form) => {
      const type = form.dataset.calc || '';
      const resultEl = form.parentElement?.querySelector<HTMLElement>('.calc-result') || null;
      calculateSavings({ type, form, resultEl });
    });
  }

  function initProviderLookup() {
    const form = document.querySelector<HTMLFormElement>('#provider-form');
    const result = document.querySelector<HTMLElement>('#provider-result');
    if (!form || !result) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const location = (form.querySelector('input[name="location"]') as HTMLInputElement | null)?.value || '';
      if (!location.trim()) return;
      track('ws_provider_search');
      result.innerHTML = '<p class="muted">Searching…</p>';
      try {
        const searchUrl = `/api/location?location=${encodeURIComponent(location.trim())}`;
        const res = await fetch(searchUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ location, locationInput: location }),
        });
        const text = await res.text();
        if (!res.ok) {
          try {
            const parsed = JSON.parse(text) as { error?: string };
            result.innerHTML = `<p class="muted">${parsed.error || 'We could not look up that provider.'}</p>`;
          } catch {
            result.innerHTML = text || '<p class="muted">We could not look up that provider.</p>';
          }
          return;
        }
        result.innerHTML = text;
      } catch {
        result.innerHTML = '<p class="muted">Error loading provider info.</p>';
      }
    });
  }

  function initBillUpload() {
    const form = document.querySelector<HTMLFormElement>('#bill-form');
    const status = document.querySelector<HTMLElement>('#bill-status');
    if (!form || !status) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
      const file = fileInput?.files?.[0];
      if (!file) {
        status.textContent = 'Please select a PDF.';
        return;
      }
      track('ws_bill_analyze_submit');
      const data = new FormData();
      data.append('file', file);
      status.textContent = 'Uploading…';
      try {
        const res = await fetch('/api/analyze-bill', { method: 'POST', body: data });
        const text = await res.text();
        status.innerHTML = text;
      } catch {
        status.textContent = 'Upload failed. Try again later.';
      }
    });
  }

  function initModals() {
    document.querySelectorAll<HTMLAnchorElement>('a[data-modal-target]').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.dataset.modalTarget;
        const dialog = (id ? document.getElementById(id) : null) as HTMLDialogElement | null;
        if (dialog && typeof dialog.showModal === 'function') {
          dialog.showModal();
        }
      });
    });
    document.querySelectorAll<HTMLButtonElement>('dialog button[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const dialog = btn.closest('dialog') as HTMLDialogElement | null;
        if (dialog && typeof dialog.close === 'function') dialog.close();
      });
    });
  }

  function initAds() {
    let autoAdsQueued = false;
    let svgSetAttributePatched = false;
    let htmlSetAttributePatched = false;

    const normalizeCalcDimension = (value: string): string | null => {
      const match = value.match(/calc\(([-\d.]+)px\s*-\s*([-\d.]+)px\)/i);
      if (!match) return null;
      const base = parseFloat(match[1]);
      const subtract = parseFloat(match[2]);
      if (!Number.isFinite(base) || !Number.isFinite(subtract)) return null;
      const adjusted = Math.max(base - subtract, 0);
      return `${adjusted}px`;
    };

    const sanitizeSvgDimensions = (svg: SVGElement) => {
      (['width', 'height'] as const).forEach((attr) => {
        const raw = svg.getAttribute(attr);
        if (!raw || !raw.includes('calc')) return;
        const normalized = normalizeCalcDimension(raw);
        if (normalized) {
          svg.setAttribute(attr, normalized);
          svg.style[attr] = normalized;
        } else {
          svg.removeAttribute(attr);
        }
      });
    };

    const sanitizeElementDimensions = (el: Element) => {
      (['width', 'height'] as const).forEach((attr) => {
        const raw = el.getAttribute(attr);
        if (!raw || !raw.includes('calc')) return;
        const normalized = normalizeCalcDimension(raw);
        if (normalized) {
          el.setAttribute(attr, normalized);
          if (el instanceof HTMLElement) {
            el.style[attr] = normalized;
          }
        } else {
          el.removeAttribute(attr);
        }
      });
    };

    const patchSvgSetAttribute = () => {
      if (svgSetAttributePatched) return;
      const nativeSetAttribute = SVGElement.prototype.setAttribute;
      SVGElement.prototype.setAttribute = function setAttribute(name: string, value: string) {
        if ((name === 'width' || name === 'height') && typeof value === 'string' && value.includes('calc')) {
          const normalized = normalizeCalcDimension(value);
          if (normalized) return nativeSetAttribute.call(this, name, normalized);
          return nativeSetAttribute.call(this, name, '');
        }
        return nativeSetAttribute.call(this, name, value);
      };
      svgSetAttributePatched = true;
    };

    const patchHtmlSetAttribute = () => {
      if (htmlSetAttributePatched) return;
      const nativeSetAttribute = HTMLElement.prototype.setAttribute;
      HTMLElement.prototype.setAttribute = function setAttribute(name: string, value: string) {
        if ((name === 'width' || name === 'height') && typeof value === 'string' && value.includes('calc')) {
          const normalized = normalizeCalcDimension(value);
          if (normalized) return nativeSetAttribute.call(this, name, normalized);
          return nativeSetAttribute.call(this, name, '');
        }
        return nativeSetAttribute.call(this, name, value);
      };
      htmlSetAttributePatched = true;
    };

    const monitorAdNodes = () => {
      document.querySelectorAll<SVGElement>('.adsbygoogle svg').forEach(sanitizeSvgDimensions);
      document
        .querySelectorAll<HTMLElement>('.adsbygoogle [width*="calc"], .adsbygoogle [height*="calc"]')
        .forEach(sanitizeElementDimensions);

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;
            const adContainer = node.matches('.adsbygoogle') ? node : node.closest('.adsbygoogle');
            if (!adContainer) return;
            adContainer.querySelectorAll<SVGElement>('svg').forEach(sanitizeSvgDimensions);
            adContainer
              .querySelectorAll<HTMLElement>('[width*="calc"], [height*="calc"]')
              .forEach(sanitizeElementDimensions);
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    };

    const ensureAdsQueue = () => {
      const adsQueue = (window as typeof window & { adsbygoogle?: Array<unknown> }).adsbygoogle || [];
      (window as typeof window & { adsbygoogle: Array<unknown> }).adsbygoogle = adsQueue;
      return adsQueue;
    };

    const queueAutoAds = () => {
      const adsQueue = ensureAdsQueue();
      if (!autoAdsQueued) {
        adsQueue.push({ google_ad_client: ADSENSE_CLIENT, enable_page_level_ads: true });
        autoAdsQueued = true;
      }
      return adsQueue;
    };

    const activateAds = () => {
      const adsQueue = queueAutoAds();
      patchSvgSetAttribute();
      patchHtmlSetAttribute();

      document.querySelectorAll<HTMLElement>('.adsbygoogle[data-ad-slot]').forEach((slot) => {
        if (slot.dataset.adsInitialized === 'true') return;
        try {
          adsQueue.push({});
          slot.dataset.adsInitialized = 'true';
        } catch (err) {
          console.error('AdSense failed to fill a slot', err);
        }
      });

      monitorAdNodes();
    };

    const adScript = document.querySelector<HTMLScriptElement>(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
    );
    queueAutoAds();
    if (adScript) {
      adScript.addEventListener('load', () => setTimeout(activateAds, 50), { once: true });
    }

    if (document.readyState === 'complete') {
      activateAds();
    } else {
      window.addEventListener('load', () => setTimeout(activateAds, 200));
    }

    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason == null) {
        event.preventDefault();
        console.warn('Suppressed empty unhandled rejection from third-party script');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initFaq();
    initWizards();
    initCalculators();
    initProviderLookup();
    initBillUpload();
    initModals();
    initAds();
  });
}

export const appJs = `(${clientScript.toString()})();`;
