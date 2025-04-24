import { execSync } from 'child_process';
import { format } from 'date-fns';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';

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

// =========== API Updates ===========

function getGitChanges(): { modified: string[]; untracked: string[] } {
  try {
    // Get modified files
    const modifiedOutput = execSync(
      'git diff --name-only HEAD',
      { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
    ).toString();
    const modified = modifiedOutput
      .split('\n')
      .filter(
        (file) =>
          file.startsWith('content/docs/api/reference/') &&
          file.endsWith('.mdx'),
      )
      .sort(); // Sort for consistent ordering

    // Get untracked files
    const untrackedOutput = execSync(
      'git ls-files --others --exclude-standard',
      { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
    ).toString();
    const untracked = untrackedOutput
      .split('\n')
      .filter(
        (file) =>
          file.startsWith('content/docs/api/reference/') &&
          file.endsWith('.mdx'),
      )
      .sort(); // Sort for consistent ordering

    return { modified, untracked };
  } catch (error) {
    console.error('Error getting git changes:', error);
    return { modified: [], untracked: [] };
  }
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

function detectChangesFromOpenAPI(): APIChange[] {
  const changes: APIChange[] = [];
  const { modified, untracked } = getGitChanges();

  try {
    // Process both modified and untracked files
    [...modified, ...untracked].forEach((file) => {
      if (!file) return;

      try {
        const content = readFileSync(file, 'utf-8');
        const change = categorizeChange(file, content);
        changes.push(change);
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    });
  } catch (error) {
    console.error('Error detecting OpenAPI changes:', error);
  }

  // Group changes by category
  return changes.sort((a, b) => {
    // Sort by category first
    if (a.category !== b.category) {
      return (a.category || '').localeCompare(b.category || '');
    }
    // Then by type (breaking > feature > enhancement)
    const typeOrder = { breaking: 0, feature: 1, enhancement: 2 };
    return typeOrder[a.type] - typeOrder[b.type];
  });
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

function sanitizeForMdx(content: string): string {
  // Replace all potentially problematic characters
  return (
    content
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // Escape curly braces which could break MDX parsing
      .replace(/{/g, '&#123;')
      .replace(/}/g, '&#125;')
  );
}

async function generateAPIUpdates(): Promise<string | null> {
  try {
    // Create updates directory if it doesn't exist
    const updatesDir = join(process.cwd(), 'content', 'docs', 'updates');
    if (!existsSync(updatesDir)) {
      mkdirSync(updatesDir, { recursive: true });
    }

    // Get current date for the update file name
    const currentDate = new Date();
    const dateString = format(currentDate, 'yyyy-MM-dd');

    // Paths to API docs
    const apiDocsPath = join(process.cwd(), 'content', 'docs', 'api');
    const apiReferencePath = join(apiDocsPath, 'reference');

    try {
      // Get git changes for the API reference path
      const { modified, untracked } = getGitChanges();
      const allChangedFiles = [...modified, ...untracked].filter(Boolean);

      // Skip if no changes
      if (allChangedFiles.length === 0) {
        console.log('No API reference changes detected');
        return null;
      }

      // Group changes by root folder
      const changesByFolder: Record<string, string[]> = {};

      allChangedFiles.forEach((file) => {
        // Extract the root folder from the path (like 'bots', 'webhooks', etc.)
        const pathParts = file
          .replace('content/docs/api/reference/', '')
          .split('/');
        const rootFolder = pathParts[0];

        if (!changesByFolder[rootFolder]) {
          changesByFolder[rootFolder] = [];
        }
        changesByFolder[rootFolder].push(file);
      });

      // Check if we have only one file changed
      const isSingleFileChange = allChangedFiles.length === 1;
      const singleFile = isSingleFileChange ? allChangedFiles[0] : null;

      // Create a template with metadata + git diff for LLM processing
      const fileName = `api-update-${dateString}.mdx`;
      const updatePath = join(updatesDir, fileName);

      // Add a comment with details first (will be ignored by MDX renderer)
      let updateContent = `---
title: API Update - ${format(currentDate, 'MMMM do, yyyy')}
description: Updates to Meeting BaaS API
icon: Api
date: ${dateString}
service: api
tags: ['api', 'update']
---

{/* 
This file contains raw git diff information that will be processed by an LLM.
*/}

# API Updates - ${format(currentDate, 'MMMM do, yyyy')}

`;

      if (isSingleFileChange && singleFile) {
        // For single file change, get diff just for that file
        const singleFileDiff = execSync(
          `git diff -- "${singleFile}"`,
        ).toString();
        const fileContent = readFileSync(singleFile, 'utf-8');

        updateContent += `
## File Changed

\`${singleFile}\`

## Detailed Change Information

The specific file listed above was changed. This update focuses on these changes.

<details>
<summary>View Git Diff</summary>

<pre>
${sanitizeForMdx(singleFileDiff)}
</pre>

</details>

Content to be generated by LLM processing.
`;
      } else {
        // For multiple files, organize by folder
        updateContent += `
## Overview

The following API reference files were modified:

${Object.entries(changesByFolder)
  .map(
    ([folder, files]) => `
### ${folder.toUpperCase()}

${files.map((file) => `- \`${file}\``).join('\n')}
`,
  )
  .join('\n')}

## Detailed Change Information

This update includes changes across multiple files and categories.

<details>
<summary>View Git Diffs by Category</summary>

${Object.entries(changesByFolder)
  .map(([folder, files]) => {
    const folderDiff = execSync(
      `git diff -- ${files.map((f) => `"${f}"`).join(' ')}`,
      { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
    ).toString();
    return `
### ${folder.toUpperCase()} CHANGES

<pre>
${sanitizeForMdx(folderDiff)}
</pre>`;
  })
  .join('\n')}

</details>

Content to be generated by LLM processing.
`;
      }

      writeFileSync(updatePath, updateContent);

      console.log(
        `Generated API update template with diff information for ${allChangedFiles.length} files`,
      );
      return fileName;
    } catch (error) {
      console.error('Error getting git diff:', error);
      return null;
    }
  } catch (error) {
    console.error('Failed to generate API updates:', error);
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

    // Create updates directory if it doesn't exist
    const updatesDir = join(process.cwd(), 'content', 'docs', 'updates');
    if (!existsSync(updatesDir)) {
      mkdirSync(updatesDir, { recursive: true });
    }

    // Get current date for the file name
    const currentDate = new Date();
    const dateString = format(currentDate, 'yyyy-MM-dd');
    const fileName = `sdk-update-${sdkVersion.replace(/\./g, '-')}.mdx`;
    const updatePath = join(updatesDir, fileName);

    try {
      // Get path to SDK docs
      const sdkDocsPath = join(
        process.cwd(),
        'content',
        'docs',
        'typescript-sdk',
      );

      // Base content with version info
      let updateContent = `---
title: SDK Update - Version ${sdkVersion}
description: Updates to Meeting BaaS TypeScript SDK v${sdkVersion}
icon: Code
date: ${dateString}
service: sdk
tags: ['sdk', 'typescript']
---

{/* 
This file contains raw git diff information that will be processed by an LLM.
*/}

# TypeScript SDK ${sdkVersion} Released

## SDK Version Information

- Current SDK version: \`${sdkVersion}\`

`;

      // Package.json diff section - always include this
      const packageJsonDiff = execSync(
        `git diff -- ${packageJsonPath}`,
      ).toString();
      updateContent += `
## Package.json Changes

<details>
<summary>View Package Changes</summary>

<pre>
${sanitizeForMdx(packageJsonDiff)}
</pre>

</details>

`;

      // Check if SDK docs path exists
      if (!existsSync(sdkDocsPath)) {
        // Just add placeholder for basic update
        updateContent += `Content to be generated by LLM processing.`;

        writeFileSync(updatePath, updateContent);
        console.log(
          `Generated basic SDK update template for version ${sdkVersion}`,
        );
        return fileName;
      }

      // Get SDK docs folders (reference, examples, etc.)
      const sdkFolders = readdirSync(sdkDocsPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

      // Get git changes for SDK docs
      const gitStatus = execSync(
        `git diff --name-only -- ${sdkDocsPath}`,
        { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
      ).toString();
      const changedFiles = gitStatus.split('\n').filter(Boolean).sort(); // Sort for consistent ordering

      // Group changed files by folder
      const filesByFolder: Record<string, string[]> = {
        root: [], // For files directly in the typescript-sdk folder
      };

      changedFiles.forEach((file) => {
        const relativePath = file.replace(`content/docs/typescript-sdk/`, '');
        const folder = relativePath.includes('/')
          ? relativePath.split('/')[0]
          : 'root';

        if (!filesByFolder[folder]) {
          filesByFolder[folder] = [];
        }
        filesByFolder[folder].push(file);
      });

      if (changedFiles.length === 0) {
        // No SDK doc changes, just version update
        updateContent += `No changes to SDK documentation. Content to be generated by LLM processing.`;
      } else if (changedFiles.length === 1) {
        // Single file change - focus on that file
        const singleFile = changedFiles[0];
        const singleFileDiff = execSync(
          `git diff -- "${singleFile}"`,
        ).toString();
        const fileExists = existsSync(singleFile);
        const fileContent = fileExists ? readFileSync(singleFile, 'utf-8') : '';

        updateContent += `
## File Changed

\`${singleFile}\`

## Detailed Change Information

<details>
<summary>View Git Diff</summary>

<pre>
${sanitizeForMdx(singleFileDiff)}
</pre>

</details>

Content to be generated by LLM processing.
`;
      } else {
        // Multiple file changes - organize by folder
        updateContent += `
## Overview

The following SDK documentation files were modified:

${Object.entries(filesByFolder)
  .filter(([_, files]) => files.length > 0)
  .map(
    ([folder, files]) => `
### ${folder.toUpperCase()}

${files.map((file) => `- \`${file}\``).join('\n')}
`,
  )
  .join('\n')}

## Detailed Change Information

<details>
<summary>View Git Diffs by Folder</summary>

${Object.entries(filesByFolder)
  .filter(([_, files]) => files.length > 0)
  .map(([folder, files]) => {
    const folderDiff = execSync(
      `git diff -- ${files.map((f) => `"${f}"`).join(' ')}`,
      { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
    ).toString();
    return `
### ${folder.toUpperCase()} CHANGES

<pre>
${sanitizeForMdx(folderDiff)}
</pre>`;
  })
  .join('\n')}

</details>

Content to be generated by LLM processing.
`;
      }

      writeFileSync(updatePath, updateContent);
      console.log(
        `Generated SDK update template for version ${sdkVersion} with diff information for ${changedFiles.length} files`,
      );
      return fileName;
    } catch (error) {
      console.error('Error getting git diff:', error);
      return null;
    }
  } catch (error) {
    console.error('Failed to generate SDK updates:', error);
    return null;
  }
}

// =========== LLM Updates ===========

async function generateLLMUpdates(): Promise<string | null> {
  try {
    // Path to LLM content directory
    const llmContentDir = join(process.cwd(), 'content', 'llm');

    // Skip if no LLM content directory
    if (!existsSync(llmContentDir)) {
      console.log('No LLM content directory found, skipping LLM updates');
      return null;
    }

    // Create updates directory if it doesn't exist
    const updatesDir = join(process.cwd(), 'content', 'docs', 'updates');
    if (!existsSync(updatesDir)) {
      mkdirSync(updatesDir, { recursive: true });
    }

    // Generate file names
    const currentDate = new Date();
    const dateString = format(currentDate, 'yyyy-MM-dd');
    const fileName = `llm-update-${dateString}.mdx`;
    const updatePath = join(updatesDir, fileName);

    try {
      // Get all LLM content files
      const llmFiles = readdirSync(llmContentDir)
        .filter((f) => f.endsWith('.md') && f !== 'all.md') // Deliberately exclude all.md
        .sort() // Sort files to ensure consistent ordering
        .map((f) => join(llmContentDir, f));

      // Get git status to see which files have changed
      const gitStatus = execSync(
        `git diff --name-only -- ${llmContentDir}`,
        { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
      ).toString();
      const changedFiles = gitStatus
        .split('\n')
        .filter(Boolean)
        .filter((file) => !file.endsWith('/all.md')) // Deliberately exclude all.md
        .sort(); // Sort changed files to ensure consistent ordering

      if (changedFiles.length === 0) {
        console.log('No changes detected in LLM content files');
        return null;
      }

      // Group changed files by service type
      const filesByService: Record<string, string[]> = {};
      const singleFileChange = changedFiles.length === 1;
      const singleFile = singleFileChange ? changedFiles[0] : null;

      changedFiles.forEach((file) => {
        const filename = file.split('/').pop() || '';
        const service = filename.replace('.md', '').split('-')[0];

        if (!filesByService[service]) {
          filesByService[service] = [];
        }
        filesByService[service].push(file);
      });

      let updateContent = `---
title: LLM Update - ${format(currentDate, 'MMMM do, yyyy')}
description: Updates to LLM integration in Meeting BaaS
icon: Brain
date: ${dateString}
service: llm
tags: ['llm', 'ai']
---

{/* 
This file contains raw git diff information that will be processed by an LLM.
*/}

# LLM Updates - ${format(currentDate, 'MMMM do, yyyy')}

`;

      if (singleFileChange && singleFile) {
        // For a single file change, focus on that file
        const singleFileDiff = execSync(
          `git diff -- "${singleFile}"`,
          { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
        ).toString();
        const fileExists = existsSync(singleFile);
        const fileContent = fileExists ? readFileSync(singleFile, 'utf-8') : '';

        updateContent += `
## File Changed

\`${singleFile}\`

## Detailed Change Information

<details>
<summary>View Git Diff</summary>

<pre>
${sanitizeForMdx(singleFileDiff)}
</pre>

</details>

Content to be generated by LLM processing.
`;
      } else {
        // For multiple files, organize by service
        updateContent += `
## Overview

The following LLM content files were modified:

${Object.entries(filesByService)
  .map(
    ([service, files]) => `
### ${service.toUpperCase()}

${files.map((file) => `- \`${file}\``).join('\n')}
`,
  )
  .join('\n')}

## Detailed Change Information

<details>
<summary>View Git Diffs by Service</summary>

${Object.entries(filesByService)
  .map(([service, files]) => {
    const serviceDiff = execSync(
      `git diff -- ${files.map((f) => `"${f}"`).join(' ')}`,
      { maxBuffer: 10 * 1024 * 1024 }, // 10MB buffer limit
    ).toString();
    return `
### ${service.toUpperCase()} CHANGES

<pre>
${sanitizeForMdx(serviceDiff)}
</pre>`;
  })
  .join('\n')}

</details>

Content to be generated by LLM processing.
`;
      }

      writeFileSync(updatePath, updateContent);
      console.log(
        `Generated LLM update template with diff information for ${changedFiles.length} files`,
      );
      return fileName;
    } catch (error) {
      console.error('Error getting git diff:', error);
      return null;
    }
  } catch (error) {
    console.error('Failed to generate LLM updates:', error);
    return null;
  }
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

// =========== Main Function ===========

export async function generateAllUpdates(): Promise<void> {
  try {
    console.log('Generating updates...');

    // Run all update generators in parallel
    const [apiUpdates, sdkUpdates, llmUpdates] = await Promise.all([
      generateAPIUpdates(),
      generateSDKUpdates(),
      generateLLMUpdates(),
    ]);

    // Update meta.json with any new pages
    await updateMetaJson(
      [apiUpdates, sdkUpdates, llmUpdates].filter(Boolean) as string[],
    );

    console.log('Finished generating updates');
  } catch (error) {
    console.error('Error generating updates:', error);
  }
}

// Run the main function if this script is executed directly
// Using ES modules compatible approach
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  generateAllUpdates();
}
