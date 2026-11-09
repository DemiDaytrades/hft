import { requireMemberApiUser } from '@/lib/dal';
import { getIntakeV2Db } from '@/lib/student-intake-v2/service';
import { getStudentLearningPath } from '@/lib/learning-path/service';
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
    try {
        const user = await requireMemberApiUser(request.headers);
        // Deliberately no client-supplied student/version ID: published own plan only.
        return Response.json(await getStudentLearningPath(getIntakeV2Db(), user.id), { headers: { 'Cache-Control': 'private, no-store' } });
    }
    catch (e) {
        return Response.json({ error: e instanceof Error ? e.message : 'Unable to load plan.' }, { status: (e as {
                status?: number;
            })?.status ?? 400, headers: { 'Cache-Control': 'private, no-store' } });
    }
}
