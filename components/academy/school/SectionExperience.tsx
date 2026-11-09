'use client';
import type {ReactNode} from 'react';
import type {PublicClass} from '@/lib/academy/school/contracts';
import {practiceResult,type Scene,type Exploration,type ExploreEvent,type PracticeTask} from '@/lib/academy/school/exploration';
import {ExperienceVisual} from './ExperienceVisual';

type Props={scene:Scene;section:Pick<PublicClass['sections'][number],'paragraphs'|'example'|'misconception'>;state:Exploration;dispatch:(event:ExploreEvent)=>void;children?:ReactNode};
function Practice({task,state,dispatch}:{task:PracticeTask;state:Exploration;dispatch:Props['dispatch']}){
 const entry=state[task.id],answers=entry?.answers??{},result=entry?.result;
 const answer=(field:string,value:string)=>dispatch({type:'answer',id:task.id,field,value});
 return <form className={'experience-practice practice-'+task.kind} onSubmit={e=>{e.preventDefault();dispatch({type:'check',id:task.id,result:practiceResult(task,answers)});}}>
  <fieldset><legend>{task.prompt}</legend>
   {task.kind==='choice'&&<div className="response-tiles">{task.options?.map(o=><label key={o.id} className={'response-tile '+(answers.choice===o.id?'is-selected':'')}><input type="radio" name={task.id} value={o.id} checked={answers.choice===o.id} onChange={()=>answer('choice',o.id)}/><span>{o.label}</span><span className="tile-mark" aria-hidden="true">{answers.choice===o.id?'●':'○'}</span></label>)}</div>}
   {task.kind==='multi'&&<div className="response-tiles">{task.options?.map(o=><label key={o.id} className={'response-tile '+(answers[o.id]==='yes'?'is-selected':'')}><input type="checkbox" name={task.id+'-'+o.id} checked={answers[o.id]==='yes'} onChange={e=>answer(o.id,e.target.checked?'yes':'no')}/><span>{o.label}</span><span className="tile-mark" aria-hidden="true">{answers[o.id]==='yes'?'✓':'+'}</span></label>)}</div>}
   {task.kind==='matching'&&<div className="function-sort">{task.rows?.map(r=><label key={r.id}><span>{r.label}</span><select aria-label={r.label} value={answers[r.id]??''} onChange={e=>answer(r.id,e.target.value)}><option value="">Choose the job</option>{task.options?.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select></label>)}</div>}
   {task.kind==='reflection'&&<textarea aria-label={task.prompt} value={answers.thought??''} onChange={e=>answer('thought',e.target.value)} rows={3} maxLength={2500} placeholder="Try explaining the actions. No private financial details."/>}
  </fieldset>
  <div className="practice-actions"><button type="submit">{task.kind==='reflection'?'Compare my explanation':result?'Try the prompt again':'Explore my response'}</button><small>Practice only · not graded or saved</small></div>
  {result&&<div className={'experience-feedback feedback-'+result.kind} role="status"><strong><span aria-hidden="true">{result.kind==='success'?'✓':result.kind==='try-again'?'↻':'→'} </span>{result.title}</strong><p>{result.why}</p>{result.items&&<ul>{result.items.map(i=><li key={i.id}><strong>{i.passed?'Connected':'Revisit'}:</strong> {i.why}</li>)}</ul>}</div>}
 </form>;
}
export function SectionExperience({scene,section,state,dispatch,children}:Props){
 const revealed=state[scene.id]?.revealed||scene.tasks.some(t=>state[t.id]?.revealed);
 const step=Number(state[scene.id]?.answers.step??0);
 return <div className={'section-experience experience-'+scene.id} data-presentation="money-experience.1.0.0">
  <div className="experience-scene"><p className="scene-setting">{scene.setting}</p><h3>{scene.headline}</h3><p>{scene.situation}</p></div>
  <ExperienceVisual revealed={!!revealed} kind={scene.visual} step={step} onAdvance={()=>dispatch({type:'answer',id:scene.id,field:'step',value:String(step+1)})}/>
  <div className="explore-label"><span aria-hidden="true">✦</span> Your turn <small>Explore before the explanation</small></div>
  {scene.tasks.map(task=><Practice task={task} state={state} dispatch={dispatch} key={task.id}/>)}
  <button className="reveal-button secondary" aria-expanded={!!revealed} aria-controls={'idea-'+scene.id} onClick={()=>dispatch({type:'reveal',id:scene.id})}>{revealed?'Idea revealed below':'Reveal the idea'} <span aria-hidden="true">↓</span></button>
  <div id={'idea-'+scene.id} hidden={!revealed} className="concept-reveal"><p className="school-eyebrow">The idea behind the experience</p><h3>{scene.revealTitle}</h3>{scene.explanation.map(p=><p key={p}>{p}</p>)}<blockquote><span>Take it with you</span>{scene.takeaway}</blockquote></div>
  <div className="experience-application"><span className="apply-number" aria-hidden="true">↗</span><div><h3>Apply it to a new moment</h3><p>{section.example}</p></div></div>
  <details className="experience-deeper"><summary>Explore the full explanation</summary>{section.paragraphs.map(p=><p key={p}>{p}</p>)}</details>
  <aside className="misconception-note"><strong>Watch out for this misconception</strong><p>{section.misconception}</p></aside>
  <details className="demi-prompt"><summary>In class with Demi</summary><p>{scene.demi}</p><small>You can explore this on your own too; attending a live class is not required.</small></details>
  {children&&<div className="saved-check"><p className="school-eyebrow">Check understanding · saved class work</p>{children}</div>}
 </div>;
}
