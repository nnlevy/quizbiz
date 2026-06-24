# Growth sharing + attribution

## Environment variables

Set these in production (do not commit secret values):

- `GROWTH_HASH_SALT`: secret salt used to hash IP + user agent for growth events.
- `GROWTH_TOKEN_SECRET`: HMAC secret used to sign share tokens.
- `GROWTH_ADMIN_KEY`: secret header value for `/api/growth/admin/summary`.
- `KV_GROWTH_ID`: KV namespace id for growth counters + rate limits.

## KV keys

Rate limits:

- `rl:share_start:{sessionId}:{hourBucket}`
- `rl:share_finalize:{sessionId}:{dayBucket}`
- `rl:ip:{ipHash}:{bucket}`

Counters (daily bucket `YYYYMMDD`):

- `cnt:share_impression:{YYYYMMDD}`
- `cnt:share_click:{YYYYMMDD}`
- `cnt:share_start:{YYYYMMDD}`
- `cnt:share_finalize_granted:{YYYYMMDD}`
- `cnt:share_finalize_rejected:{YYYYMMDD}`
- `cnt:referral_visit:{YYYYMMDD}`
- `cnt:referral_convert:{YYYYMMDD}`

## Portfolio leads / contacts from growth.business (hub submissions)

Growth.business (newgrowthbusiness) captures contact/access requests via /api/contact and AI chat (stored in its D1 leads + chatbot_conversations with app_id='growth.business').

Quizbiz surfaces them via:
- Proxy `/api/growth/contacts/recent` (fetches normalized from growth, logs to local growth_events as event_type="growth_contact", platform="growth.business").
- React Dashboard (/dashboard) has "Portfolio Access Requests (from growth.business)" section polling the proxy (shows name/email/outcome/unit/kind/date).
- Admin/summary and internal tools can query growth_events for type or use the proxy.

This integrates hub form + chat subs into quizbiz's growth system (events, attribution, admin views) without duplicating storage. Uses shared KV for counters if extended, shared services.

See src/worker/index.ts (proxy + logGrowthEvent), src/react-app/routes/Dashboard.tsx (poll + render), and growth's /api/recent-contacts (D1 query on leads/chatbot_convos).

Add to GA: "growth_contact" events for cross-domain visitor/lead tracking.

## Endpoints

- `GET /api/growth/share/config`
- `POST /api/growth/share/start`
- `POST /api/growth/share/finalize`
- `GET /r/:ref_code`
- `POST /api/growth/referral/convert`
- `GET /api/growth/admin/summary` (requires `x-growth-admin-key`)
