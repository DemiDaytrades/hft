// @ts-nocheck -- synthetic D1 fixtures; no production runtime.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');
function load(file, mocks={}) {
  const original = Module._load;
  delete require.cache[path.resolve(file)];
  Module._load = function(name,...args) { return Object.hasOwn(mocks,name) ? mocks[name] : original.call(this,name,...args); };
  try { return require(path.resolve(file)); } finally { Module._load=original; }
}
function fixture(canonical=true) {
  const current = {id:'q',user_id:'synthetic',status:'in_progress',data:JSON.stringify({marketsTraded:['Forex'],preferredName:'Known',anythingElse:'old narrative',instructorNotes:'private',unknownPrivate:'retain'}),updated_at:'2026-01-01'};
  const history=[]; const actors=[]; let writes=0;
  const db={prepare(sql){return {bind(...args){return {
    async first(){if(sql.includes('student_intake_v2'))return canonical?{id:'v2'}:null;if(sql.includes('consultation_questionnaire_revision'))return {id:'revision',user_id:'synthetic',status:'draft',data:JSON.stringify({marketsTraded:['Crypto']})};return current;},
    async run(){writes++;if(sql.includes('INSERT INTO "consultation_questionnaire_revision"')){history.push(args[3]);actors.push(args[8]);}if(sql.includes('UPDATE "consultation_questionnaire" SET data'))current.data=args[0];return {meta:{changes:1}};}
  };}};}};
  db.batch = async statements => { const results=[]; for(const stmt of statements)results.push(await stmt.run()); return results; };
  return {db,current,history,actors,writes:()=>writes};
}
function adminRoute(f,revision=false){return load(revision?'app/api/admin/consultation/questionnaire/revisions/route.ts':'app/api/admin/consultation/questionnaire/route.ts',{
 'next/server':{NextResponse:{json:(body,options)=>({body,status:options?.status??200})}},
 '@/lib/dal':{requireAdmin:async()=>({id:'staff'})},
 '@opennextjs/cloudflare':{getCloudflareContext:()=>({env:{DB:f.db}})},
 '@/lib/academy':{db:()=>f.db,newId:()=> 'new-id',nowIso:()=> '2026-11-07'}
});}
const request=body=>new Request('https://example.test',{method:'POST',body:JSON.stringify(body)});
test('canonical capture rejects duplicate questionnaire saves and completion before history or answer writes',async()=>{
 for(const action of ['save','complete']){
  const f=fixture();const before=f.current.data;
  const result=await adminRoute(f).POST(request({action,id:'q',userId:'synthetic',data:{marketsTraded:['Crypto']}}));
  assert.equal(result.status,409);assert.equal(f.current.data,before);assert.equal(f.writes(),0);assert.deepEqual(f.history,[]);
 }
});
test('legacy-only narrative updates retain facts and private keys and snapshot previous JSON',async()=>{
 const f=fixture();const before=f.current.data;
 const result=await adminRoute(f).POST(request({action:'save',id:'q',userId:'synthetic',data:{anythingElse:'new narrative'}}));
 assert.equal(result.status,200);
 assert.deepEqual(JSON.parse(f.current.data),{marketsTraded:['Forex'],preferredName:'Known',anythingElse:'new narrative',instructorNotes:'private',unknownPrivate:'retain'});
 assert.deepEqual(f.history,[before]);
});
test('revision restore cannot overwrite protected legacy facts after canonical capture',async()=>{
 const f=fixture();const before=f.current.data;
 const result=await adminRoute(f,true).POST(request({action:'restore',userId:'synthetic',revisionId:'revision'}));
 assert.equal(result.status,409);assert.equal(f.current.data,before);assert.equal(f.writes(),0);
});
test('manual placement and training writes are retired without opening database',async()=>{
 const cloud={'@opennextjs/cloudflare':{getCloudflareContext:()=>{throw Error('database opened');}}};
 const placement=load('lib/student-placement.ts',cloud),training=load('lib/training-plan.ts',cloud);
 await assert.rejects(placement.upsertPlacement('synthetic',{},'staff'),/historical|retired/i);
 await assert.rejects(training.upsertPlan('synthetic',{},'active','staff'),/historical|retired/i);
});
test('legacy intake rejects mapped fact changes using actual record owner and keeps distinct evidence editable',async()=>{
 const row={id:'old',userId:'synthetic',data:JSON.stringify({work:'original work',mt5Installed:'No',experienceLevel:'Beginner'})};let writes=0;
 const db={prepare(sql){return {bind(...args){return {async first(){return sql.includes('student_intake_v2')?{id:'v2'}:row;},async run(){writes++;if(sql.startsWith('INSERT'))row.data=args[3];else row.data=args[0];return {meta:{changes:1}};}};}};}};
 const api=load('lib/student-intake.ts',{'@opennextjs/cloudflare':{getCloudflareContext:()=>({env:{DB:db}})}});
 await assert.rejects(api.saveDraft('old',{work:'different work'},'synthetic'),/read-only|canonical/i);assert.equal(writes,0);
 await assert.rejects(api.saveDraft('old',{mt5Installed:'Yes'},'another-user'),/not found/i);assert.equal(writes,0);
 await api.saveDraft('old',{mt5Installed:'Yes',experienceLevel:'Intermediate'},'synthetic');
 assert.deepEqual(JSON.parse(row.data),{work:'original work',mt5Installed:'Yes',experienceLevel:'Intermediate'});
});
test('shared form renders mapped facts historical while unrelated student evidence stays editable without admin link',()=>{
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
 const Form=load('app/(app)/consultation/questionnaire/QuestionnaireForm.tsx').default;
 const html=renderToStaticMarkup(React.createElement(Form,{questionnaire:{id:'q',status:'draft',data:{preferredName:'Known',aboutYourself:'Personal narrative'}},canonicalIntakeExists:true,protectedKeys:['preferredName']}));
 assert.match(html,/historical|read-only/i);assert.match(html,/<input[^>]*disabled=""[^>]*value="Known"/);
 assert.match(html,/<textarea(?![^>]*disabled)[^>]*>Personal narrative<\/textarea>/);
 assert.doesNotMatch(html,/href="\/admin\//);
});
test('student service cannot change canonical-covered facts even if a write endpoint is re-enabled',async()=>{
 const f=fixture();const before=f.current.data;
 const api=load('lib/consultation-questionnaire/index.ts',{'@opennextjs/cloudflare':{getCloudflareContext:()=>({env:{DB:f.db}})}});
 for(const method of ['saveQuestionnaireDraft','submitQuestionnaire'])await assert.rejects(api[method]({id:'q',userId:'synthetic',data:{preferredName:'different'}}),/read-only|canonical/i);
 assert.equal(f.current.data,before);assert.equal(f.writes(),0);
});
test('manual training history renders stored values and current review destinations without edit controls',()=>{
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
 const Workspace=load('app/(app)/admin/students/[id]/training-plan/TrainingPlanWorkspace.tsx').default;
 const html=renderToStaticMarkup(React.createElement(Workspace,{userId:'synthetic',planStatus:'active',data:{level:'Intermediate',track:'Custom',startingSummary:'Original plan',instructorNotes:'Retained private admin note',priorities:['MT5']}}));
 assert.match(html,/Intermediate/);assert.match(html,/Original plan/);assert.match(html,/Retained private admin note/);
 assert.match(html,/learning-path\?studentId=synthetic/);assert.match(html,/financial-plan\?studentId=synthetic/);
 assert.doesNotMatch(html,/<form|<input|<textarea|<button/);
});
test('editing a distinct legacy answer creates a new version and preserves original completed JSON',async()=>{
 const row={id:'old',userId:'synthetic',status:'completed',data:JSON.stringify({gtk2:'original',experienceLevel:'Beginner'}),version:2};const originals=row.data;let inserted=null;let updates=0;
 const db={prepare(sql){return {bind(...args){return {async first(){if(sql.includes('student_intake_v2'))return {id:'v2'};return row;},async run(){if(sql.startsWith('INSERT'))inserted=args;else updates++;return {meta:{changes:1}};}};}};}};
 const api=load('lib/student-intake.ts',{'@opennextjs/cloudflare':{getCloudflareContext:()=>({env:{DB:db}})}});
 const result=await api.saveDraft('old',{experienceLevel:'Intermediate'},'synthetic','staff');
 assert.equal(row.data,originals);assert.equal(updates,0);assert.ok(inserted);assert.notEqual(result,'old');
 assert.equal(inserted[1],'synthetic');assert.deepEqual(JSON.parse(inserted[3]),{gtk2:'original',experienceLevel:'Intermediate'});
});
test('SQLite interleaving V2 creation after guard read cannot change protected questionnaire facts or orphan history',async()=>{
 const {DatabaseSync}=require('node:sqlite');
 for(const action of ['save','complete','restore']){
  const sql=new DatabaseSync(':memory:');
  sql.exec(`CREATE TABLE consultation_questionnaire(id TEXT,user_id TEXT,status TEXT,data TEXT,updated_at TEXT,submitted_at TEXT,created_at TEXT); CREATE TABLE student_intake_v2(id TEXT,student_user_id TEXT,status TEXT); CREATE TABLE consultation_questionnaire_revision(id TEXT,questionnaire_id TEXT,user_id TEXT,data TEXT,status TEXT,questionnaire_updated_at TEXT,source TEXT,restored_from_revision_id TEXT,actor_user_id TEXT,created_at TEXT); INSERT INTO consultation_questionnaire VALUES ('q','synthetic','draft','{"preferredName":"Known"}','old',NULL,'old'); INSERT INTO consultation_questionnaire_revision VALUES ('revision','q','synthetic','{"preferredName":"Different"}','draft','older','save',NULL,NULL,'older');`);
  let inserted=false;
  function interleave(){if(!inserted){inserted=true;sql.exec("INSERT INTO student_intake_v2 VALUES ('v2','synthetic','draft')");}}
  const db={prepare(query){let args=[];return {bind(...a){args=a;return this;},async first(){return sql.prepare(query).get(...args)??null;},async run(){if(query.startsWith('UPDATE'))interleave();return {meta:{changes:Number(sql.prepare(query).run(...args).changes)}};}};},async batch(stmts){interleave();sql.exec('BEGIN');try{const results=[];for(const stmt of stmts)results.push(await stmt.run());sql.exec('COMMIT');return results;}catch(e){sql.exec('ROLLBACK');throw e;}}};
  const result=await adminRoute({db},action==='restore').POST(request(action==='restore'?{action,userId:'synthetic',revisionId:'revision'}:{action,id:'q',userId:'synthetic',data:{preferredName:'Different'}}));
  assert.equal(result.status,409);assert.match(result.body.error,/canonical/i);
  assert.equal(sql.prepare('SELECT data FROM consultation_questionnaire').get().data,'{"preferredName":"Known"}');
  assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM consultation_questionnaire_revision').get().n,1);
  sql.close();
 }
});
test('SQLite old-intake version insert rechecks canonical authority after its preflight read',async()=>{
 const {DatabaseSync}=require('node:sqlite');const sql=new DatabaseSync(':memory:');
 sql.exec(`CREATE TABLE student_intake(id TEXT,userId TEXT,status TEXT,version INTEGER,createdBy TEXT,data TEXT,createdAt TEXT,updatedAt TEXT); CREATE TABLE student_intake_v2(id TEXT,student_user_id TEXT,status TEXT); INSERT INTO student_intake VALUES ('old','synthetic','completed',1,'staff','{"work":"Known"}','old','old');`);
 let inserted=false;const db={prepare(query){let args=[];return {bind(...a){args=a;return this;},async first(){return sql.prepare(query).get(...args)??null;},async run(){if(query.startsWith('INSERT')&&!inserted){inserted=true;sql.exec("INSERT INTO student_intake_v2 VALUES ('v2','synthetic','draft')");}return {meta:{changes:Number(sql.prepare(query).run(...args).changes)}};}};}};
 const api=load('lib/student-intake.ts',{'@opennextjs/cloudflare':{getCloudflareContext:()=>({env:{DB:db}})}});
 await assert.rejects(api.saveDraft('old',{work:'Different'},'synthetic','staff'),/canonical/i);
 assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM student_intake').get().n,1);
 assert.equal(sql.prepare('SELECT data FROM student_intake').get().data,'{"work":"Known"}');sql.close();
});
test('SQLite questionnaire snapshot failure rolls back the answer mutation',async()=>{
 const {DatabaseSync}=require('node:sqlite');const sql=new DatabaseSync(':memory:');
 sql.exec(`CREATE TABLE consultation_questionnaire(id TEXT,user_id TEXT,status TEXT,data TEXT,updated_at TEXT,submitted_at TEXT); CREATE TABLE student_intake_v2(id TEXT,student_user_id TEXT,status TEXT); CREATE TABLE consultation_questionnaire_revision(id TEXT,questionnaire_id TEXT,user_id TEXT,data TEXT,status TEXT,questionnaire_updated_at TEXT,source TEXT,restored_from_revision_id TEXT,actor_user_id TEXT,created_at TEXT); INSERT INTO consultation_questionnaire VALUES ('q','synthetic','draft','{"anythingElse":"Known"}','old',NULL); CREATE TRIGGER no_snapshot BEFORE INSERT ON consultation_questionnaire_revision BEGIN SELECT RAISE(ABORT,'snapshot failed'); END;`);
 const db={prepare(query){let args=[];return {bind(...a){args=a;return this;},async run(){return {meta:{changes:Number(sql.prepare(query).run(...args).changes)}};}};},async batch(stmts){sql.exec('BEGIN');try{const r=[];for(const stmt of stmts)r.push(await stmt.run());sql.exec('COMMIT');return r;}catch(e){sql.exec('ROLLBACK');throw e;}}};
 const {commitLegacyQuestionnaire}=load('lib/consultation-questionnaire/legacy-write.ts');
 await assert.rejects(commitLegacyQuestionnaire(db,{previous:{id:'q',user_id:'synthetic',status:'draft',data:'{"anythingElse":"Known"}',updated_at:'old'},data:'{"anythingElse":"New"}',status:'draft',submittedAt:null,source:'save_draft',now:'new',actorUserId:'staff'}),/snapshot failed/);
 assert.equal(sql.prepare('SELECT data FROM consultation_questionnaire').get().data,'{"anythingElse":"Known"}');sql.close();
});

test('admin save complete restore and student save record authenticated revision actor',async()=>{
 for(const action of ['save','complete','restore']){
  const f=fixture(false);
  const result=await adminRoute(f,action==='restore').POST(request(action==='restore'?{action,userId:'synthetic',revisionId:'revision'}:{action,id:'q',userId:'synthetic',data:{anythingElse:'updated'}}));
  assert.equal(result.status,200);assert.deepEqual(f.actors,['staff']);
 }
 const f=fixture(false);
 const api=load('lib/consultation-questionnaire/index.ts',{'@opennextjs/cloudflare':{getCloudflareContext:()=>({env:{DB:f.db}})}});
 await api.saveQuestionnaireDraft({id:'q',userId:'synthetic',data:{anythingElse:'updated'}});
 assert.deepEqual(f.actors,['synthetic']);
});
test('narrowed legacy unique narratives retain their owner instead of being false duplicates',async()=>{
 const f=fixture();
 const result=await adminRoute(f).POST(request({action:'save',id:'q',userId:'synthetic',data:{currentWork:'New nuanced work story',financialGoal:'Specific original financial goal',experienceLevel:'Intermediate',mt5Installed:'Yes',goal612Month:'Combined original vision'}}));
 assert.equal(result.status,200);
 const saved=JSON.parse(f.current.data);assert.equal(saved.currentWork,'New nuanced work story');assert.equal(saved.financialGoal,'Specific original financial goal');assert.equal(saved.experienceLevel,'Intermediate');assert.equal(saved.mt5Installed,'Yes');assert.equal(saved.goal612Month,'Combined original vision');
});

test('SQLite numbered historical goal cannot fork a competing fact when canonical capture starts concurrently',async()=>{
 const {DatabaseSync}=require('node:sqlite');const sql=new DatabaseSync(':memory:');
 sql.exec(`CREATE TABLE student_intake(id TEXT,userId TEXT,status TEXT,version INTEGER,createdBy TEXT,data TEXT,createdAt TEXT,updatedAt TEXT); CREATE TABLE student_intake_v2(id TEXT,student_user_id TEXT,status TEXT); INSERT INTO student_intake VALUES ('old','synthetic','completed',1,'staff','{"q3":"Known"}','old','old');`);
 let inserted=false;const db={prepare(query){let args=[];return {bind(...a){args=a;return this;},async first(){return sql.prepare(query).get(...args)??null;},async run(){if(query.startsWith('INSERT')&&!inserted){inserted=true;sql.exec("INSERT INTO student_intake_v2 VALUES ('v2','synthetic','draft')");}return {meta:{changes:Number(sql.prepare(query).run(...args).changes)}};}};}};
 const api=load('lib/student-intake.ts',{'@opennextjs/cloudflare':{getCloudflareContext:()=>({env:{DB:db}})}});
 await assert.rejects(api.saveDraft('old',{q3:'Different'},'synthetic','staff'),/canonical/i);
 assert.equal(sql.prepare('SELECT COUNT(*) AS n FROM student_intake').get().n,1);
 assert.equal(sql.prepare('SELECT data FROM student_intake').get().data,'{"q3":"Known"}');sql.close();
});
