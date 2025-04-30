#!/usr/bin/env tsx

/**
 * This script enhances all non-API update files in the content/docs/updates directory
 *
 * Usage:
 * pnpm enhance:all-non-api --key=your_api_key [options]
 *
 * Options:
 * --key        Required. OpenRouter API key
 * --model      Optional. Model to use (default: anthropic/claude-3-haiku)
 * --local      Optional. Enable local development mode
 */

import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import minimist from 'minimist';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Parse command line arguments
const argv = minimist(process.argv.slice(2));

// Get API key from command line args or environment variable
const apiKey = argv.key || process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error(
    'Error: API key is required (--key=your_api_key) or set OPENROUTER_API_KEY in .env file',
  );
  process.exit(1);
}

// Optional parameters
const model = argv.model || 'anthropic/claude-3-haiku';
const localDev = argv.local || false;

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const updatesDir = path.join(rootDir, 'content', 'docs', 'updates');

// Read all MDX files in the updates directory
const files = fs
  .readdirSync(updatesDir)
  .filter(
    (file) =>
      file.endsWith('.mdx') &&
      !file.startsWith('api-') &&
      file !== 'index.mdx' &&
      file !== 'meta.json',
  );

console.log(`Found ${files.length} non-API files to enhance`);

// Process each file
for (const file of files) {
  try {
    // Extract service and date
    const match = file.match(/^([a-z-]+)-(\d{4}-\d{2}-\d{2})\.mdx$/);

    if (match) {
      const [_, service, date] = match;
      console.log(`Processing ${file} - Service: ${service}, Date: ${date}`);

      // Generate URLs for the file
      const fileBaseName = path.basename(file, '.mdx');
      const prodUrl = `https://docs.meetingbaas.com/updates/${fileBaseName}`;

      // Build the command
      const command = `pnpm enhance:updates --service=${service} --date=${date} --model=${model}${localDev ? ' --local' : ''}${apiKey ? ` --key=${apiKey}` : ''}`;

      // Execute the command
      console.log(`Running: ${command}`);
      execSync(command, { stdio: 'inherit' });

      // Log the URL
      console.log(`Enhanced: ${prodUrl}`);
    } else {
      console.warn(`Skipping ${file} - Could not extract service and date`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
}

console.log('Enhancement complete!');
