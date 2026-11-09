# MASTER CURRICULUM ARCHITECTURE
**HFT Trading Foundations - Competency-Based Academy**

*Version: 1.0 | Status: PROPOSED - PENDING APPROVAL | Last Updated: 2026-11-04*

---

## Table of Contents
1. [Core Philosophy](#core-philosophy)
2. [Current State](#current-state)
3. [Competency-Based Assessment Framework](#competency-based-assessment-framework)
4. [Assessment Layer Specifications](#assessment-layer-specifications)
5. [Curriculum Structure](#curriculum-structure)
6. [Unlocking & Progression Logic](#unlocking--progression-logic)
7. [Database Schema Requirements (Future)](#database-schema-requirements-future)
8. [Admin / Instructor Review Center](#admin--instructor-review-center)
9. [UX Guidelines](#ux-guidelines)
10. [Phased Implementation Plan](#phased-implementation-plan)
11. [Non-Negotiable Constraints](#non-negotiable-constraints)

---

## Core Philosophy

The HFT Academy must be **competency-based, not completion-based**. Students cannot progress by simply reading and clicking "Mark Complete". 

**Definition of Completion:** A student graduates only when they have *demonstrated* the required knowledge and practical skills through assessments, practical exercises, and instructor-verified checkpoints - not merely consumed content.

---

## Current State

- **Course:** HFT Trading Foundations (`02863cd745984e0b8898beb4550c458d`, slug: `hft-trading-foundations`)
- **Track:** Foundations | Status: `draft`
- **Assigned:** Demi (`2de88cf55bab413baeafdac5546cc6c6`)
- **Module 1:** "Welcome to High Frequency Talent" (`ab4cdbfb5fe743df9fa71c4d41cd0acd`) - 5 lessons planned
- **Current Progression:** Linear (previous lesson must be completed to unlock next). Simple completion-based.
- **No Assessment System:** Only `student_lesson_progress` with status (`locked`/`available`/`completed`) exists.

---

## Competency-Based Assessment Framework

All progression gates must verify competency. The system must enforce that students **prove** understanding before advancing through critical junctures.

### Four Assessment Layers

| Layer | Purpose | Grading | Unlock Impact |
|-------|---------|---------|---------------|
| **1. Knowledge Checks/MCQ** | Test theoretical understanding | Automated (immediate) | May gate next lesson/module if minimum score required |
| **2. Homework Assignments** | Apply concepts with analysis/explanation | Instructor review (eventual) or auto-score where possible | May require submission + approval to unlock |
| **3. Chart Demonstrations/Practical Assessments** | Prove practical application on real charts | Instructor review (primary) | Often require approval before checkpoint/module unlock |
| **4. HFT Checkpoints** | Milestone validation combining all types | Mixed (auto + instructor) | **Hard gate** - cannot proceed until all parts satisfied |

---

## Assessment Layer Specifications

### 1. KNOWLEDGE CHECKS / MULTIPLE CHOICE

#### Question Types
- **Single-answer MCQ** - Choose one correct answer
- **Multiple-answer MCQ** - Choose one or more correct answers
- **Scenario-based** - Apply knowledge to a trading scenario
- **Calculation** - Risk/reward, position sizing, pip value, etc.
- **True/False** - Where appropriate
- **Image-based** - Questions referencing charts/patterns

#### Features
- **Randomization:** Question order randomized per attempt where appropriate
- **Answer shuffling:** Answer choices randomized per attempt
- **No answer leakage:** Correct answers must NOT be revealed before submission
- **Educational feedback:** Provide detailed explanation after submission (why correct/incorrect)
- **Attempt tracking:** Track attempt number, all attempts with scores
- **Passing thresholds:** Configurable per quiz/checkpoint (recommend per-assessment, not global hardcoded)
- **Retry policy:** Define per assessment (may allow retakes, may cap attempts)

#### Data Model (Future)
```sql
academy_quiz (
  id, lesson_id/module_id/checkpoint_id,
  title, instructions, passing_score_percent,
  time_limit_minutes, max_attempts,
  randomize_questions, randomize_answers,
  require_pass_to_unlock, created_at, updated_at
)

academy_quiz_question (
  id, quiz_id, question_type, question_text, question_image_url,
  explanation, sort_order, points
)

academy_quiz_question_choice (
  id, question_id, choice_text, choice_image_url, is_correct, sort_order
)

student_quiz_attempt (
  id, user_id, quiz_id, attempt_number,
  started_at, submitted_at, score_percent, passed,
  time_spent_seconds
)

student_quiz_response (
  id, attempt_id, question_id,
  selected_choice_ids (JSON), text_response,
  is_correct, points_earned
)
```

---

### 2. HOMEWORK ASSIGNMENTS

#### Assignment Types
- **Written Response** - Analysis, explanation, reasoning
- **Trading Plan Exercise** - Build elements of trading plan
- **Risk Calculations** - Position sizing, R-multiples, drawdown
- **Market Analysis** - Pre-market/technical analysis writeup
- **Journal Entry** - Trading journal practice
- **Chart Markup Description** - Describe what they'd mark and why
- **File Upload** - Screenshots, annotated images (when implemented)

#### Student Flow
```
OPEN ASSIGNMENT → READ INSTRUCTIONS → COMPLETE RESPONSE → 
ATTACH FILE/IMAGE/CHART SCREENSHOT (future) → SUBMIT TO INSTRUCTOR
```

#### Status Lifecycle
`NOT STARTED` → `IN PROGRESS` → `SUBMITTED` → `UNDER REVIEW` → `APPROVED` | `REVISION REQUIRED`

#### Data Model (Future)
```sql
academy_assignment (
  id, lesson_id/module_id,
  title, instructions, assignment_type,
  requires_file_upload, allowed_file_types,
  requires_approval_to_unlock,
  due_in_days, points, rubric (JSON)
)

student_assignment_submission (
  id, user_id, assignment_id,
  status, response_text, file_urls (JSON),
  attempt_number, revision_of_id,
  submitted_at, reviewed_at, reviewed_by,
  instructor_feedback, score, approved
)

assignment_submission_history (
  id, submission_id, action, actor_id,
  feedback, created_at
)
```

**Note:** Do NOT implement storage/uploads in this phase - design only.

---

### 3. CHART DEMONSTRATIONS / PRACTICAL ASSESSMENTS

This is critical for HFT training. Students must prove practical chart-reading skills.

#### Example Assignments
- "Open EUR/USD and identify the current market structure."
- "Mark the most recent swing high and swing low."
- "Identify support and resistance zones."
- "Mark a Break of Structure (BOS) or Change of Character (CHoCH)."
- "Show where you would place your stop loss and explain why."
- "Mark your proposed entry, stop loss, and take profit with rationale."
- "Identify liquidity zones/areas of interest."
- "Perform a top-down analysis using the required timeframes (e.g., D1, H4, H1, M15)."
- "Screenshot a setup that meets your trading-plan rules and explain confluence."
- "Identify order blocks, FVGs, or other concepts as introduced"

#### Submission Requirements
- **Annotated chart screenshot** upload (future implementation)
- **Written explanation** of markings and reasoning
- **Tool-agnostic:** Should work with common screenshot formats (PNG, JPG, JPEG, WebP)
- **Appears in Instructor Review Queue**

#### Instructor Review View Must Show
- STUDENT (name, ID)
- COURSE
- MODULE
- LESSON
- ASSIGNMENT
- WRITTEN RESPONSE (explanation/reasoning)
- UPLOADED CHART (image viewer)
- DATE SUBMITTED
- ATTEMPT/REVISION NUMBER
- STATUS

#### Instructor Actions
- **APPROVE** - Satisfies requirement, may unlock progression
- **REQUEST REVISION** - Returns to student with feedback, increments revision number
- **INSTRUCTOR FEEDBACK** - Detailed, actionable feedback

**Critical:** Some practical assessments **MUST** require instructor approval before next checkpoint/module unlocks.

**Note:** Design only - no uploads/storage implementation yet.

---

### 4. HFT CHECKPOINTS

Major milestones combining multiple assessment types with hard gates.

#### Example: MARKET STRUCTURE CHECKPOINT

**PART A - Knowledge Quiz (Automated)**
- 10 multiple-choice/scenario questions covering market structure
- Must achieve minimum passing score
- Immediate feedback with explanations

**PART B - Chart Demonstration (Instructor Reviewed)**
Student uploads annotated chart showing:
- Swing high identification
- Swing low identification
- Current trend determination
- Break of Structure (BOS) marked
- Support and resistance zones
- Proper labeling/annotation

**PART C - Explanation (Written)**
Student explains reasoning for all markings in detail.

**PART D - Instructor Review (Gate)**
- Instructor approves OR requests revision
- **Student CANNOT unlock next major stage until all parts satisfied and approved**

#### Other Checkpoint Ideas
- **Liquidity & Zones Checkpoint** - Order blocks, FVGs, liquidity pools
- **Risk Management Checkpoint** - Calculations, position sizing, risk/reward
- **Entry/Execution Checkpoint** - Valid setups, confluence, invalidation
- **Pre-Capstone Readiness Checkpoint** - Comprehensive review

#### Data Model (Future)
```sql
academy_checkpoint (
  id, course_id/module_id, title, description,
  checkpoint_type, sort_order,
  is_hard_gate, requires_all_parts_passed
)

academy_checkpoint_part (
  id, checkpoint_id, part_type, // quiz|assignment|chart_demo|essay
  quiz_id, assignment_id,
  required, sort_order, instructions
)

student_checkpoint_progress (
  id, user_id, checkpoint_id,
  status, // in_progress|pending_review|revision_required|passed
  started_at, completed_at, passed_at,
  reviewed_by, overall_feedback
)
```

---

## HFT CAPSTONE / GRADUATION

The final Academy stage requires comprehensive demonstration of applied skills. **Academy completion means demonstrated competence, not content consumption.**

### Potential Requirements

| Requirement | Type | Gate |
|-------------|------|------|
| **Final Comprehensive Knowledge Assessment** | Automated Quiz (extensive) | Must pass minimum threshold |
| **Risk-Management Calculations** | Homework/Quiz | Must demonstrate correct calculations |
| **Full Chart Analysis** | Chart Demonstration | Instructor reviewed |
| **Multi-Timeframe Analysis** | Chart Demo + Explanation | Must analyze required TFs (e.g., HTF → LTF) |
| **Annotated Chart Upload** | Practical Assessment | Instructor reviewed with specific requirements |
| **Trading Setup Explanation** | Written Essay | Detailed rationale with confluence |
| **Completed Personal Trading Plan** | Homework Assignment | Must include rules, risk parameters, journal plan |
| **Journal Review** | Homework/Portfolio Review | Show practice journal with analysis |
| **Strategy Rules Documentation** | Written Assignment | Personal, rules-based strategy |
| **Instructor Review** | Final Review | Comprehensive review of all capstone elements |
| **Final Approval** | Gate | Required for graduation |

### Graduation Criteria
```text
ACADEMY COMPLETED = 
  All lessons/modules complete AND
  All required quizzes passed (meeting thresholds) AND
  All required homework approved AND
  All chart demonstrations approved AND
  All checkpoints passed AND
  Capstone fully approved by instructor
```

---

## Curriculum Structure

### Design Principles
1. **Intentional Assessment** - Not every lesson needs homework/quiz
2. **Progressive Difficulty** - Build from theory → application → demonstration
3. **Just-in-Time Practice** - Assess concepts right after learning them
4. **Real-World Focus** - Emphasize HFT-relevant skills (structure, liquidity, execution)
5. **Serious but Not Tedious** - Challenging without busywork

### Suggested Module Breakdown (Evolving)

| Module | Focus | Assessment Strategy |
|--------|-------Box|---|
| **Module 1: Foundations & Mindset** | Welcome, Academy structure, Trader mindset, Goals, Journal | Short knowledge check + journal setup exercise (maybe homework) |
| **Module 2: Market Structure Fundamentals** | Swings, BOS/CHoCH, Trends, Liquidity basics | MCQ quiz + Chart demo (mark structure) |
| **Module 3: Zones & Liquidity** | Order blocks, FVGs, Liquidity pools, Inducement | Quiz + Practical chart marking |
| **Module 4: Risk Management** | Position sizing, R:R, Stop placement, Drawdown | Calculations quiz + Homework (build risk rules) |
| **Module 5: Entry & Execution** | Confluence, Invalidation, Entry models | Scenario-based quiz + Setup screenshot assignment |
| **Module 6: Multi-Timeframe Analysis** | Top-down analysis, HTF/LTF alignment | Chart demo (required TFs) + Explanation |
| **CHECKPOINT 1: Market Structure Mastery** | Milestone | Quiz + Chart demo + Explanation + Instructor approval |
| **Module 7: Psychology & Discipline** | Edge vs outcome, Journaling, Tilt, Consistency | Reflection homework (less technical, still evaluated) |
| **Module 8: Building Your System** | Rules, Checklist, Backtesting mindset | Trading plan homework (instructor review) |
| **CAPSTONE: Demonstration of Competency** | Final validation | Comprehensive assessment bundle + Final approval |

*Note: This is a proposed structure; actual module titles/content to be finalized.*

---

## Unlocking & Progression Logic

### Current Logic (Keep for Basic Flow)
```typescript
// Sequential by module order, then lesson order within module
// First lesson: unlocks if assigned
// Subsequent: unlocks only if previous lesson completed
```

### Enhanced Competency-Based Logic (Future)

```typescript
function canUnlockLesson(userId, lessonId, courseId) {
  // 1. Must pass sequential prerequisite (if required)
  // 2. If lesson has required quiz and not passed -> blocked
  // 3. If lesson has required homework and not approved -> blocked
  // 4. If lesson is behind a checkpoint gate -> check checkpoint status
  // 5. Module unlock may require checkpoint completion
}
```

### Gate Types
- **Soft Gate (Recommended):** Show warning, suggest completion, but may allow proceeding? **NO** - for required gates, must block.
- **Hard Gate (Required):** Cannot access next lesson/module until requirements met. Must be enforced server-side.
- **Checkpoint Gate:** Major hard gate requiring mixed assessments + instructor approval.

### Progress States (Enhanced)
```typescript
type LessonStatus = 
  | 'locked'           // Prerequisites not met
  | 'available'        // Can start
  | 'in_progress'      // Started but not complete
  | 'pending_review'   // Submitted homework/chart/demo awaiting review
  | 'revision_required'// Needs revision
  | 'completed'        // All requirements satisfied
```

---

## Database Schema Requirements (Future)

*Do not implement migrations now. This is for planning.*

### New Tables Needed

```sql
-- Quizzes
academy_quiz
academy_quiz_question  
academy_quiz_question_choice
student_quiz_attempt
student_quiz_response

-- Assignments (Homework/Practical)
academy_assignment
student_assignment_submission
assignment_submission_history

-- Checkpoints
academy_checkpoint
academy_checkpoint_part
student_checkpoint_progress

-- Instructor Review
instructor_review_queue (view/materialized or query)
```

### Modifications to Existing Tables

```sql
-- academy_lesson: add assessment requirements
ALTER TABLE academy_lesson ADD COLUMN requires_quiz INTEGER DEFAULT 0;
ALTER TABLE academy_lesson ADD COLUMN requires_assignment INTEGER DEFAULT 0;
ALTER TABLE academy_lesson ADD COLUMN requires_practical INTEGER DEFAULT 0;
ALTER TABLE academy_lesson ADD COLUMN passing_gate INTEGER DEFAULT 0; -- hard gate

-- student_lesson_progress: enhance states
-- (status becomes more granular as above)
```

### Indexes Needed
- Quiz lookups by lesson/module/checkpoint
- Assignment submissions by status/reviewer
- Review queue performance
- Student progress queries

---

## Admin / Instructor Review Center

### Dashboard Sections

| Section | Purpose | Priority |
|---------|---------|----------|
| **AWAITING REVIEW** | New submissions needing attention (homework, chart demos, checkpoints) | P0 |
| **REVISION REQUIRED** | Awaiting student revision after feedback | P1 |
| **APPROVED** | Recently approved (for tracking) | P2 |
| **OVERDUE / INCOMPLETE** | Students stalled at gates > X days (configurable) | P1 |

### Student Detail View
Clicking a student should show complete educational record:

- **Curriculum Progress** - Course/modules/lessons completion with gate status
- **Quiz Scores & Attempts** - All quizzes, scores, attempts, pass/fail, time
- **Homework** - All assignments, status, submissions, revisions
- **Uploaded Charts** - All chart demo submissions with images
- **Instructor Feedback** - Full feedback history
- **Revisions** - Revision count and history per submission
- **Checkpoint Results** - All checkpoint parts, status, approvals
- **Strengths** - Areas of demonstrated competency
- **Areas Needing Improvement** - Patterns from feedback/revisions

### Instructor Actions
- Review submission with full context
- View annotated charts (image viewer with zoom)
- Provide detailed feedback
- Approve / Request Revision
- Assign scores (where applicable)
- See student's full attempt history
- Track revision count
- Add private notes (future)

### Permissions
- **Demi/Admin** - Full access to Review Center
- **Instructors** (future role) - Assigned courses only
- **Students** - See only own submissions/feedback

---

## UX Guidelines

### Assessment Philosophy
- **Intentional, not ubiquitous** - Don't quiz every paragraph
- **Meaningful gates** - Hard gates only where competency is critical (checkpoints, capstone)
- **Educational feedback** - Every assessment teaches, even on failure
- **Low friction for learning** - Knowledge checks can be quick; practicals matter more
- **Serious tone** - Challenging and professional without punitive UX

### Lesson Design
- Some lessons: Education + short knowledge check
- Other lessons: Education + quiz
- Important practical concepts: Chart demonstrations
- Major stages: Instructor-reviewed checkpoints
- Capstone: Comprehensive multi-part assessment

### Student Experience
- Clear indication of requirements before starting ("This lesson requires quiz pass to unlock next")
- Progress visibility: "X/Y requirements met"
- Pending review state clearly communicated
- Revision requests include actionable feedback
- Can see all feedback history
- No surprises about gates

### Avoid
- Turning every lesson into homework
- Making everything instructor-reviewed (use automation where possible)
- Revealing answers before submission
- Vague feedback
- Blocking on trivial items

---

## Phased Implementation Plan

### Phase 0: Architecture & Design (CURRENT)
- [x] Document competency-based requirements
- [x] Design assessment layers
- [x] Design schema (future)
- [x] Design Review Center
- [ ] **Get approval on this architecture**

### Phase 1: Assessment Foundation (Schema + Models)
- [ ] Create migrations for quiz/assignment/checkpoint tables
- [ ] Add assessment fields to lessons
- [ ] Build data models and query functions
- [ ] Student-facing API routes for quizzes/assignments

### Phase 2: Knowledge Checks (MCQ)
- [ ] Quiz builder (admin)
- [ ] Quiz taking UI (student)
- [ ] Auto-grading logic
- [ ] Randomization
- [ ] Educational feedback
- [ ] Passing gates integration with unlock logic

### Phase 3: Homework Assignments
- [ ] Assignment creation (admin)
- [ ] Student submission UI (text responses)
- [ ] Status tracking
- [ ] Submission storage (text initially)
- [ ] Basic instructor review UI

### Phase 4: Chart Demonstrations (Practical)
- [ ] Practical assessment UI
- [ ] Image upload/storage (Cloudflare R2 or similar)
- [ ] Image viewer in review
- [ ] Chart demo specific review workflow
- [ ] Gate enforcement

### Phase 5: Checkpoints & Hard Gates
- [ ] Checkpoint system
- [ ] Multi-part checkpoint UI
- [ ] Hard gate enforcement (server-side)
- [ ] Checkpoint progression logic

### Phase 6: Review Center & Capstone
- [ ] Academy Review Center dashboard
- [ ] Student detail view (complete record)
- [ ] Capstone requirements
- [ ] Graduation logic
- [ ] Reporting/analytics

**Note:** Phases 1-6 require approval and careful implementation. No production data changes.

---

## Non-Negotiable Constraints

- **DO NOT MODIFY PRODUCTION DATA** - All schema changes must go through migrations, tested first
- **DO NOT TOUCH** existing public `/book`, assessment/placement/training plan/intake/Stripe/membership logic
- **DO NOT APPLY** migration `0020`
- **NO CURRICULUM INSERTION** into DB without explicit approval
- **NO PROGRESS CHANGES** without explicit approval
- **NO COURSE PUBLISHING** without explicit approval
- **NO STUDENT ASSIGNMENT** without explicit approval
- **NO MODIFYING EXISTING LESSONS** for Module 2 without explicit approval
- **Competency-based required** - Cannot be reverted to pure completion-based
- **Instructor approval gates** must exist for practical/capstone elements
- **Answers never revealed before submission**
- **Educational feedback required**
- **Server-side gate enforcement** (client checks insufficient)

---

## Recommendations for Initial Implementation

1. **Start Simple** - Add quiz support first (highest ROI, automatable)
2. **Make it Configurable** - Passing thresholds, gate behavior per assessment
3. **Audit Everything** - Track attempts, submissions, reviews for compliance
4. **Build Review Center Early** - Essential for instructor workflow
5. **Test Gates Thoroughly** - Progression bugs would be catastrophic
6. **Keep Backwards Compatible** - Existing lessons without assessments should still work
7. **Design for Scale** - Multiple courses/instructors later

---

## Assessment Attempt Policy

### Quizzes & Graded Knowledge Checkpoints (Auto-Graded)

**Default Maximum Attempts:** 2 (hard limit for automatic retries)

#### Attempt 1
1. Student completes the assessment
2. **Record everything:** Every answer, score, attempt number, timestamp for each question
3. **If PASSED:** Checkpoint/requirement is satisfied. Unlock progression as applicable.
4. **If FAILED:** Display score and **topics/concepts to review** (do NOT reveal the complete answer key). 
5. Student may review relevant lessons before Attempt 2.

#### Attempt 2
1. Student retakes the assessment
2. **Randomization encouraged:** Prefer randomized question selection/order and randomized answer order where appropriate
3. **Record separately:** Track as Attempt 2 with full history
4. **If PASSED:** Checkpoint/requirement is satisfied
5. **If FAILED again:** Assessment status becomes `INSTRUCTOR REVIEW REQUIRED`

**Rules:**
- **No unlimited automatic retries** - Exactly 2 automatic attempts maximum
- **Full attempt history preserved** - Both attempts must be inspectable
- **No answer key leakage** - Never show full correct answers, only topic-level guidance on failure

#### After 2 Failed Attempts (Instructor Action Required)

When status is `INSTRUCTOR REVIEW REQUIRED`, Demi/admin can:

- **Inspect both attempts** side-by-side
- **Review missed questions** per attempt
- **Identify weak concepts/topics** (aggregate from failures)
- **Leave instructor feedback**
- **Assign remediation lessons/homework** targeting weak areas
- **Conduct one-on-one discussion** of problem concepts
- **Manually authorize ONE additional attempt** when appropriate (and only when justified)

**Student UI must clearly display:**
```
Attempts Used: 2 of 2
Status: Instructor Review Required
[Message: Additional attempts require instructor authorization]
```

---

### Homework Assignments & Chart Demonstrations (Instructor-Reviewed)

**Do NOT apply the 2-attempt auto-limit.** These use a **revision workflow** because correcting practical work is integral to learning.

#### Workflow
```
NOT STARTED → IN PROGRESS → SUBMITTED → UNDER REVIEW
                                        ↓                ↓
                                      APPROVED      REVISION REQUIRED
                                                      ↓
                                                   RESUBMITTED
                                                      ↓
                                                   UNDER REVIEW
                                                      ↓
                                                    (repeat as needed)
```

#### Rules
- **Multiple revisions allowed** - Instructor may request revisions as many times as necessary for competency
- **Full revision history tracked** - Every submission, resubmission, feedback, and action must be logged
- **Improvement visible** - Instructor can review revision history to see student growth
- **No automatic attempt cap** - Focus is on reaching competency, not limiting tries
- **Feedback-driven** - Each revision request must include actionable instructor feedback

#### Data Tracking
- `attempt_number` / `revision_number` increments on each resubmission
- `revision_of_id` links to previous submission
- Full audit trail in `assignment_submission_history`

---

### Checkpoint Unlocking Requirements

For **required checkpoints** (especially major milestones), the next major curriculum stage **MUST remain locked** until ALL required conditions are satisfied.

#### Example: Market Structure Checkpoint
```
MARKET STRUCTURE CHECKPOINT
├── Knowledge Quiz (Part A): PASSED ✓
├── Chart Demonstration (Part B): APPROVED ✓  
├── Written Explanation (Part C): APPROVED ✓
└── Instructor Review (Part D): COMPLETE ✓

CHECKPOINT COMPLETE → NEXT MAJOR STAGE UNLOCKED
```

**Enforcement:** Server-side validation required. Client-side checks are insufficient. All parts must meet their respective requirements (quiz passed within attempts, practical work instructor-approved).

---

### One-On-One Instructor Mode (Future Feature)

A dedicated **Instructor Session** view for live/structured one-on-one instruction.

#### Instructor Dashboard (Demi View)
Must display at a glance:
- **Current Module** - Where student is in curriculum
- **Completed Lessons** - Full completion history
- **Quiz Scores** - All quiz results with attempts
- **Failed Questions/Topics** - Aggregated weaknesses
- **Homework Status** - All assignments and revisions
- **Chart Submissions** - All practical work
- **Revision History** - Complete revision trail
- **Weak Areas** - AI/heuristic-suggested focus areas based on data

#### Question Generation
- **Scope-restricted:** Generate/select questions **ONLY from concepts the student has already studied** (based on completed lessons/modules)
- **Flexible selection:** Demi can manually choose specific topics or auto-generate
- **Randomization:** Random question selection from eligible pool
- **Contextual:** Pull from quiz question bank filtered by completed curriculum

#### Question Examples
- *"Calculate 1% risk on a $2,500 account."* (Risk Management - if studied)
- *"Identify the swing high on this chart."* (Market Structure - if studied)
- *"Explain why this is or is not a valid break of structure."* (Market Structure - if studied)
- *"Mark where you'd enter this setup and explain your reasoning."* (Pragmatic application)

#### Session Recording (Future)
- **Recordable performance:** Student answers and performance during one-on-one can be recorded
- **Learning history:** Becomes part of permanent educational record
- **Instructor notes:** Private notes per session
- **Follow-up tracking:** Link remediation assigned during session to student record

**Note:** This is architecture/design only. Do not implement yet.



---

**END OF ARCHITECTURE DOCUMENT**

*This document is submitted for approval. No database changes, curriculum insertion, or code modifications have been made.*
