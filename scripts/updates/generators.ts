import { execSync } from 'child_process';
import { format } from 'date-fns';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { ServiceConfig } from './types';
import { getGitChanges, sanitizeForMdx } from './utils';

// Define constants
const CURRENT_DATE = format(new Date(), 'yyyy-MM-dd');
const UPDATES_DIR = './content/docs/updates';

/**
 * Generates an update file for a service based on git changes
 */
export async function generateServiceUpdate(
  config: ServiceConfig,
): Promise<string | null> {
  console.log(`Generating updates for ${config.name}...`);

  try {
    // Check if directory exists for the service
    if (!existsSync(config.dirPattern)) {
      console.log(`Directory not found for ${config.name}, skipping`);
      return null;
    }

    // Get git changes
    const { modified, added, deleted } = getGitChanges();

    // Group all files by their containing folder
    const allChanges = [...modified, ...added, ...deleted];

    // Filter files related to this service
    const serviceFiles = allChanges.filter((file) => {
      // Check if file path matches the service directory pattern
      const isMatch = file.startsWith(config.dirPattern);

      // If there are excludes, check if file should be excluded
      if (isMatch && config.excludePatterns?.length) {
        return !config.excludePatterns.some((pattern: string) =>
          file.includes(pattern),
        );
      }

      return isMatch;
    });

    // If no changes, skip update
    if (serviceFiles.length === 0) {
      console.log(`No changes detected for ${config.name}, skipping`);
      return null;
    }

    // Ensure updates directory exists
    if (!existsSync(UPDATES_DIR)) {
      mkdirSync(UPDATES_DIR, { recursive: true });
    }

    // Create filename with current date and service key
    const TODAY = format(new Date(), 'yyyy-MM-dd');
    const updateFilename = `${config.serviceKey}-${TODAY}.mdx`;
    const updatePath = join(UPDATES_DIR, updateFilename);

    // Group files by root folder
    const filesByFolder: Record<string, string[]> = {};
    const rootFolders = new Set<string>();

    serviceFiles.forEach((file) => {
      // Skip the top-level directory itself
      if (file === config.dirPattern) return;

      // Get the immediate subfolder after the main pattern
      const relativePath = file.slice(config.dirPattern.length).split('/');
      const rootFolder = relativePath[0] || 'root';

      if (!filesByFolder[rootFolder]) {
        filesByFolder[rootFolder] = [];
      }

      filesByFolder[rootFolder].push(file);
      rootFolders.add(rootFolder);
    });

    // If there's only one file changed, focus on that single file
    const isSingleFile = serviceFiles.length === 1;

    // Get git diff for service files
    let gitDiff = '';
    try {
      if (isSingleFile) {
        // For a single file, get a focused diff
        gitDiff = execSync(`git diff HEAD -- "${serviceFiles[0]}"`).toString();
      } else {
        // For multiple files, get diffs grouped by folder
        gitDiff = execSync(
          `git diff HEAD -- "${config.dirPattern}"`,
        ).toString();
      }
    } catch (err) {
      console.error(`Error getting git diff for ${config.name}:`, err);
      gitDiff = 'Error retrieving git diff.';
    }

    // Create update content
    let updateContent = '';

    if (isSingleFile) {
      // Single file focus
      const fileName = serviceFiles[0].split('/').pop() || 'unknown';

      updateContent = `---
title: "${config.name} - ${fileName} Update"
description: "Update for a change in ${fileName}"
icon: "${config.icon}"
date: "${TODAY}"
tags: [${config.additionalTags?.join(', ') || ''}]
---

# ${config.name} Update - ${fileName}

Below is a change in \`${fileName}\` that requires documentation updates.

## Changed File

\`\`\`
${serviceFiles[0]}
\`\`\`

## Git Diff

\`\`\`diff
${sanitizeForMdx(gitDiff)}
\`\`\`
`;
    } else {
      // Multiple files/folders
      const foldersList = Array.from(rootFolders)
        .map((folder) => `- ${folder}`)
        .join('\n');

      updateContent = `---
title: "${config.name} Update"
description: "Updates to ${config.name} documentation"
icon: "${config.icon}"
date: "${TODAY}"
tags: [${config.additionalTags?.join(', ') || ''}]
---

# ${config.name} Update

This update covers changes to the following areas:

${foldersList}

## Changed Files

\`\`\`
${serviceFiles.join('\n')}
\`\`\`

## Git Diff

\`\`\`diff
${sanitizeForMdx(gitDiff)}
\`\`\`
`;
    }

    // Write update file
    writeFileSync(updatePath, updateContent);
    console.log(`Generated update: ${updatePath}`);

    // Return the filename for meta.json update
    return updateFilename;
  } catch (error) {
    console.error(`Error generating update for ${config.name}:`, error);
    return null;
  }
}
