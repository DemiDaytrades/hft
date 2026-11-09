import test from 'node:test';import assert from 'node:assert/strict';
import {renderToStaticMarkup} from 'react-dom/server';
import Scheduler from '../../components/teaching/Scheduler';

test('initial teaching shell does not initialize ICU/date formatters before session data is loaded',()=>{
 const Original=Intl.DateTimeFormat;let constructions=0;
 (Intl as any).DateTimeFormat=function(...args:any[]){constructions++;return new (Original as any)(...args);};
 try{const html=renderToStaticMarkup(<Scheduler admin/>);assert.match(html,/Teaching center/);assert.match(html,/aria-busy="true"/);assert.equal(constructions,0,'loading render must not format dates that are never displayed');}
 finally{Intl.DateTimeFormat=Original;}
});
