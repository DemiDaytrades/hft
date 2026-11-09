export const teachingJson=(value:unknown,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'private, no-store'}});
export function teachingError(e:unknown){const error=e as Error&{status?:number};return teachingJson({error:(error.status??500)>=500?'Teaching tools temporarily unavailable.':error.message},error.status??500);}
export async function teachingBody(request:Request,origin:string){
 if(request.headers.get('origin')!==new URL(origin).origin)throw Object.assign(new Error('Same-origin request required.'),{status:403});
 if(!request.headers.get('content-type')?.startsWith('application/json'))throw Object.assign(new Error('JSON required.'),{status:415});
 const raw=await request.text();if(raw.length>30000)throw Object.assign(new Error('Request too large.'),{status:413});
 let body;try{body=JSON.parse(raw);}catch{throw Object.assign(new Error('Invalid JSON.'),{status:400});}
 if(!body||typeof body!=='object'||Array.isArray(body))throw Object.assign(new Error('Invalid command.'),{status:400});return body;
}
