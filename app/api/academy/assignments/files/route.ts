import { NextRequest, NextResponse } from "next/server";
import { requireMemberApiUser } from "@/lib/dal";
import { requireAcademyResource } from "@/lib/academy";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(req: NextRequest) {
  try {
    const user = await requireMemberApiUser(req.headers);
    
    const { searchParams } = new URL(req.url);
    const key = searchParams.get("key");
    if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });
    
    // Check ownership or admin
    const isAdmin = user.role === 'admin';
    if (!isAdmin && !key.startsWith(`academy/${user.id}/`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    
    if (!isAdmin) await requireAcademyResource(user.id, "assignment", key.split("/")[2]);
    const { env } = await getCloudflareContext();
    const bucket = (env as any).ACADEMY_BUCKET;
    if (!bucket) return NextResponse.json({ error: "R2 not configured" }, { status: 500 });
    
    const object = await bucket.get(key);
    if (!object) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("Cache-Control", "private, max-age=3600");
    return new Response(object.body, { headers });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: e.status || 500 });
  }
}
