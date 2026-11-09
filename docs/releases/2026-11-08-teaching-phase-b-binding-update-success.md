# Phase B corrected configuration-only main bindings — success

2026-11-08. Corrected binding update executed once after Demi confirmed restored Wrangler access. **SUCCESS. No main Phase B application code uploaded. No migrations replayed. No LiveKit webhook created.**

| Verification | Result |
|---|---|
| CLASSROOM_HUB | Service binding to `hft-classroom-control`, environment `production`, verified from accepted settings and fresh deployed metadata |
| CLASSROOM_CONTROL_URL | Plain variable `wss://classroom.highfrequency.vip`, verified |
| Existing main bindings | All18 previous binding objects preserved exactly;20 total now. Original auth, D1, assets, communications and disabled-delivery settings retained |
| Main application code | Original Phase A ETag `e5ec08a1920bc857bf427df5a546a14c735aa22464d04bd0a7b1fce0da34ef8a` unchanged. Frozen489 source hashes unchanged. No application source/build upload |
| Main configuration version | `0214811f-d2cc-48b8-84a6-cc64fcb1541e`, deployment `b4cff5ab-e37c-4874-ba20-30c929d4cc24`,100% traffic. Configuration version change is not a Phase B code release |
| Main HTTPS health | `/login`200; protected `/admin/teaching` and `/lessons`307 to login, preserving authentication boundary |
| Control Worker/DO | Version `ca3656bd-df69-435c-97bd-c3cc08149bec` unchanged; correct production D1/HFT_APP/server settings; SQLite `ClassroomRoom` namespace `a3a910c26ebd4dcb911ff5460e7fcbe9` healthy in metadata |
| Control domain | Cloudflare custom domain `classroom.highfrequency.vip` points to control/production; HTTPS `/login` forwarding200 |
| Authorized control protocol | Shared-key HMAC accepted at `/internal/publish`. Intentionally empty session body returned expected400 `Invalid session`, after authentication and replay-nonce insertion. This proves server-signature acceptance without creating a room/session or targeting a student |
| Unauthorized/replay | Unsigned request401; repeated signed nonce503, rejected by durable UNIQUE nonce protection. No second action performed |
| WebSocket | Actual WS handshake at control hostname: invalid ticket with HFT origin401; foreign origin403. No fabricated valid student admission used |
| Migrations/data | Ledger36 through0036;13 users/four consultations retained;0 teaching/classroom sessions;FK0. All health SELECTs report rows_written0. **0035/0036 NOT replayed** |
| Probe data impact | No real student or booking change. One temporary replay-protection nonce was intentionally recorded by the signed infrastructure probe, with existing expiry/cleanup behavior. No classroom/DO session, LiveKit room, messages or transactions created |
| Webhook | Main `/api/classroom/webhook` still404 because Phase B application code remains intentionally undeployed. No LiveKit dashboard webhook configured |

## Verification limit

The accepted metadata binding and shared server authentication protocol are verified. The current main Phase A code does not contain the Phase B invocation path, so **an actual main-runtime classroom operation over CLASSROOM_HUB is not claimed**. End-to-end application/control/admission/media/webhook smoke testing belongs after a separately authorized main Phase B release. Existing frozen local/provider security acceptance is preserved, not substituted for future production acceptance.

## Next gate

No further dashboard action is appropriate against the404 webhook. Next is separate authorization to deploy only the frozen main Phase B application candidate and verify its protected routes/permanent webhook endpoint. **Do not replay migrations or redeploy unrelated work.** After that endpoint is live/verified, Demi's manual webhook gate will be HFT Production → Settings → Webhooks → Create webhook, name `HFT Production Classroom`, URL `https://highfrequency.vip/api/classroom/webhook`, production signing key corresponding to the installed rotated production credentials. Do not create it before endpoint readiness.

The main-code rollback version remains `fad1f0e2-683c-4f15-baea-e3b6c8147951`; the current fully configured Phase A-code version above is also recorded for a future release baseline. Keep successful additive migrations and DO history. Infrastructure recovery export/bookmark and terminal/provider containment runbook remain recorded in the infrastructure report. Obtain fresh recovery/baseline checks before any later application rollout.

Private evidence: `main-settings-before-bind.json`, `main-settings-after-bind.json`, `post-bind-auth-probe.json`, `post-bind-d1-health.json`, `post-bind-http-health.json`, fresh metadata under `diagnosis/`, and `execution-state.json` in `.wrangler/phase-b-release/2026-11-08/infrastructure/`. No secret values included in this report. No Phase C/Lesson2 work performed.
