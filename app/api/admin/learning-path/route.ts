import { requireMemberApiUser } from '@/lib/dal';
import { getIntakeV2Db } from '@/lib/student-intake-v2/service';
import { generateLearningPath, getStaffLearningPaths, saveLearningPath, approveLearningPath } from '@/lib/learning-path/service';
export const dynamic = 'force-dynamic';
const respond = (value: unknown, status = 200) => Response.json(value, { status, headers: { 'Cache-Control': 'private, no-store' } });
const error = (e: unknown) => respond({ error: e instanceof Error ? e.message : 'Financial plan request failed.' }, (e as {
    status?: number;
})?.status ?? 400);
async function authorize(request: Request) { const u = await requireMemberApiUser(request.headers); if (u.role !== 'admin')
    throw Object.assign(new Error('Forbidden'), { status: 403 }); return { userId: u.id, role: 'admin' }; }
export async function GET(request: Request) {
    try {
        const actor = await authorize(request), studentId = new URL(request.url).searchParams.get('studentId');
        if (!studentId)
            return respond({ error: 'studentId required' }, 400);
        return respond(await getStaffLearningPaths(getIntakeV2Db(), actor, studentId));
    }
    catch (e) {
        return error(e);
    }
}
export async function POST(request: Request) { try {
    const actor = await authorize(request), text = await request.text();
    if (text.length > 100000)
        return respond({ error: 'Request too large' }, 413);
    const b = JSON.parse(text), db = getIntakeV2Db();
    if (b.action === 'generate' && typeof b.studentId === 'string')
        return respond(await generateLearningPath(db, actor, b.studentId, b.requestKey));
    if (typeof b.planId !== 'string' || !Number.isSafeInteger(b.revision))
        return respond({ error: 'Valid plan ID/revision required' }, 400);
    if (b.action === 'save')
        return respond(await saveLearningPath(db, actor, b.planId, b.revision, b.content));
    if (b.action === 'approve')
        return respond(await approveLearningPath(db, actor, b.planId, b.revision));
    return respond({ error: 'Invalid action' }, 400);
}
catch (e) {
    return error(e);
} }
