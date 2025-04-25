import { execSync } from 'child_process';
import { format } from 'date-fns';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';
import { pathToFileURL } from 'url';

// Define constants
const CURRENT_DATE = format(new Date(), 'yyyy-MM-dd');
const UPDATES_DIR = './content/docs/updates';
const META_JSON_PATH = './content/docs/meta.json';
const LLM_CONTENT_DIR = './content/llm';
const API_REF_PATH = './content/api-reference';
const PACKAGE_JSON_PATH = './package.json';

// ServiceConfig interface for standardized service update generation
interface ServiceConfig {
  name: string; // Display name of the service
  dirPattern: string; // Directory pattern to search for changes
  icon: string; // Icon for the service
  serviceKey: string; // Key used in filenames and references
  openapiFile?: string; // Optional path to OpenAPI file for API services
  additionalTags?: string[]; // Additional tags for categorization
}

// Service configurations
const SERVICES: ServiceConfig[] = [
  {
    name: 'API',
    dirPattern: API_REF_PATH,
    icon: 'Server',
    serviceKey: 'api',
    additionalTags: ['api-reference'],
  },
  {
    name: 'TypeScript SDK',
    dirPattern: './content/docs/typescript-sdk',
    icon: 'Braces',
    serviceKey: 'sdk',
    additionalTags: ['sdk', 'typescript'],
  },
  {
    name: 'LLM Integration',
    dirPattern: LLM_CONTENT_DIR,
    icon: 'BrainCircuit',
    serviceKey: 'llm',
    additionalTags: ['llm', 'ai'],
  },
  {
    name: 'Speaking Bots',
    dirPattern: './content/docs/speaking-bots',
    icon: 'Brain',
    serviceKey: 'speaking-bots',
    additionalTags: ['bots', 'persona'],
  },
  {
    name: 'MCP Servers',
    dirPattern: './content/docs/mcp-servers',
    icon: 'Server',
    serviceKey: 'mcp-servers',
    additionalTags: ['mcp', 'server'],
  },
  // Add other services as needed
];

// Helper function to sanitize content for MDX
function sanitizeForMdx(content: string): string {
  return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Helper function to get git changes
function getGitChanges() {
  // Get git status for changes
  const gitStatus = execSync('git status --porcelain', {
    maxBuffer: 10 * 1024 * 1024, // 10MB buffer limit
  }).toString();

  // Parse git status output
  const modified: string[] = [];
  const added: string[] = [];
  const deleted: string[] = [];

  gitStatus.split('\n').forEach((line) => {
    if (!line) return;
    const status = line.substring(0, 2).trim();
    const file = line.substring(3);

    if (status === 'M' || status === 'MM') {
      modified.push(file);
    } else if (status === 'A' || status === '??') {
      added.push(file);
    } else if (status === 'D') {
      deleted.push(file);
    }
  });

  return { modified, added, deleted };
}

// Common function to generate service updates
async function generateServiceUpdate(
  config: ServiceConfig,
): Promise<string | null> {
  // Create updates directory if it doesn't exist
  if (!existsSync(UPDATES_DIR)) {
    mkdirSync(UPDATES_DIR, { recursive: true });
  }

  // Get git changes
  const gitChanges = getGitChanges();
  const { modified, added, deleted } = gitChanges;

  // Filter changes for this service's directory
  const allChanges = [...modified, ...added, ...deleted].filter((file) =>
    file.startsWith(config.dirPattern),
  );

  // If no changes, return null
  if (allChanges.length === 0) {
    console.log(`No changes detected for ${config.name}`);
    return null;
  }

  // Group changes by root folder
  const changesByFolder = allChanges.reduce(
    (acc, file) => {
      const folderPath = dirname(file);
      const rootFolder = folderPath.split('/').slice(0, 3).join('/');

      if (!acc[rootFolder]) {
        acc[rootFolder] = [];
      }
      acc[rootFolder].push(file);
      return acc;
    },
    {} as Record<string, string[]>,
  );

  // Check if we have only a single file change
  const isSingleFileChange = allChanges.length === 1;
  const singleFile = allChanges[0];

  // Generate update filename
  const updateFilename = `${config.serviceKey}-update-${CURRENT_DATE}.mdx`;
  const updateFilePath = join(UPDATES_DIR, updateFilename);

  // Generate metadata for the update
  const titleDate = format(new Date(), 'MMMM d, yyyy');
  let metaContent = `---
title: "${config.name} Updates - ${titleDate}"
description: "Changes and updates to ${config.name} documentation"
icon: "${config.icon}"
tags: ["updates", "${config.serviceKey}"${config.additionalTags ? ', "' + config.additionalTags.join('", "') + '"' : ''}]
date: ${CURRENT_DATE}
---

import { Callout } from "fumadocs-ui/components/callout";

<Callout>
  This page was automatically generated on ${titleDate}.
</Callout>

`;

  // Handle single file changes with detailed focus
  if (isSingleFileChange && singleFile) {
    let diffContent = '';
    // Get git changes to properly check if file is modified or new
    const { modified } = getGitChanges();
    const isNewFile = !modified.includes(singleFile);

    if (isNewFile) {
      // For new files, include the file content
      diffContent = `New file: ${singleFile}\n\n${readFileSync(singleFile, 'utf-8')}`;
    } else {
      // For modified files, get the git diff
      diffContent = execSync(
        `git diff -- "${singleFile}"`,
        { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
      ).toString();
    }

    const fileBasename = basename(singleFile);
    metaContent += `
## Changes to ${fileBasename}

\`\`\`diff
${sanitizeForMdx(diffContent)}
\`\`\`
`;
  } else {
    // Handle multiple file changes grouped by folder
    metaContent += `
## Summary of Changes

The following ${config.name} components have been updated:

`;

    // List changed folders with files
    Object.entries(changesByFolder).forEach(([folder, files]) => {
      const folderName = basename(folder);
      metaContent += `### ${folderName}\n\n`;

      files.forEach((file) => {
        const fileName = basename(file);
        metaContent += `- ${fileName}\n`;
      });

      metaContent += '\n';
    });

    // Add git diff information
    metaContent += `
## Detailed Changes

\`\`\`diff
${sanitizeForMdx(
  execSync(
    `git diff -- "${config.dirPattern}"`,
    { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
  ).toString(),
)}
\`\`\`
`;
  }

  // Handle OpenAPI changes if applicable
  if (config.openapiFile && existsSync(config.openapiFile)) {
    metaContent += `
## OpenAPI Specification Changes

\`\`\`diff
${sanitizeForMdx(
  execSync(
    `git diff -- "${config.openapiFile}"`,
    { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
  ).toString(),
)}
\`\`\`
`;
  }

  // Write the update file
  writeFileSync(updateFilePath, metaContent);
  console.log(`Generated ${config.name} update: ${updateFilePath}`);

  return updateFilename;
}

// Function to update meta.json with new update pages

// Function to generate all updates
export async function generateAllUpdates(): Promise<void> {
  // Generate updates for all configured services in parallel
  const updatePromises = SERVICES.map((service) =>
    generateServiceUpdate(service),
  );
  const updateResults = await Promise.all(updatePromises);

  // Filter out null results and get the generated update filenames
  const generatedUpdates = updateResults.filter(Boolean) as string[];

  // Update meta.json with new pages if any updates were generated
  if (generatedUpdates.length > 0) {
    updateMetaJson(generatedUpdates);
    console.log(`Generated ${generatedUpdates.length} update pages`);
  } else {
    console.log('No updates generated');
  }
}

// Check if run directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateAllUpdates().catch(console.error);
}

// Legacy generator functions - can be removed once the new approach is tested

// =========== Types ===========

interface APIChange {
  path: string;
  method: string;
  type: 'breaking' | 'enhancement' | 'feature';
  description: string;
  category?: string;
}

interface NpmPackageInfo {
  'dist-tags': {
    latest: string;
  };
  versions: {
    [key: string]: {
      description: string;
      homepage: string;
      repository?: {
        url: string;
      };
      license: string;
      dependencies?: Record<string, string>;
      peerDependencies?: Record<string, string>;
    };
  };
}

interface LLMModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  contextWindow: number;
  version?: string;
  releaseDate?: string;
  description?: string;
}

interface ServiceConfig {
  name: string;
  dirPattern: string;
  icon: string;
  serviceKey: string;
  openapiFile?: string;
  additionalTags?: string[];
}

function categorizeChange(path: string, content: string): APIChange {
  const categoryMatches = {
    '/bots/': 'Bots',
    '/calendar': 'Calendar',
    '/webhook': 'Webhooks',
    '/screenshot': 'Screenshots',
    '/transcribe': 'Transcription',
  };

  // Determine category
  const category =
    Object.entries(categoryMatches).find(([key]) => path.includes(key))?.[1] ||
    'API';

  // Check for breaking changes in content
  const isBreaking =
    content.toLowerCase().includes('breaking') ||
    content.includes('deprecated') ||
    content.includes('removed');

  // Check if it's a new feature
  const isNewFeature =
    path.startsWith('content/docs/api/reference/') &&
    !path.includes('index.mdx') &&
    !path.includes('meta.json');

  // Extract method from content
  const methodMatch = content.match(/method":"(GET|POST|PUT|DELETE|PATCH)"/i);
  const method = methodMatch ? methodMatch[1] : 'GET';

  // Extract description from content
  const descMatch = content.match(/description":\s*"([^"]+)"/);
  const description = descMatch ? descMatch[1] : 'API endpoint updated';

  // Clean up the path to match API format
  const apiPath = path
    .replace('content/docs/api/reference/', '')
    .replace('.mdx', '')
    .replace(/_/g, '/')
    .replace(/\/index$/, '');

  return {
    path: `/${apiPath}`,
    method,
    type: isBreaking ? 'breaking' : isNewFeature ? 'feature' : 'enhancement',
    description,
    category,
  };
}

function getUpdateIcon(changes: APIChange[]): string {
  // Map categories to relevant icons
  const categoryIcons: Record<string, string[]> = {
    Bots: ['Bot', 'Robot', 'Cpu'],
    Calendar: ['Calendar', 'Clock', 'Timer'],
    Webhooks: ['Webhook', 'Link', 'Connection'],
    Screenshots: ['Camera', 'Image', 'Screenshot'],
    Transcription: ['FileAudio', 'Mic', 'Waveform'],
    General: ['Code', 'Terminal', 'Api'],
  };

  // Get all categories from changes
  const categories = [...new Set(changes.map((c) => c.category || 'General'))];

  // If there's only one category, use its icon set
  if (categories.length === 1) {
    const icons = categoryIcons[categories[0]] || categoryIcons.General;
    return icons[Math.floor(Math.random() * icons.length)];
  }

  // If there are breaking changes, use warning-related icons
  if (changes.some((c) => c.type === 'breaking')) {
    return ['AlertTriangle', 'AlertCircle', 'Shield'][
      Math.floor(Math.random() * 3)
    ];
  }

  // For mixed changes, use general API/update icons
  const generalIcons = ['Rocket', 'Zap', 'Upload', 'RefreshCw', 'Code'];
  return generalIcons[Math.floor(Math.random() * generalIcons.length)];
}

async function generateAPIUpdates(): Promise<string | null> {
  try {
    // Create updates directory if it doesn't exist
    if (!existsSync(UPDATES_DIR)) {
      mkdirSync(UPDATES_DIR, { recursive: true });
    }

    // Get git changes
    const { modified, added, deleted } = getGitChanges();
    const allChanges = [...modified, ...added, ...deleted];

    // Filter files in API reference path
    const apiChanges = allChanges.filter((file) =>
      file.startsWith(API_REF_PATH),
    );

    // If no changes, return null
    if (apiChanges.length === 0) {
      console.log('No changes detected for API');
      return null;
    }

    // Group changes by root folder
    const changesByFolder = apiChanges.reduce(
      (acc, file) => {
        const folderPath = dirname(file);
        const rootFolder = folderPath.split('/').slice(0, 3).join('/');

        if (!acc[rootFolder]) {
          acc[rootFolder] = [];
        }
        acc[rootFolder].push(file);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    // Check if we have only a single file change
    const isSingleFileChange = apiChanges.length === 1;
    const singleFile = apiChanges[0];

    // Generate update filename
    const updateFilename = `api-update-${CURRENT_DATE}.mdx`;
    const updateFilePath = join(UPDATES_DIR, updateFilename);

    // Generate metadata for the update
    const titleDate = format(new Date(), 'MMMM d, yyyy');
    let metaContent = `---
title: "API Updates - ${titleDate}"
description: "Changes and updates to API documentation"
icon: "Server"
tags: ["updates", "api"]
date: ${CURRENT_DATE}
---

import { Callout } from "fumadocs-ui/components/callout";

<Callout>
  This page was automatically generated on ${titleDate}.
</Callout>

`;

    // Handle single file changes with detailed focus
    if (isSingleFileChange && singleFile) {
      let diffContent = '';
      // Get git changes to properly check if file is modified or new
      const { modified } = getGitChanges();
      const isNewFile = !modified.includes(singleFile);

      if (isNewFile) {
        // For new files, include the file content
        diffContent = `New file: ${singleFile}\n\n${readFileSync(singleFile, 'utf-8')}`;
      } else {
        // For modified files, get the git diff
        diffContent = execSync(
          `git diff -- "${singleFile}"`,
          { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
        ).toString();
      }

      const fileBasename = basename(singleFile);
      metaContent += `
## Changes to ${fileBasename}

\`\`\`diff
${sanitizeForMdx(diffContent)}
\`\`\`
`;
    } else {
      // Handle multiple file changes grouped by folder
      metaContent += `
## Summary of Changes

The following API components have been updated:

`;

      // List changed folders with files
      Object.entries(changesByFolder).forEach(([folder, files]) => {
        const folderName = basename(folder);
        metaContent += `### ${folderName}\n\n`;

        files.forEach((file) => {
          const fileName = basename(file);
          metaContent += `- ${fileName}\n`;
        });

        metaContent += '\n';
      });

      // Add git diff information
      metaContent += `
## Detailed Changes

\`\`\`diff
${sanitizeForMdx(
  execSync(
    `git diff -- "${API_REF_PATH}"`,
    { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
  ).toString(),
)}
\`\`\`
`;
    }

    // Handle OpenAPI changes if applicable
    if (existsSync('openapi.json')) {
      metaContent += `
## OpenAPI Specification Changes

\`\`\`diff
${sanitizeForMdx(
  execSync(
    `git diff -- "openapi.json"`,
    { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
  ).toString(),
)}
\`\`\`
`;
    }

    // Write the update file
    writeFileSync(updateFilePath, metaContent);
    console.log(`Generated API update: ${updateFilePath}`);

    return updateFilename;
  } catch (error) {
    console.error('Error generating API updates:', error);
    return null;
  }
}

// =========== SDK Updates ===========

async function generateSDKUpdates(): Promise<string | null> {
  try {
    // Read SDK version from package.json
    const packageJsonPath = join(process.cwd(), 'package.json');
    if (!existsSync(packageJsonPath)) {
      console.log('No package.json found, skipping SDK updates');
      return null;
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const sdkVersion =
      packageJson.dependencies?.['@meeting-baas/sdk']?.replace('^', '') || null;

    if (!sdkVersion) {
      console.log('No SDK version found in package.json');
      return null;
    }

    // Use common function for SDK updates
    return generateServiceUpdate({
      name: `TypeScript SDK ${sdkVersion}`,
      dirPattern: 'content/docs/typescript-sdk/',
      icon: 'Code',
      serviceKey: `sdk-update-${sdkVersion.replace(/\./g, '-')}`,
      additionalTags: ['sdk', 'typescript', 'release'],
    });
  } catch (error) {
    console.error('Failed to generate SDK updates:', error);
    return null;
  }
}

// =========== LLM Updates ===========

async function generateLLMUpdates(): Promise<string | null> {
  // Path to LLM content directory
  const llmContentDir = join(process.cwd(), 'content', 'llm');

  // Skip if no LLM content directory
  if (!existsSync(llmContentDir)) {
    console.log('No LLM content directory found, skipping LLM updates');
    return null;
  }

  return generateServiceUpdate({
    name: 'LLM',
    dirPattern: 'content/llm/',
    icon: 'Brain',
    serviceKey: 'llm',
    additionalTags: ['llm', 'ai'],
  });
}

// =========== Meta.json Updates ===========

async function updateMetaJson(newPages: string[]): Promise<void> {
  try {
    // Filter out null values
    const validPages = newPages.filter(Boolean) as string[];

    if (validPages.length === 0) {
      console.log('No new pages to add to meta.json');
      return;
    }

    // Path to meta.json
    const metaPath = join(
      process.cwd(),
      'content',
      'docs',
      'updates',
      'meta.json',
    );

    // Read current meta.json
    let meta: any = {
      title: 'Updates',
      icon: 'MonitorUp',
      description:
        'Latest updates, improvements, and changes to Meeting BaaS services',
      root: true,
      sortBy: 'date',
      sortOrder: 'desc',
      pages: ['index'],
    };

    if (existsSync(metaPath)) {
      meta = JSON.parse(readFileSync(metaPath, 'utf-8'));
    }

    // Add new pages to the pages array if they don't already exist
    for (const page of validPages) {
      const pageName = page.replace('.mdx', '');
      if (!meta.pages.includes(pageName)) {
        meta.pages.unshift(pageName); // Add to start of array for most recent
      }
    }

    // Write updated meta.json
    writeFileSync(metaPath, JSON.stringify(meta, null, 2));

    console.log(`Updated meta.json with ${validPages.length} new pages`);
  } catch (error) {
    console.error('Failed to update meta.json:', error);
  }
}

// =========== Service-Specific Update Functions ===========

async function generateSpeakingBotsUpdates(): Promise<string | null> {
  return generateServiceUpdate({
    name: 'Speaking Bots',
    dirPattern: 'content/docs/speaking-bots/',
    icon: 'Brain',
    serviceKey: 'speaking-bots',
    openapiFile: 'speaking-bots-openapi.json',
    additionalTags: ['bots', 'persona'],
  });
}

async function generateMCPServersUpdates(): Promise<string | null> {
  return generateServiceUpdate({
    name: 'MCP Servers',
    dirPattern: 'content/docs/mcp-servers/',
    icon: 'Server',
    serviceKey: 'mcp-servers',
    additionalTags: ['mcp', 'server'],
  });
}
