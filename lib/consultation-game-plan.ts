import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { newId, nowIso } from "@/lib/academy";

function parseJson(v: any) {
  if (!v) return {};
  if (typeof v === "string") {
    try { return JSON.parse(v); } catch { return {}; }
  }
  return v;
}

function stringifyJson(v: any) {
  return JSON.stringify(v || {});
}

async function getDb() {
  const ctx = getCloudflareContext();
  const env = (ctx as any).env || (ctx as any);
  return env.DB;
}

export async function getSeries(userId: string) {
  const db: any = await getDb();
  const row = await db.prepare(`SELECT * FROM "consultation_game_plan_series" WHERE user_id = ?;`).bind(userId).first();
  if (!row) return null;
  return row;
}

export async function ensureSeries(userId: string, questionnaireId: string) {
  const db: any = await getDb();
  const existing = await getSeries(userId);
  if (existing) return existing;
  const now = nowIso();
  const id = newId();
  await db.prepare(`INSERT INTO "consultation_game_plan_series" (id, user_id, questionnaire_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?);`)
    .bind(id, userId, questionnaireId, now, now)
    .run();
  return db.prepare(`SELECT * FROM "consultation_game_plan_series" WHERE id = ?;`).bind(id).first();
}

function mapVersion(row: any) {
  if (!row) return null;
  return { ...row, student_visible_payload: parseJson(row.student_visible_payload), instructor_recommendations: parseJson(row.instructor_recommendations), instructor_private_data: parseJson(row.instructor_private_data), derived_financial: parseJson(row.derived_financial), academy_recommendation: parseJson(row.academy_recommendation) };
}

export async function getLatestVersion(seriesId: string) {
  const db: any = await getDb();
  const row = await db.prepare(`SELECT * FROM "consultation_game_plan_version" WHERE series_id = ? ORDER BY version DESC LIMIT 1;`).bind(seriesId).first();
  return mapVersion(row);
}

export async function getVersionHistory(seriesId: string) {
  const db: any = await getDb();
  const result = await db.prepare(`SELECT id, series_id, version, status, replaces_id, replaced_by_id, approved_by, approved_at, published_at, created_at, updated_at FROM "consultation_game_plan_version" WHERE series_id = ? ORDER BY version ASC;`).bind(seriesId).all();
  return (result?.results as any[]) || [];
}

export async function getPublishedForUser(userId: string) {
  const db: any = await getDb();
  const pub = await db.prepare(`SELECT * FROM "consultation_game_plan_published" WHERE user_id = ?;`).bind(userId).first();
  if (!pub) return null;
  const row = await db.prepare(`SELECT * FROM "consultation_game_plan_version" WHERE id = ?;`).bind((pub as any).published_version_id).first();
  if (!row) return null;
  const mapped = mapVersion(row);
  return mapped ? { ...mapped, published_pointer: pub } : null;
}

function deriveFinancial(data: any) {
  const parseNum = (v: any) => {
    const n = parseFloat(String(v || "").replace(/[^0-9.-]/g, ""));
    return isNaN(n) ? 0 : n;
  };
  const fixedBills = ["billRentMortgage", "billCarPayment", "billCarInsurance", "billPhone", "billUtilities", "billInternet", "billCreditCards", "billLoans", "billChildFamilySupport", "billGroceries", "billGasTransportation", "billSubscriptions", "billOtherRecurring"];
  let totalBills = 0;
  for (const k of fixedBills) totalBills += parseNum(data[k]);
  for (const b of data.customBills || []) totalBills += parseNum(b.amount);
  const monthlyIncome = parseNum(data.monthlyTakeHomeIncome) || parseNum(data.salary) || parseNum(data.currentApproxMonthlyIncome);
  const otherIncome = parseNum(data.monthlyOtherIncome);
  const totalIncome = monthlyIncome + otherIncome;
  return { monthlyIncome, otherIncome, totalIncome, totalBills, remaining: totalIncome - totalBills };
}

function buildStudentVisiblePayload(questionnaireData: any, instructorRec: any = {}) {
  return {
    startingPoint: {
      experienceLevel: questionnaireData.experienceLevel || questionnaireData.yearsTrading,
      tradedBefore: questionnaireData.tradedBefore,
      markets: questionnaireData.marketsTraded,
      platforms: questionnaireData.platformsUsed,
      broker: questionnaireData.brokerCurrent || questionnaireData.preferredBroker,
      strengths: instructorRec.strengths || questionnaireData.strengthsIdentified,
      knowledgeGaps: instructorRec.areasToFocus || questionnaireData.areasToFocus || questionnaireData.weakestTopic,
    },
    goals: {
      primary: questionnaireData.primaryGoal || questionnaireData.whyJoinHft,
      goal30: questionnaireData.goal30Day,
      goal90: questionnaireData.goal90Day,
      goal612: questionnaireData.goal6Month || questionnaireData.goal12Month,
      motivation: questionnaireData.goalImportance,
    },
    learningProfile: {
      prefs: questionnaireData.learningPrefs || questionnaireData.learningPace,
      practicePrefs: questionnaireData.practiceAssignmentsHelp,
      weeklyCapacity: questionnaireData.hoursPerWeek || questionnaireData.hoursPerWeekHft,
      supportPrefs: questionnaireData.supportWhenStuck || questionnaireData.accountabilityPrefs,
    },
    schedule: {
      timezone: questionnaireData.timeZone || questionnaireData.timeZone2,
      schedule: questionnaireData.workSchedule || questionnaireData.commitments,
      classWindows: questionnaireData.preferredStudyTimes,
    },
    roadmap: {
      recommendedStart: instructorRec.recommendedStart || questionnaireData.recommendedStart,
      firstLesson: instructorRec.firstLesson || instructorRec.recommendedStart,
      firstHomework: instructorRec.firstHomework || questionnaireData.actionItems,
      nextAction: instructorRec.nextAction || questionnaireData.actionItems,
      personalizedPlan: instructorRec.personalizedPlan || questionnaireData.personalizedPlan,
    }
  };
}

export async function generateDraft(userId: string, questionnaireId: string, questionnaireData: any) {
  const db: any = await getDb();
  const series: any = await ensureSeries(userId, questionnaireId);
  const latest: any = await getLatestVersion(series.id);
  if (latest && latest.status === 'published') {
    throw new Error("Latest version is published. Create a revision instead.");
  }
  if (latest && (latest.status === 'draft' || latest.status === 'review')) {
    const derived = deriveFinancial(questionnaireData);
    const instructorRec = latest.instructor_recommendations || {};
    const studentVisible = buildStudentVisiblePayload(questionnaireData, instructorRec);
    const now = nowIso();
    await db.prepare(`UPDATE "consultation_game_plan_version" SET student_visible_payload = ?, instructor_recommendations = ?, derived_financial = ?, updated_at = ? WHERE id = ?;`)
      .bind(stringifyJson(studentVisible), stringifyJson(instructorRec), stringifyJson(derived), now, latest.id)
      .run();
    return getLatestVersion(series.id);
  }
  const derived = deriveFinancial(questionnaireData);
  const now = nowIso();
  const id = newId();
  const version = 1;
  const instructorRec = { strengths: questionnaireData.strengthsIdentified, areasToFocus: questionnaireData.areasToFocus, personalizedPlan: questionnaireData.personalizedPlan, actionItems: questionnaireData.actionItems, recommendedStart: questionnaireData.recommendedStart };
  const studentVisible = buildStudentVisiblePayload(questionnaireData, instructorRec);
  await db.prepare(`INSERT INTO "consultation_game_plan_version" (id, series_id, user_id, questionnaire_id, version, status, student_visible_payload, instructor_recommendations, instructor_private_data, derived_financial, academy_recommendation, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?, ?, ?);`)
    .bind(id, series.id, userId, questionnaireId, version, 'draft', stringifyJson(studentVisible), stringifyJson(instructorRec), stringifyJson({ instructorNotes: questionnaireData.instructorNotes }), stringifyJson(derived), stringifyJson({}), now, now)
    .run();
  return getLatestVersion(series.id);
}

export async function updateVersion(versionId: string, userId: string, updates: any) {
  const db: any = await getDb();
  const row: any = await db.prepare(`SELECT * FROM "consultation_game_plan_version" WHERE id = ? AND user_id = ?;`).bind(versionId, userId).first();
  if (!row) throw new Error("Not found");
  if (row.status === 'published') throw new Error("Cannot edit published version");
  if (row.status === 'approved') throw new Error("Cannot edit approved version");
  const now = nowIso();
  const studentVisible = updates.student_visible_payload !== undefined ? stringifyJson(updates.student_visible_payload) : row.student_visible_payload;
  const instructorRec = updates.instructor_recommendations !== undefined ? stringifyJson(updates.instructor_recommendations) : row.instructor_recommendations;
  const instructorPrivate = updates.instructor_private_data !== undefined ? stringifyJson(updates.instructor_private_data) : row.instructor_private_data;
  const derived = updates.derived_financial !== undefined ? stringifyJson(updates.derived_financial) : row.derived_financial;
  const academyRec = updates.academy_recommendation !== undefined ? stringifyJson(updates.academy_recommendation) : row.academy_recommendation;
  const status = updates.status && ['draft','review'].includes(updates.status) ? updates.status : row.status;
  await db.prepare(`UPDATE "consultation_game_plan_version" SET student_visible_payload = ?, instructor_recommendations = ?, instructor_private_data = ?, derived_financial = ?, academy_recommendation = ?, status = ?, updated_at = ? WHERE id = ?;`)
    .bind(studentVisible, instructorRec, instructorPrivate, derived, academyRec, status, now, versionId)
    .run();
  return getLatestVersion(row.series_id);
}

export async function approveVersion(versionId: string, userId: string, approverId: string) {
  const db: any = await getDb();
  const row: any = await db.prepare(`SELECT * FROM "consultation_game_plan_version" WHERE id = ? AND user_id = ?;`).bind(versionId, userId).first();
  if (!row) throw new Error("Not found");
  if (row.status === 'published') throw new Error("Already published");
  const studentVisible = parseJson(row.student_visible_payload);
  if (!studentVisible?.goals?.primary && !studentVisible?.roadmap?.personalizedPlan) {
    throw new Error("Cannot approve: missing goals/plan");
  }
  const now = nowIso();
  await db.prepare(`UPDATE "consultation_game_plan_version" SET status = 'approved', approved_by = ?, approved_at = ?, updated_at = ? WHERE id = ?;`)
    .bind(approverId, now, now, versionId)
    .run();
  return getLatestVersion(row.series_id);
}

export async function publishVersion(versionId: string, userId: string) {
  const db: any = await getDb();
  const row: any = await db.prepare(`SELECT * FROM "consultation_game_plan_version" WHERE id = ? AND user_id = ?;`).bind(versionId, userId).first();
  if (!row) throw new Error("Not found");
  if (row.status !== 'approved') throw new Error("Must be approved before publishing");
  const now = nowIso();
  await db.prepare(`UPDATE "consultation_game_plan_version" SET status = 'published', published_at = COALESCE(published_at, ?), updated_at = ? WHERE id = ?;`)
    .bind(now, now, versionId)
    .run();
  await db.prepare(`INSERT OR REPLACE INTO "consultation_game_plan_published" (user_id, series_id, published_version_id, published_at, updated_at) VALUES (?, ?, ?, ?, ?);`)
    .bind(userId, row.series_id, versionId, now, now)
    .run();
  return getLatestVersion(row.series_id);
}

export async function createRevision(versionId: string, userId: string) {
  const db: any = await getDb();
  const row: any = await db.prepare(`SELECT * FROM "consultation_game_plan_version" WHERE id = ? AND user_id = ?;`).bind(versionId, userId).first();
  if (!row) throw new Error("Not found");
  if (row.status !== 'published') throw new Error("Can only revise published versions");
  const now = nowIso();
  const newIdVer = newId();
  const newVersion = row.version + 1;
  await db.prepare(`INSERT INTO "consultation_game_plan_version" (id, series_id, user_id, questionnaire_id, version, status, replaces_id, student_visible_payload, instructor_recommendations, instructor_private_data, derived_financial, academy_recommendation, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);`)
    .bind(newIdVer, row.series_id, userId, row.questionnaire_id, newVersion, 'draft', row.id, row.student_visible_payload, row.instructor_recommendations, row.instructor_private_data, row.derived_financial, row.academy_recommendation, now, now)
    .run();
  await db.prepare(`UPDATE "consultation_game_plan_version" SET replaced_by_id = ? WHERE id = ?;`).bind(newIdVer, row.id).run();
  return getLatestVersion(row.series_id);
}
