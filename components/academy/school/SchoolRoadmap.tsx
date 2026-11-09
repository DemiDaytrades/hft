import type {StudentStage} from '@/lib/academy/school/roadmap';
export function SchoolRoadmap({stages}:{stages:StudentStage[]}){
 return <div className="school-roadmap">{stages.map(stage=><section className="school-roadmap-stage" key={stage.id} id={stage.id}>
  <div className="roadmap-stage-number" aria-hidden="true">{stage.id==='capstone'?'★':String(stage.number).padStart(2,'0')}</div>
  <div><p className="school-eyebrow">{stage.id==='capstone'?'Capstone':'Stage '+stage.number}</p><h2>{stage.title}</h2>
  {!stage.classes.length?<p className="roadmap-status">Coming later</p>:<ol>{stage.classes.map(c=><li key={c.id+(c.edition??'')}><span className={'roadmap-status status-'+c.status.toLowerCase().replaceAll(' ','-')}>{c.status}</span><h3>Class {c.number} · {c.title}</h3>{c.href?<><a href={c.href}>{c.status==='Completed'?'Revisit class':'Enter class'} <span aria-hidden="true">→</span></a></>:<p>{c.status==='Locked'?'Your instructor will help you access this class when it is part of your learning plan.':'Your journey continues here later.'}</p>}</li>)}</ol>}
  {stage.id==='stage-1'&&<p className="roadmap-next">After these classes: review together, then demonstrate your understanding. Your instructor will guide your next step.</p>}</div>
 </section>)}</div>;
}
