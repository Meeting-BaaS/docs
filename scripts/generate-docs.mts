import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';
import { rimraf } from 'rimraf';
import fs from 'fs';
import path from 'path';

/**
 * Move files from 'unknown' subfolder to parent folder.
 * OpenAPI endpoints without tags get grouped into 'unknown/' by fumadocs-openapi.
 * We want them at the root reference level instead.
 */
async function flattenUnknownFolder(referenceDir: string) {
  const unknownDir = path.join(referenceDir, 'unknown');

  if (!fs.existsSync(unknownDir)) {
    return;
  }

  const files = fs.readdirSync(unknownDir);

  for (const file of files) {
    const srcPath = path.join(unknownDir, file);
    const destPath = path.join(referenceDir, file);

    // Skip if destination already exists
    if (fs.existsSync(destPath)) {
      console.log(`  Skipping ${file} (already exists)`);
      continue;
    }

    fs.renameSync(srcPath, destPath);
    console.log(`  Moved ${file} from unknown/ to reference root`);
  }

  // Remove empty unknown directory
  const remaining = fs.readdirSync(unknownDir);
  if (remaining.length === 0) {
    fs.rmdirSync(unknownDir);
    console.log('  Removed empty unknown/ directory');
  }
}

export async function generateDocs() {
  // Clean up Meeting BaaS API reference directory
  await rimraf('./content/docs/api/reference', {
    filter(v) {
      return !v.endsWith('index.mdx') && !v.endsWith('meta.json');
    },
  });

  // Clean up Meeting BaaS API v2 reference directory
  await rimraf('./content/docs/api-v2/reference', {
    filter(v) {
      return !v.endsWith('index.mdx') && !v.endsWith('meta.json');
    },
  });

  // Clean up Speaking Bots API reference directory
  await rimraf('./content/docs/speaking-bots/reference', {
    filter(v) {
      return !v.endsWith('index.mdx') && !v.endsWith('meta.json');
    },
  });

  // Create OpenAPI servers for each spec
  const apiV1 = createOpenAPI({ input: ['./openapi.json'] });
  const apiV2 = createOpenAPI({ input: ['./openapi-v2.json'] });
  const speakingBots = createOpenAPI({ input: ['./speaking-bots-openapi.json'] });

  await Promise.all([
    // Generate Meeting BaaS API v1 docs
    generateFiles({
      input: apiV1,
      output: './content/docs/api/reference',
      per: 'operation',
      includeDescription: true,
      groupBy: 'tag',
    }),

    // Generate Meeting BaaS API v2 docs
    generateFiles({
      input: apiV2,
      output: './content/docs/api-v2/reference',
      per: 'operation',
      includeDescription: true,
      groupBy: 'tag',
    }),

    // Generate Speaking Bots API docs
    generateFiles({
      input: speakingBots,
      output: './content/docs/speaking-bots/reference',
      per: 'operation',
      includeDescription: true,
      groupBy: 'tag',
    }),
  ]);

  // Move untagged endpoints from 'unknown/' to reference root
  console.log('Flattening unknown folders...');
  await flattenUnknownFolder('./content/docs/api/reference');
  await flattenUnknownFolder('./content/docs/api-v2/reference');
  await flattenUnknownFolder('./content/docs/speaking-bots/reference');
}
