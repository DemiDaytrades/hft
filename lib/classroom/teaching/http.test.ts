import test from 'node:test';import assert from 'node:assert/strict';import {teachingBody} from './http';
test('teaching HTTP rejects cross-origin, non-JSON, malformed and oversized requests',async()=>{
 const request=(body:string,origin='http://localhost:3012',type='application/json')=>new Request('http://localhost:3012/api',{method:'POST',headers:{origin,'content-type':type},body});
 assert.deepEqual(await teachingBody(request('{"action":"notes"}'),'http://localhost:3012'),{action:'notes'});
 for(const r of [request('{}','https://evil.invalid'),request('{}',undefined,'text/plain'),request('['),request('[]'),request('x'.repeat(30001))])await assert.rejects(teachingBody(r,'http://localhost:3012'));
});
