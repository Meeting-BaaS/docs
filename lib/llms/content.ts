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
export async function getCategoryContent(categoryKey: string): Promise<string> {
  const config = llmCategoryConfig[categoryKey];
  if (!config) {
    return `# Error: Unknown Category\n\nNo configuration found for category: ${categoryKey}`;
  }

  const patterns = [...config.patterns, ...(config.excludePatterns ?? [])];
  const files = await glob(patterns);

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
      out += content;
      out += '\n\n---\n\n';
    } catch (error) {
      console.error(`[llms] error processing ${filePath}:`, error);
      out += `## Error processing ${filePath}\n\n`;
    }
  }
  return out;
}
