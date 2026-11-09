export const TEACHING_DISPATCH_PATH='/api/internal/teaching-delivery';
const encoder=new TextEncoder();
const canonical=(method:string,path:string,timestamp:string,nonce:string)=>encoder.encode([method,path,timestamp,nonce].join('\n'));
async function key(secret:string){return crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
export async function signDispatchRequest(secret:string,now=Date.now()):Promise<Headers>{
 if(secret.length<32)throw new Error('Dispatcher signing configuration unavailable.');
 const timestamp=String(now),nonce=crypto.randomUUID();
 const signature=await crypto.subtle.sign('HMAC',await key(secret),canonical('POST',TEACHING_DISPATCH_PATH,timestamp,nonce));
 return new Headers({'x-teaching-timestamp':timestamp,'x-teaching-nonce':nonce,'x-teaching-signature':Array.from(new Uint8Array(signature),b=>b.toString(16).padStart(2,'0')).join(''),'content-type':'application/json'});
}
export async function verifyDispatchRequest(request:Request,secret:string|undefined,now=Date.now()):Promise<string|null>{
 if(!secret||secret.length<32)return null;
 const timestamp=request.headers.get('x-teaching-timestamp')??'',nonce=request.headers.get('x-teaching-nonce')??'',signature=request.headers.get('x-teaching-signature')??'';
 if(!/^\d{13}$/.test(timestamp)||Math.abs(now-Number(timestamp))>60000||!Number.isSafeInteger(Number(timestamp)))return null;
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(nonce)||! /^[0-9a-f]{64}$/.test(signature))return null;
 const url=new URL(request.url);if(request.method!=='POST'||url.pathname!==TEACHING_DISPATCH_PATH||url.search)return null;
 const bytes=Uint8Array.from(signature.match(/../g)!,value=>parseInt(value,16));
 return await crypto.subtle.verify('HMAC',await key(secret),bytes,canonical(request.method,url.pathname,timestamp,nonce))?nonce:null;
}
