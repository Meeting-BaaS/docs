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

// Function to generate the static route
export async function generateStaticParams() {
  return [{}]; // Generate this single route
}

// Standard Next.js 15.2.4 route handler
export async function GET(request: NextRequest) {
  const availableFolders = Object.entries(categories).map(
    ([folder, description]) => `- [/llms/${folder}](${folder}) - ${description}`
  );

  const content = `# Available LLM Content Categories

${availableFolders.join('\n')}

[All Content](/llms/all)`;

  return new Response(content);
} 