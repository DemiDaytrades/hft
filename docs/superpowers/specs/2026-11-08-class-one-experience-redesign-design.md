# Class 1 experience redesign — proposed design

Status: approved by Demi for local implementation through testing and authenticated desktop/mobile Chrome acceptance. No deployment or production changes authorized.

## Intent and boundaries

Turn the approved What Is Money? instruction into an experience-first, visual, participatory lesson for complete beginners. Preserve the ten concepts and their order, substantive economic qualifications, curriculum versions, competencies, graded checks, Study Guide, Homework A–F, individual instructor review, remediation, revision/history and legacy progress. Do not author Class 2+, change educational placement, add a mastery authority, or build Chart Lab/stage assessments/Phase D.

The instructional rhythm is experience → visualize → predict/interact → explain → apply → check understanding. Important explanations remain available; shortening the default presentation must not delete substance.

## Existing constraints and approach

`SchoolPlayer` currently renders every section paragraph before a generic visual and check. `school_definition` is hash-pinned and immutable; enrollment and completion reference its exact version. Editing `class-one.ts` under the current version would break installation consistency. The approved definition must remain byte-identical.

Approaches considered:

1. **Presentation overlay keyed to class + academic version (recommended).** New public instructional scenes arrange the existing concepts and add ungraded exploratory practice. The exact approved definition and all durable learner state remain unchanged. This fits presentation-only scope and permits existing completed students to revisit the redesigned instruction.
2. **New academic version/enrollment.** Appropriate for changed objectives, assessment or evidence requirements, but unnecessary here and would require explicit enrollment/version policy and more compatibility work.
3. **Only collapse current paragraphs.** Low risk but insufficient: it would preserve the textbook-first rhythm without meaningful visual demonstrations or prediction.

There is one suitable approach within this request's preservation constraints: option 1. It is proposed for approval, not recorded as an already-approved decision.

## Version and state contract

- Introduce a public presentation definition with its own revision, scoped exactly to `stage-1-class-1` / `money-foundations.1.0.0`, and ten stable section IDs. Validate complete coverage and reject mismatches. Other versions fall back to their original presentation; do not silently apply incompatible scenes.
- Do not import private `class-one.ts`, correct answers or instructor rubrics into the student bundle. Public scene practice has its own IDs, examples and explanatory feedback. It must not duplicate later assessment-bank questions/answers verbatim.
- Preserve the installed definition bytes/hash, enrollment IDs, academic version, existing activity IDs/answers, section completion, assessment/homework submissions, reviews, drafts and immutable evidence.
- New predictions, reveals, comparison selections, flow exploration and practice sorting are explicitly **ungraded exploration**, not evidence or new completion gates. State is held per section in React for the mounted class; switching sections retains it, reload can restart exploration. Existing saved graded progress/drafts remain server-backed. Do not store new free text or credentials in browser storage.
- Exploration remains usable when revisiting a completed class; approved graded answers/completion remain read-only. Failed existing checks retain server-authoritative retry/history behavior.
- Tailored existing-check feedback is selected from the server-returned pass/fail result and section mapping, never client-computed assessment grades. Changing a selection must not imply a fresh server result until submitted; preserve the prior result as a prior attempt where necessary.
- No database migration, backfill, enrollment replacement, installer re-run or progress reset is expected.

## Section-by-section instruction

| Section | Experience and participation | Visual/reveal and preserved teaching |
| --- | --- | --- |
| 1. World without money | Dinner tonight; select eggs, time/labor or repair skill, then explore the obstacle to obtaining food. Choices show plausible consequences rather than a graded personality choice. | Illustrated need/offer/counterparty scene; useful goods do not guarantee a matching trade. Reveal exchange problem before terminology. |
| 2. Direct barter | Eggs available, shoes needed, shoemaker wants bread; predict whether a direct swap works. Retry gives a helpful distinction. | Explicit have/need pairs and blocked exchange; reveal double coincidence of wants after prediction. Preserve nuance about credit, gifting and other non-cash arrangements; no universal barter-origin story. |
| 3. What money solves | Advance carpenter → Customer A → payment → Store B; explain/select why the grocer need not want carpentry. | Two exchanges connected by an accepted payment bridge; distinguish who buys your work from who sells what you need. |
| 4. Medium of exchange | Make a grocery payment; identify what money does in that action. | Payment handoff, goods and payment traveling in opposite directions; connect everyday “exchange/pay” to formal term. |
| 5. Unit of account | Compare bread $4, eggs $5, milk $4; select what the shared prices let you compare. | Common dollar scale/price comparison, not physical size or usefulness ranking; reveal unit of account. |
| 6. Store of value | Move from Friday earnings to Tuesday spending; predict what can remain unchanged and what can change. | Timeline separating nominal amount and purchasing power. Never promise constant real value. Add a short multi-scenario matching challenge using exchange / compare / later labels, then connect formal terms with item-specific why feedback. |
| 7. Acceptance | Predict why a $100 note can function monetarily before revealing acceptance/confidence chain. | Others accept → goods priced → reuse → continued acceptance, qualified by institutions and functioning arrangements. Paper cost/scarcity alone do not explain value. Preserve original substantive $100 check without leaking later assessment bank. |
| 8. Beyond cash | Compare cash, debit payment, bank balance and digital payment; select examples involved in using money, then distinguish balance from access tool. | Labeled comparisons, not the claim that every app/card/credit product is money. Bank balances, payment tools and borrowing stay distinct. |
| 9. Economic flow | Step through wage/payment recipients and predict a plausible next use; allow more than one realistic destination where appropriate. | Employer → worker → business → supplier/people; explicitly a simplified flow, not tracking one physical dollar, guaranteed profits or money creation. |
| 10. Apply/explain/review | Work through a multi-action carpenter/grocery story; identify paying, comparing and keeping funds, and explain briefly before reveal. | Synthesis on what money is doing, followed by existing approved check and knowledge/reasoning assessment. Do not classify an entire story with one memorized label. |

Each section includes a concise takeaway, example/misconception, optional “Explore the full explanation” retaining the exact approved prose, and existing durable check. Full explanation is not a prerequisite for receiving credit. Subtle public “In class with Demi” prompts are independently understandable, do not require attendance and do not expose the private teaching guide.

## Visual system and navigation

Maintain existing HFT dark/orange identity. Use original HTML/CSS/SVG teaching assets: goods/payment illustrations, have/need layout, animated bridge, common-price comparison, time/purchasing-power contrast, confidence chain, payment-tool comparison and branching circulation flow. No stock photography, external assets, image API, new dependency or copied graphics required.

Vary composition by concept: scene, comparison, timeline, connected chain and synthesis. Avoid rendering every idea as the same bordered card. Use short text with breathing room; deeper reading stays available. Animation demonstrates a relationship and honors reduced motion; it is never needed to understand the concept.

Desktop journey navigation identifies current/completed/remaining sections with words, numbers and icons. Mobile uses a compact current-step/progress control and accessible expandable section list. Preserve previous/next, focus management, section anchors and saved-state refresh. Completion continues to mean approved evidence, not reveal counts or elapsed animation time.

## School roadmap and instructor separation

Extract/test a student-facing status projection: Available, In progress, Completed, Locked or Coming later as appropriate. Use actual enrollment/completion/start evidence for distinctions; never label unauthored/unassigned content playable. Remove student-facing Blueprint/Authored/developer language from explanatory text and class/stage statuses. Keep internal metadata, blueprint descriptions and assessment readiness in protected instructor/admin inspection.

Student preview uses the same redesigned public presentation, with existing no-write guards. Private instructor objectives, rubrics, source versions, remediation mappings and live guide remain intact. Do not change classroom/media/admission code for this redesign.

## Study Guide, homework and authoring standard

Preserve the exact versioned Study Guide content and links, adding concise original concept diagrams/self-check presentation where useful. It remains a review artifact rather than a copy of scene screens. Homework A–F requirements, IDs, grading/review, drafts and histories remain unchanged; improve layout only if necessary. Maintain accurate submitted/awaiting-review, returned and approved wording.

Document the reusable instructional rhythm and rule **homework format must match the skill**: pips calculations; candlestick identification/building/reading; market structure markup; risk/position scenarios; psychology decisions/reflection; trade-plan construction. Do not mechanically replicate A–F or this scene layout into every future class.

## Accessibility

Native buttons, radios/checkboxes, selects and labeled textareas; no drag-only interaction. Matching always works with tap/select and keyboard. Visible focus, meaningful diagram labels/text equivalents, status announcements, text/icons alongside color, generous touch targets and reduced motion. Collapsed content and reveals expose expanded state. At 393px, diagrams reflow and controls wrap without horizontal overflow; preserve DOM reading order and heading focus after navigation. Explore wrong/correct/retry and keyboard-only use in actual Chrome.

## Implementation boundaries and verification

Continue from the existing isolated local workspace after verifying its 39-file inventory matches the repository. Preserve its completed synthetic student's history and legacy fixture. If a fresh graded path is needed, add a separate local-only synthetic enrollment; never clear/reseed existing progress. No production credentials/resources/data are needed.

Expected touched areas: new public presentation contract/content/helpers/tests; new section experience/visual/feedback components; `SchoolPlayer`, scoped CSS, student roadmap/status projection; optional guide layout; deterministic rendering/state tests; authoring standard and verification documentation. `class-one.ts`, academic service/schema/assessment/homework contracts and classroom implementation should remain unchanged. If an actual implementation constraint requires changing a protected area, stop and justify it rather than silently widening scope.

Tests: assert unchanged academic-definition hash and IDs/content/competencies, preserved legacy/current progress and homework history; section/retry/check behavior; exploration isolation from completion; practice sorting with repeated targets; meaningful feedback; accessible keyboard/select alternatives; roadmap status and private metadata separation; preview no-write; Study Guide/remediation/homework regressions. Use render/CSS invariants plus actual 393px Chrome; do not claim a unit test proves browser layout.

Run focused Class 1/foundation/Academy security tests, full suite, TypeScript before OpenNext, OpenNext and application Worker dry-run. Classroom dry-run only if shared classroom code is affected. Authenticated Chrome traverses all ten redesigned sections, correct/wrong/retry/reveals, matching, existing saved checks, guide, homework/remediation/history and instructor metadata/preview; verify desktop keyboard and 393px touch layout. No production access/deployments, messages, Stripe, real students or next-class authoring.

Final report supplies all 21 requested items and explicit A–E results with evidence and limitations. The design standard is accepted only after the actual full lesson experience passes; passing unit tests alone is insufficient.

## Builder discretion

Builder may choose component names, responsive spacing, original icon paths, concise public scene wording, exact non-assessment practice examples and animation timing within these constraints. Public conceptual explanation may overlap what is taught in assessments; assessment keys/rubrics or verbatim later-bank solutions must never be embedded. New free-response exploration is reflective practice without automated semantic grading. No additional product decisions or dependencies are required.
