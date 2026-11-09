export type PracticeOption = {id:string; label:string; why?:string};
export type PracticeTask = {
 id:string; kind:'choice'|'multi'|'matching'|'reflection'; prompt:string;
 options?:PracticeOption[]; answer?:string; expected?:string[];
 rows?:{id:string;label:string;answer:string;why:string}[];
 success:string; retry:string;
};
export type PracticeResult = {
 kind:'success'|'try-again'|'reflection'|'incomplete'; title:string; why:string;
 items?:{id:string;passed:boolean;why:string}[];
};
export type Exploration = Record<string,{answers:Record<string,string>;revealed:boolean;result?:PracticeResult}>;
export type ExploreEvent =
 | {type:'answer';id:string;field:string;value:string}
 | {type:'check';id:string;result:PracticeResult}
 | {type:'reveal';id:string};
export type Scene = {
 id:string; setting:string; headline:string; situation:string;
 visual:'dinner'|'barter'|'bridge'|'exchange'|'account'|'store'|'acceptance'|'digital'|'flow'|'review';
 tasks:PracticeTask[]; revealTitle:string; explanation:string[]; takeaway:string; demi:string;
};


export function explore(state:Exploration,event:ExploreEvent):Exploration {
 const old=state[event.id]??{answers:{},revealed:false};
 if(event.type==='answer')return {...state,[event.id]:{...old,answers:{...old.answers,[event.field]:event.value},result:undefined}};
 if(event.type==='check')return {...state,[event.id]:{...old,result:event.result,revealed:event.result.kind!=='incomplete'||old.revealed}};
 return {...state,[event.id]:{...old,revealed:true}};
}

export function practiceResult(task:PracticeTask,answers:Record<string,string>):PracticeResult {
 const incomplete=():PracticeResult=>({kind:'incomplete',title:'Make a choice first',why:'Try the prompt before checking. This exploration does not change your saved class evidence.'});
 if(task.kind==='reflection')return answers.thought?.trim()?{kind:'reflection',title:'Reflect, then compare',why:task.success}:incomplete();
 if(task.kind==='matching') {
  if(!task.rows?.every(r=>task.options?.some(o=>o.id===answers[r.id]))||Object.keys(answers).some(k=>!task.rows?.some(r=>r.id===k)))return incomplete();
  const items=task.rows.map(r=>({id:r.id,passed:answers[r.id]===r.answer,why:r.why})),passed=items.every(i=>i.passed);
  return {kind:passed?'success':'try-again',title:passed?'You connected the actions':'Look at the action again',why:passed?task.success:task.retry,items};
 }
 if(task.kind==='multi') {
  if(!Object.values(answers).some(v=>v==='yes')||Object.keys(answers).some(k=>!task.options?.some(o=>o.id===k)))return incomplete();
  const picked=Object.keys(answers).filter(k=>answers[k]==='yes'),passed=picked.length===task.expected?.length&&picked.every(k=>task.expected?.includes(k));
  return {kind:passed?'success':'try-again',title:passed?'Connected, but different':'Include the different roles',why:passed?task.success:task.retry};
 }
 const option=task.options?.find(o=>o.id===answers.choice);if(!option)return incomplete();
 const passed=!task.answer||option.id===task.answer;
 return {kind:passed?'success':'try-again',title:task.answer?(passed?'That explains the action':'Try another way of looking at it'):'See how the exchange changes',why:option.why??(passed?task.success:task.retry)};
}

