import {schoolReference,instructorSchoolHref} from '@/lib/academy/school/reference';
import {redirect} from 'next/navigation';
import Link from 'next/link';
import {requireAdmin} from '@/lib/dal';
import {db} from '@/lib/academy';
import {inspectLesson} from '@/lib/academy/instructor/service';
import PreviewPlayer from '@/components/academy/instructor/PreviewPlayer';
import {LessonContentRenderer} from '@/components/academy/lesson/LessonContentRenderer';
export const dynamic='force-dynamic';
export default async function PreviewPage({params}:{params:Promise<{lessonId:string}>}){const actor=await requireAdmin(),{lessonId}=await params,data=await inspectLesson(db(),actor.id,lessonId);const schoolHref=instructorSchoolHref(data.lesson.content,true);if(schoolHref)redirect(schoolHref);return <main className="mx-auto min-w-0 max-w-6xl break-words"><Link href={`/admin/academy/inspect/${lessonId}`} className="mb-6 inline-block text-sm text-brand-300">← Instructor lesson inspection</Link><p className="mb-6 text-xs text-white/60">Publication: {data.lesson.publication} · {data.lesson.readiness.replaceAll('_',' ')}. Preview does not publish content or grant student access.</p>{data.interactive?<PreviewPlayer lesson={data.interactive}/>:<section className="space-y-6"><p className="rounded border border-brand-400/40 p-4 text-sm text-brand-200">STUDENT PREVIEW · READ ONLY · No attempts or progress are created.</p><h1 className="text-3xl font-bold">{data.lesson.title}</h1>{data.lesson.readiness==='READY'?<LessonContentRenderer content={data.lesson.content??''}/>:<p>Content is not yet available. No lesson experience has been fabricated.</p>}</section>}</main>;}
