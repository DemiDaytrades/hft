# Instructor Academy + student preview implementation

Authorized design: attached HFT scope b77ae556. Local only; preserve dirty tree. No deployments, persistent student-data changes, provider calls, Lesson2, financial logic or intake-contract edits. Use existing admin role (no new staff role/permission model).

Ruling: implement native in this working tree; the user's detailed implementation scope is the design authority. Use existing student renderer with explicit browser-only simulation transport, never impersonation/cookies or real mutation actions. Real student view is a server-authorized read-only projection with no review controls. Retain existing editing/review pages separately; preview provides no mutation links. No schema changes needed.

- [x] Read existing Academy, mastery, assignments, paths, lifecycle, entitlement and Next docs.
- [x] Tests first: fresh staff authorization, full ordered catalog/draft readiness, protected inspection/keys, student selection, accurate denied/prerequisite/homework/review states, own-vs-foreign privacy, approved path safe DTO, former history and zero database writes.
- [x] Read-only instructor service + GET-only API. Explicit metadata/DTO selection; no financial/private placement fields. Reuse existing Lesson1 gates/state projection, not a duplicate scoring/progress system.
- [x] Browser-only simulation reducer + tests; reuse InteractiveLessonPlayer via explicit simulation mode. Simulation resets/scenarios do not persist or request real endpoints. Actual-student player is inert/read-only.
- [x] Ordered instructor home, complete lesson inspection, prominent preview action, student selector/read-only timeline and summaries; responsive bounded containers. No fake curriculum or classroom controls.
- [x] Focused/regression/full suite, TypeScript, independent final review, final22-item report and authenticated browser procedure.

Review focus: role spoof/deactivated staff; raw answer keys sent to normal student; preview transport accidentally fetches; actual student controls/navigation escape readonly; stale completed flags; paid/comp/deactivated/unassigned/unpublished lock accuracy; source/private financial fields projected; no reads that create records; no mutations on GET; preserve prior security checks.

Future integration: add live teaching session entry from instructor lesson header once a separate authorized classroom phase exists. Keep classroom/session state independent of persisted curriculum and student evidence. No dead buttons now.

Verification: focused8/8; full257 tests/256pass with unchanged known availability overlapfailure; TypeScript exit0. Review history-visibility finding corrected and independently re-reviewed. Browser harness compiled/server stopped: no browser available, manual authenticated/responsive procedure in docs/instructor-academy-implementation-report.md. No migrations, deployment or persistent data changes.
