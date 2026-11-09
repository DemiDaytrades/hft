# Phase C teaching tools and instructor panel — local design

## Authority and safety

Spec: user's Phase C controlled local implementation brief, `/Users/demi/.codex/attachments/617a5105-9468-48a8-9d3a-500eed7f52b4/Pasted text.txt`. User confirmed **additional approved classroom text tasks inside Academy**, separate from mandatory lesson/mastery requirements.

Local implementation only. No deploy, remote D1/migrations/configuration, real accounts/students, messages, Stripe, Lesson2, Chart Lab, recording/replay/community, R2 uploads, full stage assessments or retake workflow. Phase B production webhook is verified; positive test-student Join and real teaching availability remain operational gates and must not be marked complete.

## Approaches and recommendation

The user's preservation requirement selects an additive layer on Phase B. Keep its admission, grants, screen leases, media adapter, chat/hands/attendance, revision controls and terminal strict revocation. Add session-keyed teaching records and compose role-specific teaching views through the existing server/DO. A second realtime authority or putting private teaching state into a shared public room payload would conflict with that requirement and is excluded.

For homework, the user chose additional classroom tasks rather than only linking existing lesson homework. These tasks get their own approval/submission history and Academy section; they never create or satisfy a legacy lesson attempt/homework/mastery gate.

## Existing integration points

- Classroom snapshots/commands: `lib/classroom/`; control DO in `workers/classroom/src/index.ts`; current DO already renders snapshots per authenticated actor.
- Lesson1 has approved purpose, stage, concepts, step outline and remediation content. No separate teacher guide schema exists. Derive only factual context from those existing fields; empty guide sections remain explicitly unset until instructor edits them.
- Learning-path contracts name live quiz/written/chart evidence, but `captureEducationalSource()` currently collects only existing Academy evidence. The new collector must actually load eligible reviewed live evidence, preserve provenance and keep prior approved path versions unchanged.
- Existing Academy homework is linked to reviewed lesson attempts. Do not reuse those rows for additional classroom tasks.

## State, authorization and persistence

One additive local migration after0036 (proposed0037) creates session teaching/context, immutable activity versions/runs, responses/revisions, review/observation records, evidence records, handoff versions, per-student follow-up/task/submission history and audit/idempotency metadata. Final table grouping is an implementation choice; no existing table rewrites or destructive operations.

Every command uses authenticated server identity, assigned instructor/roster, active lifecycle/entitlement and current session eligibility. Reuse shared checks through a narrow extracted helper if necessary without altering their semantics. Instructor panel, bank authoring, keys/rubrics/results/notes and handoff are assigned-instructor-only, including after END. Student access is always self-scoped; caller-supplied student IDs never grant authority.

Live launch/control/submission requires Phase B LIVE and a current valid connection lease. Persist with database guards against the current Phase B room revision/state and teaching revision. Guard account/lifecycle, roster and activity deadline inside the write, not only before an await. The DO serializes teaching messages on its existing queue; HTTP commands use the same guarded service. Idempotency keys bind actor/action/body. Cross-session run IDs and mismatched answer payloads fail.

Never make Phase B terminal state depend on Phase C cleanup. END immediately blocks all live teaching writes even if the teaching close/handoff hook fails. Outstanding runs become closed as of END; preparation is idempotent/recoverable from saved activity/attendance history. After-END review/approval/follow-up operations are separate from prohibited live commands.

## Privacy and realtime

Keep instructor-only APIs separate from public snapshots. Explicit projection functions produce instructor view, student live view and student approved follow-up. Private payloads never enter shared room state/events, provider metadata, URLs or client bundles. Instructor components receive private data only after server authorization.

Extend the existing actor-specific DO snapshot with sanitized live teaching state: stage source, safe active prompt/options, own receipt/permitted feedback, and aggregate results only when enabled. The instructor panel fetches its private context/results independently; private full-class analytics are not broadcast to students. HTTP snapshot recovery follows the same projection. END closes live sockets as today; approved after-class content loads through private authenticated HTTP/Academy routes.

## Instructor teaching panel

Single classroom command-center panel: Today’s Class, Teaching Guide, Notes, Live Results and After Class. Read session/group, selected approved published lesson/topic, stage/module, planned duration from schedule, prior eligible lesson/homework state and approved educational path/weak concepts. No Financial Readiness/intake financial fields are queried or rendered.

Use existing approved lesson purpose/concepts/step headings as factual starter content. Instructor can save versioned private objectives/outline/examples/demonstrations/misconceptions/questions/wrap-up and per-session notes. No generated instructional claims or invented authored Lesson2 content. Ad-hoc topic has explicit instructor mapping or shows unmapped/missing evidence; it must not fabricate an approved curriculum link.

## YouTube and stage model

Official YouTube IFrame API, no download/rehosting/Data API key. Normalize allowlisted youtube.com/youtu.be/nocookie embed URLs to an11-character video ID; reject arbitrary hosts, HTML, playlists-only URLs and malformed IDs. Store video ID, position, playing/paused, server timestamp, teaching revision and prior Phase B presentation selection. Only assigned instructor controls it.

Approximate position from server anchor plus elapsed time while playing. Late joins/reconnects rehydrate from current anchor; pause/seek/revision changes reconcile older messages. Student playback never issues instructor commands. Show click-to-enable playback, buffering/unavailable state and Rejoin instructor position; errors do not blank chat or destroy media. Use explicit origin/enablejsapi/playsinline; preserve YouTube player minimum dimensions at390px.

Stage source is an overlay on unchanged Phase B stage/grants: INSTRUCTOR_CAMERA, SCREEN_SHARE/PRESENTER_SCREEN or YOUTUBE. YouTube does not disconnect LiveKit or surrender active screen slots. Return restores the last valid instructor/presenter selection, falling back to instructor if a presenter was demoted/disconnected. Natural video end offers/executes instructor-side return without making a video mandatory. Student player events cannot change class stage.

## Activity bank, runs and responses

Reusable activity definitions may link to an existing lesson; ad-hoc creation is supported. Versioned immutable launch snapshot includes prompt/options/key or private rubric, kind, stage/domain/concept mapping, evaluation method, author/version, launchedAt, explicit closing rule, feedback/aggregate visibility and allow-revision setting. Only the launched snapshot determines scoring, never a later bank edit. One current activity is shown to students; launching another closes/replaces the previous run explicitly.

Poll: unscored opinion/confidence/prediction, response count/option counts private by default; instructor may reveal aggregate-only results. No names/individual opinion feedback to group. Poll evidence is participation/context, never competency proof.

Quiz: single-select, multi-select and true/false. Validate option IDs, exact required cardinality and no duplicate IDs. Deterministic exact-match/set-equality scoring, no unsupported partial-credit formula. One accepted answer/student/run unless the launch explicitly allows revisions; preserve revision history and grade the latest accepted answer before close. Same idempotency key/body replays own receipt; a conflicting replay/duplicate is rejected.

Written: bounded plain text, default instructor-review-required, no automatic correctness. Assigned instructor marks APPROVE or NEEDS_REINFORCEMENT and adds feedback, retaining review history. A rubric may be stored privately but this phase does not add an automatic written-answer grader.

Default student feedback is Answer received. Optional post-close correctness and approved concise feedback contain no answer key/rubric. Instructor sees participation, option counts, per-student answer/correctness/review state and mapping. Closed/missing/deactivated/removed students cannot submit or use a stale run/lease. Manual/timed closure uses server time; ties at deadline are closed.

## Evidence and observations

Persist per-student immutable source records: session/lesson/run/question version, response version, stage/domain/concept, evaluation method, result/review status, author/evaluator/time and approval provenance. Add only LIVE_CLASS_POLL and INSTRUCTOR_OBSERVATION source kinds where missing. Do not implement chart challenges; retain future mapping compatibility.

No live write calls learning-path generation/approval, lesson completion, homework approval or mastery/placement updates. Instructor observation is explicitly instructor-authored and retains its own result/status, never disguised as student self-report.

Extend evidence contracts minimally with structured optional provenance/result/context-only fields so negative, pending and poll evidence are not falsely treated as positive mastery. The source collector loads live evidence into a newly requested path draft only. Deterministically graded correct quiz results may carry concept knowledge; negative/unreviewed/poll/observational context stays non-qualifying unless a specific instructor review verifies a concept. Never emit whole-domain mastery from these events or reuse student self-report as instructor verification. Existing placement/domain-score formulas stay unchanged. Tests prove context-only records cannot raise competency and approved path IDs/assignments remain unchanged until the existing separate path approval workflow runs.

## After-class handoff and approved follow-up

After END, prepare a private versioned summary: topic/lesson, attendance/duration (unknown remains unknown), run participation/results, written review status, observations and provenance. Deterministic strengths are demonstrated results; development areas are observed incorrect/reinforcement results; missing/unreviewed evidence stays missing rather than zero. Do not invent competency thresholds. Recommendations are mapped review/practice/reinforcement/homework/practical-review suggestions, not automatic placements.

Handoff requires explicit assigned-instructor review. Edit, feedback, reinforcement, practical demonstration and No additional work are per-student decisions. APPROVE publishes an allowlisted immutable student projection and reviewed evidence references atomically. Private notes/rubrics/other students never copy automatically. Editing an approved follow-up creates a new draft/version; previous approved student content remains until the new version is approved. Responses that require instructor review cannot be silently promoted to verified evidence by approving an unrelated follow-up.

Academy receives a private After-class section/card for the signed-in student with only approved feedback/tasks and already-eligible lesson/remediation links. Check active entitlement, current course assignment, publication, prerequisite/mastery gates and follow-up ownership before showing/opening curriculum. No entitlement/course assignment/lesson unlock is created by handoff approval. Unavailable content is labeled, never bypassed.

Additional approved classroom tasks support text submission, instructor review/feedback, revision-needed/resubmission and immutable history. They are distinct from required Academy lesson assignments. Only explicit task review marks that task approved; no task/attendance automatically completes a lesson or awards mastery. The panel and Academy show only the student’s own task/results. No automatic email/SMS notification.

## UI and browser scope

Reuse HFT dark/orange styles, responsive teacher panel and large response tiles. Mobile approximately390px has Stage/Chat/Activity tabs; existing participant/hand controls remain accessible without instructor analytics. Screen shares stay mounted/authorized when YouTube or activity occupies the stage. Accessible keyboard/labels/live status and reduced-motion behavior where feedback animates.

Browser acceptance uses isolated local synthetic instructor/two students, including390px; no production cookies/data/state needed. Verify actual YouTube embed play/pause/seek/rejoin and autoplay fallback, poll/quiz/written/group privacy, private teacher notes/results, END and approved follow-up/task submission/review. If an external video is unavailable, report that limitation rather than fake a player success. Existing3-native-screen/provider acceptance is preserved; recheck only affected media transitions locally.

## Implementation boundaries and verification

Anticipated modules: `lib/classroom/teaching/{contracts,access,projection,service,youtube,activities,evidence,handoff,context}.ts`, dedicated tests; additive API routes under classroom teaching/instructor/self follow-up; instructor/student teaching components; minimal composition changes to `Classroom.tsx`, media stage and DO snapshot/dispatch; Academy After-class card/task route; narrow `learning-path/contracts.ts`, source collector and engine guard changes; migration0037. No new library required for the YouTube API.

Use an isolated local workspace based on frozen Phase B source, then hash-check only owned additions/changes back to the shared repository. Do not reset the shared dirty tree or change frozen Phase B release artifacts. Use local D1/migrations, synthetic QA data, delivery disabled and no production environment file/LiveKit key copied into it.

Required deterministic tests: YouTube validation/revisions/play-pause-seek/late join/reconnect/authority; poll response/revision/aggregates/privacy; every quiz kind/snapshot/scoring/deadlines/duplicates/cross-session; written review/no unsupported scoring; instructor-only context/notes; per-student provenance/observations/context-only engine guard; END races; handoff versions/approval/eligibility/task review; actual payload privacy across HTTP/WS/history. Run Phase C focused, Phase B/terminal/provider, Phase A, Lifecycle, Academy regressions, full suite, TypeScript, OpenNext, app/control Worker dry-runs and local authenticated browser acceptance. No deployment.

## Decisions left to builder

Exact table grouping, bounded text/option limits, sync drift tolerance, component splitting and rendering details may be settled without changing the product rules above; document those choices and test their boundaries. No AI scoring/summarization is required; this implementation is deterministic plus explicit instructor judgments. Missing authored content and missing educational mappings remain explicit.

## Status

User-approved requirement: additional independent classroom text tasks. Independent builder review completed with “nothing important left.” This written design is ready for user approval before product implementation, per the brainstorming skill gate.
