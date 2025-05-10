#!/usr/bin/env tsx

/**
 * This script enhances automatically generated update MDX files using AI
 * to make them more human-readable, properly formatted, and add context.
 *
 * Usage:
 * pnpm enhance:updates --key=your_api_key [options]
 *
 * Options:
 * --key        Required. OpenRouter API key
 * --model      Optional. Model to use (default: anthropic/claude-3-haiku)
 * --service    Optional. Service to enhance (e.g., api, sdk)
 * --date       Optional. Date to enhance (YYYY-MM-DD)
 * --days       Optional. Number of days to include (default: 90)
 * --all        Optional. Process all update files
 * --verbose    Optional. Enable verbose logging
 * --local      Optional. Enable local development mode
 */

import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import * as dotenv from 'dotenv';
import fs from 'fs/promises';
import minimist from 'minimist';
import fetch from 'node-fetch';
import ora from 'ora';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import * as yaml from 'yaml';
import { getPrompt, getCategoryPrompts } from './prompts';

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
const service = argv.service;
const date = argv.date;
const days = parseInt(argv.days || '90', 10);
const processAll = argv.all;
const verbose = argv.verbose;
const localDev = argv.local || false;

// Set default model
const model = argv.model || 'anthropic/claude-3-haiku';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const updatesDir = path.join(rootDir, 'content', 'docs', 'updates');

// Spinner for loading states
const spinner = ora('Initializing');

// Create OpenRouter client
const openrouter = createOpenRouter({
  apiKey,
  baseURL: 'https://openrouter.ai/api/v1',
});

// Log with verbose option
function log(message: string) {
  if (verbose) {
    spinner.stop();
    console.log(message);
    spinner.start();
  }
}

// Extract frontmatter from MDX content
function extractFrontmatter(content: string): {
  frontmatter: Record<string, any>;
  content: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, content };
  }

  const frontmatterStr = match[1];
  const restContent = match[2];

  try {
    const frontmatter = yaml.parse(frontmatterStr);
    return { frontmatter, content: restContent };
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return { frontmatter: {}, content };
  }
}

// Find update files based on criteria
async function findUpdateFiles(): Promise<string[]> {
  spinner.text = 'Finding update files';

  try {
    const files: string[] = [];

    // First, check for files with naming pattern [service]-[date].mdx directly in the updates directory
    try {
      const entries = await fs.readdir(updatesDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.mdx')) {
          // Check if filename matches the [service]-[date].mdx pattern
          const filenamePattern =
            service && date
              ? new RegExp(`^${service}-${date}\\.mdx$`)
              : service
                ? new RegExp(`^${service}-.*\\.mdx$`)
                : date
                  ? new RegExp(`^.*-${date}\\.mdx$`)
                  : null;

          if (!filenamePattern || filenamePattern.test(entry.name)) {
            // Extract date from filename (e.g., api-2025-05-02.mdx -> 2025-05-02)
            const dateMatch = entry.name.match(/\d{4}-\d{2}-\d{2}/);
            if (dateMatch) {
              const fileDate = new Date(dateMatch[0]);
              const now = new Date();
              const diffTime = Math.abs(now.getTime() - fileDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              // Only include files within the specified days range
              if (diffDays <= days) {
                files.push(path.join(updatesDir, entry.name));
                if (verbose) {
                  console.log(`Including file ${entry.name} (${diffDays} days old)`);
                }
              } else if (verbose) {
                console.log(`Skipping file ${entry.name} (${diffDays} days old)`);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${updatesDir}:`, error);
    }

    // If processAll is false and we have more than 1 file, take the most recent
    if (!processAll && files.length > 1) {
      // Get file stats and sort files by modification time (newest first)
      const fileStats = [];

      for (const file of files) {
        const stats = await fs.stat(file);
        fileStats.push({ file, mtime: stats.mtime.getTime() });
      }

      // Sort by modification time (newest first)
      fileStats.sort((a, b) => b.mtime - a.mtime);

      // Return just the most recent file
      return [fileStats[0].file];
    }

    return files;
  } catch (error) {
    console.error('Error finding update files:', error);
    return [];
  }
}

// Load available MDX components from app/mdx-components.tsx
async function getAvailableMDXComponents(): Promise<string[]> {
  try {
    const mdxComponentsPath = path.join(rootDir, 'app', 'mdx-components.tsx');
    const content = await fs.readFile(mdxComponentsPath, 'utf-8');

    // Extract component names from the file
    const components: string[] = [];

    // Extract imported components
    const importMatches = content.matchAll(/import\s+{([^}]+)}\s+from/g);
    for (const match of importMatches) {
      if (match[1]) {
        const importedComponents = match[1]
          .split(',')
          .map((comp) => comp.trim())
          .filter((comp) => comp && !comp.includes('as'));
        components.push(...importedComponents);
      }
    }

    // Extract components from useMDXComponents
    const returnObjMatch = content.match(/return\s+{([^}]+)}/s);
    if (returnObjMatch && returnObjMatch[1]) {
      const returnedComponents = returnObjMatch[1]
        .split(',')
        .map((comp) => comp.split(':')[0]?.trim())
        .filter(Boolean);
      components.push(...returnedComponents);
    }

    return [...new Set(components)]; // Remove duplicates
  } catch (error) {
    console.warn('Could not load MDX components:', error);
    return [];
  }
}

// Load available routes and content structure
async function getContentStructure(): Promise<string> {
  try {
    // Check if content/docs directory exists
    const contentPath = path.join(rootDir, 'content', 'docs');
    const contentExists = await fs
      .access(contentPath)
      .then(() => true)
      .catch(() => false);

    if (!contentExists) {
      return '';
    }

    // Get a list of top-level directories in content/docs
    const entries = await fs.readdir(contentPath, { withFileTypes: true });
    const directories = entries
      .filter((entry) => entry.isDirectory() && entry.name !== 'updates')
      .map((dir) => dir.name);

    return `\nProject content structure: ${directories.join(', ')}\n`;
  } catch (error) {
    console.warn('Could not load content structure:', error);
    return '';
  }
}

// Function to detect platforms in content
function detectPlatforms(content: string): string[] {
  const platforms: string[] = [];
  const contentLower = content.toLowerCase();

  if (contentLower.includes('zoom')) {
    platforms.push('Zoom');
  }
  if (contentLower.includes('gmeet') || contentLower.includes('google meet')) {
    platforms.push('Google Meet');
  }
  if (contentLower.includes('teams') || contentLower.includes('microsoft teams')) {
    platforms.push('Teams');
  }

  return platforms;
}

// Function to validate and format header
function validateAndFormatHeader(frontmatter: Record<string, any>, content: string): Record<string, any> {
  const platforms = detectPlatforms(content);
  const platformsStr = platforms.length > 0 ? ` - ${platforms.join(', ')}` : '';
  
  // Ensure date is in correct format
  const date = new Date(frontmatter.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Update frontmatter
  return {
    ...frontmatter,
    title: formattedDate,
    date: formattedDate,
    description: `${frontmatter.description}${platformsStr}`,
  };
}

// Generate enhanced content using OpenRouter
async function generateEnhancedContent(
  content: string,
  serviceName: string,
): Promise<string> {
  spinner.text = `Enhancing content with OpenRouter (${model})`;

  // Get available MDX components
  const availableComponents = await getAvailableMDXComponents();
  const componentsStr =
    availableComponents.length > 0
      ? `\nAvailable MDX components: ${availableComponents.join(', ')}\n`
      : '';

  // Get content structure
  const contentStructure = await getContentStructure();

  // Get prompts from our prompts file
  const fumadocsComponents = getPrompt('codingStyle', 'fumadocsComponents');
  const enhanceInstructions = getPrompt('instructions', 'enhanceUpdates');
  const rules = getPrompt('instructions', 'rules');
  const serviceSpecific = getPrompt('instructions', 'serviceSpecific');

  // Template prompts for future use or reference
  const updateHeader = getPrompt('templates', 'updateHeader');
  const updateFooter = getPrompt('templates', 'updateFooter');
  const codeBlock = getPrompt('formatting', 'codeBlock');
  const table = getPrompt('formatting', 'table');

  const prompt = `
You are an expert technical writer for developer documentation. Your task is to enhance the following auto-generated change summary for the ${serviceName} service to make it more human-readable, properly formatted, and with better context.

Project information:
- Service being documented: ${serviceName}${contentStructure}
WARNING: if the serviceName is api, you might want to change it to production with the icon Bolt IF IT DOES NOT AFFECT THE PUBLIC API, which is most cases. 

${fumadocsComponents}

${enhanceInstructions}

${rules}

Here is the original content to enhance:

${content}

Provide only the enhanced content in proper MDX format. Do not include explanations or meta-commentary about your changes.

${serviceSpecific}`;

  // Log the prompt to a temporary file
  const tmpDir = path.join(rootDir, 'tmp');
  await fs.mkdir(tmpDir, { recursive: true });
  const tmpFile = path.join(tmpDir, `${serviceName}-prompt.txt`);
  await fs.writeFile(tmpFile, prompt, 'utf-8');
  if (verbose) {
    spinner.info(`Prompt logged to: ${tmpFile}`);
  }

  // After getting the AI response, validate the content
  const validateComponentsInContent = (
    content: string,
    availableComponents: string[],
  ): void => {
    // Find all custom component tags in the content
    const componentRegex = /<([A-Z][a-zA-Z]*)[^>]*>/g;
    const matches = [...content.matchAll(componentRegex)];

    // Extract the component names
    const usedComponents = matches.map((match) => match[1]);

    // Always allow Tabs component since it's an alias in our setup
    const allowedComponents = [...availableComponents, 'Tabs', 'CustomTabs'];

    // Filter to only components not in the available list
    const invalidComponents = usedComponents.filter(
      (comp) => comp && !allowedComponents.includes(comp),
    );

    // Crash if invalid components are found
    if (invalidComponents.length > 0) {
      throw new Error(
        `Error: Generated content contains components that are not available: ${invalidComponents.join(', ')}. ` +
          `Available components are: ${allowedComponents.join(', ')}`,
      );
    }
  };

  try {
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    // Add optional headers (only if not in local development mode)
    if (!localDev) {
      headers['HTTP-Referer'] = 'https://meeting-baas-docs.vercel.app/';
      headers['X-Title'] = 'MeetingBaaS Docs';
    }

    // Use OpenRouter to send request to model
    const result = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'system',
              content:
                'You are an expert technical writer for developer documentation.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 4000,
        }),
      },
    );

    if (!result.ok) {
      const errorText = await result.text();
      throw new Error(`OpenRouter API error: ${result.status} ${errorText}`);
    }

    // Define type for OpenRouter API response
    interface OpenRouterResponse {
      id?: string;
      model?: string;
      choices?: Array<{
        message?: {
          content?: string;
          role?: string;
        };
        delta?: {
          content?: string;
          role?: string;
        };
        finish_reason?: string;
        error?: {
          message: string;
          code?: number;
        };
      }>;
      error?: {
        message: string;
        code: number;
      };
    }

    const responseData = (await result.json()) as OpenRouterResponse;

    // Always log the response structure in case of issues
    if (verbose) {
      console.log('Full Response:', JSON.stringify(responseData, null, 2));
    } else {
      // Log minimal response info even without verbose flag
      console.log(
        `Response status: ${result.status}, Model: ${responseData.model || 'unknown'}`,
      );
    }

    // Check for API error responses
    if (responseData.error) {
      console.error('API Error:', responseData.error);
      throw new Error(
        `OpenRouter API error: ${responseData.error.message || 'Unknown error'}`,
      );
    }

    // Add more robust error handling for the response structure
    if (!responseData.choices || responseData.choices.length === 0) {
      console.error(
        'Full response data:',
        JSON.stringify(responseData, null, 2),
      );
      throw new Error('Empty response from OpenRouter API');
    }

    // Handle the response format according to OpenRouter's structure
    const choice = responseData.choices[0];

    if (choice.error) {
      console.error('Choice error:', choice.error);
      throw new Error(`Error in model response: ${choice.error.message}`);
    }

    // Extract content from the response based on OpenRouter's format
    const contentFromAI =
      choice.message?.content ?? choice.delta?.content ?? null;

    if (!contentFromAI) {
      console.error('First choice data:', JSON.stringify(choice, null, 2));
      throw new Error('No content found in the model response');
    }

    // Validate the response
    if (availableComponents.length > 0) {
      validateComponentsInContent(contentFromAI, availableComponents);
    }

    return contentFromAI;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
}

// Process a single update file
async function processUpdateFile(filePath: string): Promise<void> {
  spinner.text = `Processing ${path.basename(filePath)}`;

  try {
    // Read the file content
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Extract frontmatter and content
    const { frontmatter, content } = extractFrontmatter(fileContent);

    // Validate and format header
    const updatedFrontmatter = validateAndFormatHeader(frontmatter, content);

    // Determine service name from path or filename
    const pathParts = filePath.split(path.sep);
    const filename = pathParts[pathParts.length - 1];

    // Check if filename follows [service]-[date].mdx pattern
    const filenameMatch = filename.match(/^([^-]+)-/);

    let serviceName = 'unknown';
    if (filenameMatch && filenameMatch[1]) {
      serviceName = filenameMatch[1];
    } else {
      const serviceIndex = pathParts.indexOf('updates') + 1;
      if (serviceIndex < pathParts.length) {
        serviceName = pathParts[serviceIndex];
      }
    }

    // Generate enhanced content
    const enhancedContent = await generateEnhancedContent(content, serviceName);

    // Reconstruct the MDX file with updated frontmatter
    const finalContent = `---
${yaml.stringify(updatedFrontmatter)}
---

${enhancedContent}`;

    // Write the enhanced content back to the file
    await fs.writeFile(filePath, finalContent, 'utf-8');

    // Generate URLs for the file
    const fileBaseName = path.basename(filePath, '.mdx');
    const localUrl = `http://localhost:3000/docs/updates/${fileBaseName}`;
    const prodUrl = `https://meeting-baas-docs.vercel.app/docs/updates/${fileBaseName}`;

    spinner.succeed(`Enhanced ${path.basename(filePath)}`);
    spinner.info(`URLs: 
  Local: ${localUrl}
  Prod:  ${prodUrl}`);
    spinner.start();
  } catch (error) {
    spinner.fail(`Failed to process ${path.basename(filePath)}`);
    console.error(`Error processing file ${filePath}:`, error);
  }
}

// Main function
async function main() {
  spinner.start('Starting enhancement process');

  try {
    // Find files to process
    const files = await findUpdateFiles();

    if (files.length === 0) {
      spinner.fail('No update files found matching criteria');
      return;
    }

    spinner.succeed(`Found ${files.length} files to enhance`);
    spinner.start();

    // Process each file
    for (const file of files) {
      await processUpdateFile(file);
    }

    spinner.succeed(`Enhanced ${files.length} update files`);
  } catch (error) {
    spinner.fail('Enhancement process failed');
    console.error('Error in enhancement process:', error);
  }
}

// Run the script
main().catch(console.error);
