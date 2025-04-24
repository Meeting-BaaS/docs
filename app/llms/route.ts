export const revalidate = false;

// Categories mapping
const categories = {
  api: 'MeetingBaas API, the main purpose of the documentation',
  'transcript-seeker': 'Transcript Seeker, the open-source transcription playground',
  'speaking-bots': 'Speaking Bots, the Pipecat-powered bots',
  'calendars': 'Calendars API, for managing calendar integrations and events',
  'meetings': 'Meetings API, for scheduling and managing virtual meetings',
  'users': 'Users API, for user management and authentication',
  'webhooks': 'Webhooks API, for event notifications and integrations',
  'sdk': 'MeetingBaas SDK, client libraries for various programming languages'
};

export async function GET() {
  const availableFolders = Object.entries(categories).map(
    ([folder, description]) => `- [/llms/${folder}](${folder}) - ${description}`
  );

  const content = `# Available LLM Content Categories

${availableFolders.join('\n')}

[All Content](/llms/all)
`;

  return new Response(content);
} 