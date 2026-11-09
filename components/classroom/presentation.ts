export function visibleScreens(ids: string[], focus: string, mobile: boolean): string[] { return mobile ? ids.filter(id => id === focus).slice(0, 1) : ids; }
export function orderedChat<T extends {id: string | number; sequence?: number}>(messages: T[]): T[] { return [...new Map(messages.map(message => [message.id, message])).values()].sort((a,b) => (a.sequence ?? Number(a.id)) - (b.sequence ?? Number(b.id))); }
export function mediaIdentity(userId:string):string { return `hft-${userId}`; }
export function controlSocketOptions(url:string,ticket:string):{url:string;protocols:string[]} { return {url,protocols:['hft-classroom',ticket]}; }
export function mergeChatHistory<T extends {id:number}>(existing:T[],incoming:T[]):T[] {return [...new Map([...existing,...incoming].map(message=>[message.id,message])).values()].sort((a,b)=>a.id-b.id);}
export function requiresHistoryRefresh(events:{id:number;action:string}[],after:number):boolean {return events.some(event=>event.id>after&&(event.action==='deleteChat'||event.action==='pin'));}
export function heartbeatDue(now:number,last:number):boolean {return now-last>=15000;}
/** Realtime snapshots are server-authorized. Keep HTTP as a safety refresh/fallback. */
export function classroomPollDue(now:number,lastHttp:number,lastControl:number,socketOpen:boolean):boolean {
 return !socketOpen||!lastControl||now-lastControl>10000||now-lastHttp>=30000;
}
export function accessDeniedStatus(status:number):boolean {return status===401||status===403||status===404;}
/** Admission owns the media replacement from before its POST until connection completes.
 * Cloud permission updates deliberately disconnect the old room during that interval.
 */
export function createMediaAdmissionCoordinator(){
 let active=false;let generation=0;
 return {
  get active(){return active;},
  async execute(action:string,operation:()=>Promise<boolean>):Promise<boolean>{
   const admission=action==='join'||action==='screenStart'||action==='screenStop';
   if(!admission)return operation();
   if(active)return false;
   active=true;generation++;
   try{return await operation();}finally{active=false;}
  },
  recover(operation:()=>Promise<unknown>|void,schedule:(callback:()=>void)=>void){
   if(active)return;
   const queuedGeneration=generation;
   schedule(()=>{if(!active&&generation===queuedGeneration)void operation();});
  },
 };
}
/** END effects may run again: do not trigger another render when already off. */
export function clearedMediaState<T extends {microphone:boolean;camera:boolean;screen:boolean}>(current:T):T {
 return current.microphone||current.camera||current.screen?{...current,microphone:false,camera:false,screen:false}:current;
}
