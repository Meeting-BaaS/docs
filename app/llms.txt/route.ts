import { NextRequest } from 'next/server';

export const revalidate = false;

export async function GET(request: NextRequest) {
  // Get host from request for proper URL construction
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  
  // Option 1: Simple redirect to the new "all" route
  return Response.redirect(`${baseUrl}/llms/all`);
  
  // Option 2: For backward compatibility, you could also re-fetch from the "all" route
  // const response = await fetch(`${baseUrl}/llms/all`);
  // return response;
}
