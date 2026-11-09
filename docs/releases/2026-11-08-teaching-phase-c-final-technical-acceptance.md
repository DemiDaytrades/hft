> Subsequent production attempt was **not accepted and rolled back**. See [production release / rollback report](2026-11-08-teaching-phase-c-production-release.md). Migration 0037 is already applied; do not replay it. This document records the earlier local technical acceptance only.

# Phase C — final three technical gates

2026-11-08. **Technical readiness: YES. No deployment or production mutation occurred.** This report supersedes only the three outstanding technical findings in the earlier readiness report. Real-student operational clearance remains separate.

Frozen revision 2: [manifest / exact 518-file inventory](2026-11-08-teaching-phase-c-candidate.json). Fingerprint: `5d459c2c7dfc720a877e1d105550835a2c4402dc14d9fc4ddd4f82a1e825af42`. [Revision 1 inventory](2026-11-08-teaching-phase-c-candidate-revision-1.json) is retained. All source hashes were verified after testing. Runtime credentials, copied data, synthetic accounts and the policy test proxy are outside the candidate. Unrelated working-tree changes were preserved.

| Requested result | Final evidence |
|---|---|
| 1. Invalid YouTube fix | Only the URL normalizer now raises a safe input-validation error with status 400. Existing host/protocol/credentials/ID restrictions and accepted standard/short forms remain unchanged. |
| 2. Invalid-input HTTP behavior | PASS. Malformed, non-YouTube, unsupported playlist, missing ID and empty inputs return actionable 400, never generic 500. Service regression compares the complete snapshot, teaching state/revision and durable command count before/after rejection. Six invalid cases also returned 400 on the actual local Next/OpenNext endpoint without changing state. The actual instructor form visibly displayed “Enter a valid YouTube video URL.” Valid standard/short URLs pass. Unrelated internal errors remain private 500 errors. |
| 3. Actual autoplay-blocked browser | PASS. Actual Chrome Guest, official YouTube iframe and the built app on the migrated production copy. A loopback-only proxy added `Permissions-Policy: autoplay=()` to reproduce genuine browser denial; no player/event mocks or browser script injection. The video thumbnail and Play button stayed visible with no infinite spinner or false local “playing” status. |
| 4. Manual recovery / Rejoin | PASS. Under the strict policy, parent-page Rejoin alone did not unlock video. Directly tapping YouTube's visible Play button did; Rejoin then resumed instructor synchronization. The one-line recovery instruction was corrected to “Playback blocked. Tap Play on the video, then select Rejoin instructor position.” This final built wording and the complete direct-Play→Rejoin path were reverified in Chrome. Official player accessibility changed to Pause video, and the blocked message cleared. Subsequent instructor pause changed it to Play video; authoritative seek was exercised at 40 seconds. Normal pre-END Reconnect completed with unique provider identities. |
| 5. Mobile Chat | PASS in actual Chrome device emulation at **393 CSS px**. Chat opened, student entered/sent a long message including a long unbroken string, messages wrapped without visible horizontal page overflow, and instructor received/replied. Both messages remained readable after returning. Input and Send stayed usable with keyboard entry; touch-sized tabs/controls were visibly usable. No mobile redesign was needed. |
| 6. Stage/Chat/Activity | PASS. Visible taps switched Stage→Chat→Stage, Stage→Activity, Activity→Chat and Chat→Activity. A real poll response persisted as Answer received. Existing conversation remained after returning to Chat. Exercised with YouTube, an active poll, and real native screen presentation. Scroll was used to reach tabs below the video/activity; offscreen AX clicks were not counted as successful taps. |
| 7. Native media regression | PASS against development LiveKit. Real native Chrome capture→YouTube→native screen; the same unmuted screen track `TR_VSBeXTVJ5mMFMa` existed before/after, with publish/screen permission intact and no duplicate/orphan screen. The 393px student visibly received the restored synthetic screen. |
| 8. Three-screen regression | PASS within the minimum affected scope: prior actual three-simultaneous-native-share acceptance remains preserved; final automated reservation/race/max-three and mobile/desktop presentation tests pass. No screen-slot, presenter-grant, transport or LiveKit implementation changed. This pass did not unnecessarily repeat the entire three-native-picker exercise; it repeated the affected real screen/YouTube/screen sequence. |
| 9. Written wording | PASS. Existing awaiting/approved/needs-reinforcement regression passed unchanged; stored review and feedback remain intact. |
| 10. Temporary export link | HEAD returned 403. Locally inspected signing metadata expires at **2026-11-08 11:22:57 AM America/Chicago**; expiry was checked after that deadline. No URL or snapshot content is reproduced. A content GET was not performed: automatic approval review rejected the ranged GET because it could retrieve sensitive production snapshot data. No workaround or unrelated key rotation was attempted. This is metadata expiry plus HEAD evidence, not a new post-expiry content-download test. |
| 11. Focused tests | **269 passed / 42 files**, including targeted validation/state preservation, playback anchoring, mobile presentation, Phase C, Phase B/provider/END/security, scheduling, Lifecycle, Academy and learning-path coverage. |
| 12. Full suite | **534 passed, zero failures.** |
| 13. TypeScript | PASS, exit 0. Isolated clean source/typecheck tree; OpenNext also checked types. |
| 14. OpenNext | PASS, exit 0 on final source. Initial sandbox listener denial was rerun with authorized local loopback access; a test JSON unknown-type error was corrected before final checks. Existing generated-library/cache-header warnings remain. |
| 15. Worker dry-runs | Main and classroom/control PASS, both exit 0, `--dry-run` only. |
| 16. Remaining technical blockers | **None among the three authorized items.** Browser certification is Chrome emulation with a real policy-blocked official player, not physical iPhone/Safari or all-browser certification. |
| 17. Remaining operational gates | Demi chooses/saves actual teaching availability; existing production synthetic student completes legitimate normal login/onboarding; production Join Class/media/End acceptance after separately authorized release and smoke testing. No fabricated availability, D1 password edits or onboarding bypasses. |

## Exact source changes in this pass

- `lib/classroom/teaching/policy.ts`: narrow YouTube validation HTTP status/message only.
- `lib/classroom/teaching/service.test.ts`: failing-then-passing HTTP/state-preservation regression and supported URL cases.
- `components/classroom/teaching/YoutubeStage.tsx`: clarify the observed direct-video-Play requirement in the recovery prompt only.

These were synchronized to the shared checkout with original-file hash guards. No migration, scoring, mastery, homework, evidence/provenance or admission/security contract changed. Production migration 0037 remains unapplied. The previous production-copy migration/preservation result remains valid because the schema did not change.

## Browser method and evidence boundaries

The proxy was bound only to 127.0.0.1 and forwarded to the actual built local app, preserving its configured local origin at the upstream boundary. It changed only the response policy for the browser rehearsal; it is not shipped. Genuine browser permissions-policy denial is a documented source of YouTube's `onAutoplayBlocked` event: [official YouTube API](https://developers.google.com/youtube/iframe_api_reference#onAutoplayBlocked), [Chrome permissions policy](https://developer.chrome.com/docs/privacy-security/permissions-policy).

The first synthetic class exercised native media/mobile/activities; after ending it, the rebuilt final guidance was accepted in a short second synthetic class. There was no partial run misrepresented as complete. The development-provider room briefly remained visible immediately after END; a subsequent read showed no rooms. Terminal HFT state and cleared connections/screens were verified before cleanup was accepted. All three local Phase C synthetic classes are ENDED, development LiveKit has zero rooms, and app/control, synthetic-target server and autoplay-policy proxy were stopped. No real student's records were changed; no email/SMS, external messaging or Stripe action occurred. Classroom chat contained only explicitly synthetic QA messages.

Private evidence: `.wrangler/phase-c-release/2026-11-08/preflight/final-three-*.log`, `export-url-expiry-check.json`, and `/private/tmp/hft-phase-c-production-copy/` result JSON files. Private data/credentials are excluded from release documents and source inventory.

## Explicit decisions

**A. Frozen Phase C technically ready for controlled production deployment? YES.** Revision 2 passes the authorized technical gates. This is not deployment authorization.

**B. Invalid YouTube input handled without generic HTTP 500? YES.** Actual application route and actual instructor form verified.

**C. Autoplay-blocked recovery verified in an actual browser? YES.** Actual Chrome policy denial→official video Play→Rejoin→instructor pause/seek and normal reconnect; final built recovery prompt verified.

**D. Approximately 390px mobile Chat verified? YES.** Actual authenticated Chrome at 393px, YouTube/native/active activity. Physical-device soft-keyboard behavior is outside this emulation result.

**E. Before real-student operational clearance:** authorized release and production smoke testing, Demi's actual availability, normal existing test-student production login, and production Join/media/End acceptance. The earlier readiness report contains exact availability and normal-login steps. No real-student operational clearance is claimed.

**DO NOT DEPLOY.** No production configuration, migration or application release was performed by this task.
