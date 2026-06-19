import { NextResponse } from 'next/server';

// Liveness/readiness probe for self-hosted (k8s) deployments. Cheap and always
// 200 when the server is up.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export function GET() {
  return NextResponse.json({ status: 'ok' });
}
