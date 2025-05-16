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
 * (MODIFIED: No longer deletes any files, only ensures index.mdx is present. meta.json will not be modified.)
 */
function cleanGitUpdates(serviceKey?: string): void {
  console.log('Skipping deletion of update files. Only ensuring index.mdx is present. meta.json will not be modified.');

  // Check if updates directory exists
  if (!existsSync(UPDATES_DIR)) {
    console.log('Updates directory not found');
    return;
  }

  // Do NOT delete any files!
  // Do NOT modify meta.json!

  // Ensure index.mdx exists
  ensureIndexFile();
}

// Run the function automatically when this module is executed directly
if (import.meta.url.endsWith(process.argv[1])) {
  const serviceKey = process.argv[2];
  cleanGitUpdates(serviceKey);
}

export { cleanGitUpdates };
