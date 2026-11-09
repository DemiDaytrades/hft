import Link from 'next/link';
import {requireActiveMember} from '@/lib/dal';
import {getCloudflareContext} from '@opennextjs/cloudflare';
import {studentCatalog} from '@/lib/academy/school/student';
import {CURRICULUM} from '@/lib/academy/school/registry';
import {studentRoadmap} from '@/lib/academy/school/roadmap';
import {SchoolRoadmap} from '@/components/academy/school/SchoolRoadmap';
import '@/components/academy/school/school.css';
export const dynamic='force-dynamic';
export default async function School(){
 const user=await requireActiveMember(),db=getCloudflareContext().env.DB,classes=await studentCatalog(db,user.id);
 const stages=studentRoadmap(CURRICULUM,classes);
 return <main className="school"><header className="school-header"><p className="school-eyebrow">HFT Academy · Your learning journey</p><h1>Build the foundations.</h1><p>Start with your available class. Explore the ideas, practise them, and build understanding with your instructor’s feedback.</p><div className="school-actions"><Link href="/academy">Academy home</Link><Link href="/academy/study-guides">Your Study Guides</Link></div></header><SchoolRoadmap stages={stages}/></main>;
}
