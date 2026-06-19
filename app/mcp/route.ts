import { createMcpHandler } from 'mcp-handler';
import { registerDocsTools } from '@/lib/llms/mcp-server';

// Must run on the Node runtime (reads MDX off disk via fs/fast-glob) and never
// be statically optimized — it's a live JSON-RPC endpoint.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// The MeetingBaas documentation MCP, served in-process by the docs app itself.
// Streamable HTTP, stateless (no Redis) — sessions aren't needed for read-only
// docs tools. Mounted at POST /mcp (basePath '' → transport path '/mcp').
const handler = createMcpHandler(
  (server) => {
    registerDocsTools(server);
  },
  {
    serverInfo: { name: 'meetingbaas-docs-mcp', version: '1.0.0' },
    instructions:
      'This server returns MeetingBaas documentation. ALWAYS prefer the v2 API (api-v2); ' +
      'only use getApiV1Docs if the user explicitly asks about legacy v1. ' +
      'Work narrow-to-wide to stay fast: 1) getApiDocs returns a small INDEX of v2 ' +
      'sections + endpoints with links; 2) getDocsPage({ slug }) fetches ONE endpoint ' +
      '(cheapest); 3) a section tool (getApiV2BotsDocs, …) returns a whole section. ' +
      'AVOID getApiV2FullDocs and getAllDocs unless truly needed. Cite the Source: links.',
  },
  {
    basePath: '',
    verboseLogs: true,
  },
);

export { handler as GET, handler as POST, handler as DELETE };
