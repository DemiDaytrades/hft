// Shared only by trusted HFT server/Worker paths. No provider credentials in tickets.
export type ControlClaims={actorId:string;sessionId:string;connectionId:string;expiresAt:number;issuedAt:number;nonce:string};
const bytes=(s:string)=>new TextEncoder().encode(s);
const encode=(v:Uint8Array)=>btoa(String.fromCharCode(...v)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
function decode(v:string){if(!/^[A-Za-z0-9_-]+$/.test(v))throw new Error('Invalid encoding');return Uint8Array.from(atob(v.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));}
async function key(secret:string){if(typeof secret!=='string'||secret.length<32)throw new Error('Classroom control is not configured.');return crypto.subtle.importKey('raw',bytes(secret),{name:'HMAC',hash:'SHA-256'},false,['sign','verify']);}
async function signature(secret:string,value:string){return encode(new Uint8Array(await crypto.subtle.sign('HMAC',await key(secret),bytes(value))));}
export async function mintControlTicket(secret:string,claim:Pick<ControlClaims,'actorId'|'sessionId'|'connectionId'>,now=Math.floor(Date.now()/1000)){
 for(const v of Object.values(claim))if(typeof v!=='string'||!v||v.length>200)throw new Error('Invalid ticket claims.');
 const body=encode(bytes(JSON.stringify({...claim,issuedAt:now,expiresAt:now+30,nonce:crypto.randomUUID()})));return body+'.'+await signature(secret,body);
}
export async function verifyControlTicket(secret:string,token:string,sessionId:string,now=Math.floor(Date.now()/1000)):Promise<ControlClaims>{
 if(token.length>2000)throw new Error('Invalid ticket.');const parts=token.split('.');if(parts.length!==2||!await crypto.subtle.verify('HMAC',await key(secret),decode(parts[1]),bytes(parts[0])))throw new Error('Invalid ticket.');
 const c=JSON.parse(new TextDecoder().decode(decode(parts[0]))) as ControlClaims;
 if(c.sessionId!==sessionId||!c.actorId||!c.connectionId||!c.nonce||!Number.isInteger(c.issuedAt)||c.issuedAt>now+2||!Number.isInteger(c.expiresAt)||c.expiresAt<=now||c.expiresAt-c.issuedAt!==30)throw new Error('Ticket expired or mismatched.');return c;
}
export async function signControlRequest(secret:string,method:string,path:string,body:string,now=Math.floor(Date.now()/1000),nonce=crypto.randomUUID()){
 const value=[method,path,String(now),nonce,body].join('\n');return {'x-hft-control-time':String(now),'x-hft-control-nonce':nonce,'x-hft-control-signature':await signature(secret,value)};
}
export async function verifyControlRequest(secret:string,method:string,path:string,body:string,headers:Headers,now=Math.floor(Date.now()/1000)){
 try{const at=headers.get('x-hft-control-time')??'',nonce=headers.get('x-hft-control-nonce')??'',sig=headers.get('x-hft-control-signature')??'';if(!/^\d+$/.test(at)||Math.abs(now-Number(at))>60||nonce.length<5||nonce.length>100)return false;return await crypto.subtle.verify('HMAC',await key(secret),decode(sig),bytes([method,path,at,nonce,body].join('\n')));}catch{return false;}
}
