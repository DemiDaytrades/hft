const fs=require('fs'),p=require('path'),cp=require('child_process');
const src='/Users/demi/Documents/GitHub/hft', dst='/private/tmp/hft-controlled-launch-rc';
if(fs.existsSync(dst))throw Error('Candidate already exists; refusing overwrite');
fs.mkdirSync(dst,{mode:0o700});
const skip=new Set(['.git','.wrangler','.next','.open-next','node_modules','.kilo','.aws','.agents','.codex','backups']);
const permittedRoots=new Set(['app','components','docs','lib','migrations','public','scripts','tests','workers']);
const permittedFiles=new Set(['AGENTS.md','CLAUDE.md','MASTER_CURRICULUM_ARCHITECTURE.md','README.md','cloudflare-env.d.ts','next-env.d.ts','next.config.ts','open-next.config.ts','package-lock.json','package.json','postcss.config.mjs','tsconfig.json','wrangler.jsonc','.gitignore']);
const records=new Map(); const sha=b=>require('crypto').createHash('sha256').update(b).digest('hex');
function write(rel,b,decision){const out=p.join(dst,rel);fs.mkdirSync(p.dirname(out),{recursive:true});fs.writeFileSync(out,b);const original=p.join(src,rel);records.set(rel,{path:rel,originalSha256:fs.existsSync(original)?sha(fs.readFileSync(original)):null,candidateSha256:sha(b),decision});}
function walk(dir=''){for(const e of fs.readdirSync(p.join(src,dir),{withFileTypes:true})){const rel=p.join(dir,e.name);if(skip.has(e.name)||e.name.startsWith('.env')||e.name.startsWith('.dev.vars')||/secret|backup|\.log$|tsbuildinfo/i.test(e.name))continue;if(!dir&&!permittedRoots.has(e.name)&&!permittedFiles.has(e.name))continue;if(e.isSymbolicLink())continue;if(e.isDirectory())walk(rel);else if(e.isFile())write(rel,fs.readFileSync(p.join(src,rel)),'current source');}}
walk();
const inventory=JSON.parse(fs.readFileSync(p.join(src,'docs/releases/2026-11-07-resumed-release-scope.json')));
const headPaths=['app/(marketing)/page.tsx','components/SiteHeader.tsx','components/SiteFooter.tsx','lib/site.ts','app/api/stripe/webhook/route.ts','lib/checkout.ts','app/join/actions.ts','app/join/page.tsx','components/JoinForm.tsx','app/welcome/actions.ts','app/welcome/page.tsx','components/WelcomeForm.tsx'];
const keepHelpers=['lib/bookings.ts','lib/consultation-types.ts','lib/availability.ts'];
const excluded=[];
for(const f of inventory.files)if(f.resumedDisposition==='HOLD_WIDER_CHECKOUT_MARKETING_BOOKING'&&!headPaths.includes(f.path)&&!keepHelpers.includes(f.path)){fs.rmSync(p.join(dst,f.path),{force:true});records.delete(f.path);excluded.push(f.path);}
for(const rel of headPaths)write(rel,cp.execFileSync('git',['show',`HEAD:${rel}`],{cwd:src}),'HEAD restored; wider behavior withheld');
const ts=require(p.join(src,'node_modules/typescript'));
function retain(rel,names){const s=fs.readFileSync(p.join(src,rel),'utf8'),ast=ts.createSourceFile(rel,s,ts.ScriptTarget.Latest,true);const selected=ast.statements.filter(n=>{if(ts.isImportDeclaration(n))return !n.moduleSpecifier.text.includes('availability');return n.name&&names.includes(n.name.text);});write(rel,selected.map(n=>n.getText(ast)).join('\n\n')+'\n','AST-selected read-only helpers');}
retain('lib/bookings.ts',['ConsultationBooking','db','rowToBooking','getActiveBookingForUser']);
retain('lib/consultation-types.ts',['ConsultationType','db','rowToType','getConsultationType']);
write('app/api/member/consultation/route.ts',`import { NextResponse } from "next/server";
import { requireActiveMember } from "@/lib/dal";
import { getMembership } from "@/lib/membership";
import { getActiveBookingForUser } from "@/lib/bookings";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const user = await requireActiveMember();
    await getMembership(user.id);
    return NextResponse.json({ booking: await getActiveBookingForUser(user.id) });
  } catch (e) {
    if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) throw e;
    return NextResponse.json({ error: "Active HFT membership required." }, { status: 403 });
  }
}
`,'GET-only consultation; no POST export');
write('app/(app)/consultation/ConsultationBookingClient.tsx',`import { Panel } from "@/components/ui";
type Props = { consultationType: { name: string; durationMin: number } | null; existingBooking: { appointmentAt: string; status: string } | null };
export default function ConsultationBookingClient({ consultationType, existingBooking }: Props) {
  return <Panel>{existingBooking ? <><h2 className="text-xl font-bold">Consultation scheduled</h2><p className="mt-2">{consultationType?.name || "HFT Strategy Consultation"}</p><p className="mt-2">{existingBooking.appointmentAt.replace("T", " ")} CT</p><p className="mt-2">Status: {existingBooking.status.replaceAll("_", " ")}{consultationType ? " · " + consultationType.durationMin + " minutes" : ""}</p></> : <p>No scheduled consultation.</p>}<p className="mt-4 text-sm text-white/60">Scheduling is temporarily unavailable. Contact your instructor.</p></Panel>;
}
`,'read-only consultation display; no booking/calendar fetches');
const page='app/(app)/consultation/page.tsx';write(page,fs.readFileSync(p.join(dst,page),'utf8').replace('Schedule your complimentary strategy consultation as an active HFT member.','View your existing strategy consultation details.'),'read-only consultation introduction');
let config=fs.readFileSync(p.join(dst,'wrangler.jsonc'),'utf8');config=config.replace(/,\s*"r2_buckets"\s*:\s*\[[\s\S]*?\]\s*(?=})/,'');if(config.includes('r2_buckets'))throw Error('R2 removal failed');write('wrangler.jsonc',config,'text-only cohort; R2 binding omitted; existing identifiers and BETTER_AUTH_URL preserved');
cp.execFileSync('cp',['-cR',p.join(src,'node_modules'),p.join(dst,'node_modules')]);
const manifest={head:cp.execFileSync('git',['rev-parse','HEAD'],{cwd:src,encoding:'utf8'}).trim(),createdAt:new Date().toISOString(),source:src,candidate:dst,frozen:false,limitations:['node_modules copied from lockfile-matched installed dependencies','Parent must resync latest owned Intake/installer changes and regenerate hashes before freeze','No tests, build, deploy or remote operations performed by assembly'],excluded,files:[...records.values()].sort((a,b)=>a.path.localeCompare(b.path))};
fs.writeFileSync(p.join(dst,'CANDIDATE-ASSEMBLY-MANIFEST.json'),JSON.stringify(manifest,null,2));
fs.copyFileSync(__filename,p.join(dst,'CANDIDATE-ASSEMBLY-SCRIPT.cjs'));
console.log(JSON.stringify({candidate:dst,files:records.size,excluded:excluded.length,frozen:false}));
