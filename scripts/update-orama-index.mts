import { sync, type OramaDocument } from 'fumadocs-core/search/orama-cloud';
import * as fs from 'node:fs/promises';
import { OramaCloud } from '@orama/core';

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

  const allowedTags = new Set(['api', 'api-v2']);
  const records = allRecords.filter((doc) => doc.tag && allowedTags.has(doc.tag));

  console.log(`filtering: ${records.length}/${allRecords.length} documents (tags: ${[...allowedTags].join(', ')})`);

  const orama = new OramaCloud({ projectId, apiKey });

  await sync(orama, {
    index,
    documents: records,
  });

  console.log(`search updated: ${records.length} records`);
}
