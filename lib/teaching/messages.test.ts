import test from 'node:test';
import assert from 'node:assert/strict';
import { teachingMessage, type TeachingMessageType } from './messages';

const safe = {recipientName:'Taylor', instructorName:'Demi', topic:'Lesson 1', startAt:'2026-03-08T08:30:00.000Z', timezone:'America/Chicago', dashboardUrl:'https://highfrequency.vip/lessons'};
const types: TeachingMessageType[] = ['REQUEST_RECEIVED','CONFIRMATION','ALTERNATIVE_PROPOSED','ALTERNATIVE_ACCEPTED','RESCHEDULED','CANCELED','REMINDER_24H','REMINDER_1H'];
for (const type of types) test(`${type} includes student-safe schedule details and dashboard access`, () => {
 const result = teachingMessage(type,{...safe,proposedStartAt:'2026-03-09T08:30:00.000Z'});
 for (const output of [result.html,result.text,result.body]) {
  for (const value of ['Taylor','Demi','Lesson 1','America/Chicago','highfrequency.vip/lessons']) assert.ok(output.includes(value));
 }
 assert.match(result.text,/March 8, 2026/);
 assert.match(result.text,/3:30 AM CDT/);
 assert.match(result.subject,/HFT/);
 assert.match(result.body,/Reply STOP/);
});
test('alternatives distinguish proposed time from the original reservation',()=>{
 const result=teachingMessage('ALTERNATIVE_PROPOSED',{...safe,proposedStartAt:'2026-03-09T08:30:00Z'});
 assert.match(result.text,/Proposed time:.*March 9, 2026/);
 assert.match(result.text,/Original reserved time:.*March 8, 2026/);
 assert.throws(()=>teachingMessage('ALTERNATIVE_PROPOSED',safe));
});
test('declined requests are identified as declined',()=>assert.match(teachingMessage('CANCELED',{...safe,status:'DECLINED'}).text,/request.*declined/i));
test('recipient timezone and fall DST ambiguity retain explicit zone',()=>{
 for (const [startAt,timezone,expected] of [
 ['2026-11-01T06:30:00Z','America/Chicago','1:30 AM CDT'],
 ['2026-11-01T07:30:00Z','America/Chicago','1:30 AM CST'],
 ['2026-03-08T08:30:00Z','America/New_York','4:30 AM EDT'],
 ['2026-03-08T08:30:00Z','Asia/Tokyo','5:30 PM GMT+9'],
 ] as const) assert.ok(teachingMessage('CONFIRMATION',{...safe,startAt,timezone}).text.includes(expected));
});
test('rejects naive or impossible timestamps and invalid timezone context',()=>{
 for(const startAt of ['2026-03-08T08:30:00','2026-02-30T08:30:00Z','invalid','2026-03-08T08:30:00-05:00']) assert.throws(()=>teachingMessage('CONFIRMATION',{...safe,startAt}));
 for(const timezone of ['CST','not/a-zone','+02:00']) assert.throws(()=>teachingMessage('CONFIRMATION',{...safe,timezone}));
});
test('escapes all HTML fields, keeps text literal, and ignores private extra fields',()=>{
 const params={...safe,recipientName:'<script>alert("name")</script>',instructorName:'Demi & Co',topic:'<img src=x onerror=alert(1)>',privateNotes:'TOP_SECRET',amountCents:12345};
 const result=teachingMessage('CONFIRMATION',params);
 assert.ok(!result.html.includes('<script>')); assert.ok(!result.html.includes('<img'));
 assert.match(result.html,/&lt;script&gt;/); assert.match(result.html,/Demi &amp; Co/);
 assert.ok(result.text.includes(params.recipientName)); assert.ok(!result.body.includes('&lt;'));
 assert.ok(!JSON.stringify(result).includes('TOP_SECRET')); assert.ok(!JSON.stringify(result).includes('12345'));
});
test('restricts dashboard destinations to teaching routes on trusted origins',()=>{
 for(const dashboardUrl of ['javascript:alert(1)','https://evil.test/lessons','https://highfrequency.vip.evil.test/lessons','https://highfrequency.vip/lessons?next=https://evil.test','https://highfrequency.vip/account','https://user:pass@highfrequency.vip/lessons','http://highfrequency.vip/lessons','https://highfrequency.vip/lessons#evil']) assert.throws(()=>teachingMessage('CONFIRMATION',{...safe,dashboardUrl}));
 for(const dashboardUrl of ['https://highfrequency.vip/admin/teaching','http://localhost:3000/lessons','http://127.0.0.1:3000/admin/teaching']) assert.ok(teachingMessage('CONFIRMATION',{...safe,dashboardUrl}).text.includes(dashboardUrl));
});
