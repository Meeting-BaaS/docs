#!/usr/bin/env tsx

/**
 * This script enhances all update files in the content/docs/updates directory
 * It can handle both API and non-API updates, with special handling for API updates
 *
 * Usage:
 * pnpm enhance:all --key=your_api_key [options]
 *
 * Options:
 * --key        Required. OpenRouter API key
 * --model      Optional. Model to use (default: anthropic/claude-3-haiku)
 * --service    Optional. Specific service to enhance (e.g., api, speaking-meeting-bot)
 * --date       Optional. Specific date to enhance (YYYY-MM-DD)
 * --local      Optional. Enable local development mode
 * --verbose    Optional. Enable verbose logging
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
const service = argv.service;
const date = argv.date;
const localDev = argv.local || false;
const verbose = argv.verbose || false;

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const updatesDir = path.join(rootDir, 'content', 'docs', 'updates');

// Function to detect platforms in a file
function detectPlatforms(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const platforms: string[] = [];

  if (content.toLowerCase().includes('zoom')) {
    platforms.push('Zoom');
  }
  if (content.toLowerCase().includes('gmeet') || content.toLowerCase().includes('google meet')) {
    platforms.push('Gmeet');
  }
  if (content.toLowerCase().includes('teams') || content.toLowerCase().includes('microsoft teams')) {
    platforms.push('Teams');
  }

  return platforms;
}

// Function to update frontmatter for API files
function updateApiFrontmatter(filePath: string): void {
  const content = fs.readFileSync(filePath, 'utf-8');
  const platforms = detectPlatforms(filePath);
  
  // Create new frontmatter
  let newFrontmatter = `---
icon: Zap
service: production
`;

  if (platforms.length > 0) {
    newFrontmatter += `description: API - ${platforms.join(', ')} - Automatically generated documentation based on Git activity.
`;
  }

  // Extract content after frontmatter
  const contentMatch = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  const mainContent = contentMatch ? contentMatch[1] : content;

  // Write updated content
  fs.writeFileSync(filePath, `${newFrontmatter}---\n\n${mainContent}`);
}

// Read all MDX files in the updates directory
const files = fs
  .readdirSync(updatesDir)
  .filter(
    (file) =>
      file.endsWith('.mdx') &&
      file !== 'index.mdx' &&
      file !== 'meta.json' &&
      (!service || 
        (service === 'meeting-baas' ? file.startsWith('api-') : file.startsWith(`${service}-`))) &&
      (!date || file.includes(`-${date}.mdx`)),
  );

console.log(`Found ${files.length} files to enhance`);

// Process each file
for (const file of files) {
  try {
    // Extract service and date
    const match = file.match(/^([a-z-]+)-(\d{4}-\d{2}-\d{2})\.mdx$/);

    if (match) {
      const [_, service, date] = match;
      const filePath = path.join(updatesDir, file);
      
      console.log(`Processing ${file} - Service: ${service}, Date: ${date}`);

      // Special handling for API files
      if (service === 'api') {
        updateApiFrontmatter(filePath);
      }

      // Generate URLs for the file
      const fileBaseName = path.basename(file, '.mdx');
      const prodUrl = `https://docs.meetingbaas.com/updates/${fileBaseName}`;

      // Build the command
      const command = `pnpm enhance:updates --service=${service} --date=${date} --model=${model}${localDev ? ' --local' : ''}${verbose ? ' --verbose' : ''} --key=${apiKey}`;

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