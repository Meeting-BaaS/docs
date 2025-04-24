export const dynamic = 'force-static';

// Single parameter route handler for maximum compatibility
export async function GET(request: Request) {
  // Extract ID from URL path
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Parse the URL to extract the ID
  // Expected format: /llms/test/{id}
  const parts = pathname.split('/').filter(Boolean);
  const id = parts.length >= 3 ? parts[2] : 'default';
  
  return new Response(`Test dynamic route with ID: ${id}`, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 