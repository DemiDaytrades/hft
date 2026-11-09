import type {Curriculum} from './contracts';
export type StudentStage={id:string;number:number;title:string;status:'Available'|'Coming later';classes:{id:string;number:number;title:string;status:'Available'|'In progress'|'Completed'|'Locked'|'Coming later';href?:string;edition?:string}[]};
type Assignment={id:string;version?:string;enrollment?:string;href?:string;completed:boolean;started?:boolean};
/** Whitelist projection: authoring fields never reach the student roadmap component. */
export function studentRoadmap(curriculum:Curriculum,assignments:Assignment[]):StudentStage[]{
 return curriculum.stages.map(stage=>({id:stage.id,number:stage.number,title:stage.title,status:assignments.some(a=>curriculum.classes.some(c=>c.stageId===stage.id&&c.id===a.id&&c.status==='authored'))?'Available':'Coming later',classes:curriculum.classes.filter(c=>c.stageId===stage.id).flatMap<StudentStage['classes'][number]>(c=>{
  const assigned=c.status==='authored'?assignments.filter(a=>a.id===c.id):[];
  return assigned.length?assigned.map(a=>({id:c.id,number:c.number,title:c.title,status:a.completed?'Completed' as const:a.started?'In progress' as const:'Available' as const,href:a.href??('/academy/school/'+c.id+(a.enrollment?'?enrollment='+encodeURIComponent(a.enrollment):''))})):[{id:c.id,number:c.number,title:c.title,status:c.status==='authored'?'Locked' as const:'Coming later' as const}];
 })}));
}
