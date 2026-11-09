import Link from 'next/link';
import {requireActiveMember} from '@/lib/dal';
import {getIntakeV2Db} from '@/lib/student-intake-v2/service';
import {getStudentPlan} from '@/lib/financial-plan/service';
import PlanContent from '@/components/financial-plan/PlanContent';
export const dynamic='force-dynamic';
export default async function FinancialPlanPage(){
 const user=await requireActiveMember(),result=await getStudentPlan(getIntakeV2Db(),user.id);
 return <main className="mx-auto max-w-5xl space-y-8 py-6"><header><p className="text-xs uppercase tracking-widest text-brand-400">HFT · Your next steps</p><h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Your Financial / Trading Readiness Plan</h1>{result&&<p className="mt-3 text-sm text-white/50">Version {result.plan.version} · Published {result.plan.publishedAt.slice(0,10)}</p>}</header>{result?<>{result.sourceOutdated&&<p role="status" className="border-l-2 border-brand-400 p-4 text-sm text-brand-200">A newer completed intake is available. This published plan remains based on the earlier consultation snapshot until your instructor reviews and publishes a revision.</p>}<PlanContent content={result.plan.content}/></>:<section className="border-y border-white/15 py-8 text-sm leading-7 text-white/65"><p>Your instructor has not published a Financial / Trading Readiness Plan yet. Drafts remain private during review.</p><Link href="/my-finances" className="mt-4 inline-block text-brand-300">View legacy My Finances information →</Link></section>}</main>;
}
