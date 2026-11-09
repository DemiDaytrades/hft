# Stage 1 authoring program — Gold-Standard v1

Status: approved by Demi and implemented/verified locally. Gold-Standard v1 itself is approved by Demi. This document specifies the bounded Stage 1 implementation; it does not authorize Stage 2 or production.

## Intent and scope

Complete the seven remaining approved Stage 1 classes using Class 1’s teaching philosophy, not its page structure. Each class supports a substantive 50–75-minute live session and reasonable active self-paced review, with original visuals, meaningful checks, appropriate homework, permanent Study Guide, private instructor guidance and targeted reinforcement. Preserve Class 1 and legacy progress, immutable definitions, individual review, version history and existing approved learning paths.

Implement only the minimum shared functionality needed to make the Stage 1 classes usable in the existing Academy. No new scheduling authority, media subsystem, assessment engine, Chart Lab, uploads, messages, Stripe, production migrations/deployment or real-student changes. Stop after Stage 1 tests, authenticated desktop/mobile Chrome acceptance and quality report.

## Authority and documented blueprint gaps

The approved `lib/academy/school/registry.ts`, the approved Master Curriculum/Class 1 design and Demi’s current authoring brief are authoritative for Stage 1. Preserve these titles, order and prerequisite chain:

1. What Is Money? — existing approved reference.
2. How Money Evolved.
3. Banks, Central Banks & the Money System.
4. Inflation, Purchasing Power & Interest Rates.
5. Why Financial Markets Exist.
6. Investing vs Trading vs Gambling.
7. What Makes Prices Move?
8. Welcome to the Foreign Exchange Market.

The older `MASTER_CURRICULUM_ARCHITECTURE.md` is marked PROPOSED and contains a different older organization. It supplies historical architecture context, not permission to replace the approved stage/class order or import unrelated assessment features.

Current blueprints name Class 2–8 topics, broad domains and linear prerequisites, but do not define detailed sections, subcompetency IDs, exact item counts or homework formats. Those are authoring decisions within these approved topics, documented below; no hidden replacement syllabus. Class 7 introduces price formation/context without advanced chart methodology. Class 8 introduces the purpose of FX and the relationship between two currencies; detailed quotes, pips, lots, margin/leverage, sessions and execution belong to Stage 2 and remain unauthored here.

Stage 1 “fully authored” means eight substantive classes, a concise stage review artifact, clean coverage/evidence mappings and a private assessment blueprint. It does not mean a runnable final stage-assessment engine, certification, graduation or automatic Stage 2 access.

## Approach

1. **Extend the existing versioned Academy minimally (recommended).** Replace Class 1-specific dispatch/navigation/assignment/guide assumptions with registry lookup; add immutable Class 2–8 definitions and subject-specific public experiences. Tighten student DTOs at the same server boundary. Existing persistence/review/security authorities remain in charge.
2. **Content documents only.** Insufficient because Demi explicitly requested working student/instructor flows, homework, progress and browser acceptance.
3. **A separate curriculum platform or broad interaction engine.** Adds duplicate authorities and exceeds the bounded authoring request. Do not build it.

Option 1 is the suitable approach within the authorized scope. This is a proposal for implementation review, not an assertion that a new design has already been approved.

## Educational designs

Section counts below are deliberate authoring plans, not universal template requirements. They may change slightly during source verification if coherence requires it; record changes and do not change approved class order/topics.

| Class | Distinct experience and proposed structure | Demonstration/homework | Main misconceptions and evidence |
| --- | --- | --- | --- |
| 2. How Money Evolved | Six chapters organized as parallel historical pathways and problem → response → limitation. Explore exchange arrangements, commodity examples, weighed metals/coins, paper claims/currency, banking/account payments, and coexistence of forms. Interactive timeline with date/context qualification, sequencing and comparison; no universal ladder from barter to digital. | Sequence a contextualized set of developments, explain two problems/responses and a limitation that remained, compare coexisting forms. Existing matching can represent ordering positions; reasoned explanation is individually reviewed. | Distinguish examples from universal history; paper claims versus contemporary currency; technological change does not eliminate confidence/institutions. Knowledge, historical reasoning, comparison/application and reviewed homework. |
| 3. Banks, Central Banks & the Money System | Seven system-map chapters: account experience, deposits/balances, payments/settlement, commercial bank functions, central-bank functions, simplified bank-lending/deposit creation with constraints, and connected-system synthesis. “Who does what?” matching and flow tracing. | Trace a hypothetical payment; classify commercial-bank/central-bank/other roles with qualifications; explain a simplified lending/deposit example and constraints, with no account details. | A bank is not merely a vault that passes the identical note onward; lending/deposit creation is constrained and not limitless; central banks are not retail banks and functions differ by jurisdiction. Individually reviewed system reasoning. |
| 4. Inflation, Purchasing Power & Interest Rates | Six basket-lab chapters: changing purchase, basket/index intuition, inflation-rate interpretation, nominal versus purchasing power, interest as a rate over time, and multi-cause/context synthesis. Then/now baskets, calculator-style practice and cause/effect comparisons. | Calculate a clearly labeled hypothetical basket change; interpret the result; show a simple interest example with assumptions/working; explain a purchasing-power decision without personal financial advice. Numeric practice checks are deterministic; durable written working uses instructor review. | Inflation rate versus price level; one item versus basket; lower inflation versus falling prices; nominal versus real intuition; multiple influences and uncertain policy transmission. No universal single-cause formula. |
| 5. Why Financial Markets Exist | Six market-purpose stations: connect participants, finance productive activity, investment/ownership, borrowing/lending, transferring/hedging risk and a participant-need synthesis. Purpose/participant diagrams and resource-allocation choices. | Build a small participant-needs map and explain two different market purposes and one risk/limitation. Scenario matching plus short reviewed rationale. | Markets do more than speculative buying/selling; liquidity is not a promise of always exiting at an expected price; financing/ownership/credit risks differ. |
| 6. Investing vs Trading vs Gambling | Five decision-studio chapters organized around objective, time horizon/process, risk/uncertainty, edge/evidence and disciplined/no-action choices. Compare similar-looking decisions in different contexts; label and justify, not blanket moral judgments or guaranteed-profit rules. | Review contrasting decision cases, explain process/risk assumptions and a defensible no-action decision; write a brief decision checklist. | Short horizon alone is not a complete definition of gambling; investing/trading both carry risk; labels/profit outcomes do not prove decision quality or edge. Reviewed reasoning is central. |
| 7. What Makes Prices Move? | Seven price-discovery chapters: buyer/seller interaction, orders/willingness to transact, changing supply/demand and depth, information/expectations, uncertainty/surprises, different participant motives, and context synthesis. Original deterministic price/offer illustrations, conditional predictions and competing explanations. | Interpret hypothetical before/after supply/demand/order situations, propose alternative explanations and state what cannot be inferred. Scenario classifications plus reviewed evidence/uncertainty reasoning. | More buyers than sellers is an inadequate literal trade-count explanation; executed trades have both sides; new information/expectations and available liquidity matter; examples are not predictive laws or advanced HFT setups. |
| 8. Welcome to the Foreign Exchange Market | Six cross-border journey chapters: a payment need, two currencies, exchanging one for another, participants/purposes, basic market organization and risks, then Stage 1 synthesis/Stage 2 orientation. Currency-flow map, simple conversion intuition and purpose/participant matching. | Explain a new cross-border case distinct from the reserved stage-assessment scenario, map the currency need and relevant participants, explain risks/uncertainty and identify what requires later learning. | FX is not only retail speculation; currency value is relative; conversion is not free/guaranteed profit; conventions, spreads and execution mechanics are deferred to Stage 2. |

Classes 2–4 must visibly differ from Class 1 in chapter count, interaction rhythm, primary visuals, homework structure and examples. Classes 5–8 must also fit their subjects. No mechanical eggs/shoes, ten-section or A–F cloning.

## Authoring references

Before authoring factual explanations, verify current primary institutional references: central-bank/official monetary-history sources for Class 2; central-bank explanations of deposits, payments, lending/deposit creation and institutional functions for Class 3; central-bank/statistical/regulator sources for inflation, indices and interest for Class 4; regulator/institutional market education for Classes 5–7; BIS/central-bank official FX material for Class 8. Record exact consulted URLs/titles on the instructor side. Explain material in original HFT words; do not copy educational graphics or source prose. Do not infer jurisdiction-specific claims universally.

Hypothetical baskets, prices, payments and rates are clearly hypothetical; no real-time market feed or personal financial advice is needed. Where a factual claim is disputed/context-dependent, qualify it or omit unsupported certainty and record the authoring decision.

## Definition, versioning and compatibility

Keep the installed Class 1 academic JSON/version/hash unchanged. Add independent Class 2–8 IDs and immutable versions; retain the existing course/module authority and explicit class assignment. Installation must be idempotent and fail on a conflicting published hash. New class lesson anchors have their own IDs/order; do not edit legacy course graphs or reinterpret old completion as new credit.

Generalize lookup in installation, assignment, instructor inspection/review, student class/guide routing and private teaching context. Remove fixed ten-section/fixed Class 1 title assumptions only where necessary. Existing tables already store JSON definitions and per-class/version enrollment/events/submissions/completion/drafts; no new migration is expected. If a real schema gap is found, document and rehearse an additive local-only migration, without rewriting legacy data or production.

Prerequisites follow the registry’s existing linear chain. Earlier completion is necessary to assign/open the next class; it is not a reason to bulk replace an approved learning path or auto-enroll real students. Instructors retain explicit assignment. Student Academy access still requires valid lifecycle/password/membership/course/publication guards on every read/write, including drafts/guides. No preview writes or cross-student access.

Class 1’s approved knowledge/reasoning/homework policy remains unchanged. New classes use the existing class-level policy rather than inventing a final stage-exam threshold or assessment bank. Knowledge, reasoning, application, homework and any future practical/formal-stage evidence remain separate. Written work requires individual review; reflection uncertainty is not automatically wrong. Preserve all attempts, returned work, fresh reinforcement, re-review protections and immutable completion snapshots. No AI grading.

## Minimal interaction support

Use existing native choices, matching, written/reflection and instructor review for durable evidence. Extend public ungraded teaching scenes only with bounded components required by the approved subjects: accessible timeline/ordering controls, system flow/map exploration, hypothetical arithmetic practice, conditional price examples and decision comparisons. Use selects/buttons/input fields rather than drag-only interactions. Ordering may use the existing exact row-to-position mapping contract. Calculation working can remain instructor-reviewed written evidence; do not build a general formula language, calculator service, chart editor or new grading subsystem.

New classes need not implement every interaction kind. Public exploration and saved assessment/homework remain visibly different. Failed concepts map to their specific sections and fresh examples, not an automatic repeat of the entire class. Preserve current revision/idempotency/security checks.

## Student/instructor information separation

Current `publicClass` removes private correct/rubric/guide fields but still includes unnecessary competency IDs, evidence metadata, version/assessment mapping and reference data. New brief explicitly requires a tighter boundary. Implement a whitelisted student transport projection, not CSS hiding:

- Instruction, terms, human-friendly learning goals, activity prompts/choices, own draft/answers, approved feedback, plain progress/review states, Study Guide and necessary navigation only.
- Do not send private rubrics, guide/timing scripts, references list, raw competency/evidence/source IDs/types, scoring policy/thresholds, weakness-to-bank mappings, authoring/QA status or curriculum version strings.
- Necessary non-secret resource keys/revision tokens may remain machine-readable for authenticated transport but are not displayed as lesson content. Resolve underlying definition/version server-side from the owned enrollment; no new cryptography/auth authority.
- Keep compatibility for existing versioned links/commands where safe, after the same authorization checks; generate new student links without academic version labels. Historical enrollment/guide references must still resolve to the exact original record. Never substitute a new version silently.
- Student feedback/history shows meaningful prompts, own answers and approved review outcomes; teacher-private review/assessment metadata never enters it. Targeted review exposes the assigned teaching/practice needed, not the private mapping logic or answer bank.
- Instructor/admin keeps complete authoring/publication metadata, mappings, IDs and provenance; human-readable competency labels by default, raw codes in optional advanced details. Preview uses the student-safe projection and cannot save durable work.

Apply the safer projection consistently to Class 1 and new classes without altering Class 1’s stored definition/evidence. This is a presentation/privacy boundary change, not a content reset. A recursive negative test must cover every student JSON/page projection, not only visible labels.

## Instructor and live guidance

Each class’s private guide includes prerequisites/objective, human-friendly competencies, flexible pacing totaling roughly one substantive hour, hook, actual talking points, visual/demo instructions, misconceptions, discussion prompts, planned Phase C polls/pop quizzes/written activities, transitions, recap and next-class preview. Optional video opportunities are descriptions the instructor can choose at teaching time; no hardcoded unapproved videos or required playback.

Generalize the existing explicit scheduled-lesson/edition binding and reflection context for the newly registered classes. No automatic class start, media permission or scheduling changes. No private reflection leakage or unrelated financial/intake queries. Any classroom changes are limited to curriculum adapters/selectors and trigger focused classroom tests plus a control Worker dry-run if actually affected.

## Study Guides, homework and future assessments

Every class has its own concise, separately authored guide with visual review aids, vocabulary, examples, mistakes and self-checks. Homework formats follow the skills in the table, not Class 1 A–F. Existing draft, submit, awaiting-review, return, revised attempt and approved states remain; instructor reviews substantive reasoning and working, not answer length alone.

Add mapped subcompetencies under the approved domains with stable IDs. For each new class define required evidence, critical concepts where supported by the approved methodology, class-check coverage, private stage-assessment preparation and practical requirement status. Avoid assigning unsupported stage-level weights/thresholds or duplicating a reserved final bank in lesson checks. Stage 1 is foundational: no fake chart/practical credit. Maintain the existing Stage 1 final-assessment scenario as private blueprint; new teaching/homework examples must not simply duplicate it. Author a brief Stage 1 review artifact without adding a ninth class or runnable final assessment.

## Quality and verification

Preserve the existing isolated local workspace and completed synthetic Class 1/legacy fixtures. Capture schema/data/source hashes before mutation. Use additional local-only synthetic students/enrollments as needed for fresh prerequisite/progression and review flows; never delete or reset the existing completed fixture. Do not copy production credentials/data or seed into production.

TDD/regressions cover each definition’s coverage/order/links, authored content and subject-specific practice, deterministic ordering/calculation boundaries, retry/feedback, Class 1 immutability and progress, exact version resolution, arbitrary section counts, prerequisite assignment and stale writes, strict student/instructor projection separation, safe preview, homework formats/history/review, targeted reinforcement, study guides and teaching adapter ownership. Update blueprint-only expectations to the now-approved Stage 1 scope without weakening preserved Class 1 behavioral/security assertions.

Run Stage 1 focused tests, foundation/Class 1/Academy security/privacy/homework/remediation tests, full suite, TypeScript, OpenNext and application Worker dry-run; classroom dry-run if affected. Use actual normal-authenticated Chrome for every new class’s student instruction/interaction/check/guide/homework/remediation/progress and instructor objectives/guide/activities/rubrics/references/mappings. Verify representative 393px flows across the different interaction/layout types and desktop keyboard alternatives. Do not claim a render/CSS test proves actual browser layout or instructor-reviewed mastery.

Compare Classes 2–4 against Class 1 explicitly for quality drift; report meaningful differences. Final report contains all29 requested items and A–I, with honest evidence/limitations and exact next recommendation for separately authorized Stage 2. Stage 2 remains unauthored; its readiness means prerequisites/design are prepared for later authorization, not implementation now.

## Expected files and builder discretion

Likely changes: school registry/contracts/policy/service and teaching adapters; new per-class private definitions and public experience modules; student DTO/projection and its consumers/routes; variable-length player/journey/guide/homework/instructor components; local seed fixtures, tests, authoring standard and verification docs. The installed Class 1 definition is immutable. All production configs/secrets and unrelated dirty checkout files are outside scope.

Builder may choose component/file names, exact original scenario wording and item counts, lesson-specific public visual geometry, flexible timing blocks, non-assessment practice values and source-supported examples. Record consequential authoring rulings. If a blueprint gap would change approved curriculum order/topics or require a new major subsystem, stop at that decision rather than silently replacing the school.
