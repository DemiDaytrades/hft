import Link from 'next/link';
type Summary={id:string;title:string;student_name?:string;instructor_name?:string;start_at:string;status:string};
export function TeachingDashboardCard({sessions,admin=false,timezone}:{sessions:Summary[];admin?:boolean;timezone:string}){
 const active=sessions.filter(s=>['REQUESTED','ALTERNATIVE_PROPOSED','CONFIRMED'].includes(s.status)&&Date.parse(s.start_at)>Date.now()).sort((a,b)=>a.start_at.localeCompare(b.start_at));
 const pending=active.filter(s=>s.status!=='CONFIRMED').length;
 return <section className="rounded-lg border border-brand-600/40 bg-ink-900/80 p-6" aria-label={admin?'Teaching overview':'This week’s lesson'}>
  <h2 className="text-xl font-semibold">{admin?'Teaching calendar':'This week’s lesson'}</h2>
  {admin&&<p className="mt-2 text-white/60">{pending} pending request{pending===1?'':'s'}</p>}
  {active.length===0?<p className="mt-2 text-white/60">{admin?'No upcoming lessons yet.':'Needs scheduling — choose an available weekly lesson time.'}</p>:<ul className="mt-3 space-y-3">{active.slice(0,3).map(s=><li key={s.id}><strong>{admin?s.student_name||'Student':s.instructor_name||'Instructor'} · {s.title}</strong><p className="text-sm text-white/60">{new Intl.DateTimeFormat('en-US',{timeZone:timezone,month:'short',day:'numeric',hour:'numeric',minute:'2-digit',timeZoneName:'short'}).format(new Date(s.start_at))} · {s.status.replaceAll('_',' ')}</p></li>)}</ul>}
  <Link href={admin?'/admin/teaching':'/lessons'} className="mt-4 inline-block rounded border border-brand-600/40 px-4 py-2 text-brand-500 focus-visible:outline-2 focus-visible:outline-brand-500">{admin?'Calendar, availability and requests':'Schedule this week’s lesson / view request'}</Link>
 </section>;
}
