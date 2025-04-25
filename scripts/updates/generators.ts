import { execSync } from 'child_process';
import { format } from 'date-fns';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, dirname, join } from 'path';
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
  // Create updates directory if it doesn't exist
  if (!existsSync(UPDATES_DIR)) {
    mkdirSync(UPDATES_DIR, { recursive: true });
  }

  // Get git changes
  const gitChanges = getGitChanges();
  const { modified, added, deleted } = gitChanges;

  console.log(`Checking for ${config.name} changes...`);
  console.log(`- Pattern: ${config.dirPattern}`);
  console.log(
    `- Modified files: ${modified.filter((f) => f.startsWith(config.dirPattern)).length}`,
  );
  console.log(
    `- Added files: ${added.filter((f) => f.startsWith(config.dirPattern)).length}`,
  );
  console.log(
    `- Deleted files: ${deleted.filter((f) => f.startsWith(config.dirPattern)).length}`,
  );

  // Filter changes for this service's directory
  const allChanges = [...modified, ...added, ...deleted].filter((file) => {
    // Skip files that match any exclude pattern
    if (config.excludePatterns?.some((pattern) => file === pattern)) {
      console.log(`  - Skipping excluded file: ${file}`);
      return false;
    }

    return file.startsWith(config.dirPattern);
  });

  if (allChanges.length > 0) {
    console.log(`Detected changes for ${config.name}:`);
    allChanges.forEach((file) => console.log(`  - ${file}`));
  }

  // If no changes, return null
  if (allChanges.length === 0) {
    console.log(`No changes detected for ${config.name}`);
    return null;
  }

  // Generate update filename
  const updateFilename = `${config.serviceKey}-update-${CURRENT_DATE}.mdx`;
  const updateFilePath = join(UPDATES_DIR, updateFilename);

  // Skip if file already exists - don't overwrite
  if (existsSync(updateFilePath)) {
    console.log(`Update file already exists: ${updateFilePath}, skipping`);
    return updateFilename; // Return the filename so it can be added to meta.json
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

{/* This file contains raw git diff information that will be processed by an LLM. */}

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

  // Add untracked files and the new update file to git
  try {
    // Add all untracked files related to this service
    if (allChanges.some((file) => !modified.includes(file))) {
      console.log(`Adding untracked files for ${config.name} to git...`);
      allChanges.forEach((file) => {
        if (!modified.includes(file)) {
          try {
            execSync(`git add "${file}"`);
            console.log(`  - Added: ${file}`);
          } catch (error) {
            console.error(`  - Failed to add: ${file}`, error);
          }
        }
      });
    }

    // Add the update file
    execSync(`git add "${updateFilePath}"`);
    console.log(`Added update file to git: ${updateFilePath}`);

    // Add the meta.json file which will be updated later
    const metaJsonPath = join(UPDATES_DIR, 'meta.json');
    if (existsSync(metaJsonPath)) {
      execSync(`git add "${metaJsonPath}"`);
      console.log(`Added meta.json to git: ${metaJsonPath}`);
    }
  } catch (error) {
    console.error('Error adding files to git:', error);
  }

  return updateFilename;
}
