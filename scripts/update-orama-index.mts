import { sync, type OramaDocument } from 'fumadocs-core/search/orama-cloud';
import * as fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { OramaCloud } from '@orama/core';

// Orama Cloud collections have a hard document cap (5,000 on the current plan).
// fumadocs `sync` expands each page into one record per heading and per
// content block, so the full docs set (~10,700 records) overflows the cap and
// `sync` fails mid-insert, leaving a stale/partial index. Capping the number
// of content blocks indexed per page keeps every page and every heading
// searchable while staying under the limit. Raise this (or remove the cap) if
// the Orama plan's document limit is increased.
const MAX_CONTENT_BLOCKS_PER_PAGE = 15;

function capPageContent(doc: OramaDocument): OramaDocument {
  const structured = doc.structured as { headings?: unknown[]; contents?: unknown[] } | undefined;
  if (!structured?.contents || structured.contents.length <= MAX_CONTENT_BLOCKS_PER_PAGE) {
    return doc;
  }
  return {
    ...doc,
    structured: {
      ...structured,
      contents: structured.contents.slice(0, MAX_CONTENT_BLOCKS_PER_PAGE),
    },
  } as OramaDocument;
}

export async function updateSearchIndexes(): Promise<void> {
  const apiKey = process.env.ORAMA_PRIVATE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID;
  const index = process.env.ORAMA_SEARCH_INDEX_ID;

  if (!apiKey || !projectId || !index) {
    console.log('no api key for Orama found, skipping');
    return;
  }

  const content = await fs.readFile('.next/server/app/static.json.body');
  const allRecords = JSON.parse(content.toString()) as OramaDocument[];

  const records = allRecords.filter((doc) => doc.tag).map(capPageContent);

  if (records.length === 0) {
    throw new Error('no documents found, aborting to prevent empty index');
  }

  console.log(`syncing ${records.length}/${allRecords.length} documents`);

  const orama = new OramaCloud({ projectId, apiKey });

  await sync(orama, {
    index,
    documents: records,
  });

  console.log(`search updated: ${records.length} records`);
}

// Allow running this file directly (e.g. `tsx scripts/update-orama-index.mts`)
// to re-sync the search index on demand after a build, without rebuilding.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  updateSearchIndexes().catch((error) => {
    console.error('Failed to update search index:', error);
    process.exit(1);
  });
}
