/** Student-safe teaching notifications. Pure rendering only; no provider or data access. */
export type TeachingMessageType = 'REQUEST_RECEIVED' | 'CONFIRMATION' | 'ALTERNATIVE_PROPOSED' | 'ALTERNATIVE_ACCEPTED' | 'RESCHEDULED' | 'CANCELED' | 'REMINDER_24H' | 'REMINDER_1H';
export interface TeachingMessageDTO {
  recipientName: string;
  instructorName: string;
  topic: string;
  startAt: string;
  timezone: string;
  dashboardUrl: string;
  proposedStartAt?: string | null;
  status?: string;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function utcInstant(value: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)) throw new Error('Teaching date must be an explicit UTC instant');
  const date = new Date(value);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0,19) !== value.slice(0,19)) throw new Error('Invalid teaching date');
  return date;
}

function dashboardLink(value: string): string {
  const url = new URL(value);
  const production = url.protocol === 'https:' && url.host === 'highfrequency.vip';
  const local = url.protocol === 'http:' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) && !!url.port;
  if ((!production && !local) || url.username || url.password || url.search || url.hash || !['/lessons','/admin/teaching'].includes(url.pathname)) throw new Error('Invalid teaching dashboard URL');
  return url.href;
}

export function teachingMessage(type: TeachingMessageType, dto: TeachingMessageDTO): {subject: string; html: string; text: string; body: string} {
  // Explicitly select allowed fields: never serialize a session or arbitrary extra properties.
  const {recipientName, instructorName, topic, timezone} = dto;
  for (const value of [recipientName, instructorName, topic]) if (typeof value !== 'string') throw new Error('Invalid teaching message field');
  if (timezone !== 'UTC' && !/^[A-Za-z_]+\/[A-Za-z_]+(?:\/[A-Za-z_]+)?$/.test(timezone)) throw new Error('An IANA timezone is required');
  const formatter = new Intl.DateTimeFormat('en-US', {timeZone:timezone, weekday:'long',year:'numeric',month:'long',day:'numeric',hour:'numeric',minute:'2-digit',hour12:true,timeZoneName:'short'});
  const format = (value: string) => `${formatter.format(utcInstant(value))} (${timezone})`;
  const current = format(dto.startAt);
  const url = dashboardLink(dto.dashboardUrl);
  const titles: Record<TeachingMessageType, string> = {
    REQUEST_RECEIVED:'Lesson request received', CONFIRMATION:'Lesson confirmed', ALTERNATIVE_PROPOSED:'Alternative lesson time proposed', ALTERNATIVE_ACCEPTED:'Alternative accepted — lesson confirmed', RESCHEDULED:'Lesson rescheduled', CANCELED:dto.status === 'DECLINED' ? 'Lesson request declined' : 'Lesson canceled', REMINDER_24H:'24-hour lesson reminder', REMINDER_1H:'1-hour lesson reminder',
  };
  const title = titles[type];
  if (!title) throw new Error('Unknown teaching notification type');
  let schedule = `Date & time: ${current}`;
  let explanation = '';
  if (type === 'REQUEST_RECEIVED') explanation = 'Your lesson request is awaiting instructor approval.';
  if (type === 'ALTERNATIVE_PROPOSED') {
    if (!dto.proposedStartAt) throw new Error('Proposed time is required');
    schedule = `Proposed time: ${format(dto.proposedStartAt)}\nOriginal reserved time: ${current}`;
    explanation = 'Review and accept the proposed time in your HFT dashboard. The original time remains reserved until the alternative is accepted.';
  }
  const content = [`Hi ${recipientName},`,title,explanation,`Instructor: ${instructorName}`,`Lesson/topic: ${topic}`,schedule].filter(Boolean).join('\n\n');
  const subject = `HFT: ${title}`;
  const text = `High Frequency Trading\n\n${content}\n\nOpen HFT dashboard: ${url}\n\nHigh Frequency Trading LLC — educational content only. Not financial advice.`;
  const body = `HFT: ${content}\n\n${url}\nReply STOP to opt out.`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head><body style="margin:0;padding:0;background:#030303;color:#fff;font-family:system-ui,-apple-system,sans-serif;line-height:1.6"><table role="presentation" width="100%"><tr><td align="center" style="padding:40px 20px"><table role="presentation" width="100%" style="max-width:600px;background:#0a0a0a;border:1px solid #1a1a1a;border-radius:10px"><tr><td align="center" style="padding:32px 24px;border-bottom:1px solid #1a1a1a"><span style="color:#e8551c">● ● ●</span><h1 style="font-size:20px">High Frequency Trading</h1></td></tr><tr><td style="padding:32px 24px"><h2>${escapeHtml(title)}</h2><p style="color:#d1d1d1">${escapeHtml(content).replace(/\n/g,'<br />')}</p><a href="${escapeHtml(url)}" style="display:inline-block;padding:12px 24px;background:#e8551c;color:#fff;border-radius:6px;text-decoration:none">Open HFT dashboard</a></td></tr><tr><td align="center" style="padding:24px;border-top:1px solid #1a1a1a;font-size:12px;color:#888">High Frequency Trading LLC — educational content only. Not financial advice.</td></tr></table></td></tr></table></body></html>`;
  return {subject, html, text, body};
}
