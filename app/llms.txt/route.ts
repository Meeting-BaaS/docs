import { NextRequest } from 'next/server';

// Set to 'force-static' to ensure this is included in the static build
export const dynamic = 'force-static';
export const revalidate = false;

// Pre-generate this static route
export async function generateStaticParams() {
  return [{}]; // Generate this single route
}

export async function GET(request: NextRequest) {
  // Get host from request for proper URL construction
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  
  // Redirect to the non-txt version
  return Response.redirect(`${baseUrl}/llms`, 301);
} 