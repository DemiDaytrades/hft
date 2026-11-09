import type {StagePractice} from './contracts';
export type StageResult={kind:'success'|'retry'|'reflect'|'incomplete';why:string};
export function stagePracticeResult(p:StagePractice,answers:Record<string,string>):StageResult{
 const incomplete:StageResult={kind:'incomplete',why:'Try the prompt first. This exploration is not graded or saved.'};let pass=false;
 if(p.kind==='reflect')return answers.value?.trim()?{kind:'reflect',why:p.explanation}:incomplete;
 if(p.kind==='calculate'){const value=(answers.value??'').trim().replace(/%$/,'');if(!value||!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value))return incomplete;const n=Number(value);if(!Number.isFinite(n)||p.expected===undefined)return incomplete;pass=Math.abs(n-p.expected)<=(p.tolerance??.00001);}
 else if(p.kind==='choice'){if(!p.options?.some(o=>o.id===answers.value))return incomplete;pass=answers.value===p.correct;}
 else{if(!p.rows?.every(r=>p.options?.some(o=>o.id===answers[r.id]))||Object.keys(answers).some(k=>!p.rows?.some(r=>r.id===k)))return incomplete;pass=p.rows.every(r=>answers[r.id]===p.answers?.[r.id]);}
 return{kind:pass?'success':'retry',why:pass?p.explanation:p.retry};
}
