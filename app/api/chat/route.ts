import { anthropic } from '@ai-sdk/anthropic';
import {
  InvalidToolArgumentsError,
  Message,
  NoSuchToolError,
  smoothStream,
  streamText,
  ToolExecutionError,
} from 'ai';
import { NextRequest } from 'next/server';
import { docsTools } from '@/lib/llms/ai-tools';

// Reads MDX off disk → must run on the Node runtime.
export const runtime = 'nodejs';

type RequestProps = { messages: Array<Message> };

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<RequestProps>;
    const messages = body?.messages;
    if (!Array.isArray(messages)) {
      return Response.json(
        { error: 'Invalid request: "messages" must be an array' },
        { status: 400 },
      );
    }

    // The docs MCP tools, called in-process (no transport hop) — the assistant
    // answers from this site's own documentation content.
    const tools = docsTools;

    const result = streamText({
      // Anthropic via the AI SDK provider (reads ANTHROPIC_API_KEY).
      // Haiku 4.5: fast/cheap, good for docs search; swap to claude-sonnet-4-6
      // for higher-quality answers.
      model: anthropic('claude-haiku-4-5'),
      tools,
      maxSteps: 10,
      experimental_transform: [
        smoothStream({
          chunking: 'word',
        }),
      ],
      onStepFinish: async ({ toolResults }) => {
        // Log only tool names — the full results are whole doc bundles and
        // would flood logs.
        const names = toolResults?.map((r) => r.toolName).join(', ');
        if (names) console.log(`Step tools: ${names}`);
      },
      system:
        'You are the MeetingBaas documentation assistant. Answer using the documentation tools ' +
        '(getApiDocs for the v2 API index, then getDocsPage or getDocsByCategory). Prefer the v2 API. ' +
        'Cite the Source: links you receive. Do not use emojis. Format code blocks with a language/title.',
      messages,
      // Surface the real cause in server logs — otherwise provider/setup
      // failures (e.g. a missing ANTHROPIC_API_KEY) are masked as a generic
      // stream error.
      onError: ({ error }) => {
        console.error('[chat] streamText error:', error);
      },
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        console.error('[chat] stream error:', error);
        if (NoSuchToolError.isInstance(error)) {
          return 'The model tried to call a unknown tool.';
        } else if (InvalidToolArgumentsError.isInstance(error)) {
          return 'The model called a tool with invalid arguments.';
        } else if (ToolExecutionError.isInstance(error)) {
          return 'An error occurred during tool execution.';
        }
        return error instanceof Error ? error.message : 'An unknown error occurred.';
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to generate text' });
  }
}
