# Asset-aware main secret-only version — single attempt succeeded, undeployed

2026-11-08. Exactly **one** corrected main version creation request was made. No version was activated, no traffic moved, no webhook was changed, no Phase C code was uploaded, and no migrations ran.

## 1–2. Asset mechanism and completion

Used the documented Cloudflare asset upload-session/completion-token mechanism, not generic asset metadata copying or `latest` asset inheritance.

- Verified all 1,908 frozen Phase B build-file SHA-256 hashes immediately before upload. No rebuild or dirty-tree overlay.
- Manifest contains the exact 90 Phase B asset files, using installed Wrangler's BLAKE3(base64(file bytes) + extension), truncated to 32 hex characters, and the same asset-ignore rules.
- Manifest canonical SHA-256: `74d3986466cc73da114b1aa326484203b8d5e954e475d54362fd9e7c41c1fe70`.
- POST production hft-landing assets-upload-session with that manifest returned **zero buckets / zero requested uploads**. Cloudflare recognized every asset; no asset file bytes needed uploading.
- Returned completion token was supplied privately as `assets.jwt` with the exact existing routing configuration. No token was printed or included in this report.
- Explicit ASSETS binding used with the completion token. All unrelated non-asset bindings inherited from the explicitly pinned main source version, never `latest`.

The completed asset session binds the supplied manifest to the new version. The returned version's asset routing configuration also matches the pinned source. Content identity is established by the frozen file hashes and the exact recognized manifest/completion process, not a new public served-content test of the undeployed version.

Official mechanism: [Cloudflare Direct Uploads](https://developers.cloudflare.com/workers/static-assets/direct-upload/).

## 3–5. Creation and verification

**New main secret-only version: `abf18574-031e-4ef5-992a-f30f6a316b4f` — UNDEPLOYED.**

Endpoint: POST `/accounts/780fda88bb137eedefd9d3981a8816b4/workers/workers/hft-landing/versions?deploy=false`; JSON module upload. One version-creation request, no automatic retries. Full redacted failure capture was enabled but no creation failure occurred.

| Verification | Result |
| --- | --- |
| Source | Explicitly pinned active Phase B main fe9f5d14-0fdd-4597-bff3-1da00b951e68 |
| Runtime module | Byte-identical worker.js, 25,328,287 bytes |
| Runtime SHA-256 | 32d5a840fb5978dad92ad0c9531743bfa44f8b2d7b6d92e4443ae72d4b8ab9b2 |
| Preserved local runtime | /private/tmp/hft-phase-b-frozen-app-dry-run/worker.js matches the downloaded active bundle |
| Assets | All 90 exact Phase B assets recognized; completion requirement satisfied; routing configuration identical |
| Unrelated bindings | Identical after creation; inherited from the pinned active version |
| Runtime configuration | Main module, compatibility date/flags, usage model, asset configuration, limits and placement compare identical |
| Worker-level configuration | Unchanged except version annotations; observability, service/D1/auth bindings and control URL preserved |
| Authorized overrides | Only LIVEKIT_API_KEY and LIVEKIT_API_SECRET supplied with replacement values |
| Additional differences | Unavoidable generated version/author/time metadata and explicit version message/tag |
| Phase C | No Phase C code; runtime hash is the preserved Phase B bundle |

Cloudflare does not return stored secret text. Secret-only intent is established by the exact two-field override request plus explicit pinned inheritance and returned binding/configuration comparisons; this is not a claim that secret values were read back. Active runtime/provider/webhook use of these values remains to be tested after separately authorized activation.

Success resolves the asset-aware creation gate. It does not retroactively recover the lost message or establish which prior omission specifically caused error 10305: the corrected request supplies both a completion token and an explicit assets binding.

## 6. Paired classroom copy

Existing `cefcff3a-e1f7-4d26-bdeb-17c038992556` remains **UNDEPLOYED**, unchanged and structurally compatible.

- Runtime hash remains 298f4fcc65d05bb71f9a8ace02bda392e441312cc43fdf3af5129b6bb9310148, identical to pinned classroom code.
- Unrelated bindings and compatibility/configuration match its pinned source.
- Both candidates use the required provider binding names and the same intended replacement credential file. That file's last modification predates classroom copy creation; no later rotation/file update is recorded. This corroborates request history, not independent readback of stored secrets.
- Main CLASSROOM_HUB still targets hft-classroom-control, and CLASSROOM_CONTROL_URL remains wss://classroom.highfrequency.vip.
- No classroom copy recreation or deletion occurred. Live paired runtime acceptance is still pending activation.

## 7–10. Production safety

| Item | Post-attempt result |
| --- | --- |
| Active main | fe9f5d14-0fdd-4597-bff3-1da00b951e68, 100%; unchanged |
| Active classroom | ca3656bd-df69-435c-97bd-c3cc08149bec, 100%; unchanged |
| Traffic/activation | None; version creation explicitly deploy=false, no deployment request |
| Classroom copy | Remains absent from deployment history and not active |
| Webhook | No dashboard/API webhook write; unchanged by this operation; replacement synchronization still pending |
| Migration state | All 37 migrations including 0037; no migration/replay |
| D1 integrity | ok; zero FK violations |
| Data comparison | Fresh before/after exports restored; identical schema and all 90 tables unchanged; 13 users retained |
| Production HTTP | Main 200, login 200, control root 200; anonymous protected route 307 |
| Accounts/bookings/messages/transactions | No changes or sends; no student/account/booking mutation; no Stripe activity |

Private evidence and one-attempt marker: `.wrangler/phase-c-release/2026-11-08/asset-aware-main-attempt/`. Database exports, credentials and completion tokens must remain private. No credential values are in the report.

## 11. Next recommended action

Separately authorize coordinated activation of **only** these two verified Phase B secret-only IDs:

- Main: abf18574-031e-4ef5-992a-f30f6a316b4f.
- Classroom: cefcff3a-e1f7-4d26-bdeb-17c038992556.

Before activation, recheck active baselines, candidate hashes/settings, replacement credential status, zero active rooms and recovery readiness. Preserve all code/resources and do not replay migrations. After both are active, stop for Demi's manual production webhook signing-key selection if required; then verify genuine signed delivery and invalid-request rejection before declaring provider infrastructure healthy. Treat successful secret-only Phase B versions as the new rollback baseline for the later separately controlled Phase C Revision 3 deployment. Do not silently roll back to revoked credentials.

No activation authorization is inferred from successful creation. No Phase C Revision 3 activation or deployment belongs in the next secret-only step.

## Explicit answers

A. Was an asset-aware main secret-only version successfully created? **YES**, abf18574-031e-4ef5-992a-f30f6a316b4f, undeployed.

B. Is it verified identical to active Phase B except authorized secret/version metadata? **YES**, at artifact, asset-manifest, runtime configuration and binding/request level described above. Runtime use of the new secrets is not yet verified.

C. Is the existing undeployed classroom copy still safe to pair with it? **YES**, structurally verified, with normal fresh pre-activation guards and post-activation integration checks still required.

D. Is it safe to authorize activation of both secret-only versions next? **YES**, as a separately authorized controlled secret-only activation with those guards, webhook synchronization and verification. Neither is activated now; Phase C production acceptance remains pending.
