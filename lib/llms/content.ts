import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import glob from 'fast-glob';
import { categoryConfig, type CategoryConfigMap } from '@/content/llm-config';

// The same category map the /llms/* routes use. Keys are slash-delimited
// (e.g. "api-v2/bots") and match the MCP tool categories verbatim.
export const llmCategoryConfig = categoryConfig as CategoryConfigMap;

export const llmCategoryKeys = Object.keys(llmCategoryConfig);

/**
 * Build the markdown bundle for one llms category, in-process, by reading the
 * MDX sources straight off disk — no HTTP round-trip to the public docs site.
 *
 * Output format is identical to the `/llms/<category>` route so existing
 * consumers (the docs MCP parser) keep working: a `## <title>` heading and a
 * `### Source: <path>` marker per file. The MCP route imports this directly.
 *
 * `content/**` must be present in the runtime working directory (it is in the
 * repo and is copied into the Docker image — see Dockerfile).
 */
// Fumadocs OpenAPI pages stash the rendered parameter/field/response docs in
// frontmatter under `_openapi.structuredData.contents` (an array of { content }).
// Pull that prose out as plain text so it's part of the bundle.
function extractStructuredText(data: unknown): string {
  const sd =
    (data as any)?._openapi?.structuredData?.contents ??
    (data as any)?.structuredData?.contents;
  if (!Array.isArray(sd)) return '';
  return sd
    .map((c) => (typeof c === 'string' ? c : c?.content))
    .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    .join('\n\n');
}

export async function getCategoryContent(categoryKey: string): Promise<string> {
  const config = llmCategoryConfig[categoryKey];
  if (!config) {
    return `# Error: Unknown Category\n\nNo configuration found for category: ${categoryKey}`;
  }

  // excludePatterns are exclusions — pass them to fast-glob's `ignore`, not the
  // include list.
  const files = await glob(config.patterns, { ignore: config.excludePatterns ?? [] });

  if (files.length === 0) {
    return `# ${config.title}\n\n${config.description}\n\nNo content found for this category.`;
  }

  let out = `# ${config.title}\n\n${config.description}\n\n`;
  for (const filePath of files) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { content, data } = matter(fileContent);
      const title = data.title || path.basename(filePath, '.mdx');
      const description = data.description || '';
      out += `## ${title}\n\n`;
      if (description) out += `${description}\n\n`;
      out += `### Source: ${filePath}\n\n`;
      // Body, minus the Fumadocs <APIPage/> component — it renders the
      // parameter/field docs from the OpenAPI spec at build time, so it
      // contributes no text here.
      out += content.replace(/<APIPage[\s\S]*?\/>/g, '').trim();
      // OpenAPI reference pages keep their actual parameter/field docs in the
      // frontmatter's structuredData (NOT the body). Include them so
      // field-level questions (e.g. timeout_config.grace_period) are answerable
      // instead of the model concluding the field doesn't exist.
      const structured = extractStructuredText(data);
      if (structured) out += `\n\n${structured}`;
      out += '\n\n---\n\n';
    } catch (error) {
      console.error(`[llms] error processing ${filePath}:`, error);
      out += `## Error processing ${filePath}\n\n`;
    }
  }
  return out;
}
