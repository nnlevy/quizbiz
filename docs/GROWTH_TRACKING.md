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

## Endpoints

- `GET /api/growth/share/config`
- `POST /api/growth/share/start`
- `POST /api/growth/share/finalize`
- `GET /r/:ref_code`
- `POST /api/growth/referral/convert`
- `GET /api/growth/admin/summary` (requires `x-growth-admin-key`)
