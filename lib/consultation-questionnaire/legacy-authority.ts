import { CANONICAL_LEGACY_KEYS } from '../consultation-review/canonical';

/** Semantic overlap is protected even when value vocabularies cannot be auto-mapped.
 * Overall self-reported level, installed software and raw financial amounts remain
 * distinct legacy-owned evidence; never mistake them for instructor assessment. */
export const PROTECTED_LEGACY_FACT_KEYS: readonly string[] = Object.freeze([...new Set([
  ...CANONICAL_LEGACY_KEYS, 'marketsTraded', 'markets',
  'platformsUsed', 'learningPrefs', 'learningMethods', 'accountabilityPrefs',
  'devices', 'preferredStudyTimes', 'internetQuality', 'timeZone2',
  'recommendedStart', 'personalizedPlan', 'actionItems',
])]);

type AuthorityDB = { prepare(sql:string): { bind(...args:unknown[]): { first<T>():Promise<T|null> } } };
export async function hasCanonicalIntake(db: AuthorityDB, studentId:string):Promise<boolean> {
  return !!await db.prepare("SELECT id FROM student_intake_v2 WHERE student_user_id=? AND status IN ('draft','in_progress','completed') LIMIT 1").bind(studentId).first<{id:string}>();
}
export function isProtectedLegacyKey(key:string):boolean {
  return PROTECTED_LEGACY_FACT_KEYS.includes(key) || key.startsWith('summary');
}
export function legacyAuthorityError():Error & {status:number} {
  return Object.assign(new Error('These historical answers are read-only because canonical Intake V2 has started. Update covered facts in the canonical consultation review.'),{status:409});
}
export function protectedLegacyChanges(previous:Record<string,unknown>, incoming:Record<string,unknown>):boolean {
  // Comparing the union also protects deletions in full-payload revision restores.
  return [...new Set([...Object.keys(previous),...Object.keys(incoming)])].some(k=>isProtectedLegacyKey(k)&&JSON.stringify(previous[k])!==JSON.stringify(incoming[k]));
}
export async function assertLegacyChangesAllowed(db:AuthorityDB,studentId:string,previous:Record<string,unknown>,incoming:Record<string,unknown>) {
  const changed=protectedLegacyChanges(previous,{...previous,...incoming});
  if(changed&&await hasCanonicalIntake(db,studentId))throw legacyAuthorityError();
}
export async function assertLegacyCreateAllowed(db:AuthorityDB,studentId:string) {
  if(await hasCanonicalIntake(db,studentId))throw legacyAuthorityError();
}
