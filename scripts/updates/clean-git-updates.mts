#!/usr/bin/env tsx

import {
  existsSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';

// Constants
const UPDATES_DIR = join(process.cwd(), 'content', 'docs', 'updates');
const META_JSON_PATH = join(UPDATES_DIR, 'meta.json');
const GIT_UPDATES_FILE_PREFIX = 'git-updates-'; // Legacy format
const PRODUCTION_PREFIX = 'production-'; // New format causing issues
const TEMPLATES_DIR = join(process.cwd(), 'scripts/updates/templates');

// Regex patterns to match different types of update files
// Legacy pattern matches exact prefix followed by a date in YYYY-MM-DD format
const LEGACY_UPDATES_PATTERN = new RegExp(
  `^${GIT_UPDATES_FILE_PREFIX}\\d{4}-\\d{2}-\\d{2}\\.mdx$`,
);

// Production pattern matches production- prefix followed by a date
const PRODUCTION_UPDATES_PATTERN = new RegExp(
  `^${PRODUCTION_PREFIX}\\d{4}-\\d{2}-\\d{2}\\.mdx$`,
);

// Service pattern matches any service key followed by a date (excluding production-)
const SERVICE_UPDATES_PATTERN = new RegExp(
  `^(?!${PRODUCTION_PREFIX})[a-z-]+-\\d{4}-\\d{2}-\\d{2}\\.mdx$`,
);

/**
 * Reset the meta.json file to only include the index page, but preserve other properties
 */
function resetMetaJson(): void {
  const metaJsonPath = META_JSON_PATH;

  // Check if meta.json exists
  if (existsSync(metaJsonPath)) {
    try {
      // Read existing meta.json
      const metaContent = readFileSync(metaJsonPath, 'utf-8');
      const meta = JSON.parse(metaContent);

      // Preserve everything but reset pages to only include index
      meta.pages = ['index'];

      // Write back to meta.json
      writeFileSync(metaJsonPath, JSON.stringify(meta, null, 2));
      console.log(`Reset meta.json pages to only include the index page`);
    } catch (error) {
      console.error('Error updating meta.json:', error);
    }
  } else {
    // If meta.json doesn't exist, create a new one
    const meta = {
      title: 'Updates',
      icon: 'MonitorUp',
      description:
        'Latest updates, improvements, and changes to Meeting BaaS services',
      root: true,
      sortBy: 'date',
      sortOrder: 'desc',
      pages: ['index'],
    };

    // Write to meta.json
    writeFileSync(metaJsonPath, JSON.stringify(meta, null, 2));
    console.log(`Created new meta.json with only the index page`);
  }
}

/**
 * Ensure index.mdx exists by restoring it from the template if needed
 */
function ensureIndexFile(): void {
  const indexPath = join(UPDATES_DIR, 'index.mdx');
  const templatePath = join(TEMPLATES_DIR, 'index.mdx.template');

  // Only restore if index.mdx doesn't exist and the template does
  if (!existsSync(indexPath) && existsSync(templatePath)) {
    try {
      // Read template content
      const templateContent = readFileSync(templatePath, 'utf-8');

      // Write to index.mdx
      writeFileSync(indexPath, templateContent);
      console.log(`Restored index.mdx from template`);
    } catch (error) {
      console.error('Error restoring index.mdx file:', error);
    }
  }
}

/**
 * Clean up update files in the updates directory
 */
function cleanGitUpdates(serviceKey?: string): void {
  console.log('Cleaning up update files...');

  // Check if updates directory exists
  if (!existsSync(UPDATES_DIR)) {
    console.log('Updates directory not found');
    return;
  }

  // Read all files in the updates directory
  const files = readdirSync(UPDATES_DIR);
  let legacyCount = 0;
  let productionCount = 0;
  let serviceCount = 0;
  const modifiedFiles: string[] = [];

  // Delete files that match any of our patterns
  files.forEach((file) => {
    const filePath = join(UPDATES_DIR, file);

    if (LEGACY_UPDATES_PATTERN.test(file)) {
      console.log(`Removing legacy file: ${file}`);
      unlinkSync(filePath);
      legacyCount++;
    } else if (PRODUCTION_UPDATES_PATTERN.test(file)) {
      console.log(`Removing production file: ${file}`);
      unlinkSync(filePath);
      productionCount++;
    } else if (SERVICE_UPDATES_PATTERN.test(file)) {
      // Only delete service files if they match the specified service
      const fileServiceKey = file.split('-')[0];
      if (!serviceKey || fileServiceKey === serviceKey) {
        console.log(`Removing service file: ${file}`);
        unlinkSync(filePath);
        serviceCount++;
      }
    } else if (file !== 'index.mdx' && file !== 'meta.json') {
      modifiedFiles.push(file);
    }
  });

  console.log(`Deleted:
  - ${legacyCount} legacy update files (${GIT_UPDATES_FILE_PREFIX}*)
  - ${productionCount} production update files (${PRODUCTION_PREFIX}*)
  - ${serviceCount} service-specific update files${serviceKey ? ` for ${serviceKey}` : ''}`);

  if (modifiedFiles.length > 0) {
    console.log(
      `Found ${modifiedFiles.length} other files that were not cleaned:`,
    );
    modifiedFiles.forEach((file) => console.log(`- ${file}`));
  }

  // Reset meta.json
  resetMetaJson();

  // Ensure index.mdx exists
  ensureIndexFile();
}

// Run the function automatically when this module is executed directly
if (import.meta.url.endsWith(process.argv[1])) {
  const serviceKey = process.argv[2];
  cleanGitUpdates(serviceKey);
}

export { cleanGitUpdates };
