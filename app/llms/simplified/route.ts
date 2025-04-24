export const dynamic = 'force-static';

export async function GET(request: Request) {
  return new Response('LLM Documentation Index', {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 