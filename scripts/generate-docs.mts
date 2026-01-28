import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';
import { rimraf } from 'rimraf';


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
}
