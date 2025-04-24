import { NextRequest } from 'next/server';

// Set to 'force-static' to ensure this is included in the static build
export const dynamic = 'force-static';
export const revalidate = false;

// Pre-generate this static route
export async function generateStaticParams() {
  return [{}]; // Generate this single route
}

export async function GET(request: NextRequest) {
  // We need to use NextResponse for proper redirects with relative URLs
  // during static generation
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/llms'
    }
  });
} 