import { getAuth } from "@/lib/auth";

// Better Auth owns every /api/auth/* path (sign-in, sign-out, session, and the
// admin plugin's /admin/* endpoints). The instance is resolved per request
// because the D1 binding is only available inside the request context.
export function GET(request: Request) {
  return getAuth().handler(request);
}

export function POST(request: Request) {
  return getAuth().handler(request);
}
