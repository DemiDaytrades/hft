import { NextRequest, NextResponse } from "next/server";
import { requireMemberApiUser } from "@/lib/dal";
import { requireAcademyResource, assertLegacyAssessmentResource } from "@/lib/academy";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { db, newId } from "@/lib/academy";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

function getExtension(mime: string) {
  if (mime === "image/png") return "png";
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpg";
  if (mime === "image/webp") return "webp";
  return "bin";
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireMemberApiUser(req.headers);
    
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const assignmentId = formData.get("assignmentId") as string | null;
    
    if (!file || !assignmentId) {
      return NextResponse.json({ error: "file and assignmentId required" }, { status: 400 });
    }
    
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Only PNG, JPG, JPEG, WebP allowed" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 });
    }
    
    await requireAcademyResource(user.id, "assignment", assignmentId);
    await assertLegacyAssessmentResource('assignment',assignmentId);
    // Verify assignment exists and user has access context
    const assignment = await db().prepare(`SELECT * FROM "academy_assignment" WHERE id = ?;`).bind(assignmentId).first<any>();
    if (!assignment) return NextResponse.json({ error: "Assignment not found" }, { status: 404 });
    
    const { env } = await getCloudflareContext();
    const bucket = (env as any).ACADEMY_BUCKET;
    if (!bucket) {
      return NextResponse.json({ error: "R2 bucket not configured" }, { status: 500 });
    }
    
    const ext = getExtension(file.type);
    const key = `academy/${user.id}/${assignmentId}/${newId()}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();
    await bucket.put(key, arrayBuffer, {
      httpMetadata: { contentType: file.type },
      customMetadata: { userId: user.id, assignmentId, originalName: file.name.replace(/[^a-zA-Z0-9.-]/g, "_") }
    });
    
    // Update or create submission with file reference
    const { getUserAssignmentSubmissions, startOrUpdateAssignment } = await import("@/lib/academy");
    const subs = await getUserAssignmentSubmissions(user.id, assignmentId);
    let submission = subs.find((s: any) => s.status === 'in_progress' || s.status === 'not_started' || s.status === 'revision_required');
    if (!submission) {
      submission = await startOrUpdateAssignment(user.id, assignmentId);
    }
    const existingFiles = submission.file_urls ? JSON.parse(submission.file_urls) : [];
    const newFiles = [...existingFiles, { key, url: `/api/academy/assignments/files?key=${encodeURIComponent(key)}`, type: file.type, uploadedAt: new Date().toISOString() }];
    await db().prepare(`UPDATE "student_assignment_submission" SET file_urls = ?, status = CASE WHEN status = 'not_started' THEN 'in_progress' ELSE status END WHERE id = ?;`)
      .bind(JSON.stringify(newFiles), submission.id)
      .run();
    
    return NextResponse.json({ success: true, key, fileCount: newFiles.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Upload failed" }, { status: e.status || 500 });
  }
}
