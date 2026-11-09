# Phase C teaching tools Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans task-by-task; native in-session execution, one final fresh review. Track checkbox steps and evidence in the ledger.

**Goal:** Deliver the approved Phase C teaching panel, synchronized YouTube, polls/quizzes/written responses, private evidence/results and instructor-approved Academy follow-up/tasks locally.
**Architecture:** Add session-keyed teaching tables and guarded services around unchanged Phase B media/admission/terminal logic. Project public/student/instructor data explicitly; reuse existing DO per-actor snapshots with minimal composition. Evidence enters only future path drafts and never changes approved progression.
**Tech Stack:** Existing Next16/React19/TypeScript/OpenNext/Workers/D1, official YouTube IFrame API; no new runtime dependency.
**Spec:** `docs/superpowers/specs/2026-11-08-classroom-phase-c-design.md` (user approved).

## Global Constraints

Local only; no production D1/configuration/migrations/deployment, messages, Stripe, Lesson2, Chart Lab, R2, recording/community or assessment system. Preserve Phase B and its pending operational gates. Additional classroom text tasks are independent of mandatory lesson homework/mastery.

## Review Focus

- END racing a teaching write must fail closed without delaying provider revocation.
- Student HTTP/WS/reconnect payloads must contain neither keys/private notes nor other students’ answers.
- Context-only/negative/poll/observation evidence must not become positive competency by fallback.
- Concurrent response/approval retries must not duplicate evidence/tasks or publish an unapproved draft.
- Returning from YouTube or reconnect must retain valid screen slots and restore only a currently authorized presenter.

### Task 1: Isolated baseline + contracts/policy

Files: new `lib/classroom/teaching/contracts.ts`, `policy.ts`, `policy.test.ts`; local migration `migrations/0037_classroom_teaching.sql`.
Interfaces: `normalizeYoutubeUrl(value): string`, `youtubePosition(state,now):number`, `validateActivity(value):ActivityDefinition`, `scoreActivity(def,answer):boolean|null`, explicit safe DTOs.
- [ ] Establish isolated local worktree, overlay exact489 baseline files, guard hashes, run509 baseline tests. No production credentials copied.
- [ ] Write failing policy tests: allowlisted YouTube URLs/IDs; foreign URLs/HTML rejected; anchor position/play/pause/seek; exact-set single/multi/true-false scoring; duplicate/foreign option IDs; written/polls returnnull.
- [ ] Run RED, implement contracts/policy and additive schema; run GREEN. Defaults: max8 options,2000-char prompt,5000-char written response; timestamps server-owned; manual close or1–3600 seconds; one response unless explicit revisions.
- [ ] Ledger verified contract/schema boundaries; no existing data alteration.

### Task 2: Guarded teaching service + privacy

Files: new `access.ts`, `service.ts`, `projection.ts`, `context.ts`, service/projection tests.
Interfaces: `teachingView(db,actorId,sid)`, `instructorTeachingView(db,actorId,sid)`, `teachingCommand(db,actorId,sid,input)`, `teachingContext(db,actorId,sid)`.
- [ ] Write RED integration tests against local SQLite: host-only launch/notes, role/roster/lifecycle/lease denial, immutable launch snapshot, run/deadline/duplicate rules, all scoring types, instructor-only results, student own responses only.
- [ ] Implement bank/context/notes, guarded/idempotent launch/response/close/review/observation and YouTube/stage commands. Aggregate hidden by default. Feedback receipts default; optional correctness only after close. No key in student projection.
- [ ] Add RED→GREEN END/concurrency tests: all live writes query Phase B LIVE/room revision in write guard; stale revision409; close runs lazily on END without changing Phase B state. Post-END instructor review remains allowed.
- [ ] Run policy/service/Phase B focused tests and ledger results.

### Task 3: Evidence, private handoff and independent tasks

Files: new `evidence.ts`, `handoff.ts`, handoff tests; narrow changes to `lib/learning-path/{contracts,source,engine}.ts` and tests.
Interfaces: `prepareHandoff(db,actorId,sid)`, `approveFollowup(db,actorId,sid,input)`, `studentFollowups(db,studentId)`, `followupCommand(...)`, `readLiveEvidence(db,studentId)`.
- [ ] RED tests for summary from durable attendance/runs, missing≠incorrect, group isolation, instructor-authored observation, provenance mapping, no publication before approval, immutable approved versions and explicit task review/resubmission.
- [ ] Implement deterministic private summaries and per-student draft/approval/edit decisions, reviewed evidence staging, Academy eligibility-checked links and independent text tasks. Approval never marks lesson/path/homework/mastery.
- [ ] RED→GREEN path collector tests for approved live evidence sources and strict context-only exclusion; assert current approved path/assignment IDs unchanged.
- [ ] Run backend/full regressions; ledger boundary decisions.

### Task 4: API and existing realtime composition

Files: new classroom teaching/instructor/follow-up routes; minimal edits to `workers/classroom/src/index.ts`, existing main classroom route and classroom contracts; route/realtime tests.
- [ ] RED tests for actual route auth/origin/type/body limits, unknown student/foreign run denial, role-specific payload allowlists and WS teaching dispatch.
- [ ] Add authenticated teaching endpoints and teaching snapshot composition. Broadcast only safe actor views; private panel separately authorized. No provider credentials/keys in snapshot/history.
- [ ] Add END-close/handoff recoverable hook after existing terminal commit without making END security depend on Phase C completion.
- [ ] Run all Phase B terminal/provider/route/WS regressions. Ledger unchanged media/security semantics.

### Task 5: Instructor/student/Academy UI + YouTube

Files: new components under `components/classroom/teaching/`, minimal `Classroom.tsx`/CSS/media-stage edits; new Academy After-class component and task route/page; UI tests.
- [ ] RED rendering/presentation tests for private panel, safe student options/receipts, group aggregates, playback anchors/stage restoration, mobile Stage/Chat/Activity and keyboard controls.
- [ ] Build teacher command-center context/guide/notes, quick-launch authoring, results/review, after-class edit/approve and observation controls. Keep existing microphone/camera/share/participants/hands/chat/END controls.
- [ ] Implement official IFrame player with origin, playsinline, autoplay/error/buffering/rejoin handling. Never unmount LiveKit screen publishers when changing teaching stage.
- [ ] Build student poll/quiz/written response forms and approved own follow-up/tasks, text submission/review status; expose only eligible Academy links.
- [ ] Run UI/backend focused tests and ledger defaults/limitations.

### Task 6: Local/browser/final review and scoped integration

Files: local QA fixture/harness outside release source; `docs/classroom-phase-c-local-report.md`, owned-file hash inventory, ledger.
- [ ] Run Phase C focused and all Phase B/END/provider, Phase A, Lifecycle and Academy regressions, full suite, clean-source TypeScript, OpenNext and app/control dry-runs locally.
- [ ] Use actual local authenticated instructor/two students and390px Chrome: context/notes, YouTube play/pause/seek/return/chat, poll/quiz/written/results, privacy, END, handoff approval and task submit/review. No production login/credentials/data used.
- [ ] Fresh independent whole-change review, fix important findings with RED→GREEN and rerun justified checks. Document actual external-player limitations.
- [ ] Hash-guard integrate only owned changes into shared dirty root, preserve unrelated work/frozen artifacts; rerun appropriate shared checks. Report27 requested items/A–E honestly. No deploy.

## Execution ledger

- Design approved by user; builder check: nothing important left.
- Baseline: deployed frozen Phase B489 source files,509 tests; current production operational gates remain pending.
- Task1: isolated489-file frozen overlay established; baseline509/509. Policy tests observed RED (missing module) → GREEN; additive local0037 only, no production access.
- Task2: service/privacy/END/account-roster-lease race tests RED→GREEN. Commit-time SQLite authority and independent teaching revision guard; student payload allowlists exclude keys, notes and classmates' answers.
- Task3: handoff/task/evidence tests RED→GREEN. Only reviewed positive evidence may qualify in future path drafts; no approved path/mastery/Academy assignment mutation.
- Task4: authenticated HTTP teaching/follow-up routes and safe DO composition added; same-origin/JSON/body validation tests pass. END teaching close is recoverable and cannot block Phase B terminal authority.
- Task5: instructor/student/Academy UI and official YouTube API composed with native media kept mounted; browser verification in progress.
- Final: fixed mobile YouTube/END access — mobile Stage/END view regression RED→GREEN.
- Final: fixed missing private versioned guide editing — guide history regression RED→GREEN.
- Final: fixed transient handoff basis — immutable handoff/approval evidence binding regression RED→GREEN.
- Final: Ruling: reviewer’s follow-up form default issue regraded Important — a feedback-only edit could silently remove an existing task/link; preserve every field — cost if wrong: unintended student work changes. Regression RED→GREEN.
- Final: Ruling: source review declined actual provider/browser/production judgments — browser acceptance and local builds are separate required evidence; production compatibility/readiness is not inferred from local tests — cost if wrong: premature release clearance.
- Browser acceptance: actual local main/control Workers, instructor + Student A + Student B; YouTube official demo playback/pause/seek/rejoin, 390px Stage/Chat/Activity, poll/quiz/written response, private live results, bank save, private note/guide, observation, End Class, approved Academy follow-up, eligible Lesson1 link, independent task submission and instructor review exercised.
- Browser-discovered fix: existing Phase B END cleanup effect repeatedly replaced an already-off media object and froze the page. Added clearedMediaState identity regression RED→GREEN; repeated fresh actual LIVE→ENDED transition succeeded, after-class page remained responsive. Provider/admission/revocation logic unchanged.
- Actual HTTP privacy checks:15/15; post-END/approved task/ownership checks12/12. Local FK violations0; mandatory homework submissions0, lesson progress0, path versions0; only original two local course assignments remain.
- Final: Ruling: TypeScript verification uses a complete clean source-only copy plus generated Next route types to avoid recursively checking generated standalone vendor bundles — application source remains fully checked and OpenNext performs its own type check — cost if wrong: a generated bundle-only typing issue could be omitted; the production-equivalent build separately covers bundling.
- Final: Ruling: retain the isolated local branch/workspace and integrate only hash-guarded owned files into the existing dirty shared checkout, as authorized by this plan; do not merge the old Git HEAD baseline or push — cost if wrong: source remains uncommitted in the shared checkout, with the scoped inventory as its review boundary.
- Deferred minors: none; the reviewer’s form-default issue was regraded Important and fixed because it could remove assigned work.
