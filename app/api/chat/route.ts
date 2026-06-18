import { openai } from '@ai-sdk/openai';
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
  const { messages }: RequestProps = (await request.json()) as RequestProps;

  try {
    // The docs MCP tools, called in-process (no transport hop) — the assistant
    // answers from this site's own documentation content.
    const tools = docsTools;

    const result = streamText({
      // todo: add models.ts file
      model: openai('gpt-4o-mini'),
      tools,
      maxSteps: 10,
      experimental_transform: [
        smoothStream({
          chunking: 'word',
        }),
      ],
      onStepFinish: async ({ toolResults }) => {
        console.log(`Step Results: ${JSON.stringify(toolResults, null, 2)}`);
      },
      system:
        'You are the MeetingBaas documentation assistant. Answer using the documentation tools ' +
        '(getApiDocs for the v2 API index, then getDocsPage or getDocsByCategory). Prefer the v2 API. ' +
        'Cite the Source: links you receive. Do not use emojis. Format code blocks with a language/title.',
      messages,
    });

    return result.toDataStreamResponse({
      getErrorMessage: (error) => {
        if (NoSuchToolError.isInstance(error)) {
          return 'The model tried to call a unknown tool.';
        } else if (InvalidToolArgumentsError.isInstance(error)) {
          return 'The model called a tool with invalid arguments.';
        } else if (ToolExecutionError.isInstance(error)) {
          console.log(error);
          return 'An error occurred during tool execution.';
        } else {
          return 'An unknown error occurred.';
        }
      },
    });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to generate text' });
  }
}
