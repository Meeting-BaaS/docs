import * as fs from 'node:fs/promises';
import { OramaCloud } from '@orama/core';
import fg from 'fast-glob';
import matter from 'gray-matter';
import path from 'node:path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import { fileGenerator, remarkDocGen, remarkInstall } from 'fumadocs-docgen';
import remarkStringify from 'remark-stringify';
import remarkMdx from 'remark-mdx';
import { remarkAutoTypeTable } from 'fumadocs-typescript';
import { remarkInclude } from 'fumadocs-mdx/config';

const processor = remark()
  .use(remarkMdx)
  .use(remarkInclude)
  .use(remarkGfm)
  .use(remarkAutoTypeTable)
  .use(remarkDocGen, { generators: [fileGenerator()] })
  .use(remarkInstall, { persist: { id: 'package-manager' } })
  .use(remarkStringify);

export async function updateOramaAi(): Promise<void> {
  const apiKey = process.env.ORAMA_PRIVATE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID;
  const index = process.env.ORAMA_AI_INDEX_ID;

  if (!apiKey || !projectId || !index) {
    console.log('no api key for Orama found, skipping');
    return;
  }

  const orama = new OramaCloud({ projectId, apiKey });
  const indexManager = orama.index.set(index);

  const files = await fg([
    './content/docs/**/*.mdx',
    '!./content/docs/api/reference/**/*',
  ]);
  const records: Record<string, unknown>[] = [];

  console.log('processing documents for AI');
  const scan = files.map(async (file) => {
    const fileContent = await fs.readFile(file);
    const { content, data } = matter(fileContent.toString());

    const dir = path.dirname(file).split(path.sep).at(3);
    const category = {
      api: 'MeetingBaas API, the main purpose of the documentation',
      'transcript-seeker':
        'Transcript Seeker, the open-source transcription playground',
      'speaking-bots': 'Speaking Bots, the Pipecat-powered bots',
    }[dir ?? ''];

    const processed = await processor.process({
      path: file,
      value: content,
    });

    records.push({
      id: file,
      title: data.title as string,
      description: data.description as string,
      content: processed,
      category,
    });
  });

  await Promise.all(scan);

  console.log(`added ${records.length} records`);
  await indexManager.transaction.open();
  await indexManager.transaction.insertDocuments(records);
  await indexManager.transaction.commit();
}
