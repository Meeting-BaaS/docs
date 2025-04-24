// Simple Route Handler with correct Next.js 15.2.4 types
export const dynamic = 'force-static';

export async function GET(
  request: Request
) {
  return new Response('Hello World', {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 