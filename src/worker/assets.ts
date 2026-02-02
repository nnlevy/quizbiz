import { ADSENSE_CLIENT as DEFAULT_ADSENSE_CLIENT } from "../config/adsense";
import { COPY as WATER_IQ_COPY, FLOW as WATER_IQ_FLOW, QUESTIONS as WATER_IQ_QUESTIONS } from "../lib/waterIq";
import { formatStoredReferralToken, isReferralTokenExpired, parseStoredReferralToken } from "../shared/referral";

export const stylesCss = `:root{color-scheme:light;font-family:"Inter",system-ui,-apple-system,Segoe UI,sans-serif;background:#f7fbff;}
*{box-sizing:border-box;}body{margin:0;color:#0f172a;background:#f7fbff;}.skip-link{position:absolute;left:-999px;top:auto;width:1px;height:1px;overflow:hidden;} .skip-link:focus{left:18px;top:18px;width:auto;height:auto;padding:10px 14px;background:#0ea5e9;color:#fff;border-radius:999px;z-index:50;}a{color:#0d6efd;text-decoration:none;}a:hover{text-decoration:underline;}header,main,footer{width:100%;}img{max-width:100%;display:block;}button,input,select,textarea{font-family:inherit;}button{cursor:pointer;}body.prefers-reduced-motion *{transition:none!important;animation:none!important;}
.app-shell{min-height:100vh;display:flex;flex-direction:column;} .site-header{position:sticky;top:0;z-index:10;background:rgba(255,255,255,0.92);backdrop-filter:blur(6px);border-bottom:1px solid #e2e8f0;} .nav-bar{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;padding:14px 18px;gap:12px;} .brand a{font-weight:700;color:#0f172a;font-size:18px;display:flex;align-items:center;gap:10px;text-decoration:none;} .brand-mark{display:inline-block;padding:6px 10px;border-radius:12px;background:#e0f2ff;color:#075985;font-weight:700;} .brand-text{display:flex;flex-direction:column;gap:2px;line-height:1;} .brand-name{letter-spacing:.08em;text-transform:uppercase;} .brand-dotcom{font-size:.7em;letter-spacing:.04em;text-transform:lowercase;margin-left:2px;} .tagline{font-size:12px;color:#64748b;font-weight:600;letter-spacing:.02em;} .nav-links{display:flex;align-items:center;gap:12px;justify-content:flex-end;} .nav-link{padding:8px 10px;border-radius:10px;color:#0f172a;font-weight:600;transition:all .2s ease;background:none;border:none;} .nav-link:hover,.nav-link:focus-visible{background:#e0f2ff;outline:none;} .nav-menu{position:relative;} .nav-menu summary{list-style:none;} .nav-menu summary::-webkit-details-marker{display:none;} .nav-menu__toggle{display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:12px;border:1px solid #e2e8f0;background:white;color:#0f172a;cursor:pointer;transition:all .2s ease;} .nav-menu__toggle:hover,.nav-menu__toggle:focus-visible{background:#e0f2ff;outline:none;} .nav-menu__icon{position:relative;width:20px;height:2px;background:#0f172a;border-radius:999px;display:inline-block;} .nav-menu__icon::before,.nav-menu__icon::after{content:"";position:absolute;left:0;width:20px;height:2px;background:#0f172a;border-radius:999px;transition:transform .2s ease,opacity .2s ease;} .nav-menu__icon::before{top:-6px;} .nav-menu__icon::after{top:6px;} .nav-menu[open] .nav-menu__icon{background:transparent;} .nav-menu[open] .nav-menu__icon::before{transform:translateY(6px) rotate(45deg);} .nav-menu[open] .nav-menu__icon::after{transform:translateY(-6px) rotate(-45deg);} .nav-menu__panel{position:absolute;right:0;top:calc(100% + 10px);min-width:240px;background:white;border:1px solid #e2e8f0;border-radius:16px;padding:12px;box-shadow:0 18px 40px rgba(15,23,42,0.16);display:grid;gap:12px;z-index:30;} .nav-menu__links{display:grid;gap:6px;} .nav-menu__links .nav-link{display:flex;align-items:center;justify-content:space-between;} .nav-menu__cta{display:grid;} .nav-menu__cta .btn{width:100%;text-align:center;} .primary-cta{background:#0ea5e9;color:white;} .primary-cta:hover,.primary-cta:focus-visible{background:#0284c7;color:white;}
.nav-badge{display:inline-flex;align-items:center;gap:6px;background:#ecfeff;border:1px solid #bae6fd;color:#0f172a;font-weight:700;}
main{flex:1;} .hero{max-width:1100px;margin:0 auto;padding:40px 18px 18px;display:grid;gap:14px;} .hero h1{margin:0;font-size:32px;color:#0f172a;} .hero p{margin:0;color:#1f2937;font-size:17px;max-width:70ch;} .hero .actions{display:flex;gap:12px;flex-wrap:wrap;} .btn{padding:12px 14px;border-radius:12px;border:1px solid #0ea5e9;background:white;color:#0ea5e9;font-weight:700;transition:transform .2s ease,box-shadow .2s ease;} .btn:hover,.btn:focus-visible{transform:translateY(-1px);box-shadow:0 10px 30px rgba(14,165,233,0.18);outline:none;} .btn.primary{background:#0ea5e9;color:white;border-color:#0ea5e9;} .btn.secondary{border-color:#e2e8f0;color:#0f172a;} .badge{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;background:#e0f2ff;color:#075985;font-weight:700;font-size:13px;}
.section{max-width:1100px;margin:0 auto;padding:28px 18px;} .section h2{margin:0 0 12px;font-size:24px;} .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px;} .card{padding:16px;border:1px solid #e2e8f0;border-radius:14px;background:white;box-shadow:0 8px 24px rgba(15,23,42,0.05);display:flex;flex-direction:column;gap:10px;} .card h3{margin:0;font-size:18px;} .card p{margin:0;color:#334155;} .card .small{font-size:14px;color:#475569;} .sitemap-card{color:#0f172a;text-decoration:none;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease;} .sitemap-card:hover,.sitemap-card:focus-visible{transform:translateY(-2px);box-shadow:0 16px 32px rgba(59,130,246,0.18);border-color:#93c5fd;outline:none;} .sitemap-grid{align-items:stretch;} .inline-list{display:flex;gap:10px;flex-wrap:wrap;} .inline-list a{padding:8px 10px;border-radius:10px;background:#e0f2ff;color:#075985;font-weight:700;}
.blog-page main{display:flex;justify-content:center;} .blog-shell{max-width:800px;width:100%;margin:0 auto;padding:28px 18px;} .blog-article{background:white;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 12px 36px rgba(15,23,42,0.08);display:grid;gap:18px;padding:22px;} .blog-header h1{margin:0;font-size:32px;color:#0f172a;} .blog-header .lead{margin:8px 0 0;color:#1f2937;font-size:17px;line-height:1.6;} .blog-section{display:grid;gap:10px;} .blog-section h2{margin:0;font-size:22px;color:#0f172a;} .blog-section p,.blog-section li{color:#1f2937;line-height:1.6;} .blog-section ol{padding-left:20px;display:grid;gap:8px;} .blog-footer{margin-top:6px;} .eyebrow{letter-spacing:0.08em;text-transform:uppercase;font-weight:800;color:#075985;margin:0;} .lead{font-weight:600;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;} .bullet-list{padding-left:18px;display:grid;gap:8px;color:#1f2937;} .faq{border:1px solid #e2e8f0;border-radius:12px;background:white;} .faq-item{border-top:1px solid #e2e8f0;} .faq-item:first-of-type{border-top:none;} .faq button{width:100%;text-align:left;padding:14px;border:none;background:none;font-weight:700;display:flex;justify-content:space-between;align-items:center;} .faq .answer{padding:0 14px 14px;color:#334155;display:none;} .faq .answer.open{display:block;}
.layout-slab{background:white;border-radius:18px;border:1px solid #e2e8f0;box-shadow:0 10px 40px rgba(15,23,42,0.06);padding:18px;} .meta-line{font-size:14px;color:#475569;}
.footer{margin-top:30px;background:#0f172a;color:white;} .footer .footer-inner{max-width:1100px;margin:0 auto;padding:24px 18px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;} .footer a{color:#bae6fd;} .footer-links{display:flex;gap:12px;flex-wrap:wrap;} .footnote{font-size:13px;color:#cbd5e1;} .ad-slot-placeholder{min-height:250px;border:1px dashed #cbd5e1;border-radius:12px;background:linear-gradient(135deg,#f0f9ff,#e2e8f0);display:flex;align-items:center;justify-content:center;color:#475569;font-weight:600;} .ad-slot{display:block;min-height:250px;width:100%;margin:12px auto;text-align:center;} .ad-fallback{min-height:250px;display:flex;align-items:center;justify-content:center;text-align:center;color:#475569;font-weight:600;} .ad-sticky{position:sticky;bottom:0;z-index:5;background:#f7fbff;padding:0 18px 18px;border-top:1px solid #e2e8f0;} ins.adsbygoogle[style*="position: fixed"]{opacity:0;transform:translateY(12px);transition:opacity .4s ease,transform .4s ease;pointer-events:auto;max-width:100vw;left:0;right:0;margin:0 auto;box-sizing:border-box;} .ws-margin-ad{opacity:0;transform:translateY(12px);transition:opacity .4s ease,transform .4s ease;pointer-events:none;} .ws-margin-ad.ws-margin-ad--visible{opacity:1;transform:translateY(0);pointer-events:auto;} .ws-margin-ad.ws-margin-ad--hidden{opacity:0;transform:translateY(8px);pointer-events:none;} .consent-banner{position:fixed;bottom:18px;left:18px;right:18px;z-index:20;background:white;border:1px solid #e2e8f0;border-radius:16px;box-shadow:0 10px 40px rgba(15,23,42,0.2);padding:16px;display:grid;gap:12px;} .consent-banner a{color:#0ea5e9;} .consent-options{display:grid;gap:6px;font-size:14px;color:#475569;} .consent-actions{display:flex;gap:10px;flex-wrap:wrap;} .consent-actions .btn{flex:1 1 160px;} .ads-diagnostics-panel{border:1px solid #e2e8f0;border-radius:12px;padding:16px;background:white;display:grid;gap:10px;} .ads-diagnostics-row{display:flex;justify-content:space-between;gap:12px;font-weight:600;color:#0f172a;} .ads-diagnostics-floating{position:fixed;top:18px;right:18px;max-width:320px;z-index:30;}
.table{width:100%;border-collapse:collapse;} .table td,.table th{border:1px solid #e2e8f0;padding:10px;} .table th{background:#f0f9ff;text-align:left;}
label{display:block;font-weight:700;margin-bottom:6px;color:#0f172a;} input,select,textarea{width:100%;padding:11px;border-radius:10px;border:1px solid #e2e8f0;background:white;color:#0f172a;} input:focus-visible,select:focus-visible,textarea:focus-visible{outline:2px solid #0ea5e9;} .form-row{display:grid;gap:8px;margin-bottom:12px;} .form-inline{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;} .muted{color:#475569;font-size:14px;} .tag{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;background:#e0f2ff;border-radius:10px;color:#075985;font-weight:700;font-size:13px;}
.wizard{display:grid;gap:12px;} .wizard-steps{display:flex;gap:8px;flex-wrap:wrap;} .step-pill{padding:8px 10px;border-radius:999px;border:1px solid #e2e8f0;font-weight:700;color:#475569;background:white;} .step-pill.active{background:#0ea5e9;color:white;border-color:#0ea5e9;} .wizard-step{display:none;gap:10px;} .wizard-step.active{display:grid;} .wizard-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;}
.callout{padding:14px;border-radius:12px;border:1px solid #bae6fd;background:#eff6ff;color:#0f172a;} .callout strong{display:block;margin-bottom:6px;}
.calc-result{padding:14px;border-radius:12px;border:1px solid #e2e8f0;background:#f8fafc;display:grid;gap:6px;font-weight:700;} .result-number{font-size:22px;color:#0ea5e9;}
.sources{margin-top:18px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:14px;color:#334155;} .breadcrumbs{display:flex;gap:8px;flex-wrap:wrap;font-size:14px;color:#475569;} .breadcrumbs a{color:#0f172a;}
.modal-trigger{cursor:pointer;} dialog{border:none;border-radius:14px;max-width:520px;width:90%;padding:0;box-shadow:0 10px 40px rgba(15,23,42,0.25);} dialog::backdrop{background:rgba(15,23,42,0.45);} .modal-inner{padding:18px;display:grid;gap:10px;} .modal-inner h2{margin:0;} .modal-actions{text-align:right;} .chip-list{display:flex;gap:8px;flex-wrap:wrap;} .mode-bar{border-top:1px solid #e2e8f0;background:#f8fafc;} .mode-bar__content{max-width:1100px;margin:0 auto;padding:10px 18px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;} .mode-bar__label{font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:#64748b;} .mode-bar__actions{display:flex;gap:8px;flex-wrap:wrap;} .mode-bar__actions a{padding:6px 10px;border-radius:999px;border:1px solid #e2e8f0;color:#0f172a;font-size:12px;font-weight:600;background:white;} .mode-bar__actions a.active{background:#0ea5e9;color:white;border-color:#0ea5e9;} .mode-bar__close{margin-left:auto;border:none;background:#e2e8f0;border-radius:999px;width:30px;height:30px;font-size:18px;line-height:1;color:#475569;} .mode-bar__close:hover,.mode-bar__close:focus-visible{background:#bae6fd;color:#0f172a;outline:none;}
.mode-switcher{display:flex;align-items:center;gap:8px;font-size:13px;color:#475569;flex-wrap:wrap;} .mode-switcher span{font-weight:700;} .mode-switcher a{padding:6px 8px;border-radius:999px;border:1px solid #e2e8f0;color:#0f172a;font-weight:600;} .mode-switcher a.active{background:#0ea5e9;color:white;border-color:#0ea5e9;}
.trust-capsule{margin-top:12px;padding:12px;border-radius:12px;border:1px solid #bae6fd;background:#eff6ff;}
.upload-stepper{display:grid;gap:6px;margin-top:10px;} .upload-stepper .step{padding:8px 10px;border-radius:10px;border:1px solid #e2e8f0;font-weight:700;color:#475569;} .upload-stepper .step.active{background:#0ea5e9;color:white;border-color:#0ea5e9;}
.results-grid{display:grid;gap:16px;} .result-card{padding:16px;border:1px solid #e2e8f0;border-radius:14px;background:white;display:grid;gap:10px;} .result-card h3{margin:0;} .result-meta{display:flex;gap:12px;font-size:13px;color:#475569;font-weight:700;flex-wrap:wrap;}
.share-bar{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;}
.share-card{border:1px solid #e2e8f0;border-radius:16px;padding:14px;background:#f8fafc;display:grid;gap:12px;margin-top:16px;}
.share-card__title{font-size:16px;font-weight:800;margin:0;color:#0f172a;}
.share-card__copy{font-size:14px;color:#334155;margin:0;}
.share-card__media img{width:100%;border-radius:12px;border:1px solid #e2e8f0;}
.share-card__actions{display:flex;gap:8px;flex-wrap:wrap;}
.help-accordion summary{font-weight:700;cursor:pointer;margin-bottom:6px;}
.water-iq{display:flex;justify-content:center;} .water-iq-card{max-width:860px;width:100%;border:1px solid rgba(0,0,0,.12);border-radius:18px;padding:20px;background:#fff;} .water-iq-card--result{box-shadow:0 20px 50px rgba(15,23,42,.12);} .water-iq-result-header{display:flex;align-items:center;justify-content:space-between;gap:12px;} .water-iq-title{margin:0;font-size:22px;font-weight:750;color:#0f172a;} .water-iq-ellipsis{font-size:22px;letter-spacing:2px;color:#cbd5e1;} .water-iq-divider{height:1px;background:#e2e8f0;margin:12px 0 16px;} .water-iq-result-meta{display:flex;gap:18px;align-items:center;flex-wrap:wrap;} .water-iq-score-circle{width:120px;height:120px;border-radius:50%;background:conic-gradient(rgba(79,155,255,.9) 0 var(--score-angle,0deg),rgba(79,155,255,.15) var(--score-angle,0deg) 360deg);display:flex;align-items:center;justify-content:center;position:relative;} .water-iq-score-circle::after{content:"";position:absolute;inset:10px;background:#f8fafc;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(148,163,184,.4);} .water-iq-score-value{position:relative;z-index:1;font-size:32px;font-weight:800;color:#0f172a;display:flex;align-items:baseline;gap:4px;} .water-iq-score-value span{font-size:16px;color:#64748b;font-weight:700;} .water-iq-result-copy{display:grid;gap:10px;min-width:200px;} .water-iq-badge-pill{display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#5db5f3,#3f7acb);color:white;border-radius:999px;padding:10px 18px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;box-shadow:0 8px 20px rgba(59,130,246,.25);} .water-iq-badge-icon{background:white;color:#3f7acb;border-radius:50%;width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center;font-size:14px;} .water-iq-fact{font-size:20px;line-height:1.35;font-weight:650;color:#0f172a;max-width:360px;} .water-iq-share,.water-iq-draft{padding:14px;border-radius:16px;border:1px solid rgba(59,130,246,.18);background:rgba(255,255,255,.9);display:grid;gap:10px;} .water-iq-share__actions{display:flex;flex-wrap:wrap;gap:10px;} .water-iq-draft__header{display:flex;align-items:center;justify-content:space-between;gap:10px;} .water-iq-draft__text{width:100%;min-height:120px;border-radius:12px;border:1px solid rgba(15,35,95,.2);padding:12px;font-family:inherit;font-size:14px;resize:vertical;} .water-iq-draft__actions{display:flex;justify-content:flex-end;} .wsH1{font-size:28px;line-height:1.15;margin:0 0 10px;} .wsH2{font-size:18px;margin:6px 0 6px;} .wsP{margin:8px 0 10px;line-height:1.45;} .wsQ{margin:10px 0 8px;font-size:18px;line-height:1.35;} .wsMuted{color:rgba(0,0,0,.62);font-size:13px;} .wsRow{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:10px;} .wsBtnPrimary{background:#111;color:#fff;border:none;border-radius:10px;padding:10px 14px;font-weight:650;cursor:pointer;} .wsBtnPrimary--pill{border-radius:999px;padding:12px 20px;background:linear-gradient(135deg,#4f9fe3,#2f6db9);box-shadow:0 12px 22px rgba(37,99,235,.2);} .wsBtnPrimary:disabled{opacity:.45;cursor:not-allowed;} .wsBtnGhost{background:transparent;color:#111;border:1px solid rgba(0,0,0,.16);border-radius:10px;padding:10px 14px;font-weight:650;cursor:pointer;text-decoration:none;display:inline-block;} .wsCallout{margin:10px 0 6px;padding:10px 12px;border-radius:12px;background:rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.08);} .wsDisclosure{margin-top:10px;padding:10px 12px;border-radius:12px;border:1px solid rgba(0,0,0,.12);background:rgba(0,0,0,.02);} .wsTopBar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:10px;} .wsProgressWrap{flex:1;height:10px;border-radius:999px;background:rgba(0,0,0,.08);overflow:hidden;} .wsProgress{height:100%;background:#111;border-radius:999px;} .wsChoices{display:flex;flex-direction:column;gap:10px;margin:12px 0;} .wsChoice{padding:12px 12px;border-radius:12px;border:1px solid rgba(0,0,0,.14);background:#fff;text-align:left;cursor:pointer;} .wsChoice.isSelected{border-color:#111;box-shadow:0 0 0 2px rgba(0,0,0,.06) inset;} .wsChoice:disabled{opacity:.5;cursor:not-allowed;} .wsExplain{margin:10px 0 12px;padding:12px;border-radius:12px;border:1px solid rgba(0,0,0,.12);background:rgba(0,0,0,.03);} .wsGood,.wsBad{font-weight:750;margin-bottom:8px;} .wsSources{margin-top:10px;} .wsSources ul{margin:6px 0 0;padding-left:18px;} .wsLink{text-decoration:underline;} .wsNav{display:flex;justify-content:space-between;gap:10px;margin-top:8px;} .wsNumWrap{display:flex;flex-direction:column;gap:10px;margin:12px 0;} .wsNum{padding:12px;border:1px solid rgba(0,0,0,.14);border-radius:12px;font-size:16px;} .wsFoot{display:flex;justify-content:space-between;gap:10px;margin-top:10px;color:rgba(0,0,0,.55);font-size:12px;} .wsGrid{display:grid;grid-template-columns:repeat(1,minmax(0,1fr));gap:10px;margin-top:10px;} .wsStat{padding:12px;border-radius:12px;border:1px solid rgba(0,0,0,.12);background:#fff;} .wsStatTitle{font-weight:800;} .wsStatValue{font-size:20px;font-weight:900;margin-top:4px;} .wsResultMoves{display:grid;gap:10px;margin-top:10px;} .wsResultMove{padding:12px;border-radius:12px;border:1px solid rgba(0,0,0,.12);text-decoration:none;color:#111;background:#fff;display:block;} .wsResultMove strong{display:block;} .wsResultMove span{display:block;margin-top:4px;color:rgba(0,0,0,.65);font-size:13px;} .water-iq-dashboard{margin-top:18px;padding:16px;border-radius:16px;border:1px solid rgba(59,130,246,.25);background:rgba(59,130,246,.08);display:grid;gap:12px;} .water-iq-dashboard__actions{display:flex;flex-wrap:wrap;gap:10px;} .water-iq-badge-grid{display:grid;gap:10px;} .water-iq-badge-card{display:flex;align-items:center;gap:10px;padding:12px;border-radius:12px;border:1px solid rgba(0,0,0,.12);background:rgba(255,255,255,.9);box-shadow:0 10px 24px rgba(59,130,246,.12);} .water-iq-badge-card strong{display:block;} .water-iq-badge-card .wsMuted{display:block;font-size:12px;} .water-iq-badge-card.is-earned{border-color:rgba(59,130,246,.45);box-shadow:0 16px 28px rgba(59,130,246,.2);} .water-iq-badge-emoji{width:40px;height:40px;border-radius:12px;display:grid;place-items:center;background:rgba(59,130,246,.12);font-size:18px;} .nav-link:hover,.nav-link:focus-visible,.btn:hover,.btn:focus-visible,.wsBtnPrimary:hover,.wsBtnPrimary:focus-visible,.wsBtnGhost:hover,.wsBtnGhost:focus-visible,.card:hover,.card:focus-visible,.wsResultMove:hover,.wsResultMove:focus-visible,.water-iq-badge-card:hover{animation:ws-wiggle .35s ease-in-out;} .wsBtnPrimary:hover,.wsBtnPrimary:focus-visible,.btn.primary:hover,.btn.primary:focus-visible{box-shadow:0 12px 28px rgba(59,130,246,.25);} .wsBtnGhost:hover,.wsBtnGhost:focus-visible{border-color:rgba(59,130,246,.45);background:rgba(59,130,246,.08);} .card:hover,.card:focus-visible,.wsResultMove:hover,.wsResultMove:focus-visible,.water-iq-badge-card:hover{transform:translateY(-2px);box-shadow:0 16px 30px rgba(59,130,246,.16);} @keyframes ws-wiggle{0%,100%{transform:translateY(0) rotate(0deg);}50%{transform:translateY(-2px) rotate(-0.35deg);}}
@media (max-width:640px){.nav-menu__panel{position:fixed;top:72px;right:12px;left:12px;min-width:auto;} .water-iq-card{padding:16px;border-radius:16px;} .water-iq-result-meta{flex-direction:column;align-items:flex-start;} .water-iq-score-circle{width:110px;height:110px;} .water-iq-fact{font-size:18px;} .wsRow{flex-direction:column;align-items:stretch;} .wsBtnPrimary,.wsBtnGhost{width:100%;text-align:center;} .wsBtnPrimary--pill{width:100%;} .wsNav{flex-direction:column;align-items:stretch;} .water-iq-badge-pill{width:100%;justify-content:center;text-align:center;}}
.ws-vignette-banner{position:fixed;bottom:18px;left:18px;right:18px;z-index:40;background:#0f172a;color:white;border-radius:16px;padding:14px 16px;display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between;box-shadow:0 20px 40px rgba(15,23,42,.35);opacity:0;transform:translateY(12px);transition:opacity .2s ease,transform .2s ease;}
.ws-vignette-banner.is-visible{opacity:1;transform:translateY(0);}
.ws-vignette-banner__content{display:grid;gap:4px;}
.ws-vignette-banner__button{border:none;background:#38bdf8;color:#0f172a;padding:10px 16px;border-radius:999px;font-weight:700;min-height:44px;cursor:pointer;}
.ws-vignette-banner__button:focus-visible{outline:3px solid #fff;outline-offset:2px;}
@media (min-width:720px){.water-iq-badge-grid{grid-template-columns:repeat(3,minmax(0,1fr));}}
@media (min-width:768px){.hero{grid-template-columns:2fr 1fr;align-items:center;} .hero h1{font-size:40px;} }
@media print{.site-header,.footer,.ad-slot-placeholder,.actions,.wizard-actions,.nav-links{display:none!important;} body{background:white;} .layout-slab{box-shadow:none;border-color:#e2e8f0;} .hero{padding-top:0;}}
`;

export function clientScript(defaultAdsenseClient: string) {
  const globalWindow = window as typeof window & { __WS_APP_BOOTED__?: boolean };
  if (globalWindow.__WS_APP_BOOTED__) {
    return;
  }
  globalWindow.__WS_APP_BOOTED__ = true;
  const appScript = document.querySelector<HTMLScriptElement>('script[data-ws-app]');
  if (appScript) {
    appScript.dataset.loaded = 'true';
  }
  const ADSENSE_CLIENT =
    (window as typeof window & { __WS_ADSENSE_CLIENT__?: string }).__WS_ADSENSE_CLIENT__ ||
    defaultAdsenseClient;
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
  const WATER_IQ_ANALYTICS_KEY = 'ws_water_iq_analytics';
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
  const getWaterIqAnalyticsOptIn = () => {
    try {
      return localStorage.getItem(WATER_IQ_ANALYTICS_KEY) === 'true';
    } catch (err) {
      return false;
    }
  };
  const setWaterIqAnalyticsOptIn = (value: boolean) => {
    try {
      localStorage.setItem(WATER_IQ_ANALYTICS_KEY, value ? 'true' : 'false');
    } catch (err) {
      // ignore
    }
  };
  const canTrackWaterIq = () => hasAnalyticsConsent() && getWaterIqAnalyticsOptIn();

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
    handleVignetteExperience();
    const existing = document.querySelector<HTMLScriptElement>(ADSENSE_SCRIPT_SELECTOR);
    if (existing) return existing;
    const script = document.createElement('script');
    script.async = true;
    script.src = ADSENSE_SCRIPT_SRC;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    handleVignetteExperience();
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

  const buildShareCardSvg = (title: string, summary: string) => {
    const safeTitle = escapeHtml(title);
    const safeSummary = escapeHtml(summary);
    const trimmed = safeSummary.length > 180 ? `${safeSummary.slice(0, 177)}...` : safeSummary;
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#f8fbff" />
  <rect x="50" y="50" width="1100" height="530" rx="28" fill="#ffffff" stroke="#0f172a" stroke-width="4" />
  <text x="110" y="170" font-size="48" font-family="system-ui, -apple-system, sans-serif" font-weight="800" fill="#0f172a">WaterShortcut plan</text>
  <text x="110" y="240" font-size="28" font-family="system-ui, -apple-system, sans-serif" font-weight="600" fill="#0f172a">${safeTitle}</text>
  <foreignObject x="110" y="280" width="980" height="200">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:system-ui,-apple-system,sans-serif;font-size:24px;color:#0f172a;line-height:1.4;">
      ${trimmed}
    </div>
  </foreignObject>
  <text x="110" y="540" font-size="22" font-family="system-ui, -apple-system, sans-serif" fill="#475569">AI water bill analysis · watershortcut.com</text>
</svg>`;
  };

  const buildShareImageUrl = (title: string, summary: string) =>
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildShareCardSvg(title, summary))}`;

  const buildShareUrl = (token?: string | null) => {
    const base = `${window.location.origin}/analyze-water-bill`;
    if (!token) return base;
    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}ref=${encodeURIComponent(token)}`;
  };

  const REFERRAL_TOKEN_KEY = 'ws_referral_token';

  const readStoredReferralToken = (): string | null => {
    const storages = [sessionStorage, localStorage];
    for (const storage of storages) {
      try {
        const stored = storage.getItem(REFERRAL_TOKEN_KEY);
        if (!stored) continue;
        const parsed = parseStoredReferralToken(stored);
        if (!parsed) {
          storage.removeItem(REFERRAL_TOKEN_KEY);
          continue;
        }
        if (parsed.issuedAt <= 0 || isReferralTokenExpired(parsed.issuedAt)) {
          storage.removeItem(REFERRAL_TOKEN_KEY);
          continue;
        }
        return parsed.token;
      } catch {
        continue;
      }
    }
    return null;
  };

  const fetchReferralToken = async (): Promise<string | null> => {
    try {
      const cached = readStoredReferralToken();
      if (cached) return cached;
    } catch {
      // ignore
    }
    try {
      const res = await fetch('/api/referral/token', {
        method: 'POST',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { token?: string };
      if (data?.token) {
        try {
          sessionStorage.setItem(REFERRAL_TOKEN_KEY, formatStoredReferralToken(data.token));
          localStorage.setItem(REFERRAL_TOKEN_KEY, formatStoredReferralToken(data.token));
        } catch {
          // ignore
        }
        return data.token;
      }
    } catch {
      return null;
    }
    return null;
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
    const shareTitle = result.topMoves[0]?.title || 'Water savings plan';
    const shareSummary = `${result.payingFor} Next step: ${result.nextStep}`;
    const shareImageUrl = buildShareImageUrl(shareTitle, shareSummary);
    const shareUrl = buildShareUrl(null);
    target.innerHTML = `
      <div class="results-grid">
        <h3>Your top 3 moves</h3>
        <div class="cards">${cards}</div>
        <h3>What you’re really paying for</h3>
        <p>${result.payingFor}</p>
        <h3>Your next best step</h3>
        <p>${result.nextStep}</p>
        ${result.confidenceNote ? `<p class="muted">${result.confidenceNote}</p>` : ''}
        <div class="share-card">
          <h4 class="share-card__title">Share your plan</h4>
          <p class="share-card__copy">Share your summary card and invite friends to try WaterShortcut.</p>
          <div class="share-card__media">
            <img src="${shareImageUrl}" alt="WaterShortcut plan summary card" loading="lazy" decoding="async" width="1200" height="630" />
          </div>
          <div class="share-card__actions">
            <a class="btn secondary" data-share-facebook href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              shareUrl,
            )}" target="_blank" rel="noreferrer">Facebook</a>
            <a class="btn secondary" data-share-x href="https://twitter.com/intent/tweet?text=${encodeURIComponent(
              `My WaterShortcut plan: ${shareUrl}`,
            )}" target="_blank" rel="noreferrer">X</a>
            <a class="btn secondary" data-share-email href="mailto:?subject=${encodeURIComponent(
              'My WaterShortcut plan',
            )}&body=${encodeURIComponent(`Here’s my plan: ${shareUrl}`)}">Email</a>
            <a class="btn secondary" href="${shareImageUrl}" download="watershortcut-plan.svg">Download card</a>
          </div>
        </div>
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

    const updateShareLinks = (token?: string | null) => {
      const updatedUrl = buildShareUrl(token);
      const facebook = target.querySelector<HTMLAnchorElement>('[data-share-facebook]');
      const twitter = target.querySelector<HTMLAnchorElement>('[data-share-x]');
      const email = target.querySelector<HTMLAnchorElement>('[data-share-email]');
      if (facebook) {
        facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(updatedUrl)}`;
      }
      if (twitter) {
        twitter.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          `My WaterShortcut plan: ${updatedUrl}`,
        )}`;
      }
      if (email) {
        email.href = `mailto:?subject=${encodeURIComponent(
          'My WaterShortcut plan',
        )}&body=${encodeURIComponent(`Here’s my plan: ${updatedUrl}`)}`;
      }
    };

    void fetchReferralToken().then((token) => updateShareLinks(token));
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
    const safeStorageGet = (key: string) => {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    };
    const safeStorageSet = (key: string, value: string) => {
      try {
        localStorage.setItem(key, value);
      } catch {
        // ignore storage failures
      }
    };
    const demoButton = document.querySelector<HTMLButtonElement>('[data-demo-run]');
    const demoOutput = document.querySelector<HTMLElement>('[data-demo-output]');
    if (demoButton && demoOutput) {
      demoButton.addEventListener('click', () => {
        renderAnalysis(demoResult, demoOutput);
        safeStorageSet('ws-latest-plan', JSON.stringify(demoResult));
      });
    }

    const manualForm = document.querySelector<HTMLFormElement>('#manual-form');
    const manualOutput = document.querySelector<HTMLElement>('[data-manual-output]');
    if (manualForm && manualOutput) {
      manualForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(manualForm);
        const usage = Number(formData.get('usage') || 0);
        const cost = Number(formData.get('cost') || 0);
        if (!usage || usage <= 0 || !cost || cost <= 0) {
          manualOutput.innerHTML =
            '<div class="callout">Please add total usage and total cost to build a plan.</div>';
          return;
        }
        manualOutput.innerHTML = '<div class="callout">Analyzing your manual entry…</div>';
        const payload = {
          period: String(formData.get('period') || ''),
          usage,
          unit: String(formData.get('unit') || ''),
          cost,
          rate: String(formData.get('rate') || ''),
          household: String(formData.get('household') || ''),
          notes: String(formData.get('notes') || ''),
        };
        try {
          const response = await fetch('/api/analyze-manual', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(payload),
          });
          const responseText = await response.text();
          if (!response.ok) {
            try {
              const data = JSON.parse(responseText) as { error?: string };
              manualOutput.innerHTML = `<div class="callout">${escapeHtml(
                data?.error || 'We couldn’t analyze that manual entry yet.',
              )}</div>`;
              return;
            } catch {
              manualOutput.innerHTML =
                '<div class="callout">We couldn’t analyze that manual entry yet.</div>';
              return;
            }
          }
          try {
            const data = JSON.parse(responseText) as { analysis?: AnalysisResult };
            if (data.analysis) {
              renderAnalysis(data.analysis, manualOutput);
              safeStorageSet('ws-latest-plan', JSON.stringify(data.analysis));
              return;
            }
          } catch {
            // fall through to raw HTML
          }
          manualOutput.innerHTML = responseText;
        } catch {
          manualOutput.innerHTML =
            '<div class="callout">We hit a snag. Please try again or email hello@watershortcut.com.</div>';
        }
      });
    }

    const stored = safeStorageGet('ws-latest-plan');
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
  let marginAdsObserver: MutationObserver | null = null;
  let marginAdsRaf = 0;
  let marginAdsHashListenerAttached = false;

  const MARGIN_AD_CLASS = 'ws-margin-ad';
  const MARGIN_AD_VISIBLE_CLASS = 'ws-margin-ad--visible';
  const MARGIN_AD_HIDDEN_CLASS = 'ws-margin-ad--hidden';
  const MARGIN_AD_VISIBILITY_MS = 10000;
  const marginAdStates = new WeakMap<HTMLElement, { shownAt: number; baselineScrollY: number }>();
  const MARGIN_AD_HOME_PATH = '/';
  let adsInitScheduled = false;
  let adsInitialized = false;

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

  const isHomePage = () => window.location.pathname === MARGIN_AD_HOME_PATH;
  const isVignetteExperience = () => window.location.hash.includes('google_vignette');
  const VIGNETTE_BANNER_ID = 'ws-vignette-banner';
  const VIGNETTE_DISMISS_DELAY_MS = 1400;
  const isAdsDisabled = () => document.body?.dataset.adsDisabled === 'true' || isHomePage();

  const isMarginAdOverlappingContent = (slot: HTMLElement) => {
    const main =
      document.querySelector<HTMLElement>('.ws-main') || document.querySelector<HTMLElement>('main');
    if (!main) return false;
    const slotRect = slot.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();
    const horizontalOverlap = slotRect.right > mainRect.left && slotRect.left < mainRect.right;
    const verticalOverlap = slotRect.bottom > mainRect.top && slotRect.top < mainRect.bottom;
    return horizontalOverlap && verticalOverlap;
  };

  const isMarginAdCandidate = (slot: HTMLElement) => {
    if (!slot.classList.contains('adsbygoogle')) return false;
    const style = window.getComputedStyle(slot);
    if (style.position !== 'fixed') return false;
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    return style.left !== 'auto' || style.right !== 'auto';
  };

  const ensureMarginAdBase = (slot: HTMLElement) => {
    slot.classList.add(MARGIN_AD_CLASS);
    if (!slot.classList.contains(MARGIN_AD_VISIBLE_CLASS)) {
      slot.classList.add(MARGIN_AD_HIDDEN_CLASS);
    }
  };

  const clearMarginAdState = (slot: HTMLElement) => {
    slot.classList.remove(MARGIN_AD_CLASS, MARGIN_AD_VISIBLE_CLASS, MARGIN_AD_HIDDEN_CLASS);
    marginAdStates.delete(slot);
  };

  const showMarginAd = (slot: HTMLElement) => {
    ensureMarginAdBase(slot);
    slot.classList.add(MARGIN_AD_VISIBLE_CLASS);
    slot.classList.remove(MARGIN_AD_HIDDEN_CLASS);
    marginAdStates.set(slot, { shownAt: Date.now(), baselineScrollY: window.scrollY });
  };

  const hideMarginAd = (slot: HTMLElement) => {
    ensureMarginAdBase(slot);
    slot.classList.add(MARGIN_AD_HIDDEN_CLASS);
    slot.classList.remove(MARGIN_AD_VISIBLE_CLASS);
  };

  const updateMarginAds = () => {
    const candidates = Array.from(document.querySelectorAll<HTMLElement>('ins.adsbygoogle'));
    if (isVignetteExperience()) {
      candidates.forEach((slot) => {
        if (!slot.classList.contains(MARGIN_AD_CLASS)) return;
        clearMarginAdState(slot);
      });
      return;
    }
    candidates.forEach((slot) => {
      if (!isMarginAdCandidate(slot)) return;
      ensureMarginAdBase(slot);
      if (isHomePage() || isMarginAdOverlappingContent(slot)) {
        hideMarginAd(slot);
        marginAdStates.delete(slot);
        return;
      }
      const state = marginAdStates.get(slot);
      if (!state || !slot.classList.contains(MARGIN_AD_VISIBLE_CLASS)) {
        showMarginAd(slot);
        return;
      }
      const elapsed = Date.now() - state.shownAt;
      const scrolled = Math.abs(window.scrollY - state.baselineScrollY);
      if (elapsed >= MARGIN_AD_VISIBILITY_MS || scrolled >= window.innerHeight) {
        hideMarginAd(slot);
      }
    });
  };

  const scheduleMarginAdsUpdate = () => {
    if (marginAdsRaf) return;
    marginAdsRaf = window.requestAnimationFrame(() => {
      marginAdsRaf = 0;
      updateMarginAds();
    });
  };

  const initMarginAds = () => {
    if (marginAdsObserver) return;
    marginAdsObserver = new MutationObserver(() => scheduleMarginAdsUpdate());
    marginAdsObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('scroll', scheduleMarginAdsUpdate, { passive: true });
    window.addEventListener('resize', scheduleMarginAdsUpdate);
    if (!marginAdsHashListenerAttached) {
      window.addEventListener('hashchange', scheduleMarginAdsUpdate);
      marginAdsHashListenerAttached = true;
    }
    scheduleMarginAdsUpdate();
  };

  const clearVignetteHash = () => {
    if (!isVignetteExperience()) return false;
    const url = `${window.location.pathname}${window.location.search}`;
    history.replaceState(history.state, '', url);
    return true;
  };

  const showVignetteBanner = () => {
    if (document.getElementById(VIGNETTE_BANNER_ID)) return;
    const banner = document.createElement('div');
    banner.className = 'ws-vignette-banner';
    banner.id = VIGNETTE_BANNER_ID;
    banner.innerHTML = `
      <div class="ws-vignette-banner__content">
        <strong>Interstitial ad blocked.</strong>
        <span>Continue to WaterShortcut.</span>
      </div>
      <button type="button" class="ws-vignette-banner__button">Continue</button>
    `;
    const button = banner.querySelector('button');
    if (button) {
      button.addEventListener('click', () => banner.remove());
    }
    setTimeout(() => {
      if (!document.body.contains(banner)) return;
      banner.classList.add('is-visible');
    }, VIGNETTE_DISMISS_DELAY_MS);
    document.body.appendChild(banner);
  };

  const handleVignetteExperience = () => {
    if (!isVignetteExperience()) return;
    clearVignetteHash();
    showVignetteBanner();
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
    if (isHomePage()) {
      return adsQueue;
    }
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
    if (isAdsDisabled()) {
      return;
    }
    if (isReactManagedAds()) {
      return;
    }
    patchAdDimensionSetters();
    initMarginAds();
    const adScript = ensureAdSenseLoaded();
    window.addEventListener('hashchange', handleVignetteExperience);
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

  const scheduleAdsInit = () => {
    if (adsInitScheduled || isAdsDisabled()) return;
    adsInitScheduled = true;

    const startAds = () => {
      if (adsInitialized || isAdsDisabled()) return;
      adsInitialized = true;
      initAds();
      cleanup();
    };

    const handleScroll = () => {
      if (window.scrollY > 0) {
        startAds();
      }
    };

    const handleInteraction = () => {
      startAds();
    };

    const cleanup = () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('pointerdown', handleInteraction, { once: true });
    window.addEventListener('keydown', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });
    if (window.scrollY > 0) {
      startAds();
    }
  };

  patchAdDimensionSetters();

  const getOrCreateWaterIqSessionId = () => {
    try {
      const key = 'ws_water_iq_sid_v2';
      const existing = localStorage.getItem(key);
      if (existing) return existing;
      const sid = Math.random().toString(36).slice(2) + '-' + Date.now().toString(36);
      localStorage.setItem(key, sid);
      return sid;
    } catch (err) {
      return 'anon-' + Math.random().toString(36).slice(2);
    }
  };

  const waterIqAssignVariant = (seed: string) => {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i += 1) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    const arm = h % 2 === 0 ? 'A' : 'B';
    return { v: 1, arm };
  };

  const waterIqPersonaFor = (score: number) => {
    if (score >= 9) return { code: 'WW', name: 'Water Wizard', emoji: '🧙‍♂️', tagline: 'High efficiency. High leverage. Rare combo.' };
    if (score >= 7) return { code: 'LS', name: 'Leak Sleuth', emoji: '🕵️‍♂️', tagline: 'You hunt silent waste. That’s power.' };
    if (score >= 4) return { code: 'PS', name: 'Practical Saver', emoji: '🛠️', tagline: 'You focus on moves that actually matter.' };
    return { code: 'CS', name: 'Curious Starter', emoji: '💧', tagline: 'You’re building a better water compass.' };
  };

  const waterIqPersonaFromCode = (code: string) => {
    const map = {
      CS: { code: 'CS', name: 'Curious Starter', emoji: '💧', tagline: 'You’re building a better water compass.' },
      PS: { code: 'PS', name: 'Practical Saver', emoji: '🛠️', tagline: 'You focus on moves that actually matter.' },
      LS: { code: 'LS', name: 'Leak Sleuth', emoji: '🕵️‍♂️', tagline: 'You hunt silent waste. That’s power.' },
      WW: { code: 'WW', name: 'Water Wizard', emoji: '🧙‍♂️', tagline: 'High efficiency. High leverage. Rare combo.' },
    };
    return map[code as keyof typeof map] ?? map.CS;
  };

  const waterIqHookFactById = (id: string) => {
    const map = {
      drip: { short: 'A 1‑drip/sec faucet can waste 3,000+ gallons/year (EPA).', sources: [{ label: 'EPA WaterSense: Fix a Leak Week', url: 'https://www.epa.gov/watersense/fix-leak-week' }] },
      irrig: { short: 'A tiny sprinkler leak can waste ~6,300 gallons/month (EPA).', sources: [{ label: 'EPA WaterSense: Fix a Leak Week', url: 'https://www.epa.gov/watersense/fix-leak-week' }] },
      toilet: { short: 'WaterSense toilets can save ~13,000 gallons/year (EPA).', sources: [{ label: 'EPA WaterSense: Statistics & Facts', url: 'https://www.epa.gov/watersense/statistics-and-facts' }] },
      leaks: { short: 'Household leaks can waste ~9,400 gallons/year (EPA).', sources: [{ label: 'EPA WaterSense: Statistics & Facts', url: 'https://www.epa.gov/watersense/statistics-and-facts' }] },
    };
    const item = map[id as keyof typeof map] ?? map.leaks;
    return { id, short: item.short, sources: item.sources };
  };

  const waterIqCoerceNumber = (value: unknown) => {
    if (typeof value === 'number') return Number.isFinite(value) ? value : null;
    if (typeof value === 'string' && value.trim() !== '') {
      const n = Number(value);
      return Number.isFinite(n) ? n : null;
    }
    return null;
  };

  const waterIqClamp = (num: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, num));

  const waterIqEncodeToken = (token: Record<string, unknown>) => {
    const bytes = new TextEncoder().encode(JSON.stringify(token));
    let binary = '';
    for (const b of bytes) binary += String.fromCharCode(b);
    const b64 = btoa(binary);
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  };

  const waterIqIsCorrect = (qid: string, answers: Record<string, unknown>) => {
    const q = (WATER_IQ_QUESTIONS || []).find((qq) => qq.id === qid);
    if (!q || q.kind !== 'mcq' || !q.correctOptionId) return false;
    return String(answers[qid] ?? '') === q.correctOptionId;
  };

  const waterIqAsFocus = (value: unknown) => {
    const s = String(value ?? '');
    if (s === 'indoor' || s === 'outdoor' || s === 'both') return s;
    return 'both';
  };

  const waterIqAsBudget = (value: unknown) => {
    const s = String(value ?? 'na');
    if (s === '0' || s === 'low' || s === 'med' || s === 'high' || s === 'na') return s;
    return 'na';
  };

  const waterIqAsHome = (value: unknown) => {
    const s = String(value ?? '');
    if (s === 'homeowner' || s === 'renter' || s === 'other') return s;
    return 'other';
  };

  const waterIqPickImpactStats = (focus: string) => {
    const stats = [
      {
        id: 'stat_leaks_9400',
        title: 'Household leaks add up',
        value: '≈ 180 gallons/week (≈ 9,400/year)',
        why: 'Leaks are common, quiet, and high-odds. Check first before you sacrifice comfort.',
        tags: ['indoor', 'outdoor', 'both'],
        sources: [{ label: 'EPA WaterSense: Statistics & Facts', url: 'https://www.epa.gov/watersense/statistics-and-facts' }],
      },
      {
        id: 'stat_irrig_6300',
        title: 'Tiny sprinkler leaks are huge',
        value: '≈ 6,300 gallons/month',
        why: 'Outdoor leaks can burn through water fast without looking dramatic.',
        tags: ['outdoor', 'both'],
        sources: [{ label: 'EPA WaterSense: Fix a Leak Week', url: 'https://www.epa.gov/watersense/fix-leak-week' }],
      },
      {
        id: 'stat_toilet_13000',
        title: 'Toilet upgrade can be massive',
        value: '≈ 13,000 gallons/year (≈ $130/year)',
        why: 'Toilets are always-on. Efficient fixtures compound savings daily.',
        tags: ['indoor', 'both'],
        sources: [{ label: 'EPA WaterSense: Statistics & Facts', url: 'https://www.epa.gov/watersense/statistics-and-facts' }],
      },
      {
        id: 'stat_brush_8',
        title: 'A tiny habit still matters',
        value: '≈ 8 gallons/day',
        why: 'Turning off the tap while brushing is a simple behavior win — great for households with $0 budget.',
        tags: ['indoor', 'both'],
        sources: [{ label: 'EPA WaterSense: Statistics & Facts', url: 'https://www.epa.gov/watersense/statistics-and-facts' }],
      },
    ];
    const leaks = stats.find((s) => s.id === 'stat_leaks_9400');
    const pool = stats.filter((s) => s.tags.includes(focus) || (focus === 'both' && s.tags.includes('both')));
    const chosen = leaks ? [leaks, ...pool.filter((s) => s.id !== leaks.id)] : pool;
    return chosen.slice(0, 3);
  };

  const waterIqRecommendMoves = (input: {
    homeSituation: string;
    focus: string;
    budgetTier: string;
    answers: Record<string, unknown>;
    pledge: string;
  }) => {
    const moves: string[] = [];
    const checkedLeaks = String(input.answers.h_leaks_checked ?? '') === 'yes';
    const constrained = input.budgetTier === '0' || input.budgetTier === 'low' || input.homeSituation === 'renter';

    if (!checkedLeaks) moves.push('leak_check');

    if (input.focus === 'outdoor') {
      moves.push('sprinkler_check');
      if (!constrained) moves.push('irrigation_controller');
    } else {
      moves.push('toilet_dye_test');
      if (!constrained) moves.push('watersense_toilet');
      moves.push('install_aerator');
    }

    if (input.pledge === 'analyze_bill') moves.unshift('analyze_bill');
    if (input.pledge === 'savings_plan') moves.unshift('savings_plan');

    moves.push('savings_plan');
    const uniq = Array.from(new Set(moves)).slice(0, 3);
    const meta: Record<string, { title: string; href: string }> = {
      leak_check: { title: '3‑minute leak check', href: '/leak-check' },
      toilet_dye_test: { title: 'Dye test: toilet leaks', href: '/leak-check' },
      fix_faucet: { title: 'Fix a dripping faucet', href: '/learn/water-saving-tips' },
      sprinkler_check: { title: 'Sprinkler walk-through', href: '/guides' },
      shower_timer: { title: 'Shower timer plan', href: '/calculators/shower' },
      install_aerator: { title: 'Install a faucet aerator', href: '/learn/water-saving-tips' },
      watersense_toilet: { title: 'Upgrade to WaterSense toilet', href: '/learn/water-saving-tips' },
      irrigation_controller: { title: 'Irrigation controller upgrade', href: '/guides' },
      savings_plan: { title: 'Build a savings plan', href: '/savings-plan' },
      analyze_bill: { title: 'Analyze your water bill', href: '/analyze-water-bill' },
    };
    return uniq.map((id) => {
      const costLabel =
        input.budgetTier === '0' || input.homeSituation === 'renter'
          ? 'Free / low-cost'
          : input.budgetTier === 'low'
            ? 'Low-cost'
            : input.budgetTier === 'med'
              ? 'Mid-cost'
              : input.budgetTier === 'high'
                ? 'Higher-cost (optional)'
                : 'Varies';
      const why =
        id === 'leak_check'
          ? input.homeSituation === 'renter'
            ? 'Leak checks help you document issues for a landlord without spending money.'
            : 'Leaks are common and high-impact. Start here before you chase tiny habits.'
          : id === 'sprinkler_check'
            ? 'Outdoor issues can waste thousands quickly — a walk-through is fast and revealing.'
            : id === 'toilet_dye_test'
              ? 'Silent toilet leaks are common and cheap to detect.'
              : id === 'watersense_toilet'
                ? 'If you can upgrade, toilets offer large year-round savings (EPA estimates).'
                : id === 'install_aerator'
                  ? 'One of the simplest low-cost upgrades with immediate savings.'
                  : id === 'irrigation_controller'
                    ? 'If you irrigate, a smarter controller can reduce waste without lifestyle changes.'
                    : id === 'analyze_bill'
                      ? 'Bills reveal spikes, tier jumps, and ‘silent’ waste patterns.'
                      : 'Get a prioritized checklist—impact first, effort second.';
      const info = meta[id] ?? { title: 'Next step', href: '/' };
      return { id, title: info.title, href: info.href, why, costLabel };
    });
  };

  const waterIqCompute = (variant: { v: number; arm: string }, answers: Record<string, unknown>) => {
    const preDrip = waterIqIsCorrect('k_drip_pre', answers);
    const postDrip = waterIqIsCorrect('k_drip_post', answers);
    const preIrr = waterIqIsCorrect('k_irrig_pre', answers);
    const postIrr = waterIqIsCorrect('k_irrig_post', answers);
    const preScore = (preDrip ? 1 : 0) + (preIrr ? 1 : 0);
    const postScore = (postDrip ? 1 : 0) + (postIrr ? 1 : 0);
    const delta = postScore - preScore;

    const knowledgeIds = ['k_drip_post', 'k_irrig_post', 'k_toilet'];
    const knowledgeScore = knowledgeIds.reduce((s, id) => s + (waterIqIsCorrect(id, answers) ? 1 : 0), 0);

    const shower = waterIqCoerceNumber(answers.h_shower_min);
    const showerScore = shower == null ? 0 : shower <= 6 ? 2 : shower <= 8 ? 1 : 0;
    const leakCheckScore = String(answers.h_leaks_checked ?? '') === 'yes' ? 1 : 0;
    const budgetTier = waterIqAsBudget(answers.c_budget);
    const budgetScore = budgetTier === '0' || budgetTier === 'low' ? 1 : 0;
    const habitScore = waterIqClamp(showerScore + leakCheckScore + budgetScore, 0, 4);
    const knowledgeScaled = Math.round((knowledgeScore / 3) * 6);
    const totalScore = waterIqClamp(knowledgeScaled + habitScore, 0, 10);

    const focus = waterIqAsFocus(answers.q_focus);
    const homeSituation = waterIqAsHome(answers.q_home);
    const pledge = String(answers.p_pledge ?? '');

    const persona = waterIqPersonaFor(totalScore);
    const badge = (() => {
      const checkedLeaks = String(answers.h_leaks_checked ?? '') === 'yes';
      if (focus === 'outdoor') return { id: 'irrigation_optimizer', label: 'Irrigation Optimizer', emoji: '🌿', reason: 'Outdoor focus: your biggest wins are often outside.' };
      if (checkedLeaks) return { id: 'leak_detective', label: 'Leak Detective', emoji: '🔍', reason: 'Leak awareness is high leverage.' };
      if (budgetTier === 'high' || budgetTier === 'med') return { id: 'bathroom_roi_hero', label: 'Bathroom ROI Hero', emoji: '🚽', reason: 'You can turn upgrades into compounding savings.' };
      if (delta > 0) return { id: 'habit_hacker', label: 'Habit Hacker', emoji: '⏱️', reason: 'You learned fast and can execute small wins.' };
      return { id: 'starter', label: 'Starter', emoji: '✨', reason: 'Begin with the quickest, cheapest wins.' };
    })();

    const impactRevealStats = waterIqPickImpactStats(focus);
    const recommendedMoves = waterIqRecommendMoves({ homeSituation, focus, budgetTier, answers, pledge });
    const hookId = !waterIqIsCorrect('k_irrig_post', answers)
      ? 'irrig'
      : !waterIqIsCorrect('k_drip_post', answers)
        ? 'drip'
        : !waterIqIsCorrect('k_toilet', answers)
          ? 'toilet'
          : 'leaks';
    const hookFact = waterIqHookFactById(hookId);

    return {
      version: 2,
      variant,
      score: { total: totalScore, knowledge: knowledgeScaled, habit: habitScore },
      knowledgeDelta: { pre: preScore, post: postScore, delta },
      persona,
      badge,
      hookFact,
      focus,
      segmentKey: `${homeSituation}|${focus}|${budgetTier}`,
      recommendedMoves,
      impactRevealStats,
      pledge,
      budgetTier,
      homeSituation,
    };
  };

  const waterIqBuildShareToken = (computed: ReturnType<typeof waterIqCompute>) => {
    const nonce = Math.random().toString(36).slice(2, 8);
    const ts = Math.floor(Date.now() / 1000);
    return {
      v: 2,
      n: nonce,
      ts,
      score: computed.score.total,
      k: computed.score.knowledge,
      h: computed.score.habit,
      delta: computed.knowledgeDelta.delta,
      persona: computed.persona.code,
      badge: computed.badge.id,
      hook: computed.hookFact.id,
      moves: computed.recommendedMoves.slice(0, 3).map((m) => m.id),
    };
  };

  const waterIqShareCopy = (arm: 'A' | 'B', payload: { score: number; persona: string; badge: string; challengeUrl: string; city?: string }) => {
    const copy = (WATER_IQ_COPY || { A: { shareBodyTemplate: () => '' }, B: { shareBodyTemplate: () => '' } }) as typeof WATER_IQ_COPY;
    return copy[arm].shareBodyTemplate(payload);
  };

  const trackWaterIqEvent = async (type: string, ref?: string | null) => {
    if (!canTrackWaterIq()) return;
    try {
      await fetch('/api/water-iq/event', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type, ref }),
        keepalive: true,
      });
    } catch (err) {
      // ignore
    }
  };

  const initWaterIq = () => {
    const root = document.querySelector<HTMLElement>('[data-water-iq-root]');
    if (!root) return;
    const questions = typeof WATER_IQ_QUESTIONS === 'undefined' ? [] : WATER_IQ_QUESTIONS;
    const flow = typeof WATER_IQ_FLOW === 'undefined' ? questions.map((q) => q.id) : WATER_IQ_FLOW;
    const copy = (WATER_IQ_COPY || { A: {}, B: {} }) as typeof WATER_IQ_COPY;
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('challenge');
    const answers: Record<string, unknown> = {};
    const variant = waterIqAssignVariant(getOrCreateWaterIqSessionId());
    const arm = variant.arm as 'A' | 'B';
    let analyticsOn = getWaterIqAnalyticsOptIn();
    let stepMode: 'landing' | 'question' | 'impact' | 'submitting' | 'error' = 'landing';
    let questionIndex = 0;
    let showExplanation = false;
    const isValidNumberAnswer = (question: (typeof questions)[number]) => {
      if (question.kind !== 'number') return true;
      const raw = answers[question.id];
      if (raw == null || raw === '') return !question.required;
      const value = Number(raw);
      if (!Number.isFinite(value)) return false;
      return value >= question.min && value <= question.max;
    };

    const render = () => {
      const totalQuestions = flow.length;
      const currentId = flow[questionIndex];
      const currentQ = questions.find((q) => q.id === currentId);

      if (stepMode === 'landing') {
        root.innerHTML = `
          <h1 class="wsH1">${escapeHtml(copy[arm].landingTitle)}</h1>
          <p class="wsP">${escapeHtml(copy[arm].landingSubtitle)}</p>
          ${ref ? `<div class="wsCallout"><strong>Challenge link detected.</strong> Beat their score — and then tag 3 friends.</div>` : ''}
          <details class="wsDisclosure">
            <summary><strong>${escapeHtml(copy[arm].disclosureTitle)}</strong></summary>
            <p class="wsMuted" style="margin-top:8px;">${escapeHtml(copy[arm].disclosureBody)}</p>
            <label class="wsRow" style="gap:8px;">
              <input type="checkbox" data-iq-analytics ${analyticsOn ? 'checked' : ''} />
              <span class="wsMuted">Allow anonymous analytics (recommended)</span>
            </label>
          </details>
          <div class="wsRow" style="margin-top:12px;">
            <button class="wsBtnPrimary" data-iq-start>Start</button>
            <a class="wsBtnGhost" href="/savings-plan">Build a savings plan instead</a>
          </div>
          <div class="wsFoot"><span>Private by default.</span><span>Sources included.</span></div>
        `;
        root.querySelector<HTMLInputElement>('[data-iq-analytics]')?.addEventListener('change', (event) => {
          const target = event.currentTarget as HTMLInputElement | null;
          if (!target) return;
          analyticsOn = target.checked;
          setWaterIqAnalyticsOptIn(analyticsOn);
          if (analyticsOn && ref) void trackWaterIqEvent('ref_landing', ref);
        });
        root.querySelector('[data-iq-start]')?.addEventListener('click', () => {
          if (analyticsOn) void trackWaterIqEvent('quiz_start', ref);
          stepMode = 'question';
          questionIndex = 0;
          showExplanation = false;
          render();
        });
        return;
      }

      if (stepMode === 'impact') {
        const computed = waterIqCompute(variant, answers);
        root.innerHTML = `
          <h2 class="wsH2">${escapeHtml(copy[arm].impactTitle)}</h2>
          <p class="wsMuted">${escapeHtml(copy[arm].impactSubtitle)}</p>
          <div class="wsGrid">
            ${computed.impactRevealStats
              .map(
                (s) => `
                  <div class="wsStat">
                    <div class="wsStatTitle">${escapeHtml(s.title)}</div>
                    <div class="wsStatValue">${escapeHtml(s.value)}</div>
                    <div class="wsMuted" style="margin-top:6px;">${escapeHtml(s.why)}</div>
                    <div class="wsMuted" style="margin-top:8px;">
                      Sources: ${s.sources
                        .map(
                          (src, idx) =>
                            `<a class="wsLink" href="${escapeHtml(src.url)}" target="_blank" rel="noreferrer">${escapeHtml(
                              src.label,
                            )}</a>${idx < s.sources.length - 1 ? ' · ' : ''}`,
                        )
                        .join('')}
                    </div>
                  </div>`,
              )
              .join('')}
          </div>
          <button class="wsBtnPrimary" data-iq-impact-continue style="margin-top:12px;">Continue (and improve your score)</button>
          <div class="wsFoot"><span>We celebrate improvement.</span><span>Private by default.</span></div>
        `;
        root.querySelector('[data-iq-impact-continue]')?.addEventListener('click', () => {
          if (analyticsOn) void trackWaterIqEvent('impact_continue', ref);
          const idx = flow.indexOf('__impact_reveal__');
          stepMode = 'question';
          questionIndex = idx + 1;
          showExplanation = false;
          render();
        });
        if (analyticsOn) void trackWaterIqEvent('impact_view', ref);
        return;
      }

      if (stepMode === 'submitting') {
        root.innerHTML = `
          <h2 class="wsH2">Scoring…</h2>
          <p class="wsMuted">Building your badge and next steps.</p>
        `;
        return;
      }

      if (stepMode === 'error') {
        root.innerHTML = `
          <h2 class="wsH2">Something went wrong</h2>
          <p class="wsP">Try again in a moment.</p>
          <button class="wsBtnPrimary" data-iq-restart>Restart</button>
        `;
        root.querySelector('[data-iq-restart]')?.addEventListener('click', () => {
          stepMode = 'landing';
          render();
        });
        return;
      }

      if (!currentQ) {
        stepMode = 'error';
        render();
        return;
      }

      const progress = Math.round(((questionIndex + 1) / totalQuestions) * 100);
      const isKnowledge = currentQ.kind === 'mcq' && Boolean(currentQ.correctOptionId);
      const numberValid = isValidNumberAnswer(currentQ);
      const showNumberError = currentQ.kind === 'number' && !numberValid;

      const choicesHtml =
        currentQ.kind === 'mcq'
          ? `<div class="wsChoices">${currentQ.options
              .map((opt) => {
                const selected = answers[currentQ.id] === opt.id;
                return `<button class="wsChoice ${selected ? 'isSelected' : ''}" data-iq-choice="${opt.id}">${escapeHtml(
                  opt.label,
                )}</button>`;
              })
              .join('')}</div>`
          : '';

      const numberHtml =
        currentQ.kind === 'number'
          ? `<div class="wsNumWrap">
              <input class="wsNum" inputmode="numeric" min="${currentQ.min}" max="${currentQ.max}" step="${
                currentQ.step ?? 1
              }" placeholder="${escapeHtml(currentQ.placeholder ?? '')}" value="${escapeHtml(
                typeof answers[currentQ.id] === 'number' ? String(answers[currentQ.id]) : (answers[currentQ.id] as string) || '',
              )}" data-iq-number />
              <button class="wsBtnPrimary" data-iq-next ${showNumberError ? 'disabled' : ''}>Next</button>
              ${showNumberError ? `<div class="wsMuted">Enter a number between ${currentQ.min} and ${currentQ.max}.</div>` : ''}
            </div>`
          : '';

      const top2Html =
        currentQ.kind === 'top2'
          ? `<div class="wsChoices">
              ${currentQ.options
                .map((opt) => {
                  const selected = Array.isArray(answers[currentQ.id]) && (answers[currentQ.id] as string[]).includes(opt.id);
                  const disabled = !selected && Array.isArray(answers[currentQ.id]) && (answers[currentQ.id] as string[]).length >= 2;
                  return `<button class="wsChoice ${selected ? 'isSelected' : ''}" data-iq-top2="${opt.id}" ${
                    disabled ? 'disabled' : ''
                  }><strong style="display:block;">${escapeHtml(opt.label)}</strong>${opt.hint ? `<span class="wsMuted">${escapeHtml(opt.hint)}</span>` : ''}</button>`;
                })
                .join('')}
              <div class="wsMuted">Selected: ${(Array.isArray(answers[currentQ.id]) ? (answers[currentQ.id] as string[]).length : 0)}/2</div>
            </div>`
          : '';

      const explanationHtml =
        currentQ.kind === 'mcq' && showExplanation && currentQ.correctOptionId
          ? `<div class="wsExplain">
              <div class="${answers[currentQ.id] === currentQ.correctOptionId ? 'wsGood' : 'wsBad'}">${
                answers[currentQ.id] === currentQ.correctOptionId ? '✅ Correct.' : '❌ Close. Here’s the shortcut truth:'
              }</div>
              ${
                currentQ.explanationByArm?.[arm] || currentQ.explanationDefault
                  ? `<p class="wsP">${escapeHtml(currentQ.explanationByArm?.[arm] || currentQ.explanationDefault || '')}</p>`
                  : ''
              }
              ${
                currentQ.sources?.length
                  ? `<div class="wsSources"><div class="wsMuted">Sources:</div><ul>${currentQ.sources
                      .map(
                        (s) =>
                          `<li><a class="wsLink" href="${escapeHtml(s.url)}" target="_blank" rel="noreferrer">${escapeHtml(
                            s.label,
                          )}</a></li>`,
                      )
                      .join('')}</ul></div>`
                  : ''
              }
              <button class="wsBtnPrimary" data-iq-next>Next</button>
            </div>`
          : '';

      const navHtml =
        currentQ.kind === 'mcq' || currentQ.kind === 'top2'
          ? `<div class="wsNav">
              <button class="wsBtnGhost" data-iq-back>Back</button>
              ${
                !(showExplanation && currentQ.kind === 'mcq' && currentQ.correctOptionId)
                  ? `<button class="wsBtnPrimary" data-iq-next ${
                      currentQ.required &&
                      (answers[currentQ.id] == null ||
                        answers[currentQ.id] === '' ||
                        (currentQ.kind === 'top2' && ((answers[currentQ.id] as string[] | undefined)?.length ?? 0) !== 2))
                        ? 'disabled'
                        : ''
                    }>Next</button>`
                  : ''
              }
            </div>`
          : `<div class="wsNav"><button class="wsBtnGhost" data-iq-back>Back</button></div>`;

      root.innerHTML = `
        <div class="wsTopBar">
          <div class="wsProgressWrap"><div class="wsProgress" style="width:${progress}%"></div></div>
          <div class="wsMuted">${questionIndex + 1}/${totalQuestions}</div>
        </div>
        <h2 class="wsH2">${escapeHtml(currentQ.stepTitle)}</h2>
        <p class="wsQ">${escapeHtml(currentQ.prompt)}</p>
        ${currentQ.helper ? `<p class="wsMuted">${escapeHtml(currentQ.helper)}</p>` : ''}
        ${choicesHtml}
        ${top2Html}
        ${numberHtml}
        ${explanationHtml}
        ${navHtml}
        <div class="wsFoot"><span>Private by default.</span><span>Sources included.</span></div>
      `;

      root.querySelectorAll<HTMLButtonElement>('[data-iq-choice]').forEach((button) => {
        button.addEventListener('click', () => {
          const value = button.getAttribute('data-iq-choice') || '';
          answers[currentQ.id] = value;
          if (isKnowledge) {
            showExplanation = true;
            render();
            return;
          }
          showExplanation = false;
          setTimeout(() => next(), 150);
        });
      });

      root.querySelectorAll<HTMLButtonElement>('[data-iq-top2]').forEach((button) => {
        button.addEventListener('click', () => {
          const value = button.getAttribute('data-iq-top2') || '';
          const current = Array.isArray(answers[currentQ.id]) ? (answers[currentQ.id] as string[]) : [];
          const set = new Set(current);
          if (set.has(value)) {
            set.delete(value);
          } else if (set.size < 2) {
            set.add(value);
          }
          answers[currentQ.id] = Array.from(set);
          render();
        });
      });

      root.querySelector<HTMLButtonElement>('[data-iq-back]')?.addEventListener('click', () => {
        if (questionIndex === 0) {
          stepMode = 'landing';
          render();
          return;
        }
        const prevIndex = questionIndex - 1;
        if (flow[prevIndex] === '__impact_reveal__') {
          stepMode = 'impact';
          render();
          return;
        }
        questionIndex = Math.max(0, prevIndex);
        showExplanation = false;
        render();
      });

      root.querySelector<HTMLButtonElement>('[data-iq-next]')?.addEventListener('click', () => next());

      root.querySelector<HTMLInputElement>('[data-iq-number]')?.addEventListener('input', (event) => {
        const input = event.currentTarget as HTMLInputElement | null;
        if (!input) return;
        const v = input.value.trim();
        const n = v === '' ? null : Number(v);
        if (n === null || Number.isFinite(n)) {
          answers[currentQ.id] = n ?? null;
          render();
        }
      });
    };

    const next = () => {
      const currentId = flow[questionIndex];
      const currentQ = questions.find((q) => q.id === currentId);
      if (currentQ && currentQ.kind === 'number' && !isValidNumberAnswer(currentQ)) {
        render();
        return;
      }
      const nextIndex = questionIndex + 1;
      if (nextIndex >= flow.length) {
        void submit();
        return;
      }
      const nextId = flow[nextIndex];
      if (nextId === '__impact_reveal__') {
        stepMode = 'impact';
        render();
        return;
      }
      questionIndex = nextIndex;
      showExplanation = false;
      render();
    };

    const submit = async () => {
      stepMode = 'submitting';
      render();
      const computed = waterIqCompute(variant, answers);
      const tokenObj = waterIqBuildShareToken(computed);
      const token = waterIqEncodeToken(tokenObj);
      try {
        localStorage.setItem('ws_water_iq_badge', computed.badge.id);
      } catch (err) {
        // ignore
      }
      if (analyticsOn && hasAnalyticsConsent()) {
        try {
          await fetch('/api/water-iq/submit', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ answers, variant, token, ref }),
          });
        } catch (err) {
          // ignore
        }
        void trackWaterIqEvent('quiz_complete', ref);
      }
      window.location.href = `/water-iq/r/${token}`;
    };

    render();
  };

  const initWaterIqBadge = () => {
    const badgeLabel = (() => {
      try {
        return localStorage.getItem('ws_water_iq_badge');
      } catch (err) {
        return null;
      }
    })();
    const badgeEls = document.querySelectorAll<HTMLElement>('[data-water-iq-badge]');
    badgeEls.forEach((el) => {
      if (badgeLabel) {
        el.textContent = `Water IQ: ${badgeLabel.replace(/_/g, ' ')}`;
      } else {
        el.textContent = 'Water IQ Challenge';
      }
    });
  };

  const initWaterIqResult = () => {
    const panel = document.querySelector<HTMLElement>('[data-water-iq-result]');
    if (!panel) return;
    const token = panel.dataset.token || '';
    const score = Number(panel.dataset.score || 0);
    const badge = panel.dataset.badge || 'starter';
    const personaCode = panel.dataset.persona || 'CS';
    const delta = Number(panel.dataset.delta || 0);
    const origin = window.location.origin;
    const challengeUrl = `${origin}/water-iq?challenge=${token}`;
    const shareUrl = `${origin}/water-iq/r/${token}`;
    const arm = waterIqAssignVariant(getOrCreateWaterIqSessionId()).arm as 'A' | 'B';
    const persona = waterIqPersonaFromCode(personaCode);
    const badgeLabel = badge.replace(/_/g, ' ').replace(/\\b\\w/g, (m) => m.toUpperCase());

    let cityForShare: string | undefined;

    const applyCreditReward = (amount: number, message: string, statusEl?: HTMLElement | null) => {
      try {
        const existing = Number(localStorage.getItem('ws_credits') || '5');
        const updated = existing + amount;
        localStorage.setItem('ws_credits', String(updated));
      } catch (err) {
        // ignore
      }
      if (statusEl) {
        statusEl.textContent = message;
      }
    };

    const scoreRewardEl = panel.querySelector<HTMLElement>('[data-water-iq-score-reward]');
    if (scoreRewardEl && token) {
      const rewardKey = `ws_water_iq_score_reward_${token}`;
      const alreadyRewarded = (() => {
        try {
          return localStorage.getItem(rewardKey) === 'true';
        } catch (err) {
          return false;
        }
      })();
      if (!alreadyRewarded) {
        if (score >= 10) {
          try {
            localStorage.setItem(rewardKey, 'true');
          } catch (err) {
            // ignore
          }
          scoreRewardEl.hidden = false;
          applyCreditReward(2, 'Perfect score! +2 credits added.', scoreRewardEl);
        } else if (score >= 8) {
          try {
            localStorage.setItem(rewardKey, 'true');
          } catch (err) {
            // ignore
          }
          scoreRewardEl.hidden = false;
          applyCreditReward(1, 'Top score! +1 credit added.', scoreRewardEl);
        }
      }
    }

    const share = async () => {
      await trackWaterIqEvent('share_click');
      const shareText = waterIqShareCopy(arm, {
        score,
        persona: persona.name,
        badge: badgeLabel,
        challengeUrl,
        city: cityForShare,
      });
      if (navigator.share) {
        try {
          await navigator.share({ title: 'Water IQ Challenge', text: shareText, url: shareUrl });
          return;
        } catch (err) {
          // fall back
        }
      }
      try {
        await navigator.clipboard.writeText(`${shareText}\\n${shareUrl}`);
        alert('Copied share text + link.');
      } catch (err) {
        prompt('Copy your link:', shareUrl);
      }
    };

    panel.querySelector<HTMLButtonElement>('[data-water-iq-share]')?.addEventListener('click', () => void share());
    panel.querySelector<HTMLButtonElement>('[data-water-iq-challenge]')?.addEventListener('click', async () => {
      await trackWaterIqEvent('cta_click');
      try {
        await navigator.clipboard.writeText(challengeUrl);
        alert('Challenge link copied.');
      } catch (err) {
        prompt('Copy challenge link:', challengeUrl);
      }
    });

    panel.querySelectorAll<HTMLElement>('[data-water-iq-cta]').forEach((cta) => {
      cta.addEventListener('click', () => void trackWaterIqEvent('cta_click'));
    });

    const shareStatus = panel.querySelector<HTMLElement>('[data-water-iq-share-status]');
    const shareRewardKey = `ws_water_iq_share_reward_${token}`;
    const rewardShareCredit = (channel: string) => {
      let alreadyRewarded = false;
      try {
        alreadyRewarded = localStorage.getItem(shareRewardKey) === 'true';
      } catch (err) {
        alreadyRewarded = false;
      }
      if (alreadyRewarded) {
        if (shareStatus) shareStatus.textContent = 'Thanks for sharing—credit already claimed.';
        return;
      }
      try {
        localStorage.setItem(shareRewardKey, 'true');
      } catch (err) {
        // ignore
      }
      applyCreditReward(1, `Shared via ${channel}. +1 credit added.`, shareStatus);
    };

    const shareX = panel.querySelector<HTMLAnchorElement>('[data-water-iq-share-x]');
    const shareLinkedIn = panel.querySelector<HTMLAnchorElement>('[data-water-iq-share-linkedin]');
    const shareCopy = panel.querySelector<HTMLButtonElement>('[data-water-iq-share-copy]');
    const shareText = waterIqShareCopy(arm, {
      score,
      persona: persona.name,
      badge: badgeLabel,
      challengeUrl,
      city: cityForShare,
    });
    const shareTextWithUrl = `${shareText} ${shareUrl}`;
    if (shareX) {
      shareX.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTextWithUrl)}`;
      shareX.addEventListener('click', () => rewardShareCredit('X'));
    }
    if (shareLinkedIn) {
      shareLinkedIn.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
      shareLinkedIn.addEventListener('click', () => rewardShareCredit('LinkedIn'));
    }
    shareCopy?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(shareTextWithUrl);
        rewardShareCredit('copy link');
      } catch (err) {
        if (shareStatus) shareStatus.textContent = 'Copy failed. Please try again.';
      }
    });

    const draftArea = panel.querySelector<HTMLTextAreaElement>('[data-water-iq-draft]');
    const draftGenerate = panel.querySelector<HTMLButtonElement>('[data-water-iq-draft-generate]');
    const draftCopy = panel.querySelector<HTMLButtonElement>('[data-water-iq-draft-copy]');
    draftGenerate?.addEventListener('click', () => {
      if (!draftArea) return;
      draftArea.value = `🌊 I just scored ${score}/10 on WaterShortcut’s Water IQ (${badgeLabel}).\n\n${shareText}\n\nTry it here: ${challengeUrl}`;
    });
    draftCopy?.addEventListener('click', async () => {
      const draft = draftArea?.value?.trim() || shareTextWithUrl;
      try {
        await navigator.clipboard.writeText(draft);
        rewardShareCredit('draft share');
      } catch (err) {
        if (shareStatus) shareStatus.textContent = 'Copy failed. Please try again.';
      }
    });

    const socialProof = panel.querySelector<HTMLElement>('[data-water-iq-social]');
    const shareProofButton = panel.querySelector<HTMLButtonElement>('[data-water-iq-share-proof]');
    let socialProofShareText = '';
    if (socialProof && token) {
      fetch(`/api/water-iq/social-proof?token=${encodeURIComponent(token)}`)
        .then((res) => res.json() as Promise<any>)
        .then((json) => {
          if (!json?.data?.ok) {
            socialProof.textContent = 'Social proof is unavailable (you may have opted out of analytics).';
            return;
          }
          const data = json.data;
          socialProof.innerHTML = `${escapeHtml((WATER_IQ_COPY as typeof WATER_IQ_COPY)[arm].socialProofPrefix)} <strong>${escapeHtml(
            data.topPledge.label,
          )}</strong> (${data.topPledge.pct}%). <span class="wsMuted">${escapeHtml(
            (WATER_IQ_COPY as typeof WATER_IQ_COPY)[arm].socialProofCaveat,
          )} n=${data.n}. ${escapeHtml((WATER_IQ_COPY as typeof WATER_IQ_COPY)[arm].socialProofSuffix)}</span>`;
          socialProofShareText = `${(WATER_IQ_COPY as typeof WATER_IQ_COPY)[arm].socialProofPrefix} ${data.topPledge.label} (${data.topPledge.pct}%). n=${data.n}. ${shareUrl}`;
          if (shareProofButton) shareProofButton.disabled = false;
        })
        .catch(() => {
          socialProof.textContent = 'Social proof is unavailable (you may have opted out of analytics).';
        });
    }
    if (shareProofButton) {
      shareProofButton.disabled = true;
      shareProofButton.addEventListener('click', async () => {
        if (!socialProofShareText) return;
        await trackWaterIqEvent('share_click');
        try {
          await navigator.clipboard.writeText(socialProofShareText);
          alert('Social proof copied.');
        } catch (err) {
          prompt('Copy social proof:', socialProofShareText);
        }
      });
    }

    const cityInput = panel.querySelector<HTMLInputElement>('[data-water-iq-city]');
    const cityButton = panel.querySelector<HTMLButtonElement>('[data-water-iq-city-submit]');
    const cityResult = panel.querySelector<HTMLElement>('[data-water-iq-city-result]');
    cityButton?.addEventListener('click', async () => {
      const city = cityInput?.value?.trim() || '';
      if (!city) {
        if (cityResult) {
          cityResult.textContent = 'Enter a city to see how your area compares.';
        }
        return;
      }
      await fetch('/api/water-iq/city', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, city }),
      }).catch(() => null);
      const res = await fetch(`/api/water-iq/city-average?city=${encodeURIComponent(city)}`)
        .then((r) => r.json() as Promise<any>)
        .catch(() => null);
      if (cityResult) {
        if (res?.data?.ok) {
          cityForShare = res.data.city;
          cityResult.textContent = `${res.data.city} average score: ${res.data.avgScore} (n=${res.data.n}).`;
        } else {
          cityResult.textContent = 'City averages appear once enough people in your city participate.';
        }
      }
      void trackWaterIqEvent('city_set');
    });

    const followupForm = panel.querySelector<HTMLFormElement>('[data-water-iq-followup]');
    const followupStatus = panel.querySelector<HTMLElement>('[data-water-iq-followup-status]');
    followupForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const email = followupForm.querySelector<HTMLInputElement>('input[name=\"email\"]')?.value?.trim() || '';
      const daysSelect = followupForm.querySelector('select[name="days"]') as HTMLSelectElement | null;
      const days = Number(daysSelect?.value || 7);
      const consent = Boolean(followupForm.querySelector<HTMLInputElement>('input[name=\"consent\"]')?.checked);
      if (!email) {
        if (followupStatus) followupStatus.textContent = 'Enter an email to schedule your check-in.';
        return;
      }
      if (!consent) {
        if (followupStatus) followupStatus.textContent = 'Please confirm consent to schedule your check-in.';
        return;
      }
      const res = await fetch('/api/water-iq/followup', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, email, days, consent }),
      }).then((r) => r.json() as Promise<any>).catch(() => null);
      if (followupStatus) {
        followupStatus.textContent = res?.ok ? '✅ Scheduled. We’ll check in soon.' : `❌ ${res?.error ?? 'Could not schedule'}`;
      }
      if (res?.ok) void trackWaterIqEvent('followup_optin');
    });

    const deltaEl = panel.querySelector<HTMLElement>('[data-water-iq-delta]');
    if (deltaEl) {
      deltaEl.textContent = `Knowledge delta: ${delta >= 0 ? '+' : ''}${delta}`;
    }

    panel.querySelectorAll<HTMLButtonElement>('[data-water-iq-reward]').forEach((button) => {
      button.addEventListener('click', async () => {
        const action = button.getAttribute('data-water-iq-reward') || '';
        if (!action) return;
        const res = await fetch('/api/water-iq/reward', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ token, action }),
        }).then((r) => r.json() as Promise<any>).catch(() => null);
        const status = panel.querySelector<HTMLElement>('[data-water-iq-reward-status]');
        if (res?.ok && res.awarded) {
          try {
            const existing = Number(localStorage.getItem('ws_credits') || '5');
            const updated = existing + 1;
            localStorage.setItem('ws_credits', String(updated));
          } catch (err) {
            // ignore
          }
          button.disabled = true;
          button.textContent = 'Credit claimed (+1)';
          if (status) status.textContent = '✅ Credit added to your account.';
        } else if (status) {
          status.textContent = res?.error || 'Credit already claimed for this step.';
        }
      });
    });
  };

  const reinitWaterIq = () => {
    initWaterIq();
    initWaterIqResult();
    initWaterIqBadge();
  };
  (window as typeof window & { __WS_REINIT_WATER_IQ__?: () => void }).__WS_REINIT_WATER_IQ__ =
    reinitWaterIq;

  let booted = false;
  const boot = () => {
    if (booted) return;
    booted = true;
    initFaq();
    initWizards();
    initCalculators();
    initProviderLookup();
    initRebatesTool();
    initBillUpload();
    initDemoAndManual();
    reinitWaterIq();
    initModals();
    initConsentBanner();
    ensureAnalyticsLoaded();
    trackPageView();
    const handleConsentUpdate = () => {
      ensureAnalyticsLoaded();
      trackPageView();
    };
    window.addEventListener('ws-consent-updated', handleConsentUpdate);
    scheduleAdsInit();
    if (isAdsDebugMode()) {
      updateDiagnosticsPanel();
      window.setInterval(updateDiagnosticsPanel, 2000);
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
}

const waterIqQuestionsJson = JSON.stringify(WATER_IQ_QUESTIONS);
const waterIqFlowJson = JSON.stringify(WATER_IQ_FLOW);
const waterIqCopyJson = JSON.stringify(WATER_IQ_COPY);

export const appJs = `const WATER_IQ_QUESTIONS = ${waterIqQuestionsJson};
const WATER_IQ_FLOW = ${waterIqFlowJson};
const WATER_IQ_COPY = ${waterIqCopyJson};
(${clientScript.toString()})(${JSON.stringify(DEFAULT_ADSENSE_CLIENT)});`;
