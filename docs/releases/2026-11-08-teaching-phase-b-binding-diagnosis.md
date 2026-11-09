# Phase B main Worker HTTP400 diagnosis — no production write

2026-11-08. **Diagnosis complete. Corrected metadata-only helper prepared and verified offline, NOT executed against production. No migrations, deployments, webhook creation, bookings or messages.** Frozen source remains489/489 hash-identical.

| Requested item | Diagnosis/result |
|---|---|
| 1. HTTP400 root cause | The infrastructure helper resolved top-level **Cloudflare TypeScript SDK4.5.0**. Its `scriptAndVersionSettings.edit()` method called multipart encoding without JSON mode. The exact reconstructed request emitted bracketed fields such as `settings[bindings][][name]`, `settings[bindings][][type]` and `settings[annotations][workers/message]`; it contained **no top-level `settings` JSON part**. This is a malformed settings request. Wrangler's bundled Cloudflare5.2 implementation of the same method explicitly sets `__multipartSyntax:'json'`. |
| 2. Error body/code/reference | Original HTTP status400 is recorded. Structured Cloudflare body, numeric code and request/reference headers were discarded by the original redacting wrapper and are unavailable. No verbatim backend validation message is claimed. The request-format defect is proven by offline wire reconstruction and SDK source, rather than recovered response text. No live PATCH replay was used to obtain another error. |
| 3. Resource | `PATCH /accounts/780fda88bb137eedefd9d3981a8816b4/workers/scripts/hft-landing/settings`, main deployed production environment. Wrong-worker/account targeting was not found. |
| 4. CLASSROOM_HUB | **Service binding**, name `CLASSROOM_HUB`, target service `hft-classroom-control`, default environment `production`, default fetch entrypoint. It is not the DO binding. `CLASSROOM_ROOMS`→`ClassroomRoom` belongs inside the control Worker. Frozen transport calls `CLASSROOM_HUB.fetch()` for signed `/internal/publish`. |
| 5. CLASSROOM_CONTROL_URL | **Plain environment variable**, exact frozen value **`wss://classroom.highfrequency.vip`**. This is a public browser control-WebSocket URL, not provider credentials. Frozen transport requires WSS for nonlocal hosts and builds `/classroom/{sessionId}`; HTTPS is not the correct value for this variable. Public HTTP reachability separately uses `https://classroom.highfrequency.vip`. |
| 6. Control target | Correctly deployed: service `hft-classroom-control`, default environment `production`, version `ca3656bd-df69-435c-97bd-c3cc08149bec`. Production custom domain mapped to it; SQLite `ClassroomRoom` namespace remains `a3a910c26ebd4dcb911ff5460e7fcbe9`. The default fetch/WebSocket handler is the frozen implementation. No redeployment needed for the encoding defect. |
| 7. OpenNext/deployment requirement | OpenNext does **not** require new application code just to install these metadata bindings. Cloudflare's settings endpoint supports binding-only changes without code upload. Frozen Wrangler already expresses the correct service binding and WSS variable, so the later authorized main deployment will also apply them atomically. The failed helper bypassed Wrangler with an older SDK encoder; OpenNext configuration did not cause the malformed multipart body. |
| 8. Smallest safe correction | Add the supported JSON multipart option to the existing SDK call: `edit('hft-landing', params, {__multipartSyntax:'json'})`. No dependency upgrade, architecture change, DO redesign, secret rotation or application source change. Offline corrected request contains one `application/json` settings part with18 inherited existing bindings and exactly the2 intended additions. |
| 9. Exact next command | `node /private/tmp/hft-phase-b-corrected-infrastructure-api.cjs bind-main` — **prepared, not run**. Freshly reads deployed version/bindings, guards unchanged main code ETag and diagnosis binding metadata, then sends only the corrected metadata update. Retains every existing binding by inheritance. Stops if state drift is found. Error capture records structured API errors/reference headers privately if a future request fails. |
| 10. Authorization classification | Configuration-only operation within the earlier infrastructure authorization; **not** the main Phase B application deployment. No separate main-application deployment authorization is required for this binding correction. This diagnosis-only turn stops before executing it. A later actual Phase B main application rollout still requires separate deployment authorization. |
| 11. Migrations | Read-only ledger remains36 through0036. **0035/0036 NOT replayed.** |
| 12. Data | No production writes in this run. SELECTs report rows_written0;13 users/four consultations retained;0 teaching/classroom sessions;0 control nonces;FK0. Earlier full197-row preservation proof remains intact. |
| 13. Webhook | No webhook created. Main `/api/classroom/webhook` remains intentionally404 because main Phase B code is undeployed. Do not configure the LiveKit dashboard webhook yet. |
| 14. Rollback/recovery | Main current config version `9e269899-206c-4ab2-80e4-ff5a76945152`; control current version above. Main code ETag remains `e5ec08a1920bc857bf427df5a546a14c735aa22464d04bd0a7b1fce0da34ef8a`. Original rollback main version `fad1f0e2-683c-4f15-baea-e3b6c8147951`. Fresh infrastructure export `.wrangler/phase-b-release/2026-11-08/infrastructure/before.sql`, SHA-256 `9944b4a7c2752ada88eca590f3f10042d4a122b103ce6d4aa94f7964c47927d4`, verified recovery bookmark `00000243-00000000-0000511d-adb35e945fd6e8fe46e5a7bd74aa406c`. No rollback/restore performed; preserve successful migrations/DO history. |

## Read-only production comparison

Main Worker has18 existing bindings, exactly equal to the pre-attempt snapshot; both requested additions remain absent. `DB` retains the confirmed production D1; all secret bindings remain server-side and values are suppressed. Main has no classroom DO binding by design. Compatibility remains2026-08-01, `nodejs_compat` + `global_fetch_strictly_public`; control uses2026-08-01 + `nodejs_compat`. No compatibility/deployment-state change was indicated by the serialization defect.

The main public hostname remains Cloudflare custom domain `highfrequency.vip`→`hft-landing`/`production` (ordinary route list empty because this is a custom-domain mapping). Control hostname remains separately mapped to control/production. Main login200, protected teaching/student routes307 to login, control HTTPS/login200. Current service/environment lookup confirms the intended control production target exists. Existing control-side `HFT_APP`, `DB`, `CLASSROOM_ROOMS` and four server settings remain present.

Cloudflare documents the settings endpoint and inheritance model in the [Worker script/version settings API](https://developers.cloudflare.com/api/resources/workers/subresources/scripts/subresources/script_and_version_settings/). SDK source and the locally captured wire bodies establish the encoder difference; accepted API support does not substitute for a future successful production update.

## Evidence and limits

- Private `infrastructure/offline-failed-request-wire.json`: exact reconstruction, dummy credential and intercepted fetch; no network write.
- Private `infrastructure/offline-corrected-request-wire.json`: same binding payload, corrected one-part JSON encoding; no network write.
- Assertion check: failed body lacks `settings`; corrected body has exactly one JSON settings part,18 inherit bindings + service/plain-text additions. PASS.
- `infrastructure/diagnosis/`: fresh Worker/service/route/DO/compatibility metadata, D1 and HTTP health, diagnosis JSON. No secret values in report/output.
- Prepared helper is outside the frozen source; product code/package lock/manifests were not edited. Current source489 hashes match.

The confirmed malformed request explains the original400 class. The discarded original backend detail cannot be recovered from local evidence, and no corrected production-success claim is made. Additional provider validation errors, if any, can only be ruled out when the correctly encoded configuration-only request is later executed under the guarded continuation.

## Explicit answers

A. **YES** — the malformed multipart serialization root cause is known and reproduced offline; original structured Cloudflare error details are unavailable.

B. **YES** — install the two missing settings through a correctly encoded metadata-only update while retaining current application code. This completes these missing bindings, not full live Phase B application/webhook readiness.

C. **NO for this configuration-only correction.** Separate main application deployment authorization remains necessary for the actual later Phase B code rollout. No deployment or production retry occurred in this diagnosis run.
