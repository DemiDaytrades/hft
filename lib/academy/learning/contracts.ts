export type Concept = "barter" | "functions" | "currency" | "international" | "fx";
export type Answer = string | string[] | Record<string, string>;
export type QuestionKind = "choice" | "matching" | "ordering" | "written" | "true_false_explain";
export type Question = {
  id: string; kind: QuestionKind; prompt: string; concept: Concept;
  options?: { id: string; label: string }[];
  items?: { id: string; label: string }[];
  targets?: { id: string; label: string }[];
  correct?: Answer; rubric?: string; mastery?: boolean;
};
export type Activity = Question & {
  required: boolean; diagnostic?: boolean; feedback: string; retryFeedback: string;
};
export type LessonStep = {
  id: string; eyebrow: string; title: string; paragraphs: string[];
  diagram?: string[]; reveals?: { id: string; title: string; text: string; example: string }[];
  activities?: Activity[]; video?: { title: string; url?: string; placeholder: string };
};
export type HomeworkBranch = "strong" | "barter" | "currency" | "broad";
export type InteractiveLesson = {
  format: "hft-interactive-v1"; version: string; id: string; courseId: string; moduleId: string;
  title: string; stage: string; purpose: string; quizId: string; assignmentId: string;
  concepts: { id: Concept; label: string }[];
  steps: LessonStep[]; questionBanks: Question[][];
  homework: Record<HomeworkBranch, { title: string; instructions: string; rubric: string }>;
  remediation: Record<Concept, { title: string; text: string }>;
};
export type StudentQuestion = Omit<Question, "correct" | "rubric">;
export type StudentLesson = Omit<InteractiveLesson, "questionBanks" | "homework" | "steps"> & {
  steps: (Omit<LessonStep, "activities"> & { activities?: Omit<Activity, "correct" | "rubric" | "feedback" | "retryFeedback">[] })[];
};
export type AssessmentReview = {
  grades: Record<string, boolean>; mastery: Record<string, boolean>; feedback: string;
};
export type AttemptView = {
  id: string; number: number; status: string; questions: StudentQuestion[];
  answers: Record<string, Answer>; score: number | null;
  mastery: Record<string, boolean>; feedback: string; branch: HomeworkBranch | null;
};
export type HomeworkView = { id: string; attemptId: string; number: number; status: string; text: string; feedback: string; branch: HomeworkBranch };
export type LearningState = {
  lesson: StudentLesson; completedSteps: string[]; activityResults: Record<string, { passed: boolean; feedback: string }>;
  attempts: AttemptView[]; homework: HomeworkView[];
  homeworkTask: { title: string; instructions: string } | null;
  weakConcepts: Concept[]; status: "In progress" | "Awaiting instructor review" | "Remediation required" | "Awaiting homework" | "Completed";
  canStartAssessment: boolean; canSubmitHomework: boolean; canComplete: boolean;
  nextLesson: { id: string; title: string; available: boolean } | null;
};
