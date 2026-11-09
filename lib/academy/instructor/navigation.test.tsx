import test from 'node:test';
import assert from 'node:assert/strict';
import Module from 'node:module';
import {renderToStaticMarkup} from 'react-dom/server';
import {fixtureDb} from '../../financial-plan/testing/db';
import {installMoneyLesson} from '../learning/seed';
import {MONEY_LESSON as lesson} from '../curriculum/what-is-money';
let database:any;
const load=(Module as any)._load;
(Module as any)._load=function(name:string,...args:any[]){if(name==='@opennextjs/cloudflare')return {getCloudflareContext:()=>({env:{DB:database}})};if(name==='@/lib/dal')return {requireAdmin:async()=>({id:'admin',role:'admin'})};return load.call(this,name,...args);};
const Home=require('../../../app/(app)/admin/academy/page').default;
const Course=require('../../../app/(app)/admin/academy/courses/[courseId]/page').default;
const Lessons=require('../../../app/(app)/admin/academy/modules/[moduleId]/lessons/page').default;
const Inspect=require('../../../app/(app)/admin/academy/inspect/[lessonId]/page').default;
const Preview=require('../../../app/(app)/admin/academy/preview/[lessonId]/page').default;
function nativeLink(html:string,href:string,text:string){const links=[...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)];assert.ok(links.some(m=>m[1].includes(`href="${href}"`)&&m[2].replace(/<[^>]*>/g,'').replaceAll('&amp;','&').includes(text)),`Expected native navigable link: ${text} -> ${href}`);}
test('actual instructor pages provide native course → module → lesson inspection → student preview links',async()=>{
 const {db,sqlite}=fixtureDb();database=db;try{
 sqlite.prepare('INSERT INTO user(id,name,email,role,createdAt,updatedAt) VALUES(?,?,?,?,?,?)').run('admin','Instructor','admin@example.invalid','admin','2026-11-07','2026-11-07');await installMoneyLesson(db);
 sqlite.prepare('UPDATE academy_course SET title=? WHERE id=?').run('HFT Trading Foundations',lesson.courseId);
 const before=sqlite.prepare('SELECT total_changes() AS n').get() as any;
 const home=renderToStaticMarkup(await Home());nativeLink(home,`/admin/academy/courses/${lesson.courseId}`,'HFT Trading Foundations');
 const course=renderToStaticMarkup(await Course({params:Promise.resolve({courseId:lesson.courseId})}));nativeLink(course,`/admin/academy/modules/${lesson.moduleId}/lessons`,lesson.stage);
 const lessons=renderToStaticMarkup(await Lessons({params:Promise.resolve({moduleId:lesson.moduleId})}));nativeLink(lessons,`/admin/academy/inspect/${lesson.id}`,lesson.title);nativeLink(lessons,`/admin/academy/preview/${lesson.id}`,'Preview as student');
 const inspection=renderToStaticMarkup(await Inspect({params:Promise.resolve({lessonId:lesson.id})}));nativeLink(inspection,`/admin/academy/preview/${lesson.id}`,'PREVIEW AS STUDENT');
 const preview=renderToStaticMarkup(await Preview({params:Promise.resolve({lessonId:lesson.id})}));assert.match(preview,/STUDENT PREVIEW/);assert.equal((sqlite.prepare('SELECT total_changes() AS n').get() as any).n,before.n);
 }finally{sqlite.close();}
});
