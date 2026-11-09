'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import './teaching.css';
import {bookingHorizonDate} from '@/lib/teaching/booking-window';

export type TeachingSession = {
  id: string; instructor_id: string; student_id: string; student_name?: string; instructor_name: string;
  title: string; lesson_id: string | null; start_at: string; end_at: string; timezone: string; status: string; revision: number;
  expires_at: string | null; base_status: string | null; proposed_start_at: string | null; proposed_end_at: string | null;
  proposed_expires_at: string | null; proposal_by: string | null;
};
type Config = { instructor_id: string; timezone: string; duration_min: number; buffer_min: number; request_hours: number; weekly_allowance: number; minimum_notice_hours:number; booking_horizon_days:number; revision: number };
type Rule = { id: string; day_of_week: number; start_time: string; end_time: string };
type Override = { id: string; date: string; blocked: number | boolean; start_time: string | null; end_time: string | null };
type Slot = { id: string; start_at: string; end_at: string; timezone: string };
type Snapshot = { admin: boolean; userId: string; config: Config | null; sessions: TeachingSession[]; availability: Rule[]; overrides: Override[]; students?: { id: string; name: string; weekly_limit: number | null }[]; suggestedLesson: { id: string; title: string } | null; slots?: Slot[] };
type Action = (action: string, session: TeachingSession) => void;
const activeStatuses = ['REQUESTED', 'ALTERNATIVE_PROPOSED', 'CONFIRMED'];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
function time(value: string, timezone: string) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', weekday: 'short', hour: 'numeric', minute: '2-digit', timeZone: timezone, timeZoneName: 'short' }).format(new Date(value)); }
function dateInZone(value: Date, timezone: string) { const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year:'numeric',month:'2-digit',day:'2-digit' }).formatToParts(value); return ['year','month','day'].map(type=>parts.find(p=>p.type===type)?.value).join('-'); }

function weekStart(date: string) { const value = new Date(date+'T12:00:00Z'); value.setUTCDate(value.getUTCDate() - ((value.getUTCDay()+6)%7)); return value.toISOString().slice(0,10); }

export function weeklyLessonStatus(sessions: TeachingSession[]) { return sessions.some(s=>s.status==='CONFIRMED'||(s.status==='ALTERNATIVE_PROPOSED'&&s.base_status==='CONFIRMED'))?'Confirmed':sessions.some(s=>['REQUESTED','ALTERNATIVE_PROPOSED'].includes(s.status))?'Request pending':'Needs scheduling'; }

function responseObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
export function teachingResponseError(value: unknown, fallback: string): string {
  return responseObject(value) && typeof value.error === 'string' && value.error ? value.error : fallback;
}
export function parseTeachingSnapshot(value: unknown): Snapshot {
  if (!responseObject(value) || typeof value.admin !== 'boolean' || typeof value.userId !== 'string'
    || !Array.isArray(value.sessions) || !Array.isArray(value.availability) || !Array.isArray(value.overrides)
    || (value.config !== null && (!responseObject(value.config) || typeof value.config.timezone !== 'string'))
    || (value.suggestedLesson !== null && (!responseObject(value.suggestedLesson) || typeof value.suggestedLesson.title !== 'string'))
    || (value.students !== undefined && !Array.isArray(value.students))
    || (value.slots !== undefined && !Array.isArray(value.slots))) {
    throw new Error('Invalid lesson response. Refresh and try again.');
  }
  return value as Snapshot;
}

export function SessionCard({ session: s, admin, timezone, busy, onAction, onPropose }: { session: TeachingSession; admin: boolean; timezone: string; busy: boolean; onAction: Action; onPropose: (session: TeachingSession)=>void }) {
  const active = activeStatuses.includes(s.status);
  const instructorProposal = s.status === 'ALTERNATIVE_PROPOSED' && s.proposal_by === s.instructor_id;
  const canConfirm = admin && (s.status === 'REQUESTED' || (s.status === 'ALTERNATIVE_PROPOSED' && s.proposal_by === s.student_id));
  return <article className="teaching-session">
    <div className="teaching-session-top"><span className={`teaching-status ${s.status === 'CONFIRMED' ? 'is-confirmed' : ''}`}>{s.status.replaceAll('_', ' ')}</span><span className="teaching-muted">1:1 lesson</span></div>
    <h3>{admin ? s.student_name || 'Student' : s.instructor_name || 'Demi'}</h3>
    <p className="teaching-topic">{s.title || 'Weekly lesson'}</p>
    <p><time dateTime={s.start_at}>{time(s.start_at, timezone)}</time> – {new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',timeZone:timezone}).format(new Date(s.end_at))}</p>
    {s.status === 'REQUESTED' && <p className="teaching-notice">Waiting for instructor confirmation. This lesson is not confirmed.</p>}
    {s.status === 'REQUESTED' && s.expires_at && <p className="teaching-muted">Request expires {time(s.expires_at, timezone)}.</p>}
    {s.status === 'ALTERNATIVE_PROPOSED' && <div className="teaching-proposal"><strong>{instructorProposal ? 'Demi proposed a different time' : 'Student proposed a different time'}</strong>{s.proposed_start_at && <p>{time(s.proposed_start_at, timezone)}</p>}<p>{s.base_status === 'CONFIRMED' ? 'Original confirmed time remains reserved until the replacement is accepted.' : 'Waiting for the proposed time to be accepted.'}</p>{s.proposed_expires_at && <p>Proposal expires {time(s.proposed_expires_at, timezone)}.</p>}</div>}
    {s.status === 'CONFIRMED' && <div className="teaching-handoff"><p><a href={`${admin ? "/admin/classroom/" : "/classroom/"}${encodeURIComponent(s.id)}`}>{admin ? "Start class" : "Join class"}</a></p><small>Session ID: {s.id}</small></div>}
    {active && <div className="teaching-actions">
      {canConfirm && <button disabled={busy} onClick={()=>onAction('confirm',s)}>Confirm</button>}
      {!admin && instructorProposal && <button disabled={busy} onClick={()=>onAction('accept',s)}>Accept alternative</button>}
      {s.status === 'ALTERNATIVE_PROPOSED' && ((admin && !instructorProposal) || (!admin && instructorProposal)) && <button className="secondary" disabled={busy} onClick={()=>onAction('rejectProposal',s)}>Decline alternative</button>}
      {s.status !== 'ALTERNATIVE_PROPOSED' && <button className="secondary" disabled={busy} onClick={()=>onPropose(s)}>Propose different time</button>}
      {admin && s.status === 'REQUESTED' && <button className="secondary" disabled={busy} onClick={()=>onAction('decline',s)}>Decline request</button>}
      <button className="quiet" disabled={busy} onClick={()=>onAction('cancel',s)}>Cancel lesson</button>
    </div>}
  </article>;
}

export default function Scheduler({ admin = false }: { admin?: boolean }) {
  const [data,setData] = useState<Snapshot|null>(null);
  const [busy,setBusy] = useState(false);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');
  const [notice,setNotice] = useState('');
  const [localZone,setLocalZone] = useState('UTC');
  const [date,setDate] = useState('');
  const [slots,setSlots] = useState<Slot[]|null>(null);
  const [selected,setSelected] = useState('');
  const [proposal,setProposal] = useState<TeachingSession|null>(null);
  const [reason,setReason] = useState('');
  const [topic,setTopic] = useState('');
  const [view,setView] = useState('Upcoming');
  const [calendarDate,setCalendarDate] = useState('');
  const [decision,setDecision] = useState<{action:string;session:TeachingSession}|null>(null);
  const pickerRef=useRef<HTMLElement>(null);
  const slotRequest=useRef(0);
  const commandLock=useRef(false);
  const retryCommand=useRef<{signature:string;key:string}|null>(null);
  async function get(url: string): Promise<Snapshot> { const response=await fetch(url,{cache:'no-store'}); const body=await response.json(); if(!response.ok) throw new Error(teachingResponseError(body, 'Unable to load lessons.')); return parseTeachingSnapshot(body); }
  async function refresh() { const value=await get('/api/teaching'); setData(value); return value; }
  useEffect(()=>{setLocalZone(Intl.DateTimeFormat().resolvedOptions().timeZone); let current=true; get('/api/teaching').then(value=>{if(current)setData(value);}).catch(e=>{if(current)setError(e.message);}).finally(()=>{if(current)setLoading(false);});return()=>{current=false;};},[]);
  const timezone=admin ? data?.config?.timezone || localZone : localZone;
  async function command(action:string, values:Record<string,unknown>) {
    if(commandLock.current)return false;
    commandLock.current=true;setBusy(true);setError('');setNotice('');
    try { const signature=JSON.stringify({action,...values}); if(retryCommand.current?.signature!==signature)retryCommand.current={signature,key:crypto.randomUUID()}; const response=await fetch('/api/teaching',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...values,requestKey:retryCommand.current.key})}); const result=await response.json(); if(!response.ok) throw new Error(teachingResponseError(result, 'Unable to save. Refresh and try again.')); slotRequest.current++;setLoading(false);setSlots(null);setSelected('');await refresh();retryCommand.current=null;setNotice('Saved. Your lesson schedule is up to date.');return true; }
    catch(e){setError(e instanceof Error?e.message:'Unable to save.');return false;}
    finally{commandLock.current=false;setBusy(false);}
  }
  async function loadSlots(nextDate:string, session:TeachingSession|null=proposal) {
    const request=++slotRequest.current;setDate(nextDate);setSlots(null);setSelected('');setError('');if(!nextDate)return;
    setLoading(true);
    try { const value=await get(`/api/teaching?date=${encodeURIComponent(nextDate)}${session?`&sessionId=${encodeURIComponent(session.id)}`:''}`);if(request===slotRequest.current)setSlots(value.slots || []); }
    catch(e){if(request===slotRequest.current)setError(e instanceof Error?e.message:'Unable to load available times.');}
    finally{if(request===slotRequest.current)setLoading(false);}
  }
  function chooseProposal(session:TeachingSession) { setProposal(session);setDecision(null);setReason('');setSlots(null);setSelected('');setDate('');setLoading(false);slotRequest.current++;pickerRef.current?.scrollIntoView({behavior:'smooth',block:'start'});pickerRef.current?.focus(); }
  async function sessionAction(action:string,session:TeachingSession) { if(['cancel','decline'].includes(action)){setReason('');setDecision({action,session});return;}await command(action,{sessionId:session.id,expectedRevision:session.revision}); }
  async function submitSlot(event:FormEvent) {event.preventDefault();if(!selected)return;const ok=await command(proposal?'propose':'request',proposal?{sessionId:proposal.id,expectedRevision:proposal.revision,slotId:selected,reason}:{slotId:selected,title:topic || undefined});if(ok){setProposal(null);setReason('');}}
  const config=data?.config;
  const sessions=data?.sessions || [];
  // Initial SSR has no sessions; avoid loading ICU for an unused Today filter.
  const today=view==='Today'&&sessions.length?dateInZone(new Date(),timezone):'';
  const weekSessions=sessions.filter(s=>weekStart(dateInZone(new Date(s.start_at),config?.timezone || timezone))===weekStart(dateInZone(new Date(),config?.timezone || timezone)));
  const visible=sessions.filter(s=>view==='Pending'?['REQUESTED','ALTERNATIVE_PROPOSED'].includes(s.status):view==='Today'?dateInZone(new Date(s.start_at),timezone)===today:view==='Calendar'?(!calendarDate || dateInZone(new Date(s.start_at),timezone)===calendarDate):activeStatuses.includes(s.status)).sort((a,b)=>a.start_at.localeCompare(b.start_at));
  return <div className="teaching" aria-busy={busy || loading}>
    <header className="teaching-header"><div><p className="teaching-eyebrow">HFT ACADEMY · LIVE TEACHING</p><h1>{admin?'Teaching center':'Your weekly lesson'}</h1><p>{admin?'Manage your teaching calendar and student requests.':'Meet with Demi, ask questions, and work on your approved learning path.'}</p></div><span className="teaching-phase">PHASE A · SCHEDULING</span></header>
    <div role="alert" className={error?'teaching-error':''}>{error}{error && !data && <button className="quiet" disabled={loading} onClick={()=>{setLoading(true);refresh().then(()=>setError('')).catch(e=>setError(e.message)).finally(()=>setLoading(false));}}>Try again</button>}</div><div role="status" aria-live="polite" className={notice?'teaching-success':''}>{notice}{loading&&!data?'Loading your lessons…':''}{busy?' Saving…':''}</div>
    {data && <>
      <div className="teaching-summary"><div><span>{admin?'PENDING REQUESTS':"THIS WEEK’S LESSON"}</span><strong>{admin?sessions.filter(s=>['REQUESTED','ALTERNATIVE_PROPOSED'].includes(s.status)).length:weeklyLessonStatus(weekSessions)}</strong></div><div><span>YOUR DISPLAY TIMEZONE</span><strong>{timezone}</strong></div><div><span>{admin?'DEFAULT WEEKLY ALLOWANCE':'INSTRUCTOR TIMEZONE'}</span><strong>{admin?`${config?.weekly_allowance ?? '—'} lessons`:config?.timezone || 'Not set'}</strong></div></div>
      {!config && <p className="teaching-notice">{admin?'Set up your teaching defaults below to open lesson scheduling.':'Demi is preparing the teaching calendar. Available lesson times will appear here once scheduling opens.'}</p>}
      <div className="teaching-columns"><div className="teaching-main">
        <section className="teaching-panel"><div className="teaching-section-head"><h2>{admin?'Teaching calendar':'Upcoming HFT lesson'}</h2><button className="quiet" disabled={busy||loading} onClick={()=>{setLoading(true);refresh().then(()=>setError('')).catch(e=>setError(e.message)).finally(()=>setLoading(false));}}>Refresh</button></div>
          {admin && <div className="teaching-tabs" aria-label="Lesson views">{['Today','Upcoming','Pending','Calendar'].map(tab=><button key={tab} className={view===tab?'active':'secondary'} aria-pressed={view===tab} onClick={()=>setView(tab)}>{tab}</button>)}</div>}
          {view==='Calendar' && <label className="teaching-field">Calendar date ({timezone})<input type="date" value={calendarDate} onChange={e=>setCalendarDate(e.target.value)}/></label>}
          <div className="teaching-session-list">{visible.length?visible.map(s=><SessionCard key={s.id} session={s} admin={admin} timezone={timezone} busy={busy} onAction={sessionAction} onPropose={chooseProposal}/>):<div className="teaching-empty"><h3>{admin?'No lessons in this view':'Your next lesson starts here'}</h3><p>{admin?'New requests and confirmed sessions will appear here.':'Choose an available time and send your request. Demi will confirm your lesson.'}</p></div>}</div>
        </section>
        {decision && <section className="teaching-panel"><h2>{decision.action==='cancel'?'Cancel this lesson?':'Decline this request?'}</h2><p>{decision.session.title} · {time(decision.session.start_at,timezone)}</p><form onSubmit={async e=>{e.preventDefault();if(await command(decision.action,{sessionId:decision.session.id,expectedRevision:decision.session.revision,reason}))setDecision(null);}}><label className="teaching-field">Reason (optional)<textarea value={reason} onChange={e=>setReason(e.target.value)} maxLength={1000}/></label><div className="teaching-actions"><button disabled={busy}>Confirm {decision.action==='cancel'?'cancellation':'decline'}</button><button type="button" className="secondary" disabled={busy} onClick={()=>setDecision(null)}>Keep lesson</button></div></form></section>}
        {config && (!admin || proposal) && <section className="teaching-panel" ref={pickerRef} tabIndex={-1}><p className="teaching-eyebrow">{proposal?'CONTROLLED RESCHEDULING':'ONE STEP AT A TIME'}</p><h2>{proposal?'Propose a different lesson time':"Schedule This Week’s Lesson"}</h2><p>{proposal?'Choose a server-available time. The other person must accept the replacement.':'Select a date to see available times. A request is held temporarily while Demi reviews it.'}</p>
          <p className="teaching-muted">Times shown in {timezone}. Teaching calendar: {config.timezone}. Duration: {config.duration_min} minutes. Minimum booking notice: {config.minimum_notice_hours} hours. Booking horizon: {config.booking_horizon_days} calendar days, through the same local time on the final day.</p>
          {proposal && <p className="teaching-notice">Rescheduling: {proposal.title} · {time(proposal.start_at,timezone)} <button className="quiet" disabled={busy} onClick={()=>{setProposal(null);setSlots(null);setSelected('');setDate('');setLoading(false);slotRequest.current++;}}>Stop rescheduling</button></p>}
          <form onSubmit={submitSlot}><label className="teaching-field">Available date in instructor timezone ({config.timezone})<input type="date" required value={date} min={dateInZone(new Date(),config.timezone)} max={bookingHorizonDate(config)} disabled={busy} onChange={e=>loadSlots(e.target.value)}/></label>
            {loading && date && <p role="status">Checking available times…</p>}
            {slots && <fieldset className="teaching-slots"><legend>Available lesson times · {timezone}</legend>{slots.length?slots.map(slot=><label key={slot.id} className={`teaching-slot ${selected===slot.id?'selected':''}`}><input type="radio" name="lesson-slot" value={slot.id} checked={selected===slot.id} disabled={busy} onChange={()=>setSelected(slot.id)}/><span>{time(slot.start_at,timezone)}</span></label>):<p>No available times for this date. Try another date. Availability also reflects booking notice, horizon, blocks, buffers and your weekly allowance.</p>}</fieldset>}
            {!proposal && <label className="teaching-field">Lesson topic (optional)<input value={topic} maxLength={200} placeholder={data.suggestedLesson?.title || 'General questions and support'} onChange={e=>setTopic(e.target.value)}/></label>}
            {!proposal && data.suggestedLesson && <p className="teaching-muted">Suggested approved lesson: {data.suggestedLesson.title}. Scheduling does not change your learning progress.</p>}
            {proposal && <label className="teaching-field">Reason for a different time (optional)<textarea value={reason} maxLength={1000} onChange={e=>setReason(e.target.value)}/></label>}
            <button disabled={!selected||busy||loading}>{proposal?'Propose selected time':'Request lesson'}</button>
          </form>
        </section>}
        {!admin && sessions.some(s=>!activeStatuses.includes(s.status)) && <details className="teaching-panel"><summary>Lesson history</summary>{sessions.filter(s=>!activeStatuses.includes(s.status)).map(s=><SessionCard key={s.id} session={s} admin={false} timezone={timezone} busy={busy} onAction={sessionAction} onPropose={chooseProposal}/>)}</details>}
      </div>{admin && <aside className="teaching-controls"><details open className="teaching-panel"><summary>Availability & teaching controls</summary><AdminControls data={data} busy={busy} command={command}/></details></aside>}</div>
    </>}
    <footer className="teaching-footer">Weekly Academy lessons are separate from paid consultations. Confirmed lessons open your protected HFT classroom.</footer>
  </div>;
}

function AdminControls({data,busy,command}:{data:Snapshot;busy:boolean;command:(action:string,values:Record<string,unknown>)=>Promise<boolean>}) {
  const config=data.config;
  function formValues(event:FormEvent<HTMLFormElement>) {event.preventDefault();return new FormData(event.currentTarget);}
  return <div className="teaching-control-content"><form key={config?.revision ?? 'new'} onSubmit={e=>{const f=formValues(e);void command('configure',{timezone:f.get('timezone'),durationMin:Number(f.get('duration')),bufferMin:Number(f.get('buffer')),requestHours:Number(f.get('expiry')),weeklyAllowance:Number(f.get('allowance')),minimumNoticeHours:Number(f.get('notice')),bookingHorizonDays:Number(f.get('horizon'))});}}>
    <h3>Teaching defaults</h3><label className="teaching-field">IANA timezone<input name="timezone" required defaultValue={config?.timezone || 'America/Chicago'} placeholder="America/Chicago"/></label><div className="teaching-form-grid"><label className="teaching-field">Duration (minutes)<input name="duration" type="number" min="15" max="180" required defaultValue={config?.duration_min ?? 60}/></label><label className="teaching-field">Buffer (minutes)<input name="buffer" type="number" min="0" max="120" required defaultValue={config?.buffer_min ?? 15}/></label><label className="teaching-field">Minimum booking notice (hours)<input name="notice" type="number" min="0" max="720" required defaultValue={config?.minimum_notice_hours ?? 12}/></label><label className="teaching-field">Booking horizon (calendar days)<input name="horizon" type="number" min="1" max="90" required defaultValue={config?.booking_horizon_days ?? 14}/></label><label className="teaching-field">Request expiry (hours)<input name="expiry" type="number" min="1" max="168" required defaultValue={config?.request_hours ?? 12}/></label><label className="teaching-field">Default lessons/week<input name="allowance" type="number" min="1" max="10" required defaultValue={config?.weekly_allowance ?? 1}/></label></div><p className="teaching-muted">Request expiry is the time allowed to review a pending request. It is separate from minimum booking notice. Lessons require instructor confirmation.</p><button disabled={busy}>Save defaults</button>
  </form>{config && <>
    <form onSubmit={e=>{const f=formValues(e);void command('availability',{dayOfWeek:Number(f.get('day')),startTime:f.get('start'),endTime:f.get('end')});}}><h3>Recurring weekly hours</h3><p className="teaching-muted">Local times in {config.timezone}. Saving a day replaces its teaching hours.</p><label className="teaching-field">Day<select name="day">{days.map((day,i)=><option key={day} value={i}>{day}</option>)}</select></label><div className="teaching-form-grid"><label className="teaching-field">Start<input name="start" type="time" required defaultValue="09:00"/></label><label className="teaching-field">End<input name="end" type="time" required defaultValue="17:00"/></label></div><button disabled={busy}>Save weekly hours</button></form>
    <ul className="teaching-rule-list">{data.availability.map(rule=><li key={rule.id}><span>{days[rule.day_of_week]} · {rule.start_time}–{rule.end_time}</span><button className="quiet" disabled={busy} aria-label={`Remove ${days[rule.day_of_week]} hours`} onClick={()=>command('removeAvailability',{id:rule.id})}>Remove</button></li>)}</ul>
    <form onSubmit={e=>{const f=formValues(e);const blocked=f.get('blocked')==='on';void command('override',{date:f.get('date'),blocked,...(!blocked?{startTime:f.get('start'),endTime:f.get('end')}:{})});}}><h3>Date overrides & blocks</h3><p className="teaching-muted">An override replaces recurring hours for that date in {config.timezone}. Blocking closes the whole date for new lesson requests.</p><label className="teaching-field">Date<input name="date" type="date" required/></label><label className="teaching-check"><input name="blocked" type="checkbox" defaultChecked/> Block the entire date</label><div className="teaching-form-grid"><label className="teaching-field">Override start<input name="start" type="time" defaultValue="09:00"/></label><label className="teaching-field">Override end<input name="end" type="time" defaultValue="17:00"/></label></div><button disabled={busy}>Save date override</button></form>
    <ul className="teaching-rule-list">{data.overrides.map(override=><li key={override.id}><span>{override.date} · {override.blocked?'Blocked':`${override.start_time}–${override.end_time}`}</span><button className="quiet" disabled={busy} aria-label={`Remove override for ${override.date}`} onClick={()=>command('removeOverride',{id:override.id})}>Remove</button></li>)}</ul>
    <form onSubmit={e=>{const f=formValues(e);void command('allowance',{studentId:f.get('student'),weeklyLimit:f.get('limit')===''?null:Number(f.get('limit')),reason:f.get('reason')});}}><h3>Student weekly allowance</h3><p className="teaching-muted">Authorize extra support with an audited reason. Leave the limit blank to restore the default.</p><label className="teaching-field">Student<select name="student" required defaultValue=""><option value="" disabled>Select a student</option>{data.students?.map(student=><option key={student.id} value={student.id}>{student.name} · {student.weekly_limit===null?'default':student.weekly_limit+'/week'}</option>)}</select></label><label className="teaching-field">Lessons per week (blank = default)<input name="limit" type="number" min="0" max="10"/></label><label className="teaching-field">Reason (required for audit)<textarea name="reason" required minLength={5} maxLength={1000}/></label><button disabled={busy || !data.students?.length}>Save student allowance</button></form>
  </>}</div>;
}
