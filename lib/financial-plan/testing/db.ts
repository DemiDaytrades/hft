import {DatabaseSync} from 'node:sqlite';
import {readdirSync,readFileSync} from 'node:fs';
export function fixtureDb(){
 const sqlite=new DatabaseSync(':memory:');sqlite.exec('PRAGMA foreign_keys=ON');
 for(const f of readdirSync('migrations').filter(f=>f.endsWith('.sql')).sort())sqlite.exec(readFileSync(`migrations/${f}`,'utf8'));
 let transactions=Promise.resolve<unknown>(undefined);
 const db={prepare(sql:string){let args:any[]=[];return {bind(...a:any[]){args=a;return this;},async first(){return sqlite.prepare(sql).get(...args)??null;},async all(){return {results:sqlite.prepare(sql).all(...args)};},async run(){const r=sqlite.prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}};}};},async batch(stmts:any[]){const operation=transactions.then(async()=>{sqlite.exec('BEGIN');try{const results=[];for(const stmt of stmts)results.push(await stmt.run());sqlite.exec('COMMIT');return results;}catch(e){sqlite.exec('ROLLBACK');throw e;}});transactions=operation.catch(()=>undefined);return operation;}};
 return {sqlite,db:db as unknown as D1Database};
}
