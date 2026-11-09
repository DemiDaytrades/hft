# Authorized pinned Phase B LiveKit secret rotation — stopped before activation

2026-11-08. The user authorized secret-only new Worker IDs cloned from the exact active Phase B versions. No Phase C code was used. **Rotation is incomplete; production activation did not occur.**

| Requested result | Evidence/result |
| --- | --- |
| 1. Prior main version | fe9f5d14-0fdd-4597-bff3-1da00b951e68; still active, deployment 44acb585-4f32-4089-a908-1f75d76b838a. |
| 2. New main secret-only version | None. Creation rejected: POST Workers API versions, deploy=false, HTTP 400 / code 10305. |
| 3. Prior classroom version | ca3656bd-df69-435c-97bd-c3cc08149bec; still active, deployment 478ce311-93db-4404-a743-875934fda65e. |
| 4. New classroom secret-only version | cefcff3a-e1f7-4d26-bdeb-17c038992556. Created and verified, **undeployed**. |
| 5. Code identity | Classroom clone runtime module SHA-256 matches the exact pinned source. Main clone creation failed. Fresh post-attempt reads confirm both original active code modules remain unchanged. |
| 6. Unrelated bindings/configuration | Classroom clone unrelated bindings, binding names, main module, compatibility settings and configuration compare identical. Every inherited binding explicitly references its pinned source version. Only LIVEKIT_API_KEY and LIVEKIT_API_SECRET were supplied as secret overrides. Both active Workers retain original bindings; no activation attempted. |
| 7. LiveKit authentication | Replacement credentials authenticate successfully using read-only listRooms; zero rooms. This proves the private replacement pair works with the provider, not that active production Workers use it. |
| 8. Webhook | Not synchronized in this run; genuine signed production delivery with replacement remains unverified. No webhook/dashboard write or provider room/event probe. |
| 9. Migrations | 37, including 0037. No migration replay or migration command. |
| 10. Foreign keys | Zero violations; restored post-attempt export integrity ok. |
| 11. Production data | Independent before/after exports restored and all 90 tables compared: no changed table rows and identical schema. All 13 users retained; accounts and bookings unchanged. No real message, invitation, Stripe transaction, classroom creation or student mutation. |
| 12. Rollback | No traffic change occurred, so no rollback needed. Original active versions above remain current. They still reference their original provider credentials; do not call them a healthy provider recovery point after revocation. New classroom version is merely a stored, unactivated candidate. |
| 13. Next Revision 3 gate | Resolve main clone rejection 10305 without changing source or activating a stored unreleased version; verify main code/assets/bindings before any activation. Then activate only verified secret-only copies, synchronize webhook, prove genuine signed/invalid-request handling and rerun frozen Revision 3 preflight with the secret-updated Phase B versions as baseline. No Phase C rollout until these prerequisites pass. |

## Failure detail and limits

The main copy used pinned Cloudflare-returned runtime modules, compatibility/configuration and explicit pinned inheritance for all unrelated bindings, including ASSETS. Its assets metadata contained configuration but no completion JWT. Cloudflare rejected creation with HTTP 400/code 10305. The response message was not retained by the redacting wrapper; a more specific server diagnosis is **not established**. Do not claim that ASSETS/JWT caused this error solely from its presence in the request. No retry or alternate activation was attempted. Diagnose the rejection and preserve/redact the exact response safely before a corrected creation request.

Fresh recovery snapshot SHA-256: 547dac5364751d7c2b0ff4bacefdc895e110154c389363f0be77ad7cff68adb0. Private evidence: `.wrangler/phase-c-release/2026-11-08/livekit-secret-rotation/`. No credential values in this report.

## Explicit decisions

A. Were only authorized LiveKit secrets changed? **In the undeployed classroom copy, YES. In active production, NO secret update has taken effect.** No unrelated configuration/code was changed.

B. Is production LiveKit authentication healthy? **YES for the replacement credential's direct read-only provider authentication. Active application/control integration with it is NOT VERIFIED because neither copy was activated.**

C. Is the production webhook healthy with the replacement key? **NOT VERIFIED; synchronization and signed delivery remain pending.**

D. Is it safe to resume Phase C Revision 3 controlled redeployment? **NO**, until secret-only installation and webhook verification complete.

No new rotation is requested. Preserve the replacement credentials privately. No manual webhook action is requested yet; the current blocker is main clone creation.
