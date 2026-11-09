/** Stable routing identity: a new response object must not reset the reader's form. */
export const schoolNavigationKey=(d:{id:string;version:string})=>d.id+'@'+d.version;
export const schoolViewHash=(view:string,sectionId:string)=>'#'+(view==='learn'?sectionId:view);
export function teachingActivitySourceVersion(context:{school?:{bound?:boolean}|null;guide?:{version?:string}|null}){return context.school?.bound&&context.guide?.version?context.guide.version:'1';}
