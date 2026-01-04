import { ADSENSE_CLIENT as DEFAULT_ADSENSE_CLIENT } from "../config/adsense";

export const stylesCss = `:root{color-scheme:light;font-family:"Inter",system-ui,-apple-system,Segoe UI,sans-serif;background:#f7fbff;}
*{box-sizing:border-box;}body{margin:0;color:#0f172a;background:#f7fbff;}a{color:#0d6efd;text-decoration:none;}a:hover{text-decoration:underline;}header,main,footer{width:100%;}img{max-width:100%;display:block;}button,input,select,textarea{font-family:inherit;}button{cursor:pointer;}body.prefers-reduced-motion *{transition:none!important;animation:none!important;}
.app-shell{min-height:100vh;display:flex;flex-direction:column;} .site-header{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.92);backdrop-filter:blur(6px);border-bottom:1px solid #e2e8f0;} .nav-bar{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:14px 18px;gap:12px;} .brand a{font-weight:700;color:#0f172a;font-size:18px;display:flex;align-items:center;gap:10px;text-decoration:none;} .brand-mark{display:inline-block;padding:6px 10px;border-radius:12px;background:#e0f2ff;color:#075985;font-weight:700;} .brand-text{display:flex;flex-direction:column;gap:2px;line-height:1;} .brand-name{letter-spacing:.08em;text-transform:uppercase;} .brand-dotcom{font-size:.7em;letter-spacing:.04em;text-transform:lowercase;margin-left:2px;} .tagline{font-size:12px;color:#64748b;font-weight:600;letter-spacing:.02em;} .nav-links{display:flex;align-items:center;gap:12px;flex-wrap:wrap;} .nav-link{padding:8px 10px;border-radius:10px;color:#0f172a;font-weight:600;transition:all .2s ease;background:none;border:none;} .nav-link:hover,.nav-link:focus-visible{background:#e0f2ff;outline:none;} .nav-dropdown{position:relative;display:inline-flex;align-items:center;} .dropdown-toggle{cursor:pointer;gap:6px;display:inline-flex;align-items:center;} .dropdown-caret{font-size:12px;line-height:1;} .dropdown-panel{position:absolute;top:calc(100% + 8px);right:0;min-width:220px;background:white;border:1px solid #e2e8f0;border-radius:12px;padding:8px;box-shadow:0 12px 30px rgba(15,23,42,0.12);opacity:0;pointer-events:none;transform:translateY(-6px);transition:opacity .2s ease,transform .2s ease;z-index:20;} .nav-dropdown:hover .dropdown-panel,.nav-dropdown:focus-within .dropdown-panel{opacity:1;pointer-events:auto;transform:translateY(0);} .dropdown-link{display:block;padding:8px 10px;border-radius:10px;color:#0f172a;font-weight:600;} .dropdown-link:hover,.dropdown-link:focus-visible{background:#e0f2ff;outline:none;} .primary-cta{background:#0ea5e9;color:white;} .primary-cta:hover,.primary-cta:focus-visible{background:#0284c7;color:white;}
main{flex:1;} .hero{max-width:1100px;margin:0 auto;padding:40px 18px 18px;display:grid;gap:14px;} .hero h1{margin:0;font-size:32px;color:#0f172a;} .hero p{margin:0;color:#1f2937;font-size:17px;max-width:70ch;} .hero .actions{display:flex;gap:12px;flex-wrap:wrap;} .btn{padding:12px 14px;border-radius:12px;border:1px solid #0ea5e9;background:white;color:#0ea5e9;font-weight:700;transition:transform .2s ease,box-shadow .2s ease;} .btn:hover,.btn:focus-visible{transform:translateY(-1px);box-shadow:0 10px 30px rgba(14,165,233,0.18);outline:none;} .btn.primary{background:#0ea5e9;color:white;border-color:#0ea5e9;} .btn.secondary{border-color:#e2e8f0;color:#0f172a;} .badge{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;background:#e0f2ff;color:#075985;font-weight:700;font-size:13px;}
.section{max-width:1100px;margin:0 auto;padding:28px 18px;} .section h2{margin:0 0 12px;font-size:24px;} .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;} .card{padding:16px;border:1px solid #e2e8f0;border-radius:14px;background:white;box-shadow:0 8px 24px rgba(15,23,42,0.05);display:flex;flex-direction:column;gap:10px;} .card h3{margin:0;font-size:18px;} .card p{margin:0;color:#334155;} .card .small{font-size:14px;color:#475569;} .inline-list{display:flex;gap:10px;flex-wrap:wrap;} .inline-list a{padding:8px 10px;border-radius:10px;background:#e0f2ff;color:#075985;font-weight:700;}
.blog-page main{display:flex;justify-content:center;} .blog-shell{max-width:800px;width:100%;margin:0 auto;padding:28px 18px;} .blog-article{background:white;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 12px 36px rgba(15,23,42,0.08);display:grid;gap:18px;padding:22px;} .blog-header h1{margin:0;font-size:32px;color:#0f172a;} .blog-header .lead{margin:8px 0 0;color:#1f2937;font-size:17px;line-height:1.6;} .blog-section{display:grid;gap:10px;} .blog-section h2{margin:0;font-size:22px;color:#0f172a;} .blog-section p,.blog-section li{color:#1f2937;line-height:1.6;} .blog-section ol{padding-left:20px;display:grid;gap:8px;} .blog-footer{margin-top:6px;} .eyebrow{letter-spacing:0.08em;text-transform:uppercase;font-weight:800;color:#075985;margin:0;} .lead{font-weight:600;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;} .bullet-list{padding-left:18px;display:grid;gap:8px;color:#1f2937;} .faq{border:1px solid #e2e8f0;border-radius:12px;background:white;} .faq-item{border-top:1px solid #e2e8f0;} .faq-item:first-of-type{border-top:none;} .faq button{width:100%;text-align:left;padding:14px;border:none;background:none;font-weight:700;display:flex;justify-content:space-between;align-items:center;} .faq .answer{padding:0 14px 14px;color:#334155;display:none;} .faq .answer.open{display:block;}
.layout-slab{background:white;border-radius:18px;border:1px solid #e2e8f0;box-shadow:0 10px 40px rgba(15,23,42,0.06);padding:18px;} .meta-line{font-size:14px;color:#475569;}
.footer{margin-top:30px;background:#0f172a;color:white;} .footer .footer-inner{max-width:1100px;margin:0 auto;padding:24px 18px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;} .footer a{color:#bae6fd;} .footer-links{display:flex;gap:12px;flex-wrap:wrap;} .footnote{font-size:13px;color:#cbd5e1;} .ad-slot-placeholder{min-height:250px;border:1px dashed #cbd5e1;border-radius:12px;background:linear-gradient(135deg,#f0f9ff,#e2e8f0);display:flex;align-items:center;justify-content:center;color:#475569;font-weight:600;} .ad-slot{display:block;min-height:250px;width:100%;margin:12px auto;text-align:center;} .ad-fallback{min-height:250px;display:flex;align-items:center;justify-content:center;text-align:center;color:#475569;font-weight:600;} .ad-sticky{position:sticky;bottom:0;z-index:5;background:#f7fbff;padding:0 18px 18px;border-top:1px solid #e2e8f0;} .consent-banner{position:fixed;bottom:18px;left:18px;right:18px;z-index:20;background:white;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 10px 40px rgba(15,23,42,0.2);padding:16px;display:grid;gap:12px;} .consent-banner a{color:#0ea5e9;} .consent-options{display:grid;gap:6px;font-size:14px;color:#475569;} .consent-actions{display:flex;gap:10px;flex-wrap:wrap;} .consent-actions .btn{flex:1 1 160px;} .ads-diagnostics-panel{border:1px solid #e2e8f0;border-radius:12px;padding:16px;background:white;display:grid;gap:10px;} .ads-diagnostics-row{display:flex;justify-content:space-between;gap:12px;font-weight:600;color:#0f172a;} .ads-diagnostics-floating{position:fixed;top:18px;right:18px;max-width:320px;z-index:30;}
.table{width:100%;border-collapse:collapse;} .table td,.table th{border:1px solid #e2e8f0;padding:10px;} .table th{background:#f0f9ff;text-align:left;}
label{display:block;font-weight:700;margin-bottom:6px;color:#0f172a;} input,select,textarea{width:100%;padding:11px;border-radius:10px;border:1px solid #e2e8f0;background:white;color:#0f172a;} input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #0ea5e9;} .form-row{display:grid;gap:8px;margin-bottom:12px;} .form-inline{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;} .muted{color:#475569;font-size:14px;} .tag{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;background:#e0f2ff;border-radius:10px;color:#075985;font-weight:700;font-size:13px;}
.wizard{display:grid;gap:12px;} .wizard-steps{display:flex;gap:8px;flex-wrap:wrap;} .step-pill{padding:8px 10px;border-radius:999px;border:1px solid #e2e8f0;font-weight:700;color:#475569;background:white;} .step-pill.active{background:#0ea5e9;color:white;border-color:#0ea5e9;} .wizard-step{display:none;gap:10px;} .wizard-step.active{display:grid;} .wizard-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
.callout{padding:14px;border-radius:12px;border:1px solid #bae6fd;background:#eff6ff;color:#0f172a;} .callout strong{display:block;margin-bottom:6px;}
.calc-result{padding:14px;border-radius:12px;border:1px solid #e2e8f0;background:#f8fafc;display:grid;gap:6px;font-weight:700;} .result-number{font-size:22px;color:#0ea5e9;}
.sources{margin-top:18px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:14px;color:#334155;} .breadcrumbs{display:flex;gap:8px;flex-wrap:wrap;font-size:14px;color:#475569;} .breadcrumbs a{color:#0f172a;}
.modal-trigger{cursor:pointer;} dialog{border:none;border-radius:14px;max-width:520px;width:90%;padding:0;box-shadow:0 10px 40px rgba(15,23,42,0.25);} dialog::backdrop{background:rgba(15,23,42,0.45);} .modal-inner{padding:18px;display:grid;gap:10px;} .modal-inner h2{margin:0;} .modal-actions{text-align:right;} .chip-list{display:flex;gap:8px;flex-wrap:wrap;} .mode-bar{border-top:1px solid #e2e8f0;background:#f8fafc;} .mode-bar__content{max-width:1100px;margin:0 auto;padding:10px 18px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;} .mode-bar__label{font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:#64748b;} .mode-bar__actions{display:flex;gap:8px;flex-wrap:wrap;} .mode-bar__actions a{padding:6px 10px;border-radius:999px;border:1px solid #e2e8f0;color:#0f172a;font-weight:600;background:white;} .mode-bar__actions a.active{background:#0ea5e9;color:white;border-color:#0ea5e9;} .mode-bar__close{margin-left:auto;border:none;background:#e2e8f0;border-radius:999px;width:30px;height:30px;font-size:18px;line-height:1;color:#475569;} .mode-bar__close:hover,.mode-bar__close:focus-visible{background:#bae6fd;color:#0f172a;outline:none;}
.mode-switcher{display:flex;align-items:center;gap:8px;font-size:13px;color:#475569;flex-wrap:wrap;} .mode-switcher span{font-weight:700;} .mode-switcher a{padding:6px 8px;border-radius:999px;border:1px solid #e2e8f0;color:#0f172a;font-weight:600;} .mode-switcher a.active{background:#0ea5e9;color:white;border-color:#0ea5e9;}
.trust-capsule{margin-top:12px;padding:12px;border-radius:12px;border:1px solid #bae6fd;background:#eff6ff;}
.upload-stepper{display:grid;gap:6px;margin-top:10px;} .upload-stepper .step{padding:8px 10px;border-radius:10px;border:1px solid #e2e8f0;font-weight:700;color:#475569;} .upload-stepper .step.active{background:#0ea5e9;color:white;border-color:#0ea5e9;}
.results-grid{display:grid;gap:16px;} .result-card{padding:16px;border:1px solid #e2e8f0;border-radius:14px;background:white;display:grid;gap:10px;} .result-card h3{margin:0;} .result-meta{display:flex;gap:12px;font-size:13px;color:#475569;font-weight:700;flex-wrap:wrap;}
.share-bar{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;}
.help-accordion summary{font-weight:700;cursor:pointer;margin-bottom:6px;}
@media (min-width:768px){.hero{grid-template-columns:2fr 1fr;align-items:center;} .hero h1{font-size:40px;} }
@media print{.site-header,.footer,.ad-slot-placeholder,.actions,.wizard-actions,.nav-links{display:none!important;} body{background:white;} .layout-slab{box-shadow:none;border-color:#e2e8f0;} .hero{padding-top:0;}}
`;

export function clientScript() {
  const ADSENSE_CLIENT =
    (window as typeof window & { __WS_ADSENSE_CLIENT__?: string }).__WS_ADSENSE_CLIENT__ ||
    DEFAULT_ADSENSE_CLIENT;
  const GA_MEASUREMENT_ID =
    (window as typeof window & { __WS_GA_MEASUREMENT_ID__?: string }).__WS_GA_MEASUREMENT_ID__ || '';
  const ADSENSE_SCRIPT_SRC =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CLIENT;
  const ADSENSE_SCRIPT_SELECTOR =
    'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]';
  const GTAG_SCRIPT_SRC = GA_MEASUREMENT_ID
    ? `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    : '';
  const GTAG_SCRIPT_SELECTOR = 'script[src*="www.googletagmanager.com/gtag/js"]';
  const CONSENT_STORAGE_KEY = 'ws-consent-v1';
  const consentRequired = Boolean(
    (window as typeof window & { __WS_CONSENT_REQUIRED__?: boolean }).__WS_CONSENT_REQUIRED__,
  );
  const privacySignal = Boolean((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) ||
    navigator.doNotTrack === '1' ||
    navigator.doNotTrack === 'yes' ||
    (window as typeof window & { doNotTrack?: string }).doNotTrack === '1';
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.body.classList.add('prefers-reduced-motion');
  }

  const fmt = (num: number) => (Number.isFinite(num) ? num.toLocaleString(undefined, { maximumFractionDigits: 1 }) : '—');
  const dollars = (num: number) =>
    Number.isFinite(num)
      ? num.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
      : '';
  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  type ConsentState = {
    functional: boolean;
    analytics: boolean;
    ads: boolean;
  };

  function track(eventName: string, params: Record<string, unknown> = {}) {
    if (!hasAnalyticsConsent()) return;
    const gtagFn = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtagFn === 'function') {
      gtagFn('event', eventName, params);
    }
  }

  let pageViewSent = false;
  const trackPageView = () => {
    if (pageViewSent) return;
    if (!hasAnalyticsConsent()) return;
    pageViewSent = true;
    track('page_view', {
      page_path: window.location.pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  };

  const defaultConsent: ConsentState = privacySignal || consentRequired
    ? { functional: true, analytics: false, ads: false }
    : { functional: true, analytics: true, ads: true };

  const getStoredConsent = (): ConsentState | null => {
    try {
      const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ConsentState) : null;
    } catch (err) {
      return null;
    }
  };

  const writeConsentCookie = (consent: ConsentState) => {
    try {
      document.cookie = `ws_consent=${encodeURIComponent(JSON.stringify(consent))}; Max-Age=31536000; Path=/; SameSite=Lax`;
    } catch (err) {
      console.warn('Failed to write consent cookie');
    }
  };

  const clearConsentCookies = () => {
    const cookieNames = ['_ga', '_gid', '_gat', '_gcl_au', '_gads'];
    document.cookie
      .split(';')
      .map((cookie) => cookie.split('=')[0]?.trim())
      .filter(Boolean)
      .forEach((name) => {
        if (cookieNames.includes(name) || name?.startsWith('_ga_') || name?.startsWith('_gcl')) {
          document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
        }
      });
  };

  const applyConsentMode = (consent: ConsentState) => {
    const gtagFn = (window as typeof window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtagFn !== 'function') return;
    gtagFn('consent', 'update', {
      ad_storage: consent.ads ? 'granted' : 'denied',
      analytics_storage: consent.analytics ? 'granted' : 'denied',
      ad_user_data: consent.ads ? 'granted' : 'denied',
      ad_personalization: consent.ads ? 'granted' : 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
    });
  };

  const storeConsent = (consent: ConsentState) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
    } catch (err) {
      console.warn('Failed to persist consent choice');
    }
    writeConsentCookie(consent);
    applyConsentMode(consent);
    if (!consent.analytics || !consent.ads) {
      clearConsentCookies();
    }
    window.dispatchEvent(new CustomEvent('ws-consent-updated', { detail: consent }));
  };

  const getEffectiveConsent = (): ConsentState => {
    return getStoredConsent() ?? defaultConsent;
  };

  const hasAdsConsent = () => getEffectiveConsent().ads;
  const hasAnalyticsConsent = () => getEffectiveConsent().analytics;

  const ensureAnalyticsLoaded = () => {
    if (!GA_MEASUREMENT_ID) return;
    if (!hasAnalyticsConsent()) return;
    if (document.querySelector(GTAG_SCRIPT_SELECTOR)) return;
    const script = document.createElement('script');
    script.async = true;
    script.src = GTAG_SCRIPT_SRC;
    document.head.appendChild(script);
  };

  const ensureAdSenseLoaded = () => {
    if (!hasAdsConsent()) return null;
    const existing = document.querySelector<HTMLScriptElement>(ADSENSE_SCRIPT_SELECTOR);
    if (existing) return existing;
    const script = document.createElement('script');
    script.async = true;
    script.src = ADSENSE_SCRIPT_SRC;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    return script;
  };

  const initConsentBanner = () => {
    const banner = document.querySelector<HTMLElement>('[data-consent-banner]');
    if (!banner) return;

    const stored = getStoredConsent();
    const consent = stored ?? defaultConsent;
    applyConsentMode(consent);

    const checkboxFor = (key: keyof ConsentState) =>
      banner.querySelector<HTMLInputElement>(`[data-consent-option="${key}"]`);
    const analyticsBox = checkboxFor('analytics');
    const adsBox = checkboxFor('ads');
    if (analyticsBox) analyticsBox.checked = consent.analytics;
    if (adsBox) adsBox.checked = consent.ads;

    const shouldShow = !stored;
    banner.hidden = !shouldShow;

    const acceptAll = banner.querySelector<HTMLButtonElement>('[data-consent-accept]');
    const reject = banner.querySelector<HTMLButtonElement>('[data-consent-reject]');
    const save = banner.querySelector<HTMLButtonElement>('[data-consent-save]');

    const closeBanner = () => {
      banner.hidden = true;
    };

    document.querySelectorAll('[data-consent-open]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        banner.hidden = false;
      });
    });

    acceptAll?.addEventListener('click', () => {
      storeConsent({ functional: true, analytics: true, ads: true });
      closeBanner();
    });

    reject?.addEventListener('click', () => {
      storeConsent({ functional: true, analytics: false, ads: false });
      if (analyticsBox) analyticsBox.checked = false;
      if (adsBox) adsBox.checked = false;
      closeBanner();
    });

    save?.addEventListener('click', () => {
      storeConsent({
        functional: true,
        analytics: Boolean(analyticsBox?.checked),
        ads: Boolean(adsBox?.checked),
      });
      closeBanner();
    });
  };

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
        track('ws_wizard_step_view', {
          wizard: wizard.dataset.wizard,
          step: step.dataset.step,
          step_index: Number(step.dataset.stepIndex),
        });
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
    const clamp = (value: number) => (Number.isFinite(value) ? Math.max(value, 0) : 0);
    const rate = clamp(getNum('[name="rate"]', 0));
    const showBath =
      (form.querySelector('[name="show-bath"]') as HTMLInputElement | null)?.checked || false;
    let gallonsDay = 0;

    if (type === 'shower') {
      const current = clamp(getNum('[name="current-flow"]', 2.5));
      const next = clamp(getNum('[name="new-flow"]', 2));
      const minutes = clamp(getNum('[name="minutes"]', 8));
      const showers = clamp(getNum('[name="showers"]', 2));
      const people = clamp(getNum('[name="people"]', 2));
      gallonsDay = Math.max(current - next, 0) * minutes * showers * people;
    }
    if (type === 'faucet') {
      const current = clamp(getNum('[name="current-flow"]', 2.2));
      const next = clamp(getNum('[name="new-flow"]', 1.5));
      const minutes = clamp(getNum('[name="minutes"]', 5));
      const people = clamp(getNum('[name="people"]', 2));
      gallonsDay = Math.max(current - next, 0) * minutes * people;
    }
    if (type === 'toilet') {
      const toilets = clamp(getNum('[name="toilets"]', 2));
      const current = clamp(getNum('[name="current-gpf"]', 1.6));
      const next = clamp(getNum('[name="new-gpf"]', 1.28));
      const flushes = clamp(getNum('[name="flushes"]', 5));
      const people = clamp(getNum('[name="people"]', 2));
      gallonsDay = Math.max(current - next, 0) * flushes * people * toilets;
    }
    if (type === 'laundry') {
      const loads = clamp(getNum('[name="loads"]', 6));
      const washer = (form.querySelector('[name="washer"]') as HTMLSelectElement | null)?.value || 'Standard';
      const baselinePerLoad = 41; // gallons typical top-loader
      const savingsPerLoad = washer === 'ENERGY STAR' ? baselinePerLoad * 0.3 : 0;
      gallonsDay = (savingsPerLoad * loads * 52) / 365;
    }

    const gallonsYear = clamp(gallonsDay * 365);
    const gallonsMonth = gallonsYear / 12;
    const moneyYear = rate ? (gallonsYear / 1000) * rate : null;
    const moneyMonth = moneyYear ? moneyYear / 12 : null;
    const bathtubEquivalent = showBath ? gallonsYear / 80 : null;
    if (resultEl) {
      resultEl.innerHTML = `
        <div class="result-number">Estimated gallons saved / year: ${fmt(gallonsYear)}</div>
        <div class="muted">≈ ${fmt(gallonsMonth)} gallons per month.</div>
        ${
          moneyYear
            ? `<div class="result-number">Estimated $ saved / year: ${dollars(moneyYear)}</div>
               <div class="muted">≈ ${dollars(moneyMonth ?? 0)} per month.</div>`
            : `<div class="muted">Add your rate to see $ savings.</div>`
        }
        ${
          bathtubEquivalent
            ? `<div class="muted">That’s about ${fmt(bathtubEquivalent)} bathtubs per year.</div>`
            : ''
        }
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
      track('ws_provider_search', { location_length: location.trim().length });
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

  function initRebatesTool() {
    const form = document.querySelector<HTMLFormElement>('#rebate-form');
    const status = document.querySelector<HTMLElement>('#rebate-status');
    const results = document.querySelector<HTMLElement>('#rebate-results');
    if (!form || !status || !results) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const zip = (form.querySelector('input[name="zip"]') as HTMLInputElement | null)?.value || '';
      const city = (form.querySelector('input[name="city"]') as HTMLInputElement | null)?.value || '';
      const state = (form.querySelector('input[name="state"]') as HTMLInputElement | null)?.value || '';
      const utility = (form.querySelector('input[name="utility"]') as HTMLInputElement | null)?.value || '';
      const upgrades = Array.from(form.querySelectorAll<HTMLInputElement>('input[name="upgrade"]:checked')).map(
        (input) => input.value,
      );
      if (!zip.trim()) {
        status.textContent = 'Please enter a ZIP code to continue.';
        return;
      }
      status.textContent = 'Searching for rebates…';
      results.innerHTML = '';
      try {
        const response = await fetch('/api/rebates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ zip, city, state, utility, upgrades }),
        });
        const data = (await response.json()) as {
          lastChecked?: string;
          results?: Array<{
            program: string;
            provider: string;
            amount: string;
            eligibility: string[];
            howToApply: string;
            links: Array<{ label: string; url: string }>;
            estimated?: boolean;
          }>;
          error?: string;
        };
        if (!response.ok) {
          status.textContent = data.error || 'Unable to fetch rebates right now.';
          return;
        }
        const rebateResults = data.results || [];
        status.textContent = data.lastChecked
          ? `Last checked ${new Date(data.lastChecked).toLocaleString()}`
          : 'Results updated.';
        if (!rebateResults.length) {
          results.innerHTML = '<div class="card"><h3>No programs found yet.</h3><p class="muted">Try another ZIP or check official rebate finders.</p></div>';
          return;
        }
        results.innerHTML = rebateResults
          .map((result) => {
            const eligibilityList = result.eligibility?.length
              ? `<ul class="bullet-list">${result.eligibility
                  .map((item) => `<li>${escapeHtml(item)}</li>`)
                  .join('')}</ul>`
              : '';
            const linkList = result.links
              .map(
                (link) =>
                  `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">${escapeHtml(link.label)}</a>`,
              )
              .join(' ');
            return `
              <div class="card">
                <h3>${escapeHtml(result.program)}</h3>
                <p class="small">Provided by ${escapeHtml(result.provider)}</p>
                <p><strong>Estimated rebate:</strong> ${escapeHtml(result.amount)}${result.estimated ? ' (estimate)' : ''}</p>
                ${eligibilityList}
                <p class="muted">${escapeHtml(result.howToApply)}</p>
                <div class="inline-list">${linkList}</div>
              </div>
            `;
          })
          .join('');
      } catch (error) {
        console.error('Rebate lookup error', error);
        status.textContent = 'Error loading rebates. Please try again.';
      }
    });
  }

  type AnalysisMove = {
    title: string;
    why: string;
    effort: string;
    impact: string;
    steps: string[];
    ctaLabel: string;
    ctaHref: string;
  };

  type AnalysisResult = {
    topMoves: AnalysisMove[];
    payingFor: string;
    nextStep: string;
    confidenceNote?: string;
  };

  const demoResult: AnalysisResult = {
    topMoves: [
      {
        title: 'Stop silent toilet leaks',
        why: 'Running toilets are often the biggest indoor waste.',
        effort: 'Low',
        impact: '500–2,000 gallons/month',
        steps: ['Do a dye test', 'Replace the flapper if it leaks', 'Recheck after 24 hours'],
        ctaLabel: 'Run the toilet calculator',
        ctaHref: '/calculators/toilet',
      },
      {
        title: 'Trim shower flow',
        why: 'Small hardware swap saves daily gallons fast.',
        effort: 'Low',
        impact: '$6–$15/month',
        steps: ['Install a WaterSense showerhead', 'Shorten showers by 2 minutes', 'Check for drips'],
        ctaLabel: 'Use the shower calculator',
        ctaHref: '/calculators/shower',
      },
      {
        title: 'Tune outdoor watering',
        why: 'Outdoor use is the fastest way to overshoot tiers.',
        effort: 'Medium',
        impact: '5–15% lower bill',
        steps: ['Water 2 days/week', 'Watch for runoff', 'Fix broken heads'],
        ctaLabel: 'Open outdoor tool',
        ctaHref: '/calculators/outdoor',
      },
    ],
    payingFor: 'Most of the bill is usage charges + sewer. Your tier jumps happen when outdoor watering spikes.',
    nextStep: 'Run the leak check today, then redo your bill comparison in 2 weeks.',
    confidenceNote: 'Demo mode uses sample data — your real bill will be more precise.',
  };

  const renderAnalysis = (result: AnalysisResult, target: HTMLElement) => {
    const cards = result.topMoves
      .map(
        (move) => `
        <div class="result-card">
          <h3>${move.title}</h3>
          <p class="muted">${move.why}</p>
          <div class="result-meta">
            <span>Effort: ${move.effort}</span>
            <span>Impact: ${move.impact}</span>
          </div>
          <ul class="bullet-list">${move.steps.map((step) => `<li>${step}</li>`).join('')}</ul>
          <a class="btn secondary" href="${move.ctaHref}">${move.ctaLabel}</a>
        </div>
      `,
      )
      .join('');
    const summary = [
      'WaterShortcut plan summary:',
      ...result.topMoves.map((move, idx) => `${idx + 1}. ${move.title} (${move.effort})`),
      `What you’re paying for: ${result.payingFor}`,
      `Next step: ${result.nextStep}`,
    ].join('\n');
    target.innerHTML = `
      <div class="results-grid">
        <h3>Your top 3 moves</h3>
        <div class="cards">${cards}</div>
        <h3>What you’re really paying for</h3>
        <p>${result.payingFor}</p>
        <h3>Your next best step</h3>
        <p>${result.nextStep}</p>
        ${result.confidenceNote ? `<p class="muted">${result.confidenceNote}</p>` : ''}
        <div class="share-bar">
          <button class="btn secondary" data-copy-summary>Copy summary</button>
          <button class="btn secondary" data-print-plan>Download PDF</button>
        </div>
      </div>
    `;
    const copyBtn = target.querySelector<HTMLButtonElement>('[data-copy-summary]');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(summary);
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = 'Copy summary'), 1500);
        } catch {
          copyBtn.textContent = 'Copy failed';
          setTimeout(() => (copyBtn.textContent = 'Copy summary'), 1500);
        }
      });
    }
    const printBtn = target.querySelector<HTMLButtonElement>('[data-print-plan]');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }
  };

  function initBillUpload() {
    const form = document.querySelector<HTMLFormElement>('#bill-form');
    const status = document.querySelector<HTMLElement>('#bill-status');
    if (!form || !status) return;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
      const file = fileInput?.files?.[0];
      if (!file) {
        status.textContent = 'Please upload a PDF water bill.';
        return;
      }
      if (file.type !== 'application/pdf') {
        status.textContent = 'Please upload a PDF water bill.';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        status.textContent = 'That file is too large. Please upload a PDF under 10MB.';
        return;
      }
      track('ws_bill_analyze_submit', {
        file_type: file.type,
        file_size_kb: Math.round(file.size / 1024),
      });
      const data = new FormData();
      data.append('file', file);
      const stepper = (step: number) =>
        `<div class="upload-stepper">
          <div class="step ${step >= 0 ? 'active' : ''}">Uploading…</div>
          <div class="step ${step >= 1 ? 'active' : ''}">Reading your bill…</div>
          <div class="step ${step >= 2 ? 'active' : ''}">Building your plan…</div>
        </div>
        <p class="muted">This usually takes under a minute.</p>`;
      status.innerHTML = stepper(0);
      const timers = [
        window.setTimeout(() => (status.innerHTML = stepper(1)), 1500),
        window.setTimeout(() => (status.innerHTML = stepper(2)), 3500),
      ];
      try {
        const res = await fetch('/api/analyze-bill', {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });
        const responseText = await res.text();
        timers.forEach((timer) => window.clearTimeout(timer));
        if (!res.ok) {
          status.innerHTML = `
            <p>We couldn’t read that bill. Try a different PDF, or use manual entry.</p>
            <p class="muted">Optional: email your utility name to hello@watershortcut.com.</p>
            <div class="inline-list"><a class="btn secondary" href="#manual">Try manual entry</a><a class="btn secondary" href="/guides">Open guides</a></div>
          `;
          return;
        }
        try {
          const data = JSON.parse(responseText) as { analysis?: AnalysisResult };
          if (data.analysis) {
            renderAnalysis(data.analysis, status);
            localStorage.setItem('ws-latest-plan', JSON.stringify(data.analysis));
            return;
          }
        } catch {
          // fall through to raw HTML
        }
        status.innerHTML = responseText;
      } catch {
        timers.forEach((timer) => window.clearTimeout(timer));
        status.textContent = 'We hit a snag building your plan. Please try again. If it keeps happening, email hello@watershortcut.com.';
      }
    });
  }

  function initDemoAndManual() {
    const demoButton = document.querySelector<HTMLButtonElement>('[data-demo-run]');
    const demoOutput = document.querySelector<HTMLElement>('[data-demo-output]');
    if (demoButton && demoOutput) {
      demoButton.addEventListener('click', () => {
        renderAnalysis(demoResult, demoOutput);
        localStorage.setItem('ws-latest-plan', JSON.stringify(demoResult));
      });
    }

    const manualForm = document.querySelector<HTMLFormElement>('#manual-form');
    const manualOutput = document.querySelector<HTMLElement>('[data-manual-output]');
    if (manualForm && manualOutput) {
      manualForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(manualForm);
        const usage = Number(formData.get('usage') || 0);
        const cost = Number(formData.get('cost') || 0);
        const household = Number(formData.get('household') || 0);
        const result: AnalysisResult = {
          topMoves: [
            {
              title: 'Check for leaks first',
              why: 'Leaks are the fastest, cheapest win.',
              effort: 'Low',
              impact: usage ? `~${fmt(usage * 0.15)} units/month` : 'Fast impact',
              steps: ['Run the leak check', 'Fix toilets first', 'Recheck your meter'],
              ctaLabel: 'Start leak check',
              ctaHref: '/leak-check',
            },
            {
              title: 'Trim shower & faucet flow',
              why: 'Daily habits add up quickly.',
              effort: 'Low',
              impact: household ? `${household} people × daily savings` : 'Daily savings',
              steps: ['Install WaterSense fixtures', 'Shorten showers', 'Monitor for drips'],
              ctaLabel: 'Open shower calculator',
              ctaHref: '/calculators/shower',
            },
            {
              title: 'Watch outdoor watering',
              why: 'Outdoor use drives tier spikes.',
              effort: 'Medium',
              impact: cost ? `Protect ~$${fmt(cost * 0.1)}/mo` : 'Avoid tier jumps',
              steps: ['Water 2 days/week', 'Fix spray heads', 'Adjust seasonally'],
              ctaLabel: 'Outdoor tips',
              ctaHref: '/calculators/outdoor',
            },
          ],
          payingFor: 'Manual entry suggests usage + sewer charges dominate the total bill.',
          nextStep: 'Confirm your unit rate on the next bill for a sharper estimate.',
          confidenceNote: 'Manual entry is less precise than a full bill upload.',
        };
        renderAnalysis(result, manualOutput);
        localStorage.setItem('ws-latest-plan', JSON.stringify(result));
      });
    }

    const stored = localStorage.getItem('ws-latest-plan');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AnalysisResult;
        const target = demoOutput || manualOutput;
        if (target) {
          renderAnalysis(parsed, target);
        }
      } catch {
        // ignore invalid stored plan
      }
    }
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

  let autoAdsQueued = false;
  let adsActivated = false;
  let lastAdsInit = 0;
  let svgSetAttributePatched = false;
  let htmlSetAttributePatched = false;
  let elementSetAttributePatched = false;
  let elementSetAttributeNsPatched = false;
  let dimensionPropertiesPatched = false;

  const isReactManagedAds = () => {
    const globalWindow = window as typeof window & { __WS_ADSENSE_MANAGED__?: string };
    return globalWindow.__WS_ADSENSE_MANAGED__ === 'react' || Boolean(document.getElementById('root'));
  };

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

  const patchElementSetAttribute = () => {
    if (elementSetAttributePatched) return;
    const nativeSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function setAttribute(name: string, value: string) {
      if ((name === 'width' || name === 'height') && typeof value === 'string' && value.includes('calc')) {
        const normalized = normalizeCalcDimension(value);
        if (normalized) return nativeSetAttribute.call(this, name, normalized);
        return nativeSetAttribute.call(this, name, '');
      }
      return nativeSetAttribute.call(this, name, value);
    };
    elementSetAttributePatched = true;
  };

  const patchElementSetAttributeNs = () => {
    if (elementSetAttributeNsPatched) return;
    const nativeSetAttributeNs = Element.prototype.setAttributeNS;
    Element.prototype.setAttributeNS = function setAttributeNS(
      namespace: string | null,
      name: string,
      value: string,
    ) {
      if ((name === 'width' || name === 'height') && typeof value === 'string' && value.includes('calc')) {
        const normalized = normalizeCalcDimension(value);
        if (normalized) return nativeSetAttributeNs.call(this, namespace, name, normalized);
        return nativeSetAttributeNs.call(this, namespace, name, '');
      }
      return nativeSetAttributeNs.call(this, namespace, name, value);
    };
    elementSetAttributeNsPatched = true;
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

  const patchDimensionProperty = (proto: object, prop: 'width' | 'height') => {
    const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
    if (!descriptor?.set || !descriptor?.get || descriptor.configurable === false) return;
    Object.defineProperty(proto, prop, {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get: descriptor.get,
      set(value: string | number) {
        if (typeof value === 'string' && value.includes('calc')) {
          const normalized = normalizeCalcDimension(value);
          descriptor.set?.call(this, normalized ?? '');
          return;
        }
        descriptor.set?.call(this, value);
      },
    });
  };

  const patchDimensionProperties = () => {
    if (dimensionPropertiesPatched) return;
    patchDimensionProperty(HTMLIFrameElement.prototype, 'width');
    patchDimensionProperty(HTMLIFrameElement.prototype, 'height');
    patchDimensionProperty(HTMLImageElement.prototype, 'width');
    patchDimensionProperty(HTMLImageElement.prototype, 'height');
    patchDimensionProperty(HTMLObjectElement.prototype, 'width');
    patchDimensionProperty(HTMLObjectElement.prototype, 'height');
    patchDimensionProperty(HTMLVideoElement.prototype, 'width');
    patchDimensionProperty(HTMLVideoElement.prototype, 'height');
    dimensionPropertiesPatched = true;
  };

  const patchAdDimensionSetters = () => {
    patchElementSetAttribute();
    patchElementSetAttributeNs();
    patchSvgSetAttribute();
    patchHtmlSetAttribute();
    patchDimensionProperties();
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
    if (!autoAdsQueued && hasAdsConsent()) {
      adsQueue.push({ google_ad_client: ADSENSE_CLIENT, enable_page_level_ads: true });
      autoAdsQueued = true;
    }
    return adsQueue;
  };

  const activateAds = () => {
    if (!hasAdsConsent()) return;
    if (adsActivated) return;
    adsActivated = true;
    const adsQueue = queueAutoAds();
    patchAdDimensionSetters();
    lastAdsInit = Date.now();

    document.querySelectorAll<HTMLElement>('.adsbygoogle[data-ad-slot]').forEach((slot) => {
      if (slot.dataset.adsInitialized === 'true') return;
      const status = slot.getAttribute('data-adsbygoogle-status');
      if (status) {
        slot.dataset.adsInitialized = 'true';
        return;
      }
      if (slot.innerHTML.trim() !== '' || slot.childElementCount > 0) {
        slot.dataset.adsInitialized = 'true';
        return;
      }
      try {
        adsQueue.push({});
        slot.dataset.adsInitialized = 'true';
        setTimeout(() => {
          if (slot.dataset.adsInitialized !== 'true') return;
          if (slot.innerHTML.trim() !== '') return;
          if (slot.querySelector('.ad-fallback')) return;
          const fallback = document.createElement('div');
          fallback.className = 'ad-fallback';
          fallback.textContent = 'Support WaterShortcut by turning off your ad blocker.';
          slot.appendChild(fallback);
        }, 4000);
      } catch (err) {
        console.error('AdSense failed to fill a slot', err);
      }
    });

    monitorAdNodes();
  };

  const isAdsDebugMode = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('ads_debug') === '1' || window.location.pathname === '/__ads';
  };

  const ensureDiagnosticsPanel = () => {
    let panel = document.querySelector<HTMLElement>('[data-ads-diagnostics]');
    if (panel) return panel;
    panel = document.createElement('div');
    panel.className = 'ads-diagnostics-panel ads-diagnostics-floating';
    panel.setAttribute('data-ads-diagnostics', 'true');
    panel.innerHTML = `
      <div class="ads-diagnostics-row"><span>Script loaded</span><strong data-ads-script>pending</strong></div>
      <div class="ads-diagnostics-row"><span>adsbygoogle present</span><strong data-adsbygoogle>pending</strong></div>
      <div class="ads-diagnostics-row"><span>Ad slots found</span><strong data-ads-count>0</strong></div>
      <div class="ads-diagnostics-row"><span>Last init</span><strong data-ads-last-init>—</strong></div>
      <div class="muted" data-ads-slots></div>
    `;
    document.body.appendChild(panel);
    return panel;
  };

  const updateDiagnosticsPanel = () => {
    if (!isAdsDebugMode()) return;
    const panel = ensureDiagnosticsPanel();
    const adScript = document.querySelector<HTMLScriptElement>(
      'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]',
    );
    const scriptLoaded = adScript?.dataset.adsenseLoaded === 'true';
    const adsQueue = (window as typeof window & { adsbygoogle?: Array<unknown> }).adsbygoogle;
    const slots = Array.from(document.querySelectorAll<HTMLElement>('.adsbygoogle'));
    const slotDetails = slots
      .map((slot, index) => {
        const rect = slot.getBoundingClientRect();
        return `#${index + 1} ${slot.dataset.adSlot || 'auto'}: ${Math.round(rect.width)}x${Math.round(rect.height)}`;
      })
      .join(' · ');

    const setText = (selector: string, value: string) => {
      const el = panel.querySelector<HTMLElement>(selector);
      if (el) el.textContent = value;
    };

    setText('[data-ads-script]', scriptLoaded ? 'loaded' : 'pending');
    setText('[data-adsbygoogle]', adsQueue ? 'yes' : 'no');
    setText('[data-ads-count]', String(slots.length));
    setText('[data-ads-last-init]', lastAdsInit ? new Date(lastAdsInit).toLocaleTimeString() : '—');
    setText('[data-ads-slots]', slotDetails || 'No ad slots on page');

    if (isAdsDebugMode()) {
      console.info('[ads-diagnostics]', {
        scriptLoaded,
        adsbygooglePresent: Boolean(adsQueue),
        slotCount: slots.length,
        lastInit: lastAdsInit,
        slotDetails,
      });
    }
  };

  function initAds() {
    if (isReactManagedAds()) {
      return;
    }
    patchAdDimensionSetters();
    const adScript = ensureAdSenseLoaded();
    queueAutoAds();
    if (adScript) {
      if (adScript.dataset.adsenseLoaded === 'true') {
        activateAds();
      } else {
        adScript.addEventListener(
          'load',
          () => {
            adScript.dataset.adsenseLoaded = 'true';
            setTimeout(activateAds, 50);
            updateDiagnosticsPanel();
          },
          { once: true },
        );
      }
    }

    if (document.readyState === 'complete') {
      activateAds();
    } else {
      window.addEventListener('load', () => setTimeout(activateAds, 200));
    }

    window.addEventListener('ws-consent-updated', () => {
      ensureAnalyticsLoaded();
      ensureAdSenseLoaded();
      adsActivated = false;
      setTimeout(activateAds, 50);
      updateDiagnosticsPanel();
    });

    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason == null) {
        event.preventDefault();
        console.warn('Suppressed empty unhandled rejection from third-party script');
      }
    });
  }

  patchAdDimensionSetters();

  document.addEventListener('DOMContentLoaded', () => {
    initFaq();
    initWizards();
    initCalculators();
    initProviderLookup();
    initRebatesTool();
    initBillUpload();
    initDemoAndManual();
    initModals();
    initConsentBanner();
    ensureAnalyticsLoaded();
    trackPageView();
    const handleConsentUpdate = () => {
      ensureAnalyticsLoaded();
      trackPageView();
    };
    window.addEventListener('ws-consent-updated', handleConsentUpdate);
    initAds();
    if (isAdsDebugMode()) {
      updateDiagnosticsPanel();
      window.setInterval(updateDiagnosticsPanel, 2000);
    }
  });
}

export const appJs = `(${clientScript.toString()})();`;
