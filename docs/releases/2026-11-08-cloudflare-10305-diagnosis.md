# Cloudflare 10305 main clone — read-only diagnosis

2026-11-08. **No retry, version creation, activation, deployment, credential rotation, webhook change, or production-data mutation occurred in this diagnosis.** Frozen Revision 3 untouched.

## Finding and confidence

The exact Cloudflare server reason for 10305 is **not recoverable from the retained evidence and is not proven**. The earlier direct-fetch wrapper retained only HTTP 400 and error code 10305, then discarded error messages, response headers and references. It did not use Wrangler for the failing request, so there is no Wrangler request log containing its missing response body. Retained local intent/error/execution records and tool output provide no detailed message or request reference. Repeating a production clone was expressly prohibited and was not done. No public primary-source definition tying 10305 to this exact request was found.

A concrete flaw in the generic helper is established: it treats an asset-backed OpenNext Worker as if copying ordinary bindings/configuration reconstructs its asset collection. It sends the ASSETS binding as an inherited binding and copies `assets.config`, but supplies neither `assets.jwt` nor an explicit asset-retention option. Cloudflare documents a completion JWT or supported existing-asset retention mechanism for an asset-backed upload. This gap must be resolved before relying on the helper for main. **That does not prove it was the particular validation which produced 10305.** Other differences, including the much larger base64 JSON request, were not isolated by an allowed server test.

## 1–2. Meaning, detailed error and exact failed request

Known failure: **HTTP 400 / Cloudflare code 10305**. More specific meaning, message, CF-Ray/request reference: **unavailable**. Do not label this a D1, credential, account-permission or multipart-boundary error without evidence.

- Method: POST.
- Endpoint: `/accounts/780fda88bb137eedefd9d3981a8816b4/workers/workers/hft-landing/versions?deploy=false`.
- Worker: `hft-landing`, same account/production Worker whose explicit active source was `fe9f5d14-0fdd-4597-bff3-1da00b951e68`; not the latest stored version. No named Wrangler environment selection was involved.
- Content-Type: `application/json`. **Not multipart**; no boundary was constructed. Runtime modules were embedded as base64 per the Workers API JSON format. This format itself is supported; classroom creation used it successfully.
- Body keys: `main_module`, `modules`, `compatibility_date`, `compatibility_flags`, `bindings`, `annotations`, `assets`, `usage_model`.
- `main_module`: `worker.js`; one exact pinned runtime module, 25,328,287 decoded bytes, 33,771,052 base64 characters, approximately 3,795,527 gzip bytes.
- Compatibility date: `2026-08-01`; flags: `nodejs_compat`, `global_fetch_strictly_public`; usage: standard.
- Only LIVEKIT_API_KEY and LIVEKIT_API_SECRET supplied as new secret text. All other bindings used `type: inherit` with the explicit pinned version ID. The helper did not read stored secret values.
- All 20 main binding names were included: ADMIN_PHONE_NUMBER, ADMIN_SMS_ENABLED, ASSETS, BETTER_AUTH_SECRET, BETTER_AUTH_URL, CLASSROOM_CONTROL_SECRET, CLASSROOM_CONTROL_URL, CLASSROOM_HUB, DB, EMAIL_FROM, LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL, RESEND_API_KEY, SETTINGS_ENCRYPTION_KEY, TEACHING_DELIVERY_ENABLED, TELNYX_API_KEY, TELNYX_FROM_NUMBER, TELNYX_MESSAGING_PROFILE_ID, TELNYX_WEBHOOK_PUBLIC_KEY. No values reproduced here.
- `assets.config`: html_handling auto-trailing-slash; not_found_handling none; run_worker_first false; base_path `/`. No completion JWT and no keep_assets request.
- Version annotations: message `LiveKit secret-only rotation; exact pinned active Phase B code`, tag `phase-b-livekit-rotation`.
- Placement was absent from the version representation and was not sent. Worker-level placement was null. Tail consumers were empty. Main Worker-level observability remained enabled with sampling 1; logs enabled/persisted, traces disabled. These Worker settings were not changed by the request. Routes/custom domains were not included in the version body and were not changed.

Secret-redacted payload reconstructions and exact runtime hashes are saved privately in `.wrangler/phase-c-release/2026-11-08/10305-diagnosis/failed-and-successful-request-structures.json` and `structural-comparison.json`.

## 3–5. Main versus classroom; responsible feature and helper validity

| Property | Main | Classroom |
| --- | --- | --- |
| Worker form | OpenNext module Worker | Standalone module Worker |
| Runtime module | worker.js, 25,328,287 bytes | index.js, 270,691 bytes |
| Static assets | ASSETS plus separate asset collection/configuration | None |
| Compatibility | nodejs_compat + globally public fetch | nodejs_compat |
| D1 | Same production DB | Same production DB |
| Service | CLASSROOM_HUB → hft-classroom-control | HFT_APP → hft-landing |
| DO namespace binding | None; OpenNext code includes named cache/queue exports | CLASSROOM_ROOMS, existing namespace, migration tag v1 |
| Secrets | More unrelated auth/email/SMS/settings bindings; all explicitly inherited | LiveKit/control secrets; explicitly inherited |
| Placement/tails | Null / empty | Null / empty |
| Observability | Worker-level enabled | No equivalent version field |
| Format and secret overrides | JSON/base64; two secret overrides | Same |
| Result | Creation rejected 400/10305 | Created, exact comparisons passed, undeployed |

Classroom success establishes that the API, account, basic JSON upload, pinned ordinary-binding inheritance and secret override pattern worked for that simpler Worker. It does **not** establish which main-only difference triggered 10305. OpenNext's separate asset collection is a confirmed helper limitation and a leading hypothesis, not a proven error-code mapping. The helper is therefore **not approved for main as currently written**.

The main version's downloaded assets metadata exposes routing configuration, not the upload completion token or an exact reproducible asset manifest. Inheriting the name/type of ASSETS is not sufficient proof of retaining identical content. Version GET output is not universally a ready-to-repost creation document. Main also has Cloudflare-generated IDs/deployment/author metadata which must not be blindly uploaded.

## 6–8. Supported correction and code identity, without Phase C

Cloudflare's Direct Uploads documentation describes obtaining an asset completion JWT via an upload session, or supported `keep_assets` retention for existing assets. Its Workers API example combines exact modules, an ASSETS binding and the completion JWT. Do not assume `keep_assets` defaults to the pinned version or is accepted by every API variant: explicit pinned-binding inheritance is supported on the newer Workers API, while older script-upload endpoints reject concrete version IDs.

The least ambiguous documented reconstruction uses **exact Phase B assets plus a fresh completion token**, not a rebuilt Next/OpenNext application:

1. Reconfirm both pinned active versions and the undeployed classroom copy; fail on drift. Capture a fresh recovery point and secret-redacted request diagnostics including status, error messages, validated request reference and headers. Keep request bodies/credential values private.
2. Use only the downloaded pinned main runtime module, or `/private/tmp/hft-phase-b-frozen-app-dry-run/worker.js`, which this diagnosis proved byte-for-byte identical. SHA-256: `32d5a840fb5978dad92ad0c9531743bfa44f8b2d7b6d92e4443ae72d4b8ab9b2`.
3. Use `/private/tmp/hft-teaching-phase-b-rc/.open-next/assets` only after checking the original deployment lineage and recorded manifest. All 1,908 Phase B build hashes currently match, including all 90 asset files. Do not use that directory's `.open-next/worker.js` entry file as the complete runtime bundle: it is **not** the downloaded bundled runtime. Do not rebuild.
4. Build the static asset manifest with Cloudflare's documented hashing/ignore/MIME rules from those exact Phase B asset bytes; reconcile it with the original deployment artifact record before mutation. Do not take assets from Phase C or the dirty checkout.
5. Only after separate authorization, POST `/accounts/{account_id}/workers/scripts/hft-landing/assets-upload-session` with that manifest. Complete only any requested uploads of those same files; keep the returned JWT private. If the files already exist, the documented empty-buckets response directly supplies the completion token. This creates upload state, not a traffic deployment.
6. POST `/accounts/{account_id}/workers/workers/hft-landing/versions?deploy=false` with the byte-identical pinned module, pinned compatibility/runtime settings, exact asset routing config plus `assets.jwt`, explicit ASSETS binding, all other unrelated bindings inherited from the pinned main ID, and only the two rotated LiveKit secret overrides. No migrations. This is a **proposed corrected undeployed-only diagnostic attempt**, not a claimed verified fix for 10305.
7. Fetch the result before any activation. Compare every runtime-module hash, asset manifest/content and unrelated binding/settings. Verify DO/service/D1/auth/observability/route state preserved. Abort on any mismatch or error; retain the full redacted error detail rather than discard it.
8. **Stop with both candidates undeployed.** No activation, webhook switch or Phase C rollout is part of this proposed next authorization. If 10305 persists, use the captured exact server error to determine the cause or prepare a Cloudflare support case; do not broaden into repeated speculative uploads.

Official sources:

- [Cloudflare Direct Uploads](https://developers.cloudflare.com/workers/static-assets/direct-upload/): asset completion tokens, retention option and upload procedure.
- [Workers API Create Version](https://developers.cloudflare.com/api/resources/workers/subresources/beta/subresources/workers/subresources/versions/methods/create/): JSON module upload, deploy=false, version-pinned binding inheritance.
- [Versions and deployments](https://developers.cloudflare.com/workers/versions-and-deployments/): new versions versus active traffic.

## 9. Existing classroom copy

`cefcff3a-e1f7-4d26-bdeb-17c038992556` exists and remains undeployed. Its current runtime hash matches the pinned classroom module: `298f4fcc65d05bb71f9a8ace02bda392e441312cc43fdf3af5129b6bb9310148`. Prior clone verification proved unrelated binding/configuration identity. No recreation/deletion is necessary merely to diagnose main. It remains a candidate for later coordinated use provided credentials/source/bindings have not subsequently drifted and the matching main candidate passes. Do not activate it now.

## 10–11. Exact next procedure and authorization

Authorize only the asset-aware main **undeployed version creation/diagnostic attempt** described in steps 1–8 above, including the Phase B-only asset upload-session/completion-token procedure and full secret-redacted failure capture. No activation, no webhook change, no Phase C code, no classroom copy recreation. This is a new production API write and requires separate authorization under the current diagnosis-only instruction. No such write was executed here.

## 12–14. Preserved production state

- Main active: fe9f5d14-0fdd-4597-bff3-1da00b951e68, 100%.
- Classroom active: ca3656bd-df69-435c-97bd-c3cc08149bec, 100%.
- Classroom copy absent from returned deployment history and neither active deployment references it.
- Main HTTP 200, login HTTP 200, protected instructor page redirects anonymous access with 307, control root HTTP 200. These are read-only HTTP checks, not a new authenticated classroom acceptance claim.
- Fresh D1 export restored: schema identical, all **90 tables unchanged**, 13 users, integrity ok, FK zero, migration count 37 including 0037. Export SHA-256 remains `547dac5364751d7c2b0ff4bacefdc895e110154c389363f0be77ad7cff68adb0`.
- No migration replay, account/booking change, messages, Stripe activity, webhook change or provider room operation. No new credentials read or rotated during this diagnosis.

## Explicit answers

A. Is the 10305 root cause known? **NO, not conclusively.** Asset-handling deficiency is established; exact server validation reason is lost and was not safely reproducible within this read-only scope.

B. Can a safe main secret-only version be created without deploying Phase C Revision 3? **YES in principle through the supported asset-aware Phase B reconstruction above; successful creation and exact verification are still required.** The pinned runtime artifact and preserved assets are available.

C. Can the existing undeployed classroom copy still be used? **YES, conditionally after paired verification.** Preserve it unchanged and undeployed.

D. What exactly should be authorized next? **One asset-aware main-only undeployed diagnostic creation attempt with exact Phase B artifacts, complete redacted error capture, and mandatory stop before activation.** No new credential rotation or Phase C deployment.
