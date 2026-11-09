import 'server-only';
import {schoolState,schoolCommand,schoolCatalog} from './service';
import {publicClass} from './registry';
import type {ClassDefinition} from './contracts';
import {MONEY_EXPERIENCE} from './presentation';
import {STAGE_EXPERIENCES} from './stage/experiences';
import type {StageClass,StageScene} from './stage/contracts';
import type {Answer,PublicItem,PublicClass} from './contracts';
import type {Scene} from './presentation';

type Internal=Awaited<ReturnType<typeof schoolState>>;
export type StudentQuestion=Pick<PublicItem,'id'|'kind'|'prompt'|'options'|'items'|'targets'|'sectionId'>;
function fail():never{throw Object.assign(new Error('Class work is unavailable. Please refresh your assigned class.'),{status:403});}
function maps(doc:PublicClass){
 const sections=new Map(doc.sections.map((s,i)=>[s.id,'s'+(i+1)]));
 const groups={checks:doc.sections.flatMap(s=>s.activities),assessment:doc.assessment,homework:doc.homework,remediation:doc.remediation.map(r=>r.reinforcement)};
 const questions=new Map<string,PublicItem>();
 for(const [group,items]of Object.entries(groups))items.forEach((q,i)=>questions.set(({checks:'c',assessment:'k',homework:'h',remediation:'r'} as Record<string,string>)[group]+(i+1),q));
 return {sections,questions};
}
function aliasQuestion(q:PublicItem,id:string,sections:Map<string,string>):StudentQuestion{return {id,kind:q.kind,prompt:q.prompt,sectionId:sections.get(q.sectionId)!,...(q.options?{options:q.options.map((o,i)=>({id:'o'+(i+1),label:o.label}))}:{}),...(q.items?{items:q.items.map((o,i)=>({id:'row'+(i+1),label:o.label}))}:{}),...(q.targets?{targets:q.targets.map((o,i)=>({id:'t'+(i+1),label:o.label}))}:{})};}
function encoded(q:PublicItem,answer:Answer|undefined):Answer|undefined{
 if(answer===undefined)return undefined;
 if(q.kind==='choice')return 'o'+(q.options!.findIndex(o=>o.id===answer)+1);
 if(q.kind==='matching'&&typeof answer==='object')return Object.fromEntries(Object.entries(answer).map(([row,target])=>['row'+(q.items!.findIndex(r=>r.id===row)+1),'t'+(q.targets!.findIndex(t=>t.id===target)+1)]));
 return answer;
}
function decoded(q:PublicItem,answer:unknown):Answer{
 if(q.kind==='choice'){const i=typeof answer==='string'&&/^o[1-9]\d*$/.test(answer)?Number(answer.slice(1))-1:-1;if(!q.options?.[i])fail();return q.options[i].id;}
 if(q.kind==='matching'){
  if(!answer||typeof answer!=='object'||Array.isArray(answer))fail();
  return Object.fromEntries(Object.entries(answer).map(([row,value])=>{const i=/^row[1-9]\d*$/.test(row)?Number(row.slice(3))-1:-1,j=typeof value==='string'&&/^t[1-9]\d*$/.test(value)?Number(value.slice(1))-1:-1;if(!q.items?.[i]||!q.targets?.[j])fail();return[q.items[i].id,q.targets[j].id];}));
 }
 if(typeof answer!=='string')fail();return answer;
}
function displayAnswer(q:PublicItem,answer:Answer):string{
 if(q.kind==='choice')return q.options?.find(o=>o.id===answer)?.label??'Response unavailable';
 if(q.kind==='matching'&&typeof answer==='object')return q.items?.map(r=>r.label+': '+(q.targets?.find(t=>t.id===answer[r.id])?.label??'Not selected')).join(' · ')??'';
 return typeof answer==='string'?answer:'';
}
function publicPractice(p:StageScene['practice'][number],i:number,j:number){
 const options=p.options?.map((o,n)=>({id:'o'+(n+1),label:o.label})),rows=p.rows?.map((r,n)=>({id:'row'+(n+1),label:r.label}));
 const option=(id:string)=>options?.[p.options!.findIndex(o=>o.id===id)]?.id??id;
 return {...p,id:'practice'+(i+1)+'-'+(j+1),...(options?{options}:{}),...(rows?{rows}:{}),...(p.correct?{correct:option(p.correct)}:{}),...(p.answers?{answers:Object.fromEntries(Object.entries(p.answers).map(([id,value])=>[rows![p.rows!.findIndex(r=>r.id===id)].id,option(value)]))}: {})};
}
function projection(state:Internal){
 const d=state.class,{sections,questions}=maps(d),key=(id:string)=>[...questions].find(([,q])=>q.id===id)?.[0]!,safe=(q:PublicItem)=>aliasQuestion(q,key(q.id),sections);
 const design=(d as unknown as StageClass).design;
 const money=d.id===MONEY_EXPERIENCE.classId&&d.version===MONEY_EXPERIENCE.academicVersion?MONEY_EXPERIENCE:null;
 const stage=STAGE_EXPERIENCES.find(e=>e.classId===d.id&&e.academicVersion===d.version);
 const lesson={title:d.title,description:d.description,goals:d.objectives.map(o=>o.text),terms:d.terms,
  sections:d.sections.map((s,i)=>({id:sections.get(s.id)!,title:s.title,goal:d.objectives.find(o=>o.id===s.objectiveId)?.text??'',paragraphs:s.paragraphs,example:s.example,misconception:s.misconception,activities:s.activities.map(safe),
   experience:(money?{kind:'money' as const,data:{...money.sections[i],id:sections.get(s.id)!,tasks:money.sections[i].tasks.map((t,j)=>({...t,id:'practice'+(i+1)+'-'+(j+1)}))}}:stage?{kind:'stage' as const,data:{...stage.sections[i],sectionId:sections.get(s.id)!,practice:stage.sections[i].practice.map((t,j)=>publicPractice(t,i,j))}}:undefined)})),
  assessment:d.assessment.map(safe),homework:d.homework.map(safe),homeworkTitle:design?.homeworkTitle??'What Is Money? · Homework A–F',homeworkIntro:design?.homeworkIntro??'Apply, reason, connect to everyday life and reflect. Use real or hypothetical examples without private financial details.',
  guideVisual:design?.studyGuideVisual,guideChecks:design?.studyGuideChecks??[],studyGuide:{summary:d.studyGuide.summary,bigPicture:d.studyGuide.bigPicture,fiveThings:d.studyGuide.fiveThings,outcomes:d.studyGuide.outcomes,examples:d.studyGuide.examples,misconceptions:d.studyGuide.misconceptions,review:d.studyGuide.review.map(r=>({label:r.label,sectionId:sections.get(r.sectionId)!,href:'/academy/school/'+d.id+'?enrollment='+encodeURIComponent(state.enrollmentId)+'#'+sections.get(r.sectionId)!}))}
 };
 const draft=(kind:string,items:PublicItem[])=>Object.fromEntries(items.filter(q=>Object.hasOwn(state.drafts[kind]??{},q.id)).map(q=>[key(q.id),encoded(q,state.drafts[kind][q.id])!]));
 return {guideHref:'/academy/study-guides/'+d.id+'?enrollment='+encodeURIComponent(state.enrollmentId),enrollment:state.enrollmentId as string,revision:state.revision as number,lesson,completed:state.completed,completedAt:state.completedAt as string|null,completedSections:state.completedSections.map(id=>sections.get(id)!),
  activities:Object.fromEntries([...questions].filter(([,q])=>state.activities[q.id]).map(([id,q])=>[id,{passed:state.activities[q.id].passed,answer:encoded(q,state.activities[q.id].answer)}])),
  drafts:{assessment:draft('assessment',d.assessment),homework:draft('homework',d.homework)},canCheck:state.canStartAssessment,canSubmitHomework:state.canSubmitHomework,canComplete:state.canComplete,
  reinforcement:d.remediation.filter(r=>state.weak.includes(r.competency)).map(r=>({id:key(r.reinforcement.id),title:r.title,paragraph:r.paragraph,sectionId:sections.get(r.sectionId)!,question:safe(r.reinforcement),done:state.remediated.includes(r.competency)})),
  history:state.submissions.map(s=>({kind:s.kind,attempt:s.number,status:s.status,submittedAt:s.createdAt,feedback:s.review?.feedback??null,answers:(s.kind==='assessment'?d.assessment:d.homework).map(q=>({prompt:q.prompt,answer:displayAnswer(q,s.answers[q.id]),sectionId:sections.get(q.sectionId)!,outcome:!s.review?'awaiting_review':(s.objective[q.id]??s.review.grades[q.id])?'demonstrated':'review'}))}))};
}
export type StudentState=ReturnType<typeof projection>;
export type StudentScene=NonNullable<StudentState['lesson']['sections'][number]['experience']>;
async function owned(db:D1Database,user:string,classId?:string,version?:string,enrollment?:string){
 if(enrollment){const e=await db.prepare('SELECT class_id,version FROM school_enrollment WHERE id=? AND user_id=?').bind(enrollment,user).first<{class_id:string;version:string}>();if(!e||classId&&classId!==e.class_id)fail();return schoolState(db,user,e.class_id,e.version);}
 if(!classId)fail();return schoolState(db,user,classId,version);
}
export async function studentRead(db:D1Database,user:string,classId:string|undefined,version?:string,enrollment?:string){return projection(await owned(db,user,classId,version,enrollment));}
export async function studentCommand(db:D1Database,user:string,input:Record<string,any>){
 const state=await owned(db,user,input.classId,input.version,input.enrollment),{sections,questions}=maps(state.class),command:Record<string,any>={action:input.action,classId:state.class.id,version:state.class.version,expectedRevision:input.expectedRevision,requestKey:input.requestKey};
 if(input.action==='activity'||input.action==='remediate'){
  const q=questions.get(input.itemId);if(!q)fail();command.answer=decoded(q,input.answer);
  if(input.action==='activity'){if(!input.itemId.startsWith('c'))fail();command.itemId=q.id;}else{const r=state.class.remediation.find(r=>r.reinforcement.id===q.id);if(!r)fail();command.competency=r.competency;}
 }else if(input.action==='section'){command.sectionId=[...sections].find(([,alias])=>alias===input.sectionId)?.[0];if(!command.sectionId)fail();}
 else if(['assessment','homework','draft'].includes(input.action)){
  const kind=input.action==='draft'?input.kind:input.action;if(kind!=='assessment'&&kind!=='homework')fail();
  if(!input.answers||typeof input.answers!=='object'||Array.isArray(input.answers))fail();const prefix=kind==='assessment'?'k':'h';
  command.answers=Object.fromEntries(Object.entries(input.answers).map(([alias,value])=>{const q=questions.get(alias);if(!q||!alias.startsWith(prefix))fail();return[q.id,decoded(q,value)];}));if(input.action==='draft')command.kind=kind;
 }
 return projection(await schoolCommand(db,user,command));
}
export async function studentCatalog(db:D1Database,user:string){const classes=await schoolCatalog(db,user),out=[];for(const c of classes){const s=await schoolState(db,user,c.id,c.version);out.push({id:c.id,title:c.title,stageId:c.stageId,enrollment:s.enrollmentId as string,completed:s.completed,started:s.revision>0,href:'/academy/school/'+c.id+'?enrollment='+encodeURIComponent(s.enrollmentId),guideHref:'/academy/study-guides/'+c.id+'?enrollment='+encodeURIComponent(s.enrollmentId)});}return out;}

export function studentPreview(d:ClassDefinition){return projection({class:publicClass(d),revision:0,drafts:{},enrollmentId:'preview',completedSections:[],activities:{},submissions:[],weak:[],remediated:[],knowledgeScore:null,canStartAssessment:true,canSubmitHomework:true,canComplete:false,completed:false,completedAt:null,evidence:[]} as Internal);}
