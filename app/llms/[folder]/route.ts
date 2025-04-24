import { NextRequest } from 'next/server';

// Set to 'force-static' to ensure this is included in the static build
export const dynamic = 'force-static';
export const revalidate = false;

// Categories mapping with type safety
const categories: Record<string, string> = {
  api: 'MeetingBaas API, the main purpose of the documentation',
  'transcript-seeker': 'Transcript Seeker, the open-source transcription playground',
  'speaking-bots': 'Speaking Bots, the Pipecat-powered bots',
  'calendars': 'Calendars API, for managing calendar integrations and events',
  'meetings': 'Meetings API, for scheduling and managing virtual meetings',
  'users': 'Users API, for user management and authentication',
  'webhooks': 'Webhooks API, for event notifications and integrations',
  'sdk': 'MeetingBaas SDK, client libraries for various programming languages',
  'all': 'All MeetingBaas documentation content'
};

// Generate all possible static paths at build time
export async function generateStaticParams() {
  return Object.keys(categories).map(folder => ({ 
    folder 
  }));
}

// Using the original working pattern with Promise<params>
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ folder: string }> }
) {
  // In Next.js 15, params is a Promise
  const { folder } = await context.params;
  
  // Check if the category exists
  if (!Object.keys(categories).includes(folder)) {
    return new Response('Category not found', { status: 404 });
  }
  
  // Here you would typically fetch and return content specific to the category
  const content = `# ${categories[folder]}

This is the content for the ${folder} category.`;

  return new Response(content);
} 