'use client';
import { useEffect, useRef, useState } from 'react';
import { type CaptureField, wrapCaptureValues } from '@/lib/student-intake-v2/workflow-fields';
import { type IntakeSaveResult } from '@/lib/student-intake-v2/autosave';
import { captureControl, capturePrompt, isCaptureVisible, optionsWithSaved, patchScheduleDay, toggleCaptureOption } from '@/lib/consultation-review/capture-controls';
import { AutosaveStatus, fetchLatestIntake, useIntakeAutosave, type AutosaveFlush } from './IntakeAutosave';
const cls='w-full rounded border border-white/20 bg-ink-950 p-2 text-white disabled:opacity-60';
const lines=(s:string)=>s.split('\n').map(x=>x.trim()).filter(Boolean);
const isObject=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
type Props = {
 fields:CaptureField[];record:any;instructor?:boolean;readOnly:boolean;
 onSaved:(r:any)=>void;onDirty:(dirty:boolean)=>void;onSaving:(saving:boolean)=>void;
 missingOnly?:boolean;missingKeys?:string[];
 fieldKeys?:readonly string[];partKeys?:Readonly<Record<string,readonly string[]>>;
 correctionReason?:string;evidenceKind?:'STUDENT_REPORTED'|'INSTRUCTOR_OVERRIDE';
 onReloadLatest?:()=>void|Promise<void>;
 onRegisterFlush?:(flush:AutosaveFlush|null)=>void;
 autosaveEnabled?:boolean;
};
export default function CaptureForm({fields,record,instructor=false,readOnly,onSaved,onDirty,onSaving,correctionReason,evidenceKind,missingOnly,missingKeys,fieldKeys,partKeys,onReloadLatest,onRegisterFlush,autosaveEnabled=true}:Props){
 const source=instructor?record.instructor_assessment_json:record.student_sections_json;
 const [raw,setRaw]=useState<Record<string,string>>({});
 const [edits,setEdits]=useState<Record<string,unknown>>({});
 const [reconcileError,setReconcileError]=useState('');
 const expectedVersion=useRef<number>(record.snapshot_version);
 const editVersion=useRef(0);
 const dirty=Object.keys(edits).length>0;
 const editsSignature=JSON.stringify(edits);
 const value=(key:string)=>key in edits?edits[key]:source?.[key]?.value;
 const values:Record<string,unknown>={...Object.fromEntries(Object.entries(record.student_sections_json??{}).map(([key,field])=>[key,(field as {value:unknown})?.value])),...(!instructor?edits:{})};
 const canonicalReview=record.system_meta_json?.captureWorkflow==='canonical_review_v1';
 const visible=(path:string)=>instructor||isCaptureVisible(path,values,canonicalReview);
 useEffect(()=>{onDirty(dirty)},[dirty,onDirty]);
 useEffect(()=>{if(!dirty)expectedVersion.current=record.snapshot_version},[dirty,record.snapshot_version]);
 useEffect(()=>{editVersion.current+=1},[editsSignature]);
 function set(key:string,v:unknown){setEdits(e=>({...e,[key]:v}));setReconcileError('')}
 function control(id:string,v:unknown,change:(v:unknown)=>void,isList=false){
  const spec=instructor?{kind:isList?'list':'narrative',options:undefined,exclusive:undefined}:captureControl(id,isList);
  const disabled=readOnly;
  // Unexpected saved shapes remain visible and untouched. They are never coerced
  // into an empty string or silently removed by switching to a structured control.
  if(isObject(v)||(Array.isArray(v)&&(spec.kind==='select'||v.some(item=>typeof item!=='string')))){return <div><p className="text-xs text-white/60">Saved custom value retained.</p><pre className="whitespace-pre-wrap text-sm">{JSON.stringify(v,null,2)}</pre></div>}
  if(spec.kind==='select'&&!Array.isArray(v)){
   const saved=v==null?'':String(v);const options=optionsWithSaved(spec.options??[],saved);
   return <select id={id} aria-label={id} className={cls} disabled={disabled} value={saved} onChange={e=>change(e.target.value)}><option value="">Select…</option>{options.map(option=><option key={option} value={option}>{option}{!(spec.options??[]).includes(option)?' (saved custom value)':''}</option>)}</select>;
  }
  if(spec.kind==='multiselect'&&(v==null||Array.isArray(v))){
   const selected=Array.isArray(v)?v:[];
   return <div id={id} className="flex flex-wrap gap-3" role="group" aria-label={id}>{optionsWithSaved(spec.options??[],v).map(option=><label key={option} className="flex items-center gap-2"><input type="checkbox" disabled={disabled} checked={selected.includes(option)} onChange={e=>change(toggleCaptureOption(v,option,e.target.checked,spec.exclusive))}/>{option}{!(spec.options??[]).includes(option)?' (saved custom value)':''}</label>)}</div>;
  }
  const list=isList||spec.kind==='list';
  return <textarea id={id} aria-label={id} className={cls} rows={list?3:2} disabled={disabled} value={raw[id]??(Array.isArray(v)?v.join('\n'):typeof v==='string'?v:v==null?'':String(v))} onChange={e=>{setRaw(r=>({...r,[id]:e.target.value}));change(list?lines(e.target.value):e.target.value)}}/>;
 }
 async function persist():Promise<IntakeSaveResult>{
  const editsToSave=edits;
  const versionAtStart=editVersion.current;
  try{
   const res=await fetch('/api/admin/student-intake-v2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:instructor?'save-instructor':'save-student',studentUserId:record.student_user_id,intakeId:record.id,expectedSnapshotVersion:expectedVersion.current,mode:'instructor_entered_for_student',correctionReason,evidenceKind,[instructor?'assessment':'sections']:wrapCaptureValues(editsToSave)})});
   const json=await res.json().catch(()=>({})) as {error?:string;intake?:any};
   if(!res.ok)return {ok:false,status:res.status,error:json.error||'Save failed'};
   const intake=json.intake;
   expectedVersion.current=intake.snapshot_version;
   onSaved(intake);
   if(versionAtStart===editVersion.current){
    setEdits({});setRaw({});onDirty(false);
   }else{
    setEdits(current=>{const next={...current};for(const key of Object.keys(editsToSave)){if(Object.is(current[key],editsToSave[key]))delete next[key]}return next});
    onDirty(true);
   }
   return {ok:true,intake};
  }catch(e){
   return {ok:false,status:0,error:(e as Error).message||'Save failed'};
  }
 }
 const autosave=useIntakeAutosave({
  enabled:autosaveEnabled&&!readOnly&&!instructor&&evidenceKind!=='INSTRUCTOR_OVERRIDE',
  dirty,
  signature:editsSignature,
  save:persist,
  onSuccess:()=>{},
  onSaving,
  onRegisterFlush,
 });
 async function reconcile(){
  setReconcileError('');
  try{
   const latest=await fetchLatestIntake(record.id,record.student_user_id);
   expectedVersion.current=latest.snapshot_version;
   onSaved(latest);
   onDirty(true);
   await autosave.retry(()=>persist());
  }catch(e){setReconcileError((e as Error).message||'Unable to reconcile the latest answers.')}
 }
 return <div className="space-y-5"><p className="text-sm text-white/65">Capture the existing approved questionnaire responses as reported. Free-form lists use one response per line. Leave unknown answers blank; do not infer answers. {instructor?'Instructor assessment stays separate from student responses.':'Saved changes are attributed to authorized instructor capture.'}</p>
 {fields.filter(f=>(!fieldKeys||fieldKeys.includes(f.key))&&(!missingOnly||missingKeys?.includes(f.key))&&visible(f.key)).map(f=>{
  const v=value(f.key);const objectValue=isObject(v)?v:{};const prompt=capturePrompt(f.key);
  const parts=partKeys?.[f.key]??f.parts??[];
  return <fieldset key={f.key} data-field-key={f.key} className="scroll-mt-24 space-y-2 rounded border border-white/10 p-3"><legend className="px-1 font-semibold">{f.label}</legend>
   {prompt&&<p className="text-sm text-white/75">{prompt}</p>}
   {(f.kind==='object'||f.kind==='schedule')&&v!=null&&!isObject(v)?<div><p className="text-xs text-white/60">Saved custom value retained.</p><pre className="whitespace-pre-wrap text-sm">{JSON.stringify(v,null,2)}</pre></div>:f.kind==='object'?parts.filter(part=>visible(`${f.key}.${part}`)).map(part=><div key={part} data-field-key={`${f.key}.${part}`}><label htmlFor={`${f.key}.${part}`}>{part.replaceAll('_',' ')}{f.lists?.includes(part)?' — one response per line':''}</label>{control(`${f.key}.${part}`,objectValue[part],next=>set(f.key,{...objectValue,[part]:next}),f.lists?.includes(part))}</div>):f.kind==='schedule'?['monday','tuesday','wednesday','thursday','friday','saturday','sunday'].map(day=>{
    const dayValue=isObject(objectValue[day])?objectValue[day]:{};
    return <div key={day} data-field-key={`${f.key}.${day}`} className="space-y-2"><label htmlFor={`${f.key}.${day}`}>{day} — available windows, one per line</label>{control(`${f.key}.${day}`,dayValue.windows,next=>set(f.key,patchScheduleDay(v,day,{windows:next})),true)}<label htmlFor={`${f.key}.${day}.note`}>{day} — schedule note (optional)</label>{control(`${f.key}.${day}.note`,dayValue.note,next=>set(f.key,patchScheduleDay(v,day,{note:next})))}</div>;
   }):<><label className="sr-only" htmlFor={f.key}>{f.label}</label>{control(f.key,v,next=>set(f.key,next),f.kind==='list')}</>}
   {record.provenance_json?.[f.key]?.source&&<p className="text-xs text-white/50">Saved source: {record.provenance_json[f.key].source}</p>}
  </fieldset>;
 })}
 <div className="space-y-2 border-t border-white/8 pt-3">
  <div className="flex flex-wrap items-center gap-3">
   {!readOnly&&<button type="button" disabled={autosave.status==='saving'||autosave.conflict||!dirty} onClick={()=>void autosave.retry(()=>persist())} className="rounded bg-brand-600 px-4 py-3 disabled:opacity-50">{autosave.status==='saving'?'Saving…':'Save draft section'}</button>}
   <AutosaveStatus status={autosave.status} error={autosave.error||reconcileError} dirty={dirty} conflict={autosave.conflict} onReloadLatest={onReloadLatest} onReconcile={reconcile}/>
  </div>
 </div>
 </div>;
}
