import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import glob from 'fast-glob';
import { categoryConfig } from '../../../content/llm-config';
import type { CategoryConfig, CategoryConfigMap } from './types';

// Set to 'force-static' to ensure this is included in the static build
export const dynamic = 'force-static';
export const revalidate = false;

// Use proper typing with the index signature
const typedCategoryConfig = categoryConfig as CategoryConfigMap;

// Generate all possible static paths at build time
export async function generateStaticParams() {
  return Object.keys(typedCategoryConfig).map(categoryPath => {
    const pathSegments = categoryPath.split('/');
    return { path: pathSegments };
  });
}

// Function to gather MDX content for a category path
async function getContentForCategory(categoryPath: string): Promise<string> {
  try {
    // Get the category configuration
    const config = typedCategoryConfig[categoryPath];
    if (!config) {
      return `# Error: Unknown Category\n\nNo configuration found for category: ${categoryPath}`;
    }
    
    // Get file patterns from config
    const allPatterns = [...config.patterns];
    if (config.excludePatterns) {
      allPatterns.push(...config.excludePatterns);
    }
    
    // Find matching files
    const files = await glob(allPatterns);
    
    // Debug logging
    console.log(`Category ${categoryPath}: Found ${files.length} files with patterns:`, allPatterns);
    
    if (files.length === 0) {
      return `# ${config.title}\n\n${config.description}\n\nNo content found for this category.\n\nPatterns searched: ${allPatterns.join(', ')}`;
    }
    
    // Create header for the content
    let fullContent = `# ${config.title}\n\n${config.description}\n\n`;
    
    // Process each file
    for (const filePath of files) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { content, data } = matter(fileContent);
        
        // Extract useful metadata
        const title = data.title || path.basename(filePath, '.mdx');
        const description = data.description || '';
        
        // Add this file's content to the full content
        fullContent += `## ${title}\n\n`;
        if (description) fullContent += `${description}\n\n`;
        fullContent += `### Source: ${filePath}\n\n`;
        fullContent += content;
        fullContent += '\n\n---\n\n';
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        fullContent += `## Error processing ${filePath}\n\n`;
      }
    }
    
    return fullContent;
  } catch (error) {
    console.error(`Error getting content for category ${categoryPath}:`, error);
    return `# ${typedCategoryConfig[categoryPath]?.title || categoryPath}\n\nError processing content for this category.`;
  }
}

// Generate API section links for the index page
function generateApiSectionLinks(): string {
  let content = "## 📘 API Documentation\n\n";
  
  // Add the main API category
  content += "- [/llms/api](/llms/api) - " + (typedCategoryConfig['api']?.title || "MeetingBaas API") + "\n";
  
  // Add API subcategories
  const apiSections = Object.entries(typedCategoryConfig)
    .filter(([key]) => key.startsWith('api/'))
    .sort((a, b) => a[0].localeCompare(b[0]));
  
  for (const [key, config] of apiSections) {
    content += `  - [/llms/${key}](/llms/${key}) - ${config.title}\n`;
  }
  
  return content;
}

// Generate SDK section links for the index page
function generateSdkSectionLinks(): string {
  let content = "## 🛠️ SDK Documentation\n\n";
  
  // Add SDK main categories
  content += "- [/llms/sdk](/llms/sdk) - " + (typedCategoryConfig['sdk']?.title || "MeetingBaas SDK") + "\n";
  
  if (typedCategoryConfig['typescript-sdk']) {
    content += "- [/llms/typescript-sdk](/llms/typescript-sdk) - " + typedCategoryConfig['typescript-sdk'].title + "\n";
  }
  
  // Add TypeScript SDK subcategories
  const sdkSections = Object.entries(typedCategoryConfig)
    .filter(([key]) => key.startsWith('typescript-sdk-'))
    .sort((a, b) => a[0].localeCompare(b[0]));
  
  for (const [key, config] of sdkSections) {
    content += `  - [/llms/${key}](/llms/${key}) - ${config.title}\n`;
  }
  
  return content;
}

// Generate service-specific documentation section
function generateServiceSectionLinks(): string {
  let content = "## 🧩 Service-Specific Documentation\n\n";
  
  // Add Speaking Bots
  if (typedCategoryConfig['speaking-bots']) {
    content += "- [/llms/speaking-bots](/llms/speaking-bots) - " + typedCategoryConfig['speaking-bots'].title + "\n";
    
    // Add Speaking Bots subcategories
    const speakingBotsSections = Object.entries(typedCategoryConfig)
      .filter(([key]) => key.startsWith('speaking-bots/'))
      .sort((a, b) => a[0].localeCompare(b[0]));
    
    for (const [key, config] of speakingBotsSections) {
      content += `  - [/llms/${key}](/llms/${key}) - ${config.title}\n`;
    }
  }
  
  // Add Transcript Seeker
  if (typedCategoryConfig['transcript-seeker']) {
    content += "- [/llms/transcript-seeker](/llms/transcript-seeker) - " + typedCategoryConfig['transcript-seeker'].title + "\n";
  }
  
  return content;
}

// Generate top-level API resources section
function generateTopLevelApiLinks(): string {
  let content = "## 🔗 Top-level API Resources\n\n";
  content += "_These are shortcuts to specific API sections, also available under `/llms/api/...`_\n\n";
  
  const topLevelApiSections = ['calendars', 'meetings', 'users', 'webhooks'];
  
  for (const key of topLevelApiSections) {
    if (typedCategoryConfig[key]) {
      content += `- [/llms/${key}](/llms/${key}) - ${typedCategoryConfig[key].title}\n`;
    }
  }
  
  return content;
}

// Generate complete documentation section
function generateCompleteDocLink(): string {
  let content = "## 📚 Complete Documentation\n\n";
  
  if (typedCategoryConfig['all']) {
    content += `- [/llms/all](/llms/all) - ${typedCategoryConfig['all'].title}\n\n`;
  }
  
  return content;
}

// Update to make this a regular constant, not an export
const categories = {
  'all': { title: 'All Documentation Combined', description: 'Complete documentation including API and SDKs' },
  'api': { title: 'API Documentation', description: 'REST API documentation' },
  'api-all': { title: 'All API Documentation', description: 'Complete API documentation' },
  'api-calendars': { title: 'Calendar API', description: 'Calendar API documentation' },
  'api-webhooks': { title: 'Webhooks API', description: 'Webhooks API documentation' },
  'calendars': { title: 'Calendars', description: 'Calendar functionality documentation' },
  'webhooks': { title: 'Webhooks', description: 'Webhook functionality documentation' },
  'mcp-servers': { title: 'MCP Servers', description: 'MCP Servers documentation' },
  'speaking-bots': { title: 'Speaking Bots', description: 'Documentation for Speaking Bots' },
  'speaking-bots-all': { title: 'All Speaking Bots Documentation', description: 'Complete Speaking Bots documentation' },
  'speaking-bots-bots': { title: 'Speaking Bots - Bots', description: 'Bot-specific documentation' },
  'speaking-bots-system': { title: 'Speaking Bots - System', description: 'System-level documentation for Speaking Bots' },
  'transcript-seeker': { title: 'Transcript Seeker', description: 'Documentation for Transcript Seeker' },
  'typescript-sdk': { title: 'TypeScript SDK', description: 'TypeScript SDK documentation' },
  'typescript-sdk-all': { title: 'Complete TypeScript SDK', description: 'Complete TypeScript SDK documentation' },
  'typescript-sdk-bots': { title: 'TypeScript SDK - Bots', description: 'Bot-related SDK documentation' },
  'typescript-sdk-calendars': { title: 'TypeScript SDK - Calendars', description: 'Calendar-related SDK documentation' },
  'typescript-sdk-common': { title: 'TypeScript SDK - Common', description: 'Common SDK utilities and types' },
  'typescript-sdk-webhooks': { title: 'TypeScript SDK - Webhooks', description: 'Webhook-related SDK documentation' },
} as const;

/**
 * Generate a hierarchical representation of all available categories
 * This will be used for the main /llms page
 */
function generateCategoryIndex(hostname: string): string {
  const baseUrl = `https://${hostname}`;
  const categoryGroups: Record<string, string[]> = {
    'General': ['all'],
    'API': ['api', 'api-all', 'api-calendars', 'api-webhooks', 'calendars', 'webhooks'],
    'SDKs': ['typescript-sdk', 'typescript-sdk-all', 'typescript-sdk-bots', 'typescript-sdk-calendars', 'typescript-sdk-common', 'typescript-sdk-webhooks'],
    'Features': ['mcp-servers', 'speaking-bots', 'speaking-bots-all', 'speaking-bots-bots', 'speaking-bots-system', 'transcript-seeker']
  };

  let output = '# MeetingBaaS Documentation for LLMs\n\n';
  output += 'This index provides access to all documentation in formats optimized for LLMs.\n';
  output += 'All content is available in both markdown format and plain text.\n\n';

  // Add general instructions
  output += '## How to use this documentation\n\n';
  output += '- Access any path with `.txt` extension to get plain text version\n';
  output += '- All documentation is statically generated for fast access\n';
  output += '- Use specific categories for targeted information\n';
  output += '- Use "all" category for comprehensive documentation\n\n';

  // Generate all category groups
  for (const [groupName, groupCategories] of Object.entries(categoryGroups)) {
    output += `## ${groupName} Documentation\n\n`;
    
    for (const category of groupCategories) {
      // Add type safety by checking if the category exists in our categories object
      if (category in categories) {
        const info = categories[category as keyof typeof categories];
        const url = `${baseUrl}/llms/${category}`;
        output += `### [${info.title}](${url})\n`;
        output += `${info.description}\n`;
        output += `- URL: ${url}\n`;
        output += `- Text version: ${url}.txt\n\n`;
      }
    }
  }

  // Add some helpful examples
  output += '## Example Usage\n\n';
  output += 'To retrieve documentation about the TypeScript SDK:\n';
  output += '```\n';
  output += `curl ${baseUrl}/llms/typescript-sdk\n`;
  output += '```\n\n';
  output += 'To get plain text version of the API documentation:\n';
  output += '```\n';
  output += `curl ${baseUrl}/llms/api.txt\n`;
  output += '```\n\n';

  return output;
}

// Single parameter route handler for maximum compatibility
export async function GET(request: Request) {
  // Get the URL from the request
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Extract path segments from the URL
  // Remove /llms/ prefix if present
  const pathWithoutPrefix = pathname.replace(/^\/llms\/?/, '');
  const pathSegments = pathWithoutPrefix ? pathWithoutPrefix.split('/') : [];
  const category = pathSegments.join('-').toLowerCase();

  // Handle the root /llms path with an index of available categories
  if (category === '') {
    const hostname = url.hostname || 'meetingbaas.com';
    const indexContent = generateCategoryIndex(hostname);
    return new Response(indexContent, {
      headers: {
        'Content-Type': 'text/markdown',
      },
    });
  }

  // Check if the category exists in our configuration
  if (!Object.keys(typedCategoryConfig).includes(category)) {
    // Try to be helpful by suggesting similar categories
    let content = "# Category Not Found\n\n";
    content += `The requested category '${category}' was not found.\n\n`;
    
    content += "## Available Categories\n\n";
    
    for (const [key, config] of Object.entries(typedCategoryConfig)) {
      content += `- [/llms/${key}](/llms/${key}) - ${config.title}\n`;
    }
    
    return new Response(content, {
      status: 404,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8'
      }
    });
  }

  // Get the content for this category
  const content = await getContentForCategory(category);
  
  // Return the content
  return new Response(content, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8'
    }
  });
} 