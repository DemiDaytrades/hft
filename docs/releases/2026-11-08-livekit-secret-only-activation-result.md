# LiveKit secret-only activation — active; stopped at manual webhook gate

2026-11-08. Only the two explicitly authorized, previously verified Phase B secret-only versions were activated. No code rebuild, new Worker version, Phase C deployment, migration or real-student operation occurred.

## Results

| # | Requested item | Result |
| --- | --- | --- |
| 1 | Prior active main | fe9f5d14-0fdd-4597-bff3-1da00b951e68; prior deployment 44acb585-4f32-4089-a908-1f75d76b838a |
| 2 | New active main | abf18574-031e-4ef5-992a-f30f6a316b4f, 100%; deployment 1109336a-54f9-4c48-94a0-8fadf7627239 |
| 3 | Prior active classroom | ca3656bd-df69-435c-97bd-c3cc08149bec; prior deployment 478ce311-93db-4404-a743-875934fda65e |
| 4 | New active classroom | cefcff3a-e1f7-4d26-bdeb-17c038992556, 100%; deployment 62ce00f1-5672-4dd3-a3da-6f1deb52316b |
| 5 | Activation | PASS, exact IDs pinned. Classroom activated/verified first, then main. Both candidates freshly matched saved runtime/configuration/binding snapshots before activation. No latest-by-name selection, new version upload or rebuild. |
| 6 | Main health | HTTP site/login 200; admin, admin/teaching, admin/academy, student lessons and classroom pages redirect anonymous users to login with 307; teaching/classroom APIs return JSON 401. Worker settings unchanged except version annotations; exact Phase B runtime code preserved. Positive authenticated instructor/student browser checks remain pending. |
| 7 | Classroom health | Control root 200; code identity and unrelated Worker settings preserved. No active provider rooms. Full authorized classroom runtime exercise pending webhook gate. |
| 8 | LiveKit authentication | PASS, replacement credential direct read-only room listing before and after activation. Zero rooms. Active version IDs are precisely those created with the authorized two-secret override requests. Stored values cannot be read back; positive application-mediated admission remains pending. |
| 9 | Production project | Existing HFT Production project, p_516stlr7rvq; dashboard project URL matches established production configuration. Replacement signing key name visible as HFT Production Phase B v3. No development environment/project used. No credential values printed. |
| 10 | Webhook synchronization | NOT DONE; required manual dashboard handoff. Existing HFT Production Classroom webhook remains unchanged. No duplicate webhook created. |
| 11 | Genuine signed webhook events | PENDING after manual synchronization. No synthetic provider room/event generated before the gate. Missing and invalid authorization both return 401. Duplicate/replay/room_started/room_finished positive checks still pending. |
| 12 | Main → control | CLASSROOM_HUB service binding remains hft-classroom-control and shared control-secret binding preserved. Public unsigned internal publish returns 401. Full authorized application-to-control runtime acceptance is PENDING; do not confuse binding identity with successful authenticated runtime invocation. |
| 13 | WebSocket | Correct HFT origin with invalid ticket rejected 401; foreign origin rejected 403. Valid authenticated WebSocket pending synthetic runtime acceptance. |
| 14 | End Class security | Code unchanged and prior security work preserved. Fresh production End Class/stale-token test NOT RUN before manual webhook gate. |
| 15 | Migrations | All 37 including 0037 present; NO migration/replay. |
| 16 | Foreign keys | Zero violations; restored snapshot integrity ok. |
| 17 | Production data | Fresh before/after D1 exports restored: identical schema and all 90 tables unchanged; 13 users retained. No synthetic session, real student/account/booking edits, invitation, message or Stripe transaction. |
| 18 | Rollback | Exact prior main/classroom IDs in rows 1 and 3 retained in private before-active metadata. No rollback needed or performed. These old IDs reference the prior revoked provider credentials; reverting would require provider-aware containment/recovery and would not restore healthy provider auth by itself. |
| 19 | Next Revision 3 gate | Manual webhook signing-key selection, then genuine signed delivery, synthetic admission/control/End Class/replay/cleanup verification. Only after completion record the new verified Phase B baseline for Revision 3 preflight. No Phase C deployment is authorized in this activation run. |

## Exact manual action — stop here

The browser is on the existing production webhook's Actions menu. No change action was selected.

1. Open LiveKit Cloud → **HFT Production** → **Settings → Webhooks**: https://cloud.livekit.io/projects/p_516stlr7rvq/settings/webhooks.
2. On the **existing HFT Production Classroom** entry, choose **Actions → Edit webhook**. Edit is confirmed available in the actual dashboard.
3. Keep its name and URL unchanged: **HFT Production Classroom**, **https://highfrequency.vip/api/classroom/webhook**.
4. Select the replacement signing key **HFT Production Phase B v3**. Do not create or rotate a key, reveal its secret, or change another webhook.
5. Save the change. Do not click Create new webhook or Delete webhook.
6. Confirm **“Production webhook updated to Phase B v3.”** Do not paste any key/secret value. Resume the already authorized signed-event/synthetic runtime verification afterward; no Phase C deployment.

The user explicitly required a stop for a manual LiveKit dashboard action. This is that gate. Production LiveKit integration is not yet fully certified; do not start real classes on the strength of HTTP checks alone.

## Explicit answers

A. Are both verified secret-only versions active? **YES.**

B. Is production LiveKit authentication healthy with the replacement key? **YES for direct read-only provider authentication; positive application-mediated admission remains pending.**

C. Is the production webhook healthy with the replacement signing key? **NOT VERIFIED — manual signing-key synchronization pending.**

D. Is the Phase B production baseline healthy after secret rotation? **Immediate HTTP/security checks PASS; complete classroom/provider baseline certification remains PENDING webhook/runtime verification.**

E. Is it safe to resume Phase C Revision 3 controlled redeployment? **NO, not yet. Complete the manual webhook and remaining runtime gates first.**

Private recovery/evidence: `.wrangler/phase-c-release/2026-11-08/secret-only-activation/`; before/after exports, candidate identity snapshots, deployment responses, health/security results and all-table comparisons. No credentials or signed export URLs are reproduced here.

## Corrected manual gate — webhook signer is immutable

After the operator reported the update, native dashboard inspection showed the single existing webhook was renamed to **HFT Production Phase B v3**. A secret-safe comparison of the displayed signing-key identifier against the private credential file and original installation payload established: replacement match FALSE, original-key match TRUE. No key/secret value was printed. The Edit dialog explicitly states: **“The signing key cannot be changed.”**

The earlier Actions → Edit → select signing key instructions were incorrect for this dashboard. They allowed a label change but cannot update the signer. No provider-dependent acceptance, synthetic room creation, data mutation, Worker change or webhook change was performed by the agent after this discovery. Both secret-only Workers remain the recorded active baseline; webhook acceptance remains blocked.

Required manual replacement, justified by the verified immutable-signer limitation:

1. In HFT Production → Settings → Webhooks, remove only the current webhook entry labeled **HFT Production Phase B v3**, whose destination is https://highfrequency.vip/api/classroom/webhook. Delete the webhook entry, **not** its API key or project.
2. Create one replacement webhook: name **HFT Production Classroom**, destination **https://highfrequency.vip/api/classroom/webhook**, signing key **HFT Production Phase B v3**.
3. Save/create; ensure exactly one production webhook remains for that URL. Do not rotate a key or reveal credential values.
4. Confirm **“Webhook recreated with the Phase B v3 signing key.”** Then resume signer comparison and the authorized genuine signed-event/synthetic runtime checks. No Phase C deployment.

The replacement is necessary because the existing endpoint's signer cannot be edited. No duplicate webhook is requested; remove the old endpoint entry first. This remains a manual operator gate, with no automatic deletion/recreation by the agent.

## Recreated webhook check — old duplicate remains

The new **HFT Production Classroom** entry's signer matches the replacement credential through a private comparison. The prior entry **HFT Production Phase B v3** remains with the old signer. Both target https://highfrequency.vip/api/classroom/webhook; two entries are present in HFT Production. No provider test or production write was performed by the agent. Stop for Demi to delete only the old webhook entry, retain the correctly signed new entry, and confirm exactly one remains. Do not delete/revoke the v3 API key. Genuine signed-event/runtime verification remains pending.
