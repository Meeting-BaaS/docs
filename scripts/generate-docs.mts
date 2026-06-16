import { generateFiles } from 'fumadocs-openapi';
import { createOpenAPI } from 'fumadocs-openapi/server';
import { rimraf } from 'rimraf';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

async function flattenUnknownFolder(referenceDir: string) {
  const unknownDir = path.join(referenceDir, 'unknown');
  if (!fs.existsSync(unknownDir)) return;

  for (const file of fs.readdirSync(unknownDir)) {
    const srcPath = path.join(unknownDir, file);
    const destPath = path.join(referenceDir, file);
    if (fs.existsSync(destPath)) continue;
    fs.renameSync(srcPath, destPath);
  }

  const remaining = fs.readdirSync(unknownDir);
  if (remaining.length === 0) fs.rmdirSync(unknownDir);
}

/**
 * Remove reference pages generated for operations that have no `tags`.
 *
 * fumadocs groups output by tag; untagged operations land under an `unknown`
 * folder and are then flattened to a folder named after the first URL path
 * segment (e.g. `/v2/meet-sso/sign-in` → `<referenceDir>/v2/…`). These are
 * internal, non-customer-facing endpoints — such as the `/v2/meet-sso/*` SAML
 * IdP callback URLs that Google calls during sign-in — and must not appear in
 * the public API reference. Tagged operations are never placed in these
 * folders, so removing them is safe and keeps every rebuild clean.
 */
async function removeUntaggedReferencePages(specPath: string, referenceDir: string) {
  if (!fs.existsSync(specPath) || !fs.existsSync(referenceDir)) return;

  const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  const httpMethods = ['get', 'post', 'put', 'patch', 'delete'];
  const orphanDirs = new Set<string>();

  for (const [route, pathItem] of Object.entries<any>(spec.paths ?? {})) {
    for (const [method, op] of Object.entries<any>(pathItem ?? {})) {
      if (!httpMethods.includes(method)) continue;
      const tags: unknown[] = op?.tags ?? [];
      if (tags.length === 0) {
        const firstSegment = route.split('/').filter(Boolean)[0];
        if (firstSegment) orphanDirs.add(firstSegment);
      }
    }
  }

  for (const dir of orphanDirs) {
    await rimraf(path.join(referenceDir, dir));
  }
  await rimraf(path.join(referenceDir, 'unknown'));
}

function resolveRef(schema: any, components: any): any {
  if (schema?.$ref) {
    const refName = schema.$ref.split('/').pop();
    return components?.schemas?.[refName] ?? schema;
  }
  return schema;
}

function extractProperties(schema: any, components: any, prefix = '', depth = 0): string[] {
  if (depth > 3 || !schema) return [];
  const resolved = resolveRef(schema, components);
  if (!resolved || typeof resolved !== 'object') return [];

  for (const combiner of ['allOf', 'anyOf', 'oneOf'] as const) {
    if (resolved[combiner]) {
      return (resolved[combiner] as any[]).flatMap((s: any) =>
        extractProperties(s, components, prefix, depth),
      );
    }
  }

  const results: string[] = [];
  for (const [name, prop] of Object.entries<any>(resolved.properties ?? {})) {
    const fullName = prefix ? `${prefix}.${name}` : name;
    const resolvedProp = resolveRef(prop, components);
    const desc: string = resolvedProp?.description ?? prop?.description ?? '';
    results.push(desc ? `${fullName}: ${desc}` : fullName);
    if (resolvedProp?.type === 'object' || resolvedProp?.properties) {
      results.push(...extractProperties(resolvedProp, components, fullName, depth + 1));
    }
  }
  return results;
}

function enrichReferenceFiles(specPath: string, referenceDir: string): void {
  if (!fs.existsSync(specPath) || !fs.existsSync(referenceDir)) return;

  const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));
  const components = spec.components ?? {};

  const opSchemas = new Map<string, { request: string[]; responses: string[] }>();
  for (const pathItem of Object.values<any>(spec.paths ?? {})) {
    for (const [method, op] of Object.entries<any>(pathItem)) {
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
      const operationId: string = op.operationId;
      if (!operationId) continue;

      const reqSchema = op.requestBody?.content?.['application/json']?.schema;
      const request = reqSchema
        ? extractProperties(resolveRef(reqSchema, components), components)
        : [];

      const responses: string[] = [];
      for (const response of Object.values<any>(op.responses ?? {})) {
        const resSchema = response?.content?.['application/json']?.schema;
        if (resSchema) responses.push(...extractProperties(resolveRef(resSchema, components), components));
      }

      opSchemas.set(operationId, { request, responses });
    }
  }

  function processDir(dir: string) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) { processDir(path.join(dir, entry.name)); continue; }
      if (!entry.name.endsWith('.mdx')) continue;

      const operationId = path.basename(entry.name, '.mdx');
      const schemas = opSchemas.get(operationId);
      if (!schemas) continue;

      const filePath = path.join(dir, entry.name);
      const parsed = matter(fs.readFileSync(filePath, 'utf-8'));
      const openapi = parsed.data._openapi;
      if (!openapi?.structuredData) continue;

      // One content item per property so each is independently searchable
      const additions: Array<{ content: string }> = [
        ...schemas.request.map((p) => ({ content: p })),
        ...schemas.responses.map((p) => ({ content: p })),
      ];
      if (additions.length === 0) continue;

      parsed.data._openapi.structuredData.contents = [
        ...(openapi.structuredData.contents ?? []),
        ...additions,
      ];
      fs.writeFileSync(filePath, matter.stringify(parsed.content, parsed.data));
    }
  }

  processDir(referenceDir);
}

export async function generateDocs() {
  await rimraf('./content/docs/api/reference', {
    filter(v) { return !v.endsWith('index.mdx') && !v.endsWith('meta.json'); },
  });
  await rimraf('./content/docs/api-v2/reference', {
    filter(v) { return !v.endsWith('index.mdx') && !v.endsWith('meta.json'); },
  });
  await rimraf('./content/docs/speaking-bots/reference', {
    filter(v) { return !v.endsWith('index.mdx') && !v.endsWith('meta.json'); },
  });

  const apiV1 = createOpenAPI({ input: ['./openapi.json'] });
  const apiV2 = createOpenAPI({ input: ['./openapi-v2.json'] });
  const speakingBots = createOpenAPI({ input: ['./speaking-bots-openapi.json'] });

  await Promise.all([
    generateFiles({ input: apiV1, output: './content/docs/api/reference', per: 'operation', includeDescription: true, groupBy: 'tag' }),
    generateFiles({ input: apiV2, output: './content/docs/api-v2/reference', per: 'operation', includeDescription: true, groupBy: 'tag' }),
    generateFiles({ input: speakingBots, output: './content/docs/speaking-bots/reference', per: 'operation', includeDescription: true, groupBy: 'tag' }),
  ]);

  console.log('Flattening unknown folders...');
  await flattenUnknownFolder('./content/docs/api/reference');
  await flattenUnknownFolder('./content/docs/api-v2/reference');
  await flattenUnknownFolder('./content/docs/speaking-bots/reference');

  console.log('Removing reference pages for untagged internal endpoints...');
  // Scoped to api-v2: every v2 path is under `/v2/`, so untagged operations
  // always land in a `v2/` folder that never collides with a tag folder.
  await removeUntaggedReferencePages('./openapi-v2.json', './content/docs/api-v2/reference');

  console.log('Enriching reference files with per-property search content...');
  enrichReferenceFiles('./openapi.json', './content/docs/api/reference');
  enrichReferenceFiles('./openapi-v2.json', './content/docs/api-v2/reference');
  enrichReferenceFiles('./speaking-bots-openapi.json', './content/docs/speaking-bots/reference');
}
