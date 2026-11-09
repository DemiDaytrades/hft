# Class 1 experience redesign — local verification

Approved design: `docs/superpowers/specs/2026-11-08-class-one-experience-redesign-design.md`.
Implementation workspace: `/private/tmp/hft-master-curriculum-local`. Completed source copied into the repository using original baseline hash guards. Local date: November 8, 2026 (America/Chicago).

**Local verification complete. Nothing deployed. No production resources/data, real students, messages or transactions were touched. No new migration or progress reset.**

## 1. Files changed

13 scoped implementation/test/authoring-standard files below, plus the design, implementation plan, this report and scoped hash inventory. No environment files, credentials, local databases, generated artifacts, dependencies, production configuration or unrelated checkout changes were copied.

- `lib/academy/school/presentation.ts`
- `lib/academy/school/presentation.test.ts`
- `lib/academy/school/roadmap.ts`
- `lib/academy/school/roadmap.test.ts`
- `lib/academy/school/experience-ui.test.tsx`
- `components/academy/school/SectionExperience.tsx`
- `components/academy/school/ExperienceVisual.tsx`
- `components/academy/school/SchoolRoadmap.tsx`
- `components/academy/school/SchoolPlayer.tsx`
- `components/academy/school/StudyGuide.tsx`
- `components/academy/school/school.css`
- `app/(app)/academy/school/page.tsx`
- `docs/academy/class-authoring-standard.md`

## 2. Visual assets created

Ten original code-native teaching compositions, built from twelve original SVG symbols (goods, repair tools, food, payment/balance tools, time and people): dinner offers; barter mismatch; carpenter/payment/grocery bridge; two-way goods/payment exchange; common-price scale; Friday–Tuesday timeline; illustrated $100 note and acceptance chain; balance/payment-tool comparison; stepped economic flow; three-action synthesis. Meaning is conveyed by labels and captions; decorative SVGs are hidden from assistive technology. No stock photography, copied third-party graphics, image service or new package.

## 3. Interaction types

Scenario decisions; prediction before reveal; native radio response tiles; multi-select payment comparison; keyboard/tap-select matching with repeated categories; step-through exchange/payment flow; short written self-explanation; expandable deeper reading and live discussion prompts. Existing saved concept checks remain separately server-authoritative. New exploration is expressly ungraded and unsaved, cannot award evidence and does not become a new completion requirement.

## 4. Section-by-section redesign

| Section | Experience |
| --- | --- |
| 1. World without money | Dinner tonight; choose eggs, time or repair skills and receive a plausible counterparty consequence before the concept is revealed. |
| 2. Direct barter | Have/need illustration; predict whether eggs obtain shoes when the shoemaker wants bread; respectful retry, then mismatch and double-coincidence explanation. |
| 3. What money solves | Step through carpenter → customer payment → separate grocery purchase; explain why the grocer need not want carpentry. |
| 4. Medium of exchange | Goods/payment travel in opposite directions; identify the role of paying. |
| 5. Unit of account | Bread $4 / eggs $5 / milk $4; compare using a common measure. |
| 6. Store of value | Friday earnings → Tuesday spending, with nominal amount/purchasing-power distinction; four-action function sort allows repeated exchange category. |
| 7. Acceptance | Predict why a $100 note functions before the confidence/acceptance chain is revealed. |
| 8. Beyond cash | Select cash, balances, debit and digital payments while distinguishing monetary balance, payment tool and credit obligation. |
| 9. Economy flow | Follow possible wage/purchase/supplier payments; predict next uses without assuming deterministic physical-dollar paths or guaranteed profit. |
| 10. Synthesis | Sort compare/pay/keep actions in one carpenter/groceries story, then explain in your words before comparing with the concept summary. |

Every section retains its original complete explanation in optional deeper reading, original example, misconception and saved check. Public Demi discussion prompts supplement independent study without exposing private live guidance or requiring attendance.

## 5. Content preserved

`class-one.ts` remains byte-identical: SHA-256 `83e036c91343db36e48ba6a575d97632d06d263181123ef06387c04ad8d9dba7`. All original approved paragraphs remain available. Curriculum order, ten sections, 11 assessment items, 12 homework items, term/objective mappings, private rubrics and references remain intact. The default screen now offers concise explanation after participation; it does not require reading all deeper prose.

Economic qualifications remain: barter is not a universal origin story; paper cost/scarcity alone do not explain accepted money; a balance and payment tool differ; credit differs from savings; store of value does not guarantee purchasing power; payment flow is simplified and receipts are not automatically profit. Practice examples teach the concepts; private assessment keys/rubrics are not imported into the student presentation.

## 6. Competencies preserved

Registry, academic contracts, service/grading/evidence logic and migration0039 are unchanged. Presentation revision `money-experience.1.0.0` is keyed to `stage-1-class-1` / academic version `money-foundations.1.0.0`, with exact ordered section coverage. Unknown class/version/section combinations use original presentation. Separate knowledge, reasoning, application, homework, practical and formal-stage evidence are unchanged. No AI grading or client-side mastery authority.

## 7. Legacy and current progress preservation

No schema/migration/backfill/reassignment/install reset was performed. Before/after read-only hashes are identical for all recorded rows across eight local tables: school definitions, enrollment, events, submissions, completion, drafts, teaching links and legacy lesson progress. The existing completed synthetic student retains 22 school events, four immutable submissions, one new-class completion, two drafts and one legacy completed lesson. Zero FK violations. Normal instructor sign-in creates only the expected local authentication session; no academic records change.

Completed students can explore the new presentation and use Continue sequentially without another save. New/incomplete sections still require passing the original saved checks before they can be saved. New exploratory state is retained when switching sections during the mounted lesson, and deliberately resets on reload; saved academic progress does not reset.

## 8. Study Guide

Original version-pinned summary, big picture, vocabulary, five takeaways, outcomes, examples, misconceptions and section links remain. Compatible Class 1 gains a synthesis diagram and self-check, with optional expansion for longer review explanation. Incompatible versions keep their original guide content/presentation. Actual mobile guide load and full-explanation disclosure passed.

## 9. Homework A–F

Requirements, items, answers, drafts, instructor review, approval, return/resubmit and history remain unchanged. Browser verified the existing returned first attempt and approved second attempt, including original feedback and related-section links. No resubmission or re-grading of completed work was performed merely to test presentation. Future homework variety standard is documented in `docs/academy/class-authoring-standard.md`; A–F is not a mandatory template for other skills.

## 10. Remediation/history

Original server workflow and targeted reinforcement remain unchanged and covered by real SQLite regression tests. Browser verified preserved returned-homework explanations/links, approved history and targeted-review state. The completed fixture correctly has no outstanding remediation. Its prior remediation/event/history data is unchanged. Existing saved check feedback now explains the relevant concept rather than only a generic success; changing the current selection labels the previous result as previous until checked again.

## 11. Student School-page cleanup

A whitelisted projection produces Available / In progress / Completed / Locked / Coming later states. Actual enrollment, revision and completion determine access/status. Unauthored content has no playable link; unassigned authored classes remain locked. No Blueprint/Authored/Assessment Ready or internal descriptions enter the student roadmap component. Browser verified the completed Class 1 entry and forthcoming route; deterministic projection tests cover available/in-progress/locked/future distinctions.

## 12. Instructor/admin metadata

Existing protected inspection retains objectives/competencies, exact version, private60-minute guide, homework/rubrics, remediation mappings, blueprints, assessment/practical specification and references. Normal local Better Auth instructor sign-in and actual inspection confirmed authored/blueprint metadata remains visible only there. Preview runs the same public scenes and keeps saved checks disabled; exploratory practice is harmless and unsaved. No classroom/media/admission code changed.

## 13. Accessibility

Native buttons, radios/checkboxes, labeled selects/textareas, fieldsets/legends, focus outlines and section heading focus; explanatory status announcements; correctness expressed by text/icons alongside color. Matching does not require dragging. Visuals expose labeled figures/captions. Feedback animations and payment glow honor reduced motion. Actual desktop keyboard matching with repeated categories passed. Non-learning tab heading focus retains existing behavior; no screen-reader hardware/software audit was performed.

## 14. Mobile

Actual authenticated Chrome responsive393×852 acceptance: compact expandable journey, section selection, retained exploration, readable original diagrams/text, large tile touch selection, wrong-response feedback/retry, native select popup, confidence chain, stepped flow touch button, homework/history/remediation and Study Guide. No horizontal clipping/overflow observed in inspected compositions. This is Chrome emulation, not iOS/Android hardware certification or automated pixel-diff coverage.

## 15. Focused tests

**38 passed;0 failed;0 skipped.** Curriculum foundation, new presentation/reducer/feedback/matching, roadmap projection, rendering/accessibility alternatives, guide version fallback, completed no-save navigation, academic-source preservation, real SQLite progression/review/homework/remediation/history/access tests and Academy security. New tests were observed RED before implementation/fixes. Responsive structure/render assertions complement actual393px QA; they do not claim to prove pixel layout.

Independent review found early conclusion reveal, guide compatibility and completed Continue issues. Each received RED→GREEN regression fixes. A later fallback assertion additionally proved incompatible guide versions retain the original uncollapsed summary. Minor non-learning-heading-focus behavior was recorded without expanding scope.

## 16. Full suite

**602 passed;0 failed;0 skipped.** Baseline589;13 added tests. Final full-suite rerun occurred after the compatibility fix, including Academy, lifecycle, placement/learning path, scheduling and classroom regressions.

## 17. TypeScript

**PASS**: `npx tsc --noEmit`, before OpenNext. Prior generated OpenNext output was moved outside the source tree during this check to prevent wildcard inclusion of generated dependency TypeScript. No repository TypeScript configuration changed.

## 18. OpenNext

**PASS**: `npx opennextjs-cloudflare build`. Local loopback permission used; no deployment. Existing custom static Cache-Control warning and dependency duplicate-method bundling warnings remain. Initial browser load used stale cached development code; cache-disabled reload verified the new player before acceptance.

## 19. Worker dry-runs

**Application Worker: PASS**, `wrangler deploy --dry-run`, no deployment. Classroom Worker dry-run not required: no classroom/control Worker or shared classroom module changed or imports the changed presentation. Existing certified production code/configuration was not accessed or modified.

## 20. Authenticated browser acceptance

**PASS**, local only. Existing synthetic student reviewed all ten sections from opening through synthesis; decisions, wrong/correct/retry, progression/reveal, exchange step, function matching, payment multi-select, economic flow and written reflection all exercised. Optional complete explanations, old saved checked responses, permanent Study Guide, homework returned/approved history and remediation state verified. Completed Continue works without academic writes.393px touch/native-select/layout checked. Separate normal synthetic instructor login confirmed private metadata and public read-only preview. No new synthetic student or production account was needed.

Local review URLs:

- Student roadmap: `http://localhost:3013/academy/school`
- Class 1 opening: `http://localhost:3013/academy/school/stage-1-class-1?version=money-foundations.1.0.0#world`
- Study Guide: `http://localhost:3013/academy/study-guides/stage-1-class-1?version=money-foundations.1.0.0`
- Instructor inspection/preview: `http://localhost:3013/admin/academy/school`

The isolated local server is left running for review. Disposable local-only account details remain in its private `.env.school-qa.local`; production credentials are unnecessary.

## 21. Remaining limitations

The fresh-enrollment graded lifecycle was not repeated in Chrome because grading/evidence requirements did not change; it passed the prior foundation browser acceptance and final real SQLite regression suite. Existing completed QA/legacy history was preserved instead. No real classroom media retest, production rollout, new academic version, migration, Class2+, full assessment engine or Chart Lab is part of this work. Exploration is intentionally not persisted or counted toward mastery. Native-device, assistive-technology and automated visual-regression testing remain outside this local acceptance.

## Explicit answers

- **A. Does Class 1 meet the specified visual/interactive teaching standard? YES — locally implemented and verified against the approved design.**
- **B. Was the approved educational substance preserved? YES — exact academic definition unchanged; full instruction remains available.**
- **C. Were homework/remediation/history preserved? YES — regression tests and unchanged local-record hashes.**
- **D. Is the student experience substantially less textbook-like? YES — scenarios, original visuals and participation precede concise explanations; deeper prose is optional.**
- **E. Is Class 1 ready to serve as the design standard for authoring Class2+? YES — as the locally verified reference for Demi’s review. This does not authorize authoring Class2 or any deployment.**

No Class2 was authored. No production actions were performed. Stop after local verification.
