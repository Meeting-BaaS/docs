'use client';

import { OramaCloud } from '@orama/core';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import SearchDialog from 'fumadocs-ui/components/dialog/search-orama';

const projectId = process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_ORAMA_API_KEY;

if (!projectId || !apiKey) {
  throw new Error('Orama project ID and API key must be defined in environment variables');
}

const baseClient = new OramaCloud({ projectId, apiKey });

function extractSnippet(content: string, term: string): string {
  const idx = content.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return content;
  // Small lead-in so the matched term appears near the start of the visible text.
  const start = Math.max(0, idx - 20);
  const end = Math.min(content.length, idx + term.length + 160);
  return (start > 0 ? '…' : '') + content.slice(start, end) + (end < content.length ? '…' : '');
}

const client = new Proxy(baseClient, {
  get(target, prop) {
    if (prop !== 'search') return (target as any)[prop];
    return async (params: any) => {
      const { groupBy, term, ...rest } = params;
      const result = await (target as any).search({ ...rest, term, mode: 'auto', limit: 100 });

      const query: string = term ?? '';
      const hits = (result.hits ?? []).map((hit: any) => {
        if (!query || typeof hit.document?.content !== 'string') return hit;
        return {
          ...hit,
          document: {
            ...hit.document,
            content: extractSnippet(hit.document.content, query),
          },
        };
      });

      const groupMap = new Map<string, any[]>();
      for (const hit of hits) {
        const pageId = hit.document?.page_id ?? hit.id;
        if (!groupMap.has(pageId)) groupMap.set(pageId, []);
        groupMap.get(pageId)!.push(hit);
      }

      return {
        ...result,
        groups: Array.from(groupMap.entries()).map(([pageId, pageHits]) => ({
          values: [pageId],
          result: pageHits,
        })),
      };
    };
  },
});

export default function CustomSearchDialog(props: SharedProps): React.ReactElement {
  return (
    <SearchDialog
      {...props}
      client={client}
      showOrama
    />
  );
}
