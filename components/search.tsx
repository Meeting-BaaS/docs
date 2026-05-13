'use client';

import { OramaCloud } from '@orama/core';
import { createContentHighlighter } from 'fumadocs-core/search';
import type { SortedResult } from 'fumadocs-core/search';
import type { SharedProps } from 'fumadocs-ui/components/dialog/search';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
} from 'fumadocs-ui/components/dialog/search';
import { useEffect, useRef, useState } from 'react';

const projectId = process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_ORAMA_API_KEY;

if (!projectId || !apiKey) {
  throw new Error('Orama project ID and API key must be defined in environment variables');
}

const oramaClient = new OramaCloud({ projectId, apiKey });

function extractSnippet(content: string, anchor: string): string {
  const idx = content.toLowerCase().indexOf(anchor.toLowerCase());
  if (idx === -1) return content;
  const start = Math.max(0, idx - 20);
  const end = Math.min(content.length, idx + anchor.length + 160);
  return (start > 0 ? '…' : '') + content.slice(start, end) + (end < content.length ? '…' : '');
}

async function doSearch(query: string): Promise<SortedResult[]> {
  // Strip tokens ≤2 chars so "I", "a", "to" don't create noisy highlights.
  const cleanTokens = query.split(/\s+/).filter((w) => w.length > 2);
  const searchTerm = cleanTokens.join(' ') || query;

  // Highlighter built from cleaned tokens only — no single-letter highlights.
  const highlighter = createContentHighlighter(searchTerm);

  const result: any = await (oramaClient as any).search({
    term: searchTerm,
    mode: 'fulltext',
    limit: 100,
  });

  const hits: any[] = result?.hits ?? [];

  // Group hits by page_id preserving Orama's relevance order.
  const groupMap = new Map<string, any[]>();
  for (const hit of hits) {
    const pageId = hit.document?.page_id ?? hit.id;
    if (!groupMap.has(pageId)) groupMap.set(pageId, []);
    groupMap.get(pageId)!.push(hit);
  }

  // Anchor snippet on the longest meaningful token.
  const snippetAnchor =
    [...cleanTokens].sort((a, b) => b.length - a.length)[0] ?? searchTerm;

  const list: SortedResult[] = [];
  for (const [pageId, pageHits] of groupMap) {
    let addedHead = false;
    for (const hit of pageHits) {
      const doc = hit.document;
      if (!addedHead) {
        list.push({
          id: pageId,
          type: 'page',
          content: doc.title ?? '',
          breadcrumbs: doc.breadcrumbs,
          contentWithHighlights: highlighter.highlight(doc.title ?? ''),
          url: doc.url,
        });
        addedHead = true;
      }
      const snippet =
        typeof doc.content === 'string'
          ? extractSnippet(doc.content, snippetAnchor)
          : (doc.content ?? '');
      list.push({
        id: doc.id,
        type: doc.content === doc.section ? 'heading' : 'text',
        content: snippet,
        contentWithHighlights: highlighter.highlight(snippet),
        url: doc.section_id ? `${doc.url}#${doc.section_id}` : doc.url,
      });
    }
  }

  return list;
}

export default function CustomSearchDialog(props: SharedProps): React.ReactElement {
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SortedResult[] | null>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    cancelRef.current?.();

    if (!search.trim()) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    cancelRef.current = () => {
      cancelled = true;
    };

    const timer = setTimeout(() => {
      setIsLoading(true);
      doSearch(search)
        .then((res) => {
          if (!cancelled) setResults(res);
        })
        .catch(() => {
          if (!cancelled) setResults([]);
        })
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
    }, 100);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  return (
    <SearchDialog {...props} search={search} onSearchChange={setSearch} isLoading={isLoading}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={results} />
        <SearchDialogFooter>
          <span className="ms-auto text-xs text-fd-muted-foreground">Search powered by Orama</span>
        </SearchDialogFooter>
      </SearchDialogContent>
    </SearchDialog>
  );
}
