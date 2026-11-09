# Instructor Academy + View as Student — local implementation report

7 November 2026. Implemented in the existing working tree; prior work preserved. No deployment, production or persistent student-data changes, migrations, Stripe activity or message delivery. No Lesson 2 or Live Classroom implementation. Approved Intake V2 contracts and Financial / Trading Readiness logic are unchanged.

## 1. Existing systems reused

Existing admin authorization and fresh lifecycle/password/role checks; Academy courses/modules/lessons and canonical ordering; existing course assignments, lesson progress and eligible learning-path skips; interactive Lesson 1 content, student DTOs/player/question controls, knowledge checks, mastery, remediation, homework and instructor review; approved personalized learning-path student DTO; paid/complimentary entitlement predicates. No impersonation/session-switching system was added.

## 2. Files created/modified

Created:

- `lib/academy/instructor/service.ts`: authorized catalog, inspection, student selector and read-only student projection.
- `lib/academy/instructor/simulation.ts`: browser-memory simulation and explicit QA scenarios.
- `lib/academy/instructor/service.test.ts`, `simulation.test.ts`, `presentation.test.tsx`.
- `app/api/admin/academy-view/route.ts`: GET-only instructor API.
- `app/(app)/admin/academy/inspect/[lessonId]/page.tsx`.
- `app/(app)/admin/academy/preview/[lessonId]/page.tsx`.
- `app/(app)/admin/academy/student/page.tsx`.
- `components/academy/instructor/PreviewPlayer.tsx`, `StudentSelector.tsx`.
- `docs/superpowers/plans/2026-11-07-instructor-academy.md` and this report.

Modified:

- `app/(app)/admin/academy/page.tsx`: full ordered Instructor Academy home replacing the course-only listing; existing management links retained.
- `components/academy/learning/InteractiveLessonPlayer.tsx`: optional simulation and read-only modes; normal student behavior remains the default. Added explicit mode banners and bounded/wrapping container styles. All read-only write controls disabled; mutation function refuses execution; refresh and onward student links do not call/navigate to student endpoints in those modes.

All other existing dirty-tree work belongs to earlier phases and was preserved.

## 3. Instructor Academy architecture

`/admin/academy` is the entry point. Server pages require the existing admin role. The service independently rereads actor lifecycle/role/ban/password state before returning data. Catalog and inspection are separate from student progression. View as Student takes a target student ID only after staff authorization and never changes the authenticated identity.

The GET-only API exposes catalog, student selector, staff inspection or read-only student projection. Responses use `private, no-store`; no POST/PUT/PATCH/DELETE handler or preview server action exists. The existing authorized review/edit features remain separate from the read-only view.

## 4. Full-curriculum visibility

All persisted courses, modules and lessons appear in canonical course/module/lesson order, including drafts and unassigned curriculum. Course and module publication are shown separately from lesson publication. Lesson cards show actual interactive stage where authored, classification, publication, content readiness and missing-video notices.

READY means the existing teaching body/interactive sequence is present, not pedagogical approval or production certification. NEEDS CONTENT marks empty/obvious placeholder content; malformed interactive content is NOT AVAILABLE. No planning-document entries or fake lessons were inserted. If the selected database is empty, the page truthfully says so and explains that viewing does not seed curriculum.

## 5. Lesson inspection

`/admin/academy/inspect/<lessonId>` opens an existing lesson without assignments, payment or student progression. Lesson 1 inspection includes stage/purpose/concepts, ordered teaching steps, reveals, diagrams, knowledge checks and keys, mastery question banks and rubrics, remediation branches, homework branches/rubrics, and progression/review requirements. Video placeholders are explicitly labeled as lacking assets. Plain lessons reuse the existing content renderer and show any existing quizzes/questions/assignment rubrics.

Inspection has prominent PREVIEW AS STUDENT and existing lesson-edit links. It does not create attempts or progress.

## 6. Preview as Student

`/admin/academy/preview/<lessonId>` uses the actual student player for an interactive lesson. Quick diagnostics, reveals, choice/matching/ordering inputs, step progression, draft knowledge checks, pending review, reinforcement, homework and completion presentation can be inspected.

Simulation controls are conspicuously separate from the student presentation. They load start, interactions-complete, pending-review, remediation, reviewed homework and completed scenarios, plus the real strong/barter/currency/broad homework branches. Loaded outcomes are explicitly illustrative, never actual grades or mastery. Reset/refresh/leaving discard browser state. Plain content uses the existing renderer with no completion form.

The pure simulation module imports no database, auth, network, storage or providers. Its actions stay in React memory. Player action/refresh branches exit before any real endpoint request. No instructor progress, student attempts, homework, mastery, unlocks or messages are recorded.

## 7. View as Student

`/admin/academy/student?studentId=<id>&lessonId=<optional-id>` shows the selected student's current entitlement/lifecycle denial, approved public placement/path (or legacy public level), focus, current stage/lesson, stage and assigned-curriculum progress, next available lesson, concept mastery signals, homework status, remediation and review counts, and ordered curriculum availability.

A selected interactive lesson uses the real student presentation with disabled write controls. It shows recorded attempts/homework/feedback already suitable for the student, without keys or private placement rationale. Assigned published lessons can be examined; retained work remains inspectable even after unassignment/unpublication. Historical visibility does not restore current access, and the lock/deactivated banner remains explicit.

## 8. Read-only safety

This is a projection, not account impersonation. No session cookie, user identity or membership state is changed. New server service functions perform SELECTs only. Tests compare every database table before and after catalog/inspection/student projection reads.

The real-student player disables inputs, submit/save/complete/remediation/refresh controls; its action handler returns immediately in read-only mode. It does not expose outbound student lesson navigation. Local step/reveal navigation remains available to inspect already recorded presentation. No password, profile, invitation, entitlement, assignment, path approval, financial-plan generation or communication controls are added to this view.

## 9. Student selector and lifecycle

Selector uses only appropriate existing student-role accounts, grouped as ACTIVE STUDENTS and FORMER / DEACTIVATED STUDENTS. It includes name/email for staff identification and excludes credential/provider/financial fields.

Former students show a clear historical-view banner and ACCESS DENIED — student deactivated. All lessons remain currently locked and there is no next available lesson. Historical review does not reactivate or grant an entitlement. Active accounts without valid paid/complimentary entitlement are denied; forced-password and banned states are also distinguished. Disabled or demoted staff cannot use stale privileges to inspect content.

## 10. Learning-path visualization

The existing current approved student-safe path appears as an ordered vertical sequence, with required-core, placement-eligible, remediation, optional and instructor-assigned classifications, assigned actions, available/completed/selected/upcoming states, and current lock reasons. Planned items are separately labeled PLANNED / NOT AVAILABLE. No draft, source snapshots, internal score implementation, raw conflicts or private instructor notes are projected. Viewing never generates or approves a recommendation or changes an assignment.

## 11. Lesson 1 visual/UX changes

Preserved the existing teaching content, interactions, mastery and review policy. Reused its modern dark/orange player rather than redesigning it. Changes are mode banners, explicit simulation controls, read-only disabled states, bounded wrapping containers and prevention of student onward navigation while inspecting. No novel animations, fake games or new lesson content.

## 12. Answer-key/rubric security

Only staff inspection and staff generic simulation receive the full interactive document. Normal student APIs/page props still use the existing stripped student DTOs. The new simulation module contains no imported question bank/content constants; the full document is supplied only by an authorized instructor server page. A student cannot obtain instructor data by selecting a target ID or spoofing an admin session role: fresh database authorization applies in the DAL and service.

The actual-student projection discards instructor review keys/rubrics and returns only the existing student presentation plus public learning-path content. No financial-plan source, balance, debt, income, readiness reasoning or private placement notes are queried for this feature. Normal Academy authorization and Lesson 1 completion/mastery services were not relaxed.

## 13. Responsive behavior

Layouts use wrapping actions and selectors, constrained widths, `min-w-0`, breakpoint-based summary columns, and a vertical learning path. The existing player keeps its mobile horizontal step-navigation scroller and desktop side navigation. Controls are clickable/focusable; none require hover. Long text is allowed to wrap; inspection details expand vertically.

Server-rendered presentation checks passed. Pixel-level viewport inspection was not completed: a disposable React/esbuild/Tailwind preview compiled and a temporary loopback server started, but the computer-use environment reported no available browsers (in-app browser unavailable, browser inventory empty). The server was stopped. This harness used no database, session, real student or external service. Desktop/tablet/mobile visual acceptance remains in the manual procedure below; no screenshot-based responsiveness claim is made.

## 14. Future Live Classroom integration point

The instructor lesson header and existing course/module hierarchy provide the future entry point for a separately authorized teaching-session workflow. A future classroom/session service should be independent of curriculum and consume the existing versioned competency/evidence contracts. No Teach Live/Start Class/share-screen/poll buttons or fake classroom features were added. Attendance, live results, chart review queues and student presence are future work.

## 15. Focused tests

Command:

`node --require ./scripts/test-register.cjs --test lib/academy/instructor/*.test.ts lib/academy/instructor/*.test.tsx`

**8 passed, 0 failed.** Covers:

- Full draft/published curriculum and inspection keys without instructor progression; metadata catalog excludes raw banks.
- Students denied instructor inspection, role-spoofed API calls rejected, forced-password/deactivated staff denied.
- Own target selection, assigned student view, public approved path/private sentinel exclusion, entitlement/lifecycle denial and zero-write table snapshots.
- First unmet prerequisites, pending instructor review, homework approval, stale completed flags and no false unlock.
- Retained work after unassignment/unpublication for a former student, with denied current access and inert recorded presentation.
- Pure local simulation interactions, assessment submission/pending review, branch scenarios and no network calls.
- Rendered real-student presentation disables write buttons, strips keys/rubrics and removes outbound student lesson navigation; simulation is clearly labeled.

## 16. Regression results

The full suite includes existing Academy security, Lesson 1/mastery, personalized learning paths, lifecycle, financial plans and approved Intake V2 tests. They continue passing. No tests weakened. The only full-suite failure is the known availability-overlap failure described below.

A fresh independent review found retained history was hidden when current assignment/publication disappeared. The projection and UI were corrected and regression coverage added. Follow-up review confirmed the correction and found no remaining important/critical blockers in the reviewed scope.

## 17. Full-suite results

`npm test`: **257 tests; 256 passed, 1 failed**.

Unchanged known failure: `lib/availability.test.ts`, “overlaps detects intersecting slots”; `RangeError: Invalid time value` in `lib/availability.ts` date arithmetic for the test's time-only input. This phase does not modify availability code/tests.

## 18. TypeScript

`node --max-old-space-size=8192 node_modules/typescript/bin/tsc --noEmit --incremental false`: **PASS, exit 0**.

## 19. Migrations

**None required or created.** No migration applied to persistent local or production data. Disposable in-memory test databases load the existing migration chain to verify compatibility.

## 20. Manual authenticated browser verification procedure

Use an isolated local development environment with the prior schema already applied and existing local-only admin/student fixtures. Disable outbound providers. This procedure is not authorization to alter production or real student data.

1. Sign in as an authorized local admin and open `/admin/academy`. Verify course/module/lesson ordering, truthful published/draft/content/video states, and empty-database behavior where applicable. An instructor with no assignments/progress must still inspect every existing persisted lesson.
2. Open Lesson 1 inspection. Expand teaching steps, checks, question banks/mastery rubrics, remediation and every homework branch. Confirm the real content is coherent and keys/rubrics are confined to this staff view.
3. Click PREVIEW AS STUDENT. Confirm the STUDENT PREVIEW/simulation banners. Interact with diagnostics, reveals and matching/ordering controls; advance through all steps. Start/save/submit a simulated knowledge check; it should await simulated instructor review. No `/api/academy/learning` request should appear in browser network activity.
4. Use explicitly labeled simulation controls to inspect pending review, remediation, every homework branch and completion. Reset and refresh: nothing should persist. Compare database counts/snapshots for attempts, progress, learning events and submissions before/after; they must be unchanged.
5. Select an existing local active student. Check public placement/path, stage/lesson/progress, actual assignments, mastered concepts, homework/review/remediation, planned items and next available lesson. Compare against that student's normal session in a separate browser profile without changing either session identity.
6. Inspect recorded lesson presentation. Try every answer/homework/save/submit/remediate/complete control: all writes must be disabled. Step/reveal inspection may change only local display. There must be no student mutation request, review approval action or navigation that pretends the admin is the target student.
7. Verify known fixtures for unassigned, unpublished, prerequisite-incomplete, review-pending and homework-pending states. Verify expired/revoked entitlement and forced-password setup denial. Existing valid complimentary and paid entitlements should behave identically for Academy access.
8. Select a former student. Confirm FORMER / DEACTIVATED, current access denial, no next available lesson, and retained work visibility. A fixture with withdrawn assignment/draft lesson and existing work should retain read-only history without granting access.
9. Sign in as a local student: instructor pages must redirect/deny; instructor API must return 403 even when the query names another student or requests lesson keys. Normal student responses/bundle props must still exclude raw keys/rubrics/private placement/financial content.
10. Repeat at approximately 1440px desktop, 1024px laptop, 768px tablet and 390px mobile. Verify no page-level horizontal scroll; step navigation may scroll within its own container. Check selectors, expanded rubrics, long feedback, inputs, ordering buttons, touch targets and keyboard focus. Test every simulation branch at mobile width.
11. Recheck normal student Lesson 1 flow: actual mastery still needs complete interactions, reviewed 80% knowledge + required concepts, current approved homework, and valid entitlement/assignment/lifecycle. Generic preview must not unlock anything for either account.

## 21. Remaining limitations

- Authenticated/pixel-level browser acceptance remains unexecuted because no browser was available in this environment. Automated service, simulation and rendered-control checks passed.
- Generic simulation reproduces the student presentation and key interaction validation, but instructor approvals/outcomes are explicitly loaded sample states, not a second persistent grading system. It is not proof of real instructor review or production lifecycle behavior.
- Student view is a reloadable snapshot rather than live presence; no automatic polling, notifications or classroom features.
- Historical interactive presentation is based on the currently authored lesson document and its existing version-aware evidence service. It does not reconstruct arbitrary old teaching-document revisions that are no longer stored as lesson content. Existing attempt snapshots/history remain retained in the underlying system.
- Full-curriculum projection performs multiple reads per lesson; suitable for the current small catalog. A much larger future catalog should batch/paginate evidence reads while retaining the same authorization boundary.
- Readiness is a content-presence signal, not instructor approval that every future authored lesson is complete or pedagogically ready.
- No Lesson 2+, missing future content, new educational formulas or financial-plan logic was introduced.

## 22. Controlled-use readiness / prerequisites

Ready for controlled local instructor acceptance with automated checks passing. Before any controlled real-student use, complete the authenticated browser and responsive procedure on an isolated local/staging environment, verify expected existing schema/catalog, fresh admin permissions, correct entitlement/lifecycle fixtures and absence of provider side effects. The known availability failure remains a separate issue if scheduling is part of that trial.

No deployment or production/student-data mutation occurred. Stop point reached for this phase.

## Browser acceptance navigation correction

Course/module/lesson titles were plain text, and the existing module-management lesson list offered only Edit. Corrected titles to native keyboard-focusable anchors; added direct Inspect lesson / Preview as student actions in the module lesson list and existing lesson editor. Existing admin authorization and student progression rules are unchanged.

A new actual-page render regression first failed on the missing HFT Trading Foundations title link, then passed through home → course → module lessons → Lesson 1 inspection → student preview. GET rendering leaves the in-memory database unchanged. Relevant focused security, mastery, learning-path, lifecycle and instructor navigation checks: 46 passed; TypeScript exit 0.

Chrome verification used the actual rendered page components with disposable in-memory fixtures on a temporary localhost-only navigation harness, not a production account or persistent database. Course and module links were clicked; Lesson 1 was focused by Tab and opened with Enter; PREVIEW AS STUDENT reached the expected labeled preview. This validates native navigation; the fixture harness does not claim a complete authenticated Next.js session/hydration test or touch-device test. Native anchors with visible focus rings and 44px minimum title-link targets support mouse/touch/keyboard. The harness was stopped afterward.

The browser tab inspected at the start was `highfrequency.vip`, serving the earlier deployed management UI. This local fix is not deployed there. Use the locally running development app at its displayed localhost URL to test current repository changes.

Browser path in the local app: `/admin/academy` → **HFT Trading Foundations** → desired module title (or **Manage Lessons**) → **What Is Money?** (or **Inspect lesson**) → **PREVIEW AS STUDENT**. On the expanded curriculum home, Lesson 1 also has direct Inspect/Preview links. IDs/titles depend on the actual local persisted curriculum; no records were seeded into the user's persistent local or production database during this fix.
