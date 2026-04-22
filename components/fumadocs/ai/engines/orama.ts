import type {
  Engine,
  MessageRecord,
  MessageReference,
} from '@/components/fumadocs/ai/context';
import { OramaCloud } from '@orama/core';

const projectId = process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_ORAMA_API_KEY;

export async function createOramaEngine(): Promise<Engine> {
  if (!projectId || !apiKey) throw new Error('Failed to find api keys');

  const client = new OramaCloud({ projectId, apiKey });

  const session = client.ai.createAISession({
    events: {
      onStateChange() {
        // State updates (sources, related queries) are read in getHistory()
      },
    },
  });

  return {
    async prompt(text, onUpdate, onEnd) {
      let full = '';
      const stream = session.answerStream({ query: text });

      for await (const chunk of stream) {
        full = chunk;
        onUpdate?.(chunk);
      }
      onEnd?.(full);
    },
    abortAnswer() {
      session.abort();
    },
    getHistory(): MessageRecord[] {
      const records: MessageRecord[] = [];
      let interactionIdx = 0;

      for (const msg of session.messages) {
        if (msg.role === 'system') continue;

        const record: MessageRecord = {
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        };

        if (msg.role === 'assistant') {
          const interaction = session.state[interactionIdx];
          if (interaction) {
            if (interaction.sources) {
              const sources = interaction.sources as any;
              const hits: any[] = Array.isArray(sources) ? sources : [];
              record.references = hits.map((result: any) => {
                const doc = result.document ?? result;
                return {
                  title: doc.title ?? '',
                  description: doc.description,
                  url: doc.url ?? '',
                  breadcrumbs: doc.breadcrumbs,
                } as MessageReference;
              });
            }
            if (interaction.related) {
              try {
                const related =
                  typeof interaction.related === 'string'
                    ? JSON.parse(interaction.related)
                    : interaction.related;
                record.suggestions = Array.isArray(related)
                  ? related
                  : [String(related)];
              } catch {
                record.suggestions = [interaction.related];
              }
            }
          }
          interactionIdx++;
        }

        records.push(record);
      }

      return records;
    },
    clearHistory() {
      session.clearSession();
    },
    async regenerateLast(onUpdate, onEnd) {
      const result = session.regenerateLast({
        stream: true,
      }) as AsyncGenerator<string>;
      let full = '';

      for await (const chunk of result) {
        full = chunk;
        onUpdate?.(chunk);
      }
      onEnd?.(full);
    },
  };
}
