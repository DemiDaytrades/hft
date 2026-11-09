# Phase B control-only publish fix production report

Date: 2026-11-08. Result: control-only fix deployed; broader Phase B production acceptance remains BLOCKED. Phase C was not deployed.

## Release record

1. Wrangler authentication succeeded through the existing configuration. Account/database configuration was not changed.
2. Narrow production reads confirmed database identity, required classroom schema, 37 migrations through 0037 and zero foreign-key violations. No database export was performed.
3. The frozen candidate source and generated artifact hashes matched. Only the minimal authenticated-body preservation/await correction and its regression tests were included. Main application deployment was unnecessary and was not performed.
4. Prior control Worker / rollback: `cefcff3a-e1f7-4d26-bdeb-17c038992556`.
5. New active control Worker: `00da709f-7dbb-43fe-ad2c-1bd260eeba8e`.
6. Main Worker remained `abf18574-031e-4ef5-992a-f30f6a316b4f`; no main code/config deployment.
7. Control deployment ID: `47445a2a-0b82-407e-887b-38782fbbab66`. Pre-activation code verification passed. Unrelated configuration/bindings were preserved; secrets were inherited without replacement. Durable Object migration tag remains `v1`.
8. The exact previously failing production signed `/internal/publish` path returned HTTP 200 with JSON `{"ok":true}`. Initial correlation: `a5774a25a821f55a-DFW`, 20:22:25 UTC. A live synthetic-session publish also returned 200. Final cleanup notification returned 200, correlation `a5775bd0987b69d0-DFW`, 20:34:28 UTC.
9. Valid authentication passed. Invalid signatures returned JSON 401; repeated nonces returned the existing safe JSON 503 contract. Invalid WebSocket tickets returned 401 and foreign origins 403. Anonymous protected pages redirected to login; protected APIs returned 401.
10. Corrected forwarding reached ClassroomRoom and returned structured success. The authorized synthetic control WebSocket received a LIVE snapshot with the correct self identity.
11. `/internal/publish` is a control snapshot/broadcast operation, not a LiveKit media-track publishing operation. Normal browser admission connected to the real production provider. Successful native media-track publishing was not certified in this run.
12. Normal pre-END browser reconnect succeeded; genuine provider join/leave events were received. No duplicate open attendance remained after cleanup.
13. Normal End Class acceptance did not pass: a later normal screen-admission POST to the unchanged main application returned HTTP 503 with Cloudflare's “Worker exceeded resource limits” HTML. The UI showed “Access could not be reverified.” The subsequent normal End Class attempt also failed to establish ENDED. A bounded authenticated control-protocol cleanup attempt timed out. These are failures, not successful End Class evidence.
14. Actual unexpired HFT-issued cached-token replay after normal End Class was NOT completed. A masked loopback helper held no token on disk and never armed successfully. No substitute self-minted token is being counted as actual HFT-token replay evidence. The helper was stopped.
15. Post-END media/screen publishing and fresh normal admission denial were NOT certified in this production run. Final terminal state/grants were verified after cleanup, but this does not replace the interrupted attack test.
16. Genuine Cloud events included `room_started` (`EV_CSH2MADfHfwt`) and `room_finished` (`EV_k6zRz6URn6Kt`) plus participant events. Separate explicitly self-signed verification probes passed: accepted 200, duplicate idempotent 200, invalid signature 401, stale event 401. Webhook configuration/signing key was unchanged.
17. Cleanup complete: exact instructor-only synthetic session `qa-publish-fix-prod-6c044e3c6f67`, no student enrollment, canceled using an exact ID/title/no-student guard after provider absence/open-attendance checks. Existing control alarm reconciliation subsequently committed ENDED. Final revision 10; all grants off, disconnected, no screen/hand activity, cleanup_pending 0, open attendance 0, outbox 0, provider rooms 0. Do not describe this containment cleanup as normal End Class acceptance.
18. Migration state remains 0037. No migration was run or replayed.
19. Zero FK violations in narrow production checks.
20. No real student, questionnaire, financial plan, learning path, Academy, account/password, consultation booking, message or Stripe mutations were performed. Protected user/account counts and max-update timestamps and consultation-booking counts were unchanged; all non-classroom/non-teaching table counts matched except the expected authentication-session count decrease from 32 to 31 after the explicit instructor sign-out. These narrow aggregate checks are not a claim of a full row-by-row audit. Changes were confined to the synthetic teaching/classroom fixture and protocol-test records. During native DevTools inspection, an instructor session cookie appeared in tool output; the browser was then signed out normally, and reopening the protected page redirected to login. No account credentials were changed. Temporary copied response was overwritten with a harmless URL; no token was saved by the replay helper.
21. Control rollback target remains `cefcff3a-e1f7-4d26-bdeb-17c038992556`. No rollback was performed: the corrected control endpoint remained healthy, while the observed resource-limit error occurred on the unchanged main Worker. Rolling back the control Worker would restore the proven consumed-request defect and would not change that main Worker. No unrelated repair or retry deployment was attempted.
22. Remaining blockers: diagnose the main application's resource-limit failure under the synthetic classroom path; repeat only the incomplete normal End Class/unexpired actual-token/publishing/screen regression after authorization. The older frozen Phase C Revision 3 control artifact still needs this minimal fix incorporated and reverified before deployment. Do not deploy that old control artifact over this fixed baseline.

## Explicit decisions

A. Is `/internal/publish` fixed in production? **YES.**

B. Does real production `/internal/publish` return 200? **YES.**

C. Does End Class still reject cached/unexpired token replay? **NOT VERIFIED in this production run; do not certify YES.**

D. Is the Phase B production baseline fully accepted? **NO.**

E. Is it safe now to resume the frozen Phase C Revision 3 controlled redeployment? **NO.** Resolve the acceptance blocker and incorporate/reverify this control fix in its future candidate first.

## Evidence and verification scope

Private, secret-safe evidence: `.wrangler/phase-c-release/2026-11-08/publish-fix-production/`, including preflight, preactivation, activation result, before/after settings, original-context response, final narrow aggregates, health results and runtime synthetic observations.

Frozen candidate validation recorded before this deployment: 81 focused tests; 513 isolated Phase B tests; 545 shared-source tests; clean-source TypeScript; OpenNext; both Worker dry-runs; real development provider regression. Candidate hashes were reverified for this release; these suites were not rerun after the unchanged frozen artifact was activated. Existing documented dirty/generated-root TypeScript OOM is not relabeled as a passing direct root invocation.

No Phase C, Phase D, Lesson 2, key rotation, webhook reconfiguration, invitation or further production deployment was performed. Stop at this failed acceptance gate.
