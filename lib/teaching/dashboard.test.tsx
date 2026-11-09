import test from 'node:test';import assert from 'node:assert/strict';import {renderToStaticMarkup} from 'react-dom/server';
let Card:any;try{Card=require('../../components/teaching/DashboardCard').TeachingDashboardCard;}catch(e:any){if(e.code!=='MODULE_NOT_FOUND')throw e;}
test('dashboard shows actual pending/confirmed sessions rather than only a scheduling link',()=>{
 assert.equal(typeof Card,'function');const html=renderToStaticMarkup(<Card admin={false} timezone="America/Chicago" sessions={[{id:'s',title:'What Is Money?',instructor_name:'Demi',student_name:'QA Student',start_at:'2099-11-09T19:00:00Z',status:'CONFIRMED'}]}/>);assert.match(html,/What Is Money/);assert.match(html,/CONFIRMED/);assert.match(html,/Nov/);assert.match(html,/\/lessons/);
 const staff=renderToStaticMarkup(<Card admin timezone="America/Chicago" sessions={[{id:'s',title:'Weekly lesson',student_name:'QA Student',start_at:'2099-11-09T19:00:00Z',status:'REQUESTED'}]}/>);assert.match(staff,/QA Student/);assert.match(staff,/1 pending/);assert.match(staff,/\/admin\/teaching/);
});
