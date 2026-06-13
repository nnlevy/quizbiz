const SITE = "https://quizbiz.org";
const CONTACT_EMAIL = "hello@quizbiz.org";
const DOMAIN_DIRECTORY = [["quizbiz.org","Quizbiz LLC","business buyers, partners, reviewers, messaging providers","verify business identity and messaging practices","public company home, lead capture, domain directory, privacy policy, messaging terms","trust review and clear next step","quizbiz company trust compliance twilio sms privacy terms business identity"],["growth.business","Growth workflow hub","B2B teams needing qualified leads and faster follow-up","leads arrive from many channels without clear routing","lead capture, qualification, routing, and follow-up workflow design","scattered demand becomes a prioritized sales queue","growth leads sales follow up crm pipeline booking revenue b2b"],["contentasaservice.co","Content as a Service","experts, agencies, operators","expertise is trapped in notes and calls","service pages, explainers, comparison pages, authority content","buyer questions get answered before sales","content seo authority articles agency blog service pages education"],["searchfirm.co","Search firm intake","recruiters, search firms, candidates, hiring teams","candidate and client requests are vague and urgent","structured intake for roles, searches, fit, and hiring priorities","search work is easier to qualify","recruiting search staffing candidate hiring jobs talent placement"],["smallbusinessholder.com","Small business help","owners needing plain-English next steps","business advice is too abstract","practical checklists and decision support","owners get a usable starting point","small business owner local operations startup plan cash flow marketing"],["earn.software","Software that earns","software builders and operators","tools do not always create measurable value","productized workflows, evaluation notes, utility software","software effort connects to ROI","software saas automation tools roi product workflow ops"],["affordablehome.us","Affordable home eligibility","homeowners renters housing programs property operators","housing options and eligibility are confusing","address-aware intake and next-step routing","captures high-intent housing demand","home housing affordable real estate address rent property eligibility"],["watershortcut.com","Water bill help","homeowners renters property managers utility programs","water bills are confusing","bill analysis provider lookup leak checks savings steps","bill questions become concrete actions","water utility bill leak savings homeowner renter rebate"],["doting.co","Relationship follow-through","people coaches creators communities","good intentions do not become follow-through","AI-guided prompts gestures reminders habits","personal follow-through gets easier","relationship gift care coach community reminder personal habit"],["communityinternet.co","Community internet","neighborhoods property groups connectivity buyers","internet options are hard to compare locally","community internet education and intake","connectivity interest becomes a clearer request","internet broadband community wifi connectivity neighborhood provider"],["roofleakatlanta.com","Atlanta roof leak intake","Atlanta homeowners property managers","leaks need fast triage before damage spreads","local issue intake and repair-request capture","contractor-ready roof request","roof leak atlanta repair contractor storm home emergency"],["fixac.co","AC repair routing","homeowners and businesses with cooling problems","AC issues need quick triage","symptom intake and HVAC repair request capture","service teams get details before calling","ac hvac air conditioning repair cooling service contractor"],["checkinforwork.com","Work check-in","teams needing attendance jobsite shift confirmation","manual check-ins create accountability gaps","lightweight worker location and status check-ins","visibility without heavy workforce software","work check in attendance shift jobsite field team operations"],["cloudgpo.com","Cloud purchasing groups","organizations comparing SaaS cloud purchasing","cloud buying is fragmented","GPO-style intake for cloud needs and categories","shared demand and buying leverage","cloud gpo procurement saas purchasing vendor discount it"],["crmforlaw.com","CRM for law firms","law firms legal operators","client intake falls between email calls case systems","legal CRM evaluation and intake guidance","firms capture inquiries consistently","law legal crm client intake attorney case firm lead"],["staffing.how","Staffing playbooks","staffing teams recruiters operators","staffing needs repeatable intake screening placement","process guidance and workflow routing","staffing operations easier to improve","staffing recruiting hiring screening placement workforce"],["firmwebsite.com","Firm website conversion","professional services firms","websites describe services but do not qualify demand","positioning intake proof conversion paths","service websites become useful to prospects","firm website professional services agency law consulting conversion"],["voicesearch.cc","Voice search utility","teams exploring voice search audio input query interfaces","search misses spoken intent","voice-first search and query workflows","spoken questions become actionable results","voice search audio query natural language accessibility"],["estimatemarketshare.com","Market share estimates","founders operators analysts","market sizing assumptions are scattered","estimate workflows for market share and opportunity framing","starting estimate with assumptions","market share tam forecast analysis estimate research"],["riskfreetrial.org","Trial and offer trust","buyers comparing subscriptions trials offers","trial terms can feel risky or unclear","plain-English offer analysis and trust conversion support","buyers understand agreement points","trial offer subscription billing risk trust pricing"],["visualtos.com","Visual terms of service","customers and teams reviewing policies","legal terms are hard to scan","visual summaries and structured policy reading aids","terms become easier to review","terms tos legal policy privacy visual contract"],["startbusiness.us","Start business guidance","new founders small business starters","starting a business creates disconnected tasks","steps for entity offer website lead capture launch basics","confusion becomes a first-week plan","start business founder llc startup launch formation plan"],["cascadeave.com","Cascade Avenue local guide","residents visitors local businesses","local discovery is fragmented","neighborhood guide and local-intent capture","local demand connects to places and events","local cascade atlanta neighborhood events restaurants guide"],["deadtreeatlanta.com","Dead tree Atlanta","Atlanta property owners","tree risk needs fast local triage","tree removal storm risk and safety intake","urgent service demand gets context","tree atlanta dead tree removal storm hazard property"],["buypatioheater.com","Patio heater recommendations","outdoor heating shoppers","heater choice varies by space fuel safety budget","recommendation flow for heater fit","product confusion becomes a shortlist","patio heater outdoor shopping recommendation home product"],["grocerydelivered.org","Grocery delivery help","households comparing delivery options","delivery choices vary by location budget urgency","routing for grocery delivery needs","users find a practical delivery path","grocery delivery food shopping household local"],["makelife.org","Make Life","people seeking practical life improvement","personal goals need repeatable actions","guided prompts and simple action plans","broad goals become easier to start","life goals habits personal planning wellbeing"],["chatulah.com","Neighborhood cat quest","neighborhood communities playful local groups","local sightings disappear quickly","shared sightings and neighborhood quest experience","lightweight community engagement","community neighborhood game local sightings quest"],["10-7.org","Learn, act, and advocate","people seeking civic educational advocacy resources","sensitive topics need clear resources","structured resource hub and responsible action steps","awareness moves to responsible action","education advocacy resources civic learn act"],["freestock.tips","Stock research tips","individual investors research-minded readers","market ideas need disciplined filtering","research prompts and stock-screening education","more disciplined investing research","stocks investing market research screen finance"],["valuestockscreen.com","Value stock screen","investors screening value opportunities","repeatable criteria are needed","screening workflow and value research framing","research process becomes repeatable","value stocks screen investing finance research"],["makeyourownbitcoin.com","Bitcoin learning","people learning Bitcoin","crypto explanations are hype-heavy or technical","education on mechanics custody experiments","safer learning before action","bitcoin crypto education wallet mining blockchain"],["investyourlifeinsurance.com","Life insurance education","consumers comparing insurance options","insurance mixes protection cost investment language","plain-English education and question routing","better questions before buying","life insurance insurance finance investment policy consumer"],["debtsettlements.co","Debt settlement education","consumers researching debt options","debt settlement tradeoffs need careful review","educational intake and comparison prompts","visitors understand options first","debt settlement credit finance consumer relief"],["industrialrefurbisher.com","Industrial refurbishment","industrial buyers equipment operators","repair refurbish replace decisions need context","equipment intake and vendor routing","industrial demand captured in structure","industrial equipment refurbish repair manufacturing vendor"],["nirlevy.org","Nir Levy public profile","people seeking background and contact context","project context is scattered","public profile and project context hub","human context when appropriate","profile founder projects contact background"]];

const styles = String.raw`
  :root{color-scheme:light;--bg:#f6f7f2;--ink:#11131f;--muted:#596072;--line:#d9dfd4;--surface:#fff;--navy:#141a3a;--teal:#1b9aaa;--coral:#f0704f;--green:#89b94c;--radius:8px;--width:1160px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:linear-gradient(rgba(20,26,58,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(20,26,58,.04) 1px,transparent 1px),radial-gradient(circle at top left,rgba(27,154,170,.16),transparent 34rem),var(--bg);background-size:34px 34px,34px 34px,auto,auto;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;line-height:1.6}a{color:inherit}.wrap,header,footer{width:min(calc(100% - 32px),var(--width));margin:0 auto}header,footer{display:flex;justify-content:space-between;gap:18px}header{align-items:center;padding:18px 0}.brand{display:inline-flex;align-items:center;gap:12px;text-decoration:none}.mark{display:grid;width:42px;height:42px;place-items:center;border:2px solid var(--ink);border-radius:var(--radius);background:var(--navy);color:#cde86b;box-shadow:5px 5px 0 var(--coral);font-size:1.45rem;font-weight:900}.brand strong,.brand small{display:block}.brand small{color:var(--muted);font-size:.78rem}nav,.actions{display:flex;flex-wrap:wrap;gap:8px}nav a,.button,button{min-height:42px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:var(--radius);background:rgba(255,255,255,.88);color:var(--ink);cursor:pointer;font-size:.9rem;font-weight:800;line-height:1.1;padding:10px 14px;text-decoration:none}.primary{background:var(--navy);border-color:var(--navy);color:#fff}.hero{display:grid;grid-template-columns:minmax(0,1.02fr) minmax(360px,.98fr);gap:22px;align-items:stretch;min-height:min(72vh,680px);padding:24px 0 12px}.panel,.product,.card,.builder,.result,.table,.consent,.final,.legal,.search,.domain-card,.sms-box{border:1px solid var(--line);border-radius:var(--radius);background:rgba(255,255,255,.94);box-shadow:0 18px 55px rgba(20,26,58,.12)}.hero-copy{display:flex;flex-direction:column;justify-content:center;padding:clamp(24px,4vw,52px)}.eyebrow{margin:0 0 12px;color:#536014;font-size:.76rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}h1,h2,h3,h4{margin:0;color:var(--ink);letter-spacing:0}h1{max-width:12ch;font-size:clamp(3rem,5.2vw,5.5rem);font-weight:900;line-height:.94}h2{max-width:13ch;font-size:clamp(2.1rem,4.1vw,4.1rem);font-weight:900;line-height:1}h3{font-size:1.32rem;line-height:1.08}p,li,.row span{color:var(--muted)}.hero p:not(.eyebrow){max-width:62ch;margin:18px 0 0;font-size:1.08rem}.actions{margin-top:22px}.product{position:relative;display:grid;align-content:center;gap:18px;overflow:hidden;padding:clamp(22px,4vw,42px);background:linear-gradient(135deg,rgba(27,154,170,.15),transparent 45%),linear-gradient(315deg,rgba(240,112,79,.16),transparent 42%),#fff}.product:before{position:absolute;inset:-30% auto -30% -24%;width:42%;content:"";background:linear-gradient(90deg,transparent,rgba(255,255,255,.74),transparent);transform:rotate(10deg);animation:scan 5s ease-in-out infinite}.product>*{position:relative}.product-top{display:flex;justify-content:space-between;gap:10px}.product-top strong{color:var(--green);overflow-wrap:anywhere}.flow{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.flow-step{min-height:118px;display:grid;align-content:space-between;gap:14px;border:2px solid var(--ink);border-radius:var(--radius);background:#fff;padding:14px;animation:float 5.5s ease-in-out infinite}.flow-step:nth-child(2){background:var(--teal);color:#fff}.flow-step:nth-child(3){background:#d9ef80}.flow-step:nth-child(4){background:var(--coral);color:#fff}.flow-step span{width:30px;height:30px;display:grid;place-items:center;border:1px solid currentColor;border-radius:999px;font-weight:900}.flow-step strong{font-size:clamp(1.05rem,2vw,1.45rem);line-height:1.05}.command{border:1px solid var(--line);border-radius:var(--radius);background:rgba(255,255,255,.9);padding:16px}.command span{display:block;width:36%;height:5px;margin-bottom:12px;border-radius:999px;background:var(--teal);animation:progress 4s ease-in-out infinite}.command p{margin:0;color:var(--ink);font-weight:750}.metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.metrics div{border:1px solid var(--line);border-radius:var(--radius);background:rgba(255,255,255,.82);padding:12px}.metrics strong,.metrics span{display:block}.metrics strong{font-size:1.35rem}.metrics span{color:var(--muted);font-size:.78rem;line-height:1.25}.proof{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;overflow:hidden;margin-top:12px;border:1px solid var(--line);border-radius:var(--radius);background:var(--line)}.proof span{display:grid;min-height:76px;place-items:center;background:var(--navy);color:#fff;font-weight:850;padding:14px;text-align:center}section{padding-top:clamp(56px,8vw,96px)}.section-head{max-width:780px;margin-bottom:24px}.section-head p:not(.eyebrow){max-width:68ch;margin:16px 0 0;font-size:1.02rem}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.card{min-height:190px;padding:18px}.capture-grid,.trust-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(360px,1.1fr);gap:16px;align-items:start}.builder,.result,.consent,.search,.sms-box{padding:20px}.builder{display:grid;gap:16px}.builder label,.builder fieldset,.search label{display:grid;gap:8px;min-width:0;margin:0;border:0;padding:0;color:var(--ink);font-weight:850}input,select,textarea{width:100%;min-height:46px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;color:var(--ink);padding:10px 12px;font:inherit}textarea{min-height:132px;resize:vertical}.sms-consent{display:grid!important;grid-template-columns:22px minmax(0,1fr);align-items:start;font-weight:650!important;line-height:1.45}.sms-consent input{width:18px;min-height:18px;margin-top:3px}.fine{font-size:.86rem;color:var(--muted)}.segmented{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.segmented .active{border-color:var(--navy);background:var(--navy);color:#fff}.result{position:sticky;top:12px;overflow:hidden}.score{display:flex;align-items:center;gap:14px;margin-bottom:18px;border-bottom:1px solid var(--line);padding-bottom:18px}.score span{width:76px;height:76px;display:grid;place-items:center;border-radius:50%;background:conic-gradient(var(--teal) 0 66%,#e6e9df 66% 100%);font-size:1.55rem;font-weight:900}.result ul{display:grid;gap:8px;margin:10px 0 0;padding-left:20px}.status{border-left:4px solid var(--teal);background:#eef8f8;color:var(--ink);padding:12px;display:none}.status.show{display:block}.results{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-top:16px}.domain-card{min-height:250px;display:grid;align-content:space-between;gap:16px;padding:18px}.domain-card small{display:block;margin-bottom:10px;color:#536014;font-weight:900;letter-spacing:.1em;text-transform:uppercase}.domain-card h3{overflow-wrap:anywhere}.domain-card a{min-height:40px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:var(--radius);font-weight:850;padding:8px 10px;text-decoration:none}.timeline{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;overflow:hidden;border:1px solid var(--line);border-radius:var(--radius);background:var(--line)}.timeline article{min-height:240px;background:#fff;padding:20px}.timeline span{width:34px;height:34px;display:grid;place-items:center;margin-bottom:18px;border-radius:999px;background:var(--navy);color:#fff;font-weight:900}.table{display:grid;overflow:hidden}.row{display:grid;grid-template-columns:170px minmax(0,1fr);gap:16px;padding:14px 16px}.row+.row{border-top:1px solid var(--line)}.consent{background:linear-gradient(180deg,#fff,#eef6f5)}.consent p:not(.eyebrow){color:var(--ink)}.final{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:center;margin-top:clamp(56px,8vw,96px);padding:clamp(22px,4vw,36px)}footer{margin-top:52px;border-top:1px solid var(--line);padding:28px 0 36px}.legal{max-width:860px;margin-top:36px;padding:clamp(24px,5vw,48px)}.legal h1{max-width:none;font-size:clamp(2.4rem,5vw,4.8rem)}.legal section{padding-top:20px;margin-top:20px;border-top:1px solid var(--line)}.legal h2{max-width:none;font-size:1.35rem;line-height:1.15}@keyframes scan{0%,42%{transform:translateX(0) rotate(10deg)}74%,100%{transform:translateX(370%) rotate(10deg)}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}@keyframes progress{0%,100%{width:28%}50%{width:78%}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.001ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}@media(max-width:980px){header,footer{align-items:flex-start;flex-direction:column}.hero,.capture-grid,.trust-grid,.final{grid-template-columns:1fr}.grid,.timeline,.results{grid-template-columns:repeat(2,minmax(0,1fr))}.result{position:static}}@media(max-width:740px){.wrap,header,footer,.legal{width:min(calc(100% - 20px),var(--width))}h1{max-width:none;font-size:clamp(2.25rem,12vw,3.25rem);line-height:.98;overflow-wrap:break-word}h2{max-width:none;font-size:clamp(1.85rem,9vw,2.7rem)}.flow,.proof,.grid,.timeline,.metrics,.segmented,.results{grid-template-columns:1fr}.row{grid-template-columns:1fr;gap:4px}.button,nav a,button{width:100%}}
`;

const premiumStyles = String.raw`
  :root{--bg:#f8faf4;--ink:#111827;--muted:#596174;--line:rgba(17,24,39,.12);--surface:#fff;--navy:#101a3f;--teal:#00a6a6;--coral:#ff6b4a;--green:#b7de57;--gold:#ffd166;--violet:#6d5dfc;--radius:8px;--width:1188px;--shadow:0 24px 80px rgba(16,26,63,.14);--soft-shadow:0 14px 40px rgba(16,26,63,.1)}body{background:radial-gradient(circle at 12% 4%,rgba(0,166,166,.22),transparent 28rem),radial-gradient(circle at 82% 0,rgba(255,107,74,.16),transparent 30rem),linear-gradient(180deg,#fbfff6 0,#f5f7ee 42%,#eef6f4 100%);font-feature-settings:"ss01" on,"cv01" on}.wrap,header,footer{width:min(calc(100% - 40px),var(--width))}header{position:sticky;top:0;z-index:10;margin-top:12px;border:1px solid rgba(255,255,255,.72);border-radius:16px;background:rgba(255,255,255,.72);box-shadow:0 18px 45px rgba(16,26,63,.08);backdrop-filter:blur(20px);padding:10px 12px}.mark{border:0;background:linear-gradient(135deg,var(--navy),#243078);color:#dffb78;box-shadow:0 10px 30px rgba(16,26,63,.24),inset 0 0 0 1px rgba(255,255,255,.2)}nav a,.button,button{border-color:rgba(17,24,39,.1);border-radius:999px;background:rgba(255,255,255,.76);box-shadow:0 1px 0 rgba(255,255,255,.8) inset;transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,background .2s ease}.primary,.button.primary{background:linear-gradient(135deg,var(--navy),#29347c);border-color:transparent;box-shadow:0 16px 36px rgba(16,26,63,.28);color:#fff}.button:hover,button:hover,nav a:hover{border-color:rgba(16,26,63,.28);box-shadow:0 18px 34px rgba(16,26,63,.14);transform:translateY(-2px)}.hero{position:relative;grid-template-columns:minmax(0,.9fr) minmax(430px,1.1fr);gap:28px;min-height:min(78vh,760px);padding:42px 0 18px}.hero:before{position:absolute;inset:4% -4% auto auto;width:180px;height:180px;border:1px solid rgba(16,26,63,.14);border-radius:50%;content:"";background:conic-gradient(from 140deg,rgba(0,166,166,.22),rgba(255,107,74,.2),rgba(183,222,87,.24),rgba(0,166,166,.22));filter:blur(.2px);animation:orb 12s linear infinite}.panel,.product,.card,.builder,.result,.table,.consent,.final,.legal,.search,.domain-card,.sms-box{border-color:rgba(255,255,255,.74);border-radius:20px;background:linear-gradient(180deg,rgba(255,255,255,.94),rgba(255,255,255,.78));box-shadow:var(--shadow);backdrop-filter:blur(18px)}.hero-copy{position:relative;overflow:hidden;background:linear-gradient(145deg,#101a3f 0%,#141b3c 58%,#25337e 100%);padding:clamp(30px,5vw,64px)}.hero-copy:before{position:absolute;inset:auto -26% -38% 18%;height:58%;content:"";background:radial-gradient(circle,rgba(183,222,87,.36),transparent 68%)}.hero-copy>*{position:relative}.hero-copy h1,.hero-copy h2,.hero-copy h3,.hero-copy p:not(.eyebrow){color:#fff}.hero-copy p:not(.eyebrow){color:rgba(255,255,255,.76);font-size:1.13rem}.eyebrow{color:#5f6b13;letter-spacing:.14em}.hero-copy .eyebrow{color:#dffb78}h1{max-width:14ch;font-size:4.2rem;line-height:.9;text-wrap:balance}h2{max-width:13ch;font-size:clamp(2.35rem,4.8vw,4.75rem);line-height:.94;text-wrap:balance}.product{isolation:isolate;align-content:stretch;background:linear-gradient(140deg,rgba(255,255,255,.88),rgba(239,250,249,.82) 40%,rgba(255,245,239,.92));padding:clamp(20px,3vw,34px)}.product:after{position:absolute;inset:16px;border:1px solid rgba(16,26,63,.1);border-radius:16px;content:"";pointer-events:none}.product-top{align-items:center;border-bottom:1px solid rgba(16,26,63,.1);padding-bottom:12px}.product-top span{color:var(--muted);font-size:.8rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase}.product-top strong{display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(0,166,166,.18);border-radius:999px;background:rgba(255,255,255,.7);color:#007d7d;padding:7px 10px}.product-top strong:before{width:8px;height:8px;border-radius:50%;background:var(--green);box-shadow:0 0 0 6px rgba(183,222,87,.2);content:""}.flow{gap:14px}.flow-step{position:relative;overflow:hidden;min-height:136px;border:1px solid rgba(16,26,63,.16);box-shadow:var(--soft-shadow);transition:transform .22s ease,box-shadow .22s ease}.flow-step:after{position:absolute;inset:auto -20% -55% 20%;height:70%;content:"";background:radial-gradient(circle,rgba(255,255,255,.58),transparent 68%)}.flow-step strong{position:relative;font-size:clamp(1.18rem,2vw,1.7rem)}.flow-step span{position:relative;background:rgba(255,255,255,.24);backdrop-filter:blur(10px)}.flow-step:hover,.domain-card:hover,.card:hover{transform:translateY(-4px);box-shadow:0 30px 70px rgba(16,26,63,.18)}.command{border-color:rgba(16,26,63,.1);background:rgba(16,26,63,.92);box-shadow:inset 0 1px 0 rgba(255,255,255,.12)}.command p{color:#fff}.command span{background:linear-gradient(90deg,var(--green),var(--teal),var(--coral));box-shadow:0 0 26px rgba(0,166,166,.36)}.metrics div{border-color:rgba(16,26,63,.08);background:rgba(255,255,255,.72);box-shadow:0 12px 26px rgba(16,26,63,.08)}.metrics strong{color:var(--navy)}.proof{border:0;border-radius:18px;background:#101a3f;box-shadow:var(--shadow)}.proof span{position:relative;min-height:88px;background:transparent;color:#fff}.proof span+span{border-left:1px solid rgba(255,255,255,.13)}.proof span:before{position:absolute;top:18px;width:26px;height:3px;border-radius:999px;background:linear-gradient(90deg,var(--green),var(--teal));content:""}section{padding-top:clamp(64px,9vw,112px)}.section-head{max-width:850px}.section-head p:not(.eyebrow){font-size:1.08rem}.grid{gap:18px}.card,.timeline article,.domain-card{border-color:rgba(255,255,255,.78);background:linear-gradient(180deg,rgba(255,255,255,.96),rgba(255,255,255,.82));box-shadow:var(--soft-shadow)}.card{position:relative;overflow:hidden;padding:22px}.card:before{display:block;width:34px;height:5px;margin-bottom:26px;border-radius:999px;background:linear-gradient(90deg,var(--teal),var(--green));content:""}.capture-grid,.trust-grid{gap:22px}.builder,.result,.search{background:rgba(255,255,255,.86)}input,select,textarea{border-color:rgba(16,26,63,.14);border-radius:12px;background:rgba(255,255,255,.92);box-shadow:0 1px 0 rgba(255,255,255,.9) inset;transition:border-color .18s ease,box-shadow .18s ease}input:focus,select:focus,textarea:focus{border-color:rgba(0,166,166,.72);box-shadow:0 0 0 4px rgba(0,166,166,.12);outline:none}.segmented button{border-radius:12px}.segmented .active{background:linear-gradient(135deg,var(--navy),#29347c)}.sms-consent{border:1px solid rgba(16,26,63,.08);border-radius:14px;background:#fbfff7;padding:12px}.result{position:sticky;top:92px}.score span{background:conic-gradient(var(--teal) 0 66%,rgba(16,26,63,.08) 66% 100%);box-shadow:inset 0 0 0 8px rgba(255,255,255,.7)}.results{gap:18px}.domain-card{position:relative;overflow:hidden}.domain-card:before{position:absolute;inset:0 0 auto;height:5px;background:linear-gradient(90deg,var(--teal),var(--green),var(--coral));content:""}.domain-card a{border-radius:999px;background:#fff;box-shadow:0 10px 22px rgba(16,26,63,.08)}.timeline{gap:0;border-color:rgba(16,26,63,.1);border-radius:20px;box-shadow:var(--soft-shadow)}.timeline article{border-radius:0;box-shadow:none}.timeline span{background:linear-gradient(135deg,var(--navy),#29347c);box-shadow:0 12px 24px rgba(16,26,63,.2)}.table{border-radius:18px;box-shadow:var(--soft-shadow)}.row{background:rgba(255,255,255,.72)}.consent{background:linear-gradient(145deg,#101a3f,#25337e);color:#fff}.consent p,.consent p:not(.eyebrow),.consent h3{color:#fff}.consent .eyebrow{color:#dffb78}.consent .button:not(.primary){background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22);color:#fff}.final{position:relative;overflow:hidden;background:linear-gradient(135deg,#101a3f,#25337e);color:#fff}.final:after{position:absolute;right:-8%;bottom:-80%;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(183,222,87,.34),transparent 66%);content:""}.final>*{position:relative}.final h2,.final p{color:#fff}footer{border-top:0}.legal{background:rgba(255,255,255,.9)}@keyframes orb{to{transform:rotate(360deg)}}@media(max-width:980px){header{position:relative}.hero{grid-template-columns:1fr;min-height:auto}.result{top:0}}@media(max-width:740px){.wrap,header,footer,.legal{width:min(calc(100% - 22px),var(--width))}header{border-radius:14px}.hero{padding-top:18px}.hero-copy{padding:28px}h1{font-size:2.65rem;line-height:.92}h2{font-size:clamp(2rem,9vw,2.85rem)}.proof span+span{border-left:0;border-top:1px solid rgba(255,255,255,.13)}.flow-step{min-height:112px}.metrics{gap:8px}.card,.builder,.result,.consent,.search,.domain-card{border-radius:16px}.sms-consent{grid-template-columns:20px minmax(0,1fr)!important}.final{grid-template-columns:1fr}.button,nav a,button{min-height:44px}}
`;

const mobilePolishStyles = String.raw`
  @media(max-width:740px){body{overflow-x:hidden}.hero{overflow:hidden}.hero:before{display:none}.product:after{inset:10px}.product-top{align-items:flex-start;flex-direction:column}.metrics{grid-template-columns:repeat(3,minmax(0,1fr))}.metrics div{padding:10px}.metrics strong{font-size:1.05rem}.metrics span{font-size:.68rem}.hero-copy p:not(.eyebrow){font-size:1rem}.final:after{display:none}}
`;

const csp = [
  "default-src 'self'",
  "img-src 'self' data:",
  "style-src 'unsafe-inline'",
  "script-src 'unsafe-inline'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
].join('; ');

const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function page(title, description, body, path = '/') {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><link rel="canonical" href="${SITE}${path}"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:type" content="website"><meta property="og:url" content="${SITE}${path}"><meta property="og:image" content="${SITE}/og/quizbiz-og.png"><meta name="twitter:card" content="summary_large_image"><style>${styles}${premiumStyles}${mobilePolishStyles}${enhancementStyles}</style></head><body><header><a class="brand" href="/"><span class="mark">Q</span><span><strong>Quizbiz LLC</strong><small>Lead capture and domain routing</small></span></a><nav><a href="/#capture">Capture</a><a href="/#directory">Directory</a><a href="/sms">SMS</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></header>${body}<footer><div><strong>Quizbiz LLC</strong><p>Company home, lead capture surface, domain directory, privacy policy, SMS disclosures, and messaging terms for Quizbiz LLC initiatives.</p></div><nav><a href="/sms">SMS</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a></nav></footer></body></html>`;
}

const enhancementStyles = String.raw`
  .hero:before{inset:4% -1% auto auto;width:220px;height:140px;border-radius:14px;background:linear-gradient(rgba(16,26,63,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(16,26,63,.08) 1px,transparent 1px),linear-gradient(140deg,rgba(0,166,166,.2),rgba(255,107,74,.16));background-size:16px 16px,16px 16px,auto;transform:rotate(-6deg);animation:none}
  .flow-step.is-active,.flow-step:hover,.domain-card:hover,.card:hover{transform:translateY(-4px);box-shadow:0 30px 70px rgba(16,26,63,.18)}
  .conversion-strip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;margin-bottom:12px;border:1px solid rgba(16,26,63,.16);border-radius:12px;overflow:hidden;background:rgba(16,26,63,.16)}
  .conversion-strip span{display:block;background:rgba(255,255,255,.92);color:var(--ink);font-size:.82rem;font-weight:780;line-height:1.35;padding:10px 12px}
  .quick-presets{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
  .quick-presets .button{min-height:38px;font-size:.82rem}
  .final:after{right:-3%;bottom:-20%;width:280px;height:180px;border:1px solid rgba(255,255,255,.18);border-radius:14px;background:linear-gradient(rgba(255,255,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.14) 1px,transparent 1px);background-size:14px 14px,14px 14px}
  @media(max-width:740px){.quick-presets .button{width:100%}.conversion-strip{grid-template-columns:1fr}}
`;

const clientScript = `
const D=${JSON.stringify(DOMAIN_DIRECTORY)};
function q(s){return document.querySelector(s)}
function state(){return{n:q('#name').value,e:q('#email').value,p:q('#phone').value,c:q('#company').value,need:q('#need').value,u:document.querySelector('.segmented .active').dataset.urgency,query:q('#query').value,sms:q('#smsOptIn').checked}}
function score(x,query){query=query.toLowerCase().trim();if(!query)return x[0]==='quizbiz.org'?4:0;const hay=[x[0],x[1],x[2],x[3],x[4],x[5],x[6]].join(' ').toLowerCase();return query.split(/[^a-z0-9.]+/).filter(t=>t.length>1).reduce((n,t)=>n+(x[0].includes(t)?10:x[6].includes(t)?7:hay.includes(t)?3:0),0)}
function matches(){const s=state();return D.map(x=>({x,score:score(x,[s.query,s.c].join(' '))})).filter(m=>m.score>0).sort((a,b)=>b.score-a.score||a.x[0].localeCompare(b.x[0])).slice(0,6)}
function render(){const ms=matches(),best=ms[0]?.x;q('#hero-domain').textContent=best?best[0]:'quizbiz.org';q('#command').textContent=best?best[0]+': '+best[4]:'Enter a need to route the request.';q('#match-count').textContent=ms.length;q('#match-count-card').textContent=ms.length;q('#best-domain').textContent=best?best[0]:'Enter a need to search';q('#best-impact').textContent=best?best[5]:'Search by audience, challenge, desired outcome, service type, or domain name.';q('#best-list').innerHTML=best?'<li>'+best[2]+'</li><li>'+best[3]+'</li><li>'+best[4]+'</li>':'';q('#open-domain').style.display=best?'inline-flex':'none';if(best)q('#open-domain').href='https://'+best[0];q('#results').innerHTML=ms.map(m=>'<article class="domain-card"><div><small>'+m.score+' match score</small><h3>'+m.x[0]+'</h3><p>'+m.x[1]+'</p></div><p>'+m.x[4]+'</p><a href="https://'+m.x[0]+'">Open '+m.x[0]+'</a></article>').join('')}
async function submitLead(){const s=state(),best=matches()[0]?.x,status=q('#status');status.className='status show';status.textContent='Submitting lead...';try{const res=await fetch('/api/leads',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:s.n,email:s.e,phone:s.p,company:s.c,need:s.need,urgency:s.u,query:s.query,matchedDomain:best?.[0],matchedTitle:best?.[1],smsOptIn:s.sms,consentText:q('#smsText').textContent,pageUrl:location.href})});const data=await res.json();if(!res.ok)throw new Error(data.error||'Lead submission failed');status.textContent='Lead captured. Reference ID: '+data.id+'. Quizbiz LLC can now follow up using the consent choices recorded here.';}catch(err){status.textContent=err.message||'Lead submission failed.'}}
function programState(){return{organization:q('#programOrg')?.value,domain:q('#programDomain')?.value,eventName:q('#programEvent')?.value,cohort:q('#programCohort')?.value,rosterSource:q('#programRoster')?.value,rsvpSource:q('#programForms')?.value,calendarSource:q('#programOutlook')?.value,attendanceSource:q('#programZoom')?.value,reminderCadence:q('#programCadence')?.value,consentBasis:q('#programConsent')?.value,pageUrl:location.href}}
function readiness(p){return[['Domain profile',!!(p.domain&&p.organization)],['Cohort roster',!!(p.cohort&&p.rosterSource)],['RSVP source',!!p.rsvpSource],['Calendar source',!!p.calendarSource],['Attendance source',!!p.attendanceSource],['Consent rules',(p.consentBasis||'').toLowerCase().includes('opt-in')]]}
function renderProgram(){if(!q('#programReady'))return;const p=programState(),r=readiness(p),n=r.filter(x=>x[1]).length;q('#programReady').textContent=n;if(q('#programReadyHero'))q('#programReadyHero').textContent=n+'/6';q('#programChecklist').innerHTML=r.map(x=>'<li>'+(x[1]?'Ready':'Needs detail')+': '+x[0]+'</li>').join('');q('#programSample').textContent='Quizbiz LLC: Reminder for '+(p.eventName||'your program')+'. Reply YES to confirm, STOP to unsubscribe, or HELP for help. Msg frequency varies. Msg & data rates may apply.'}
async function submitProgram(){const p=programState(),r=readiness(p),status=q('#programStatus');status.className='status show';status.textContent='Saving program plan...';try{const res=await fetch('/api/cohort-programs',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({...p,readiness:r})});const data=await res.json();if(!res.ok)throw new Error(data.error||'Program save failed');status.textContent='Program plan saved. Reference ID: '+data.id+'. Readiness checks passed: '+data.readyCount+'/6.'}catch(err){status.textContent=err.message||'Program save failed.'}}
const STEP_TEXT=[['Define the domain','Select the sender profile, message category, public policy links, and approval evidence.'],['Load the cohort','Import roster rows, membership labels, board roles, mobile numbers, and consent status.'],['Sync engagement','Map Forms RSVPs, Outlook responses, Zoom participants, and check-ins back to contacts.'],['Automate follow-up','Queue reminders, confirmations, thank-you notes, missed-you messages, and reports.']];
let activeStep=0;
function renderStep(){const steps=[...document.querySelectorAll('.flow-step')];if(!steps.length)return;steps.forEach((el,i)=>el.classList.toggle('is-active',i===activeStep));const cmd=q('#command');if(cmd)cmd.textContent=STEP_TEXT[activeStep][0]+': '+STEP_TEXT[activeStep][1]}
function advanceStep(){activeStep=(activeStep+1)%STEP_TEXT.length;renderStep()}
document.querySelectorAll('.flow-step').forEach((el,i)=>el.addEventListener('mouseenter',()=>{activeStep=i;renderStep()}));
document.querySelectorAll('[data-preset]').forEach((el)=>el.addEventListener('click',()=>{const p=el.getAttribute('data-preset')||'';if(q('#need'))q('#need').value=p;if(q('#query'))q('#query').value=p;render()}));
document.querySelectorAll('input,textarea').forEach(el=>el.addEventListener('input',()=>{if(el.id==='need')q('#query').value=el.value;render();renderProgram()}));document.querySelectorAll('[data-urgency]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-urgency]').forEach(x=>x.classList.remove('active'));b.classList.add('active');render()}));q('#submitLead')?.addEventListener('click',submitLead);q('#saveProgram')?.addEventListener('click',submitProgram);render();renderProgram();renderStep();setInterval(advanceStep,2600);
`;

const trustRows = [
  ['Business identity', 'Quizbiz LLC is the operator of Quizbiz.org and the responsible business for the lead capture and messaging program.'],
  ['Messaging purpose', 'Domain-specific event reminders, RSVP nudges, attendance confirmations, support follow-ups, and service notifications.'],
  ['Cohort controls', 'Rosters can be segmented by board role, donor recognition society membership, program, geography, attendance status, and opt-in evidence.'],
  ['Engagement sources', 'Microsoft Forms exports, Outlook event responses, Zoom participant reports, and manual check-in lists can be reconciled against cohort rosters.'],
  ['Audience', 'Customers, leads, members, donors, board members, and collaborators who explicitly ask to receive text messages.'],
  ['Frequency', 'Message frequency varies by request; recurring programs disclose expected frequency at opt-in.'],
  ['Costs', 'Message and data rates may apply.'],
  ['Opt-out', 'Reply STOP to unsubscribe. Reply HELP for help.'],
  ['Consent', 'Text consent is optional and is not a condition of purchase or service.'],
  ['Data sharing', 'Mobile opt-in data and consent are not shared or sold to third parties.'],
];

const storageEnhancementScript = `
(function () {
  const keys = {
    lead: 'quizbiz:lead-form:v1',
    query: 'quizbiz:directory-query:v1',
    program: 'quizbiz:program-form:v1',
    drafts: 'quizbiz:program-drafts:v1',
    selected: 'quizbiz:selected-program-draft:v1'
  };
  const leadFields = ['name', 'email', 'phone', 'company', 'need', 'smsOptIn'];
  const programFields = ['programOrg', 'programDomain', 'programEvent', 'programCohort', 'programRoster', 'programForms', 'programOutlook', 'programZoom', 'programCadence', 'programConsent'];
  const q = (selector) => document.querySelector(selector);
  const byId = (id) => document.getElementById(id);

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }
  function status(message) {
    const el = byId('programStatus');
    if (!el) return;
    el.className = 'status show';
    el.textContent = message;
  }
  function collect(fields) {
    const result = {};
    for (const id of fields) {
      const element = byId(id);
      if (!element) continue;
      result[id] = element.type === 'checkbox' ? element.checked : element.value;
    }
    return result;
  }
  function applyValues(values) {
    if (!values || typeof values !== 'object') return;
    for (const [id, value] of Object.entries(values)) {
      const element = byId(id);
      if (!element) continue;
      if (element.type === 'checkbox') element.checked = Boolean(value);
      else element.value = String(value ?? '');
    }
  }
  function draftName(program) {
    const org = String(program.programOrg || '').trim();
    const event = String(program.programEvent || '').trim();
    return org && event ? org + ' · ' + event : (event || org || 'Untitled working list');
  }
  function optionLabel(draft) {
    const date = new Date(draft.updatedAt || Date.now());
    return (draft.name || 'Untitled') + ' (' + date.toLocaleDateString() + ')';
  }
  function renderDraftSelect() {
    const select = byId('programDraftSelect');
    if (!select) return;
    const drafts = readJson(keys.drafts, []);
    const selected = readJson(keys.selected, '');
    select.innerHTML = '<option value="">None selected</option>' + drafts.map((draft) => '<option value="' + draft.id + '">' + optionLabel(draft) + '</option>').join('');
    select.value = drafts.some((draft) => draft.id === selected) ? selected : '';
  }

  applyValues(readJson(keys.lead, {}));
  applyValues(readJson(keys.program, {}));
  const storedQuery = readJson(keys.query, '');
  if (storedQuery && byId('query')) byId('query').value = storedQuery;
  renderDraftSelect();
  const selectedDraft = readJson(keys.selected, '');
  const drafts = readJson(keys.drafts, []);
  if (selectedDraft) {
    const draft = drafts.find((item) => item.id === selectedDraft);
    if (draft && draft.program) {
      applyValues(draft.program);
      if (byId('programDraftName')) byId('programDraftName').value = draft.name || draftName(draft.program);
      status('Loaded browser draft "' + (draft.name || 'working list') + '".');
    }
  }

  leadFields.forEach((id) => {
    const element = byId(id);
    if (!element) return;
    element.addEventListener('input', () => writeJson(keys.lead, collect(leadFields)));
    element.addEventListener('change', () => writeJson(keys.lead, collect(leadFields)));
  });
  programFields.forEach((id) => {
    const element = byId(id);
    if (!element) return;
    element.addEventListener('input', () => writeJson(keys.program, collect(programFields)));
    element.addEventListener('change', () => writeJson(keys.program, collect(programFields)));
  });
  if (byId('query')) {
    byId('query').addEventListener('input', () => writeJson(keys.query, byId('query').value));
  }

  byId('programSaveNew')?.addEventListener('click', () => {
    const drafts = readJson(keys.drafts, []);
    const program = collect(programFields);
    const labelInput = byId('programDraftName');
    const id = (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
    const name = (labelInput?.value || '').trim() || draftName(program);
    drafts.unshift({ id, name, updatedAt: new Date().toISOString(), program });
    writeJson(keys.drafts, drafts.slice(0, 100));
    writeJson(keys.selected, id);
    renderDraftSelect();
    if (labelInput) labelInput.value = name;
    status('Saved new browser draft "' + name + '".');
  });

  byId('programSaveSelected')?.addEventListener('click', () => {
    const selected = readJson(keys.selected, '');
    if (!selected) return byId('programSaveNew')?.click();
    const drafts = readJson(keys.drafts, []);
    const labelInput = byId('programDraftName');
    const nameFromInput = (labelInput?.value || '').trim();
    const program = collect(programFields);
    let updatedName = '';
    const next = drafts.map((draft) => {
      if (draft.id !== selected) return draft;
      updatedName = nameFromInput || draft.name || draftName(program);
      return { ...draft, name: updatedName, updatedAt: new Date().toISOString(), program };
    });
    writeJson(keys.drafts, next);
    renderDraftSelect();
    if (labelInput) labelInput.value = updatedName;
    status('Updated browser draft "' + (updatedName || 'working list') + '".');
  });

  byId('programDeleteSelected')?.addEventListener('click', () => {
    const selected = readJson(keys.selected, '');
    if (!selected) return;
    const drafts = readJson(keys.drafts, []);
    const current = drafts.find((draft) => draft.id === selected);
    writeJson(keys.drafts, drafts.filter((draft) => draft.id !== selected));
    writeJson(keys.selected, '');
    renderDraftSelect();
    status('Deleted browser draft "' + ((current && current.name) || 'working list') + '".');
  });

  byId('programDraftSelect')?.addEventListener('change', (event) => {
    const id = event.target.value;
    writeJson(keys.selected, id);
    const drafts = readJson(keys.drafts, []);
    const draft = drafts.find((item) => item.id === id);
    if (!draft) return;
    applyValues(draft.program);
    if (byId('programDraftName')) byId('programDraftName').value = draft.name || draftName(draft.program);
    writeJson(keys.program, collect(programFields));
    if (typeof window.renderProgram === 'function') window.renderProgram();
    if (typeof window.render === 'function') window.render();
    status('Loaded browser draft "' + (draft.name || 'working list') + '".');
  });
})();
`;

function home() {
  const rows = trustRows.map(([label, value]) => `<div class="row"><strong>${label}</strong><span>${value}</span></div>`).join('');
  return page('Quizbiz LLC | Domain-Specific Customer Messaging', 'Quizbiz LLC powers domain-specific customer messaging with cohort-specific controls, automations, consent evidence, and engagement reporting.', `
<main class="wrap"><section class="hero"><div class="panel hero-copy"><p class="eyebrow">Quizbiz LLC</p><h1>Domain specific customer messaging with cohort specific controls and automations</h1><p>Quizbiz.org is the operating workspace for compliant cohort messaging: configure sender identity, import roster segments, sync RSVP and attendance signals, and run automated reminders with auditable consent.</p><div class="actions"><a class="button primary" href="#cohort-control">Start 2-minute setup</a><a class="button" href="#directory">Search the directory</a></div></div><div class="product"><div class="product-top"><span>Messaging control plane</span><strong id="hero-domain">quizbiz.org</strong></div><div class="flow"><div class="flow-step"><span>1</span><strong>Define the domain</strong></div><div class="flow-step"><span>2</span><strong>Load the cohort</strong></div><div class="flow-step"><span>3</span><strong>Sync engagement</strong></div><div class="flow-step"><span>4</span><strong>Automate follow-up</strong></div></div><div class="command"><span></span><p id="command">Board and donor recognition society program reminder.</p></div><div class="metrics"><div><strong>${DOMAIN_DIRECTORY.length}</strong><span>indexed domains</span></div><div><strong id="programReadyHero">6/6</strong><span>ready checks</span></div><div><strong>KV</strong><span>audit storage</span></div></div></div></section><div class="proof"><span>Domain sender</span><span>Cohort roster</span><span>RSVP sync</span><span>Attendance report</span></div><section id="platform"><div class="section-head"><p class="eyebrow">Platform model</p><h2>Run segmented messaging programs with consent, suppression rules, and reporting.</h2><p>This is structured for operations teams, not a landing demo: pick a domain use case, apply audience rules, verify eligibility, execute reminders, and keep records ready for provider review.</p></div><div class="grid"><article class="card"><h3>Control</h3><p>Configure the domain, sender identity, message category, and public opt-in path before launch.</p></article><article class="card"><h3>Segment</h3><p>Filter board members, donors, recognition society members, and other cohorts by eligibility and consent.</p></article><article class="card"><h3>Reconcile</h3><p>Pull RSVP and attendance evidence from Microsoft Forms, Outlook, Zoom, and manual check-in exports.</p></article><article class="card"><h3>Report</h3><p>Store the program plan, readiness checks, consent rules, and engagement summary for review/export.</p></article></div></section><section id="cohort-control"><div class="section-head"><p class="eyebrow">Program builder</p><h2>Plan event reminders for board and donor cohorts before any SMS goes out.</h2><p>Build the same workflow you intend to run in production: roster filters, consent gating, reminder cadence, and post-event reconciliation against Microsoft Forms, Outlook, Zoom, and check-in exports.</p></div><div class="capture-grid"><form class="builder"><label>Organization or pilot workspace<input id="programOrg" value="American Jewish Committee pilot workspace"></label><label>Domain and sender surface<input id="programDomain" value="quizbiz.org"></label><label>Event or program<input id="programEvent" value="Board and donor recognition society program reminder"></label><label>Cohort rule<textarea id="programCohort">Board members, donors, and recognition society members with documented SMS opt-in</textarea></label><label>Roster source<textarea id="programRoster">Cohort roster CSV with name, mobile, email, society, board role, city, and consent source</textarea></label><label>Microsoft Forms RSVP source<input id="programForms" value="Microsoft Forms RSVP export or share link"></label><label>Outlook event source<input id="programOutlook" value="Outlook event ID, attendee response export, or organizer calendar link"></label><label>Zoom or attendance source<input id="programZoom" value="Zoom participant report plus in-room check-in list"></label><label>Reminder automation cadence<textarea id="programCadence">Invitation confirmation, RSVP nudge, day-before reminder, post-event thank-you, missed-you follow-up</textarea></label><label>Consent and exclusion rule<textarea id="programConsent">Send only to contacts with explicit SMS opt-in; exclude unsubscribed, missing consent, and unknown mobile records.</textarea></label><fieldset><legend>Working list management</legend><label>Saved working list<select id="programDraftSelect"><option value="">None selected</option></select></label><label>Working list label<input id="programDraftName" placeholder="Board reminder cohort"></label><div class="actions"><button class="button" id="programSaveNew" type="button">Save new</button><button class="button" id="programSaveSelected" type="button">Update selected</button><button class="button" id="programDeleteSelected" type="button">Delete selected</button></div><p class="fine">Program and lead inputs autosave in this browser and can be loaded as working lists before sync.</p></fieldset></form><article class="result"><div class="score"><span id="programReady">6</span><strong>Approval packet checks</strong></div><p class="eyebrow">Program preview</p><h3>Board and donor recognition society program reminder</h3><p>Quizbiz treats the roster as the source of truth, suppresses contacts without documented opt-in, and reconciles RSVP and attendance signals before each follow-up.</p><h4>Readiness checklist</h4><ul id="programChecklist"></ul><h4>Sample compliant message</h4><p id="programSample">Quizbiz LLC: Reminder for your program. Reply YES to confirm, STOP to unsubscribe, or HELP for help. Msg frequency varies. Msg & data rates may apply.</p><div class="actions"><button class="primary" id="saveProgram" type="button">Save and prepare approval evidence</button><a class="button" href="/sms">SMS details</a></div><p id="programStatus" class="status" role="status"></p></article></div></section><section id="capture"><div class="section-head"><p class="eyebrow">Directory router</p><h2>Match any business need to the right domain workspace.</h2><p>Route inbound needs by audience, challenge, and desired outcome, then hand off into the cohort builder for implementation and follow-up.</p></div><div class="conversion-strip" aria-label="Routing workflow"><span>1) Describe the audience and challenge</span><span>2) Get domain routing guidance</span><span>3) Save a cohort program and approval evidence</span></div><div class="quick-presets"><button class="button" type="button" data-preset="board donor event reminder RSVP attendance tracking">Board + donor</button><button class="button" type="button" data-preset="law firm client intake follow-up sms">Law firm CRM</button><button class="button" type="button" data-preset="water bill leak detection savings help">Water savings</button><button class="button" type="button" data-preset="recruiting candidate screening workflow">Recruiting</button></div><div class="capture-grid"><form class="builder"><label>Name<input id="name" name="name" autocomplete="name" placeholder="Jane Smith"></label><label>Email<input id="email" name="email" type="email" autocomplete="email" placeholder="jane@example.com"></label><label>Mobile phone, optional<input id="phone" name="tel" type="tel" autocomplete="tel" placeholder="+1 404 555 0100"></label><label>Company or context<input id="company" name="organization" autocomplete="organization" placeholder="Atlanta roofing company, law firm, utility customer"></label><label>What do they need?<textarea id="need" name="message">board donor event reminder RSVP attendance tracking</textarea></label><fieldset><legend>Urgency</legend><div class="segmented"><button class="active" type="button" data-urgency="today">Today</button><button type="button" data-urgency="this week">This week</button><button type="button" data-urgency="this month">This month</button></div></fieldset><label class="sms-consent"><input id="smsOptIn" type="checkbox"><span id="smsText">I agree to receive text messages from Quizbiz LLC about this request, including project updates, onboarding reminders, support follow-ups, and service notifications. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe and HELP for help. Consent is optional and is not a condition of purchase or service. See the <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>.</span></label><p class="fine">SMS is used only if you explicitly check the box. Mobile opt-in data and consent are not shared or sold.</p><p class="fine">To submit, include at least one contact method: email or mobile phone.</p></form><article class="result"><div class="score"><span id="match-count-card">0</span><strong>Portfolio matches</strong></div><p class="eyebrow">Best match</p><h3 id="best-domain">quizbiz.org</h3><p id="best-impact"></p><h4>Why this fits</h4><ul id="best-list"></ul><div class="actions"><button class="primary" id="submitLead" type="button">Get recommended domain plan</button><a class="button" id="open-domain" href="#">Open domain</a></div><p id="status" class="status" role="status"></p></article></div></section><section id="directory"><div class="section-head"><p class="eyebrow">Domain portfolio router</p><h2>Route the use case before configuring the messaging program.</h2><p>Try searches like board donor event reminder, CRM for a law firm, water bill savings, recruiting intake, patio heater, or terms of service.</p></div><div class="search"><label>Search the Quizbiz LLC portfolio<input id="query" value="board donor event reminder RSVP attendance tracking"></label></div><div id="results" class="results"></div></section><section><div class="section-head"><p class="eyebrow">Operating model</p><h2>One roster becomes reminders, confirmations, attendance, and reporting.</h2></div><div class="timeline"><article><span>1</span><h3>Define the domain</h3><p>Select the sender profile, message category, public policy links, and approval evidence.</p></article><article><span>2</span><h3>Load the cohort</h3><p>Import roster rows, membership labels, board roles, mobile numbers, and consent status.</p></article><article><span>3</span><h3>Sync engagement</h3><p>Map Forms RSVPs, Outlook responses, Zoom participants, and check-ins back to contacts.</p></article><article><span>4</span><h3>Automate follow-up</h3><p>Queue reminders, confirmations, thank-you notes, missed-you messages, and reports.</p></article></div></section><section id="trust"><div class="section-head"><p class="eyebrow">Trust and messaging</p><h2>Quizbiz LLC is the brand and responsible business.</h2><p>Quizbiz.org documents business identity, message purpose, opt-in language, and data handling so reviewers, partners, and customers can verify how messaging is governed.</p></div><div class="trust-grid"><div class="table">${rows}</div><aside class="consent"><p class="eyebrow">Sample opt-in language</p><p>By submitting a request and checking the SMS box, you agree to receive text messages from Quizbiz LLC about your project or service request. Message frequency varies. Message and data rates may apply. Reply STOP to unsubscribe or HELP for help.</p><div class="actions"><a class="button primary" href="/sms">SMS details</a><a class="button" href="/privacy">Privacy</a><a class="button" href="/terms">Terms</a></div></aside></div></section><section class="final"><div><p class="eyebrow">Launch readiness</p><h2>Submit for Twilio approval with evidence generated from the live operating workflow.</h2><p>Show purpose, audience, consent collection, suppression controls, and reporting from one system of record.</p></div><a class="button primary" href="#cohort-control">Start 2-minute setup</a></section></main><script>${clientScript}</script><script>${storageEnhancementScript}</script>`);
}

function smsPage() {
  return page('SMS Program Details | Quizbiz LLC', 'SMS opt-in, STOP, HELP, frequency, rates, cohort controls, and privacy details for Quizbiz LLC messaging.', `<main class="legal"><p class="eyebrow">Quizbiz LLC SMS Program</p><h1>SMS Program Details</h1><p>Quizbiz LLC sends text messages only to people who explicitly request SMS updates or otherwise provide consent for a specific cohort messaging program.</p><section><h2>How to Opt In</h2><p>On Quizbiz.org, SMS opt-in is collected through an unchecked checkbox next to the mobile phone field. The checkbox states the messaging purpose, message frequency, rates notice, STOP and HELP instructions, and links to the Privacy Policy and Terms.</p><p>Consent is optional and is not a condition of purchase or service.</p></section><section><h2>Message Types</h2><p>Messages may include requested event reminders, RSVP nudges, attendance confirmations, project updates, onboarding reminders, support follow-ups, and service notifications related to a submitted inquiry, cohort program, or active project.</p></section><section><h2>Frequency and Charges</h2><p>Message frequency varies based on the request or active project. Message and data rates may apply.</p></section><section><h2>Opt Out and Help</h2><p>Reply STOP to unsubscribe. Reply HELP for help. You can also contact ${CONTACT_EMAIL}.</p></section><section><h2>Privacy</h2><p>Mobile opt-in data and consent are not shared or sold to third parties. No mobile information will be shared with third parties/affiliates for marketing/promotional purposes.</p></section><section><h2>Sample Messages</h2><p>Example 1: Quizbiz LLC: Reminder for your event program. Reply YES to confirm, STOP to opt out, or HELP for help.</p><p>Example 2: Quizbiz LLC: Thank you for attending. Reply STOP to opt out or HELP for help.</p></section></main>`, '/sms');
}

function privacyPage() {
  return page('Privacy Policy | Quizbiz LLC', 'Privacy policy for Quizbiz LLC, Quizbiz.org, cohort messaging, consent records, and optional text messaging services.', `<main class="legal"><p class="eyebrow">Quizbiz LLC</p><h1>Privacy Policy</h1><p>Quizbiz LLC operates Quizbiz.org as the public company, cohort messaging, domain directory, and policy home for its business initiatives.</p><section><h2>Who Operates This Site</h2><p>Quizbiz LLC operates Quizbiz.org and the listed domain initiatives.</p><p>Questions about privacy can be sent to ${CONTACT_EMAIL}.</p></section><section><h2>Information We Collect</h2><p>We may collect information you choose to send, such as your name, email address, phone number, business details, cohort roster notes, event or program details, RSVP sources, attendance sources, message, search terms, domain match, urgency, source page, timestamp, and consent choice when you request a follow-up or configure a messaging program.</p><p>The directory search can run in your browser. Submitted leads and program plans are stored by Quizbiz LLC for follow-up, implementation planning, and compliance records.</p></section><section><h2>Text Messaging Privacy</h2><p>If you opt in to text messages, we use your phone number and consent record only to send the messages you requested, such as event reminders, RSVP nudges, attendance confirmations, project updates, onboarding reminders, support follow-ups, and service notifications.</p><p>No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. Text messaging originator opt-in data and consent will not be shared with any third parties.</p><p>You can opt out at any time by replying STOP. You can request help by replying HELP.</p></section><section><h2>Service Providers</h2><p>We may use vendors for hosting, analytics, security, messaging delivery, and operations. These vendors are authorized to use information only to provide services to Quizbiz LLC.</p><p>We do not sell personal information or mobile opt-in consent data.</p></section><section><h2>Updates</h2><p>We may update this policy as services change. The public version on Quizbiz.org is the current version.</p></section></main>`, '/privacy');
}

function termsPage() {
  return page('Terms and Messaging Terms | Quizbiz LLC', 'Terms of service and mobile messaging terms for Quizbiz LLC, Quizbiz.org, and related domains.', `<main class="legal"><p class="eyebrow">Quizbiz LLC</p><h1>Terms and Messaging Terms</h1><p>These terms govern Quizbiz.org, Quizbiz LLC cohort controls, domain directory routing, related business initiatives, and optional text messaging programs.</p><section><h2>Use of the Site</h2><p>Quizbiz.org provides company information, business policies, domain directory routing, lead capture, cohort messaging planning, and educational material about Quizbiz LLC initiatives.</p><p>The site is not legal, tax, financial, medical, or compliance advice. You are responsible for decisions you make based on the content.</p></section><section><h2>Mobile Messaging Terms</h2><p>By opting in, you agree to receive text messages from Quizbiz LLC about requested event reminders, RSVP nudges, attendance confirmations, project updates, onboarding reminders, support follow-ups, and service notifications.</p><p>Message frequency varies based on your request or active project. Message and data rates may apply.</p><p>Reply STOP to unsubscribe. Reply HELP for help.</p><p>Text consent is optional and is not a condition of purchase or service.</p></section><section><h2>Lead Capture and Directory Results</h2><p>Directory matches are generated from local portfolio descriptions, tags, and the search terms you provide. A match is a routing suggestion, not a guarantee that a service is available or appropriate for every situation.</p><p>Do not submit information that you do not have permission to share.</p></section><section><h2>No Guaranteed Outcomes</h2><p>Quizbiz LLC workflows can help organize requests, generate recommendations, and improve follow-up, but Quizbiz LLC does not guarantee business growth, revenue, ranking, deliverability, or approval by any third-party platform.</p></section><section><h2>Contact</h2><p>Questions about these terms can be sent to ${CONTACT_EMAIL}.</p></section></main>`, '/terms');
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'content-security-policy': csp, 'x-content-type-options': 'nosniff' } });
}

function textResponse(body, type = 'text/html; charset=utf-8') {
  return new Response(body, { headers: { 'content-type': type, 'content-security-policy': csp, 'x-content-type-options': 'nosniff', 'referrer-policy': 'strict-origin-when-cross-origin', 'permissions-policy': 'camera=(), microphone=(), geolocation=()' } });
}

async function parseJson(request) {
  try { return await request.json(); } catch { return null; }
}

function sanitize(value, max = 800) {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

async function handleLead(request, env) {
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
  const data = await parseJson(request);
  if (!data) return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
  const email = sanitize(data.email, 160);
  const phone = sanitize(data.phone, 80);
  const need = sanitize(data.need, 1200);
  const smsOptIn = data.smsOptIn === true;
  if (!email && !phone) return jsonResponse({ ok: false, error: 'Email or phone is required.' }, 400);
  if (smsOptIn && !phone) return jsonResponse({ ok: false, error: 'Phone is required for SMS opt-in.' }, 400);
  if (!need) return jsonResponse({ ok: false, error: 'Need is required.' }, 400);

  const now = new Date().toISOString();
  const id = 'lead_' + now.replace(/[^0-9]/g, '').slice(0, 14) + '_' + crypto.randomUUID().slice(0, 8);
  const lead = {
    id,
    createdAt: now,
    name: sanitize(data.name, 160),
    email,
    phone,
    company: sanitize(data.company, 200),
    need,
    urgency: sanitize(data.urgency, 40),
    query: sanitize(data.query, 800),
    matchedDomain: sanitize(data.matchedDomain, 120),
    matchedTitle: sanitize(data.matchedTitle, 160),
    smsOptIn,
    consentText: smsOptIn ? sanitize(data.consentText, 1200) : '',
    consentSource: data.pageUrl ? sanitize(data.pageUrl, 400) : SITE,
    consentTimestamp: smsOptIn ? now : '',
    userAgent: sanitize(request.headers.get('user-agent'), 300),
    ipHash: await sha256Hex(request.headers.get('cf-connecting-ip') || ''),
  };

  if (!env.QUIZBIZ_LEADS) return jsonResponse({ ok: false, error: 'Lead storage is not configured.' }, 500);
  await env.QUIZBIZ_LEADS.put('lead:' + id, JSON.stringify(lead));
  const index = (await env.QUIZBIZ_LEADS.get('leads:index', 'json')) || [];
  index.unshift({ id, createdAt: now, matchedDomain: lead.matchedDomain, email: lead.email, smsOptIn });
  await env.QUIZBIZ_LEADS.put('leads:index', JSON.stringify(index.slice(0, 250)));
  return jsonResponse({ ok: true, id, stored: true, smsConsentRecorded: smsOptIn });
}

async function handleCohortProgram(request, env) {
  if (request.method !== 'POST') return jsonResponse({ ok: false, error: 'Method not allowed' }, 405);
  const data = await parseJson(request);
  if (!data) return jsonResponse({ ok: false, error: 'Invalid JSON' }, 400);
  if (!env.QUIZBIZ_LEADS) return jsonResponse({ ok: false, error: 'Program storage is not configured.' }, 500);

  const organization = sanitize(data.organization, 220);
  const eventName = sanitize(data.eventName, 220);
  const cohort = sanitize(data.cohort, 1200);
  const consentBasis = sanitize(data.consentBasis, 1200);
  if (!organization || !eventName || !cohort) {
    return jsonResponse({ ok: false, error: 'Organization, event, and cohort are required.' }, 400);
  }

  const readiness = Array.isArray(data.readiness) ? data.readiness : [];
  const readyCount = readiness.filter((item) => Array.isArray(item) && item[1] === true).length;
  const now = new Date().toISOString();
  const id = 'program_' + now.replace(/[^0-9]/g, '').slice(0, 14) + '_' + crypto.randomUUID().slice(0, 8);
  const program = {
    id,
    createdAt: now,
    organization,
    domain: sanitize(data.domain || 'quizbiz.org', 120),
    eventName,
    cohort,
    rosterSource: sanitize(data.rosterSource, 1200),
    rsvpSource: sanitize(data.rsvpSource, 600),
    calendarSource: sanitize(data.calendarSource, 600),
    attendanceSource: sanitize(data.attendanceSource, 600),
    reminderCadence: sanitize(data.reminderCadence, 1200),
    consentBasis,
    readiness,
    readyCount,
    pageUrl: sanitize(data.pageUrl || SITE, 400),
    userAgent: sanitize(request.headers.get('user-agent'), 300),
    ipHash: await sha256Hex(request.headers.get('cf-connecting-ip') || ''),
  };
  await env.QUIZBIZ_LEADS.put('program:' + id, JSON.stringify(program));
  const index = (await env.QUIZBIZ_LEADS.get('programs:index', 'json')) || [];
  index.unshift({ id, createdAt: now, organization, eventName, domain: program.domain, readyCount });
  await env.QUIZBIZ_LEADS.put('programs:index', JSON.stringify(index.slice(0, 250)));
  return jsonResponse({ ok: true, id, stored: true, readyCount, reviewReady: readyCount >= 6 });
}

async function sha256Hex(value) {
  if (!value) return '';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function isAdmin(request, env) {
  const key = env.QUIZBIZ_ADMIN_KEY;
  return Boolean(key && request.headers.get('x-admin-key') === key);
}

async function handleAdminLeads(request, env) {
  if (!isAdmin(request, env)) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
  if (!env.QUIZBIZ_LEADS) return jsonResponse({ ok: false, error: 'Lead storage is not configured.' }, 500);
  const index = (await env.QUIZBIZ_LEADS.get('leads:index', 'json')) || [];
  const rows = [];
  for (const item of index.slice(0, 50)) {
    const lead = await env.QUIZBIZ_LEADS.get('lead:' + item.id, 'json');
    if (lead) rows.push(lead);
  }
  return jsonResponse({ ok: true, count: rows.length, leads: rows });
}

async function handleAdminPrograms(request, env) {
  if (!isAdmin(request, env)) return jsonResponse({ ok: false, error: 'Unauthorized' }, 401);
  if (!env.QUIZBIZ_LEADS) return jsonResponse({ ok: false, error: 'Program storage is not configured.' }, 500);
  const index = (await env.QUIZBIZ_LEADS.get('programs:index', 'json')) || [];
  const rows = [];
  for (const item of index.slice(0, 50)) {
    const program = await env.QUIZBIZ_LEADS.get('program:' + item.id, 'json');
    if (program) rows.push(program);
  }
  return jsonResponse({ ok: true, count: rows.length, programs: rows });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, '') || '/';
    if (pathname === '/api/leads') return handleLead(request, env || {});
    if (pathname === '/api/leads/recent') return handleAdminLeads(request, env || {});
    if (pathname === '/api/cohort-programs') return handleCohortProgram(request, env || {});
    if (pathname === '/api/cohort-programs/recent') return handleAdminPrograms(request, env || {});
    if (pathname === '/api/health') return jsonResponse({ ok: true, service: 'quizbiz-worker', leadsKv: Boolean(env?.QUIZBIZ_LEADS) });
    if (pathname === '/robots.txt') return textResponse('User-agent: *\nAllow: /\nSitemap: ' + SITE + '/sitemap.xml\n', 'text/plain; charset=utf-8');
    if (pathname === '/sitemap.xml') return textResponse('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>' + SITE + '/</loc></url><url><loc>' + SITE + '/sms</loc></url><url><loc>' + SITE + '/privacy</loc></url><url><loc>' + SITE + '/terms</loc></url></urlset>', 'application/xml; charset=utf-8');
    if (pathname === '/security.txt' || pathname === '/.well-known/security.txt') return textResponse('Contact: mailto:' + CONTACT_EMAIL + '\nPreferred-Languages: en\nCanonical: ' + SITE + '/.well-known/security.txt\n', 'text/plain; charset=utf-8');
    if (pathname === '/sms') return textResponse(smsPage());
    if (pathname === '/privacy') return textResponse(privacyPage());
    if (pathname === '/terms') return textResponse(termsPage());
    return textResponse(home());
  },
};
