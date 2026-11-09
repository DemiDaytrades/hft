import {fixtureDb} from '../../financial-plan/testing/db';

/** Test-only counters: SQL shapes and sizes, never bound arguments or row values. */
export function requestCost(db:D1Database){
 const entries:{method:string;sql:string;duplicate:boolean}[]=[];
 const seen=new Set<string>(),raw=new WeakMap<object,{statement:any;sql:string;args:unknown[]}>();
 let calls=0,decodedBytes=0;
 const record=(method:string,sql:string,args:unknown[])=>{const key=sql+JSON.stringify(args);entries.push({method,sql:sql.replace(/\s+/g,' ').trim(),duplicate:seen.has(key)});seen.add(key);};
 function wrap(statement:any,sql:string,args:unknown[]=[]):any {
  const proxy=new Proxy(statement,{get(target,key){
   if(key==='bind')return(...values:unknown[])=>wrap(target.bind(...values),sql,values);
   if(['first','all','run','raw'].includes(String(key)))return async(...values:unknown[])=>{calls++;record(String(key),sql,args);const result=await target[key](...values);decodedBytes+=JSON.stringify(result??null).length;return result;};
   const value=target[key];return typeof value==='function'?value.bind(target):value;
  }});raw.set(proxy,{statement,sql,args});return proxy;
 }
 const measured=new Proxy(db,{get(target,key){
  if(key==='prepare')return(sql:string)=>wrap(target.prepare(sql),sql);
  if(key==='batch')return async(statements:object[])=>{calls++;for(const statement of statements){const value=raw.get(statement)!;record('batch',value.sql,value.args);}const result=await target.batch(statements.map(statement=>raw.get(statement)!.statement));decodedBytes+=JSON.stringify(result).length;return result;};
  const value=(target as any)[key];return typeof value==='function'?value.bind(target):value;
 }});
 return {db:measured,entries,get calls(){return calls;},get decodedBytes(){return decodedBytes;},reset(){entries.length=0;seen.clear();calls=0;decodedBytes=0;}};
}

export function costFixture(studentCount=1){
 const f=fixtureDb(),now=Date.now();
 for(let i=0;i<=studentCount;i++){const id=i?'student-'+i:'host';f.sqlite.prepare("INSERT INTO user(id,name,email,role,createdAt,updatedAt,subscriptionStatus,lifecycle_status) VALUES(?,?,?,?,?,?,'active','ACTIVE')").run(id,id,id+'@example.invalid',i?'student':'admin','x','x');}
 f.sqlite.prepare("INSERT INTO teaching_session(id,instructor_id,student_id,kind,capacity,start_at,end_at,timezone,buffer_min,status,base_status,created_at,updated_at) VALUES('cost-room','host','student-1','GROUP',10,?,?,'UTC',0,'CONFIRMED','CONFIRMED','x','x')").run(new Date(now-1000).toISOString(),new Date(now+3600000).toISOString());
 for(let i=1;i<=studentCount;i++)f.sqlite.prepare("INSERT INTO teaching_enrollment VALUES('cost-room',?,'ENROLLED')").run('student-'+i);
 const rpc:string[]=[];
 const provider:any={configured:true,ensureRoom:async()=>{rpc.push('ensureRoom');},remove:async()=>{rpc.push('remove');},setPermissions:async()=>{rpc.push('setPermissions');},deleteRoom:async()=>{rpc.push('deleteRoom');},list:async()=>{rpc.push('list');return [];},issueToken:async()=>{rpc.push('issueToken');return {token:'synthetic-only',url:'wss://example.invalid'};}};
 return {...f,probe:requestCost(f.db),provider,rpc};
}
