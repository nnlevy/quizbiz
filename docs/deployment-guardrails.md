# Deployment Guardrails

## Build breakages & fixes

### TS2345 (CompressionFormat vs "br")
**Symptom**: `tsc -b` fails when passing the negotiated encoding to `new CompressionStream(...)` because lib.dom `CompressionFormat` can omit `"br"` in some TypeScript versions, even when the runtime supports it. 【F:src/worker/index.ts†L1162-L1221】

**Fix**: Use a typed `SupportedContentEncoding` union and a small factory (`createCompressionStream`) that attempts to construct a `CompressionStream` with a narrow cast at the constructor boundary and falls back to gzip when brotli isn’t available. This keeps the type safety everywhere else and prevents invalid encodings from being set. 【F:src/worker/index.ts†L1162-L1221】

### TS6133 (unused locals)
**Symptom**: `tsc -b` fails on an unused `session` variable when creating referral tokens. 【F:src/worker/index.ts†L4060-L4072】

**Fix**: Only destructure the values actually used (`sessionId`, `needsCookie`). If a function must run for side effects, call it without assigning the result. This avoids `noUnusedLocals` regressions. 【F:src/worker/index.ts†L4060-L4072】

## Referral token TTL contract
- **TTL**: 30 days (`REFERRAL_TOKEN_TTL_SECONDS`). 【F:src/shared/referral.ts†L1-L2】
- **Storage format**: `localStorage["ws_referral_token"]` contains JSON: `{ "token": string, "issuedAt": number }`. 【F:src/shared/referral.ts†L13-L31】
- **Refresh strategy**: on read, expired or malformed entries are cleared; fresh tokens are reused; expired tokens trigger a fetch for a new token. 【F:src/react-app/utils/referral.ts†L23-L82】
- **Claim retry**: if `/api/referral/claim` responds like an expired token (404/410 or error message), the cached token is cleared and the client retries once with a freshly issued token. 【F:src/react-app/utils/referral.ts†L125-L178】

## Compression + cache safety
- **Why**: Setting `Content-Encoding` without `Vary: Accept-Encoding` can cause shared caches/CDNs to serve compressed content to clients that can’t decode it. 【F:src/worker/index.ts†L1162-L1221】
- **Behavior**: compression only happens when a stream is created, the response is compressible, and no `Content-Encoding` is already present; `Content-Length` is removed to avoid stale lengths. `Vary: Accept-Encoding` is appended without clobbering existing values. 【F:src/worker/index.ts†L1162-L1221】

## How to verify locally
- `npm ci`
- `npm run build`
- `npm run test:unit`
