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
 * --model      Optional. Model to use (default: anthropic/claude-3-haiku-20240307)
 * --service    Optional. Service to enhance (e.g., api, sdk)
 * --date       Optional. Date to enhance (YYYY-MM-DD)
 * --all        Optional. Process all update files
 * --verbose    Optional. Enable verbose logging
 */

import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import fs from 'fs/promises';
import minimist from 'minimist';
import fetch from 'node-fetch';
import ora from 'ora';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import * as yaml from 'yaml';

// Parse command line arguments
const argv = minimist(process.argv.slice(2));

// Required parameters
const apiKey = argv.key;
if (!apiKey) {
  console.error('Error: API key is required (--key=your_api_key)');
  process.exit(1);
}

// Optional parameters
const service = argv.service;
const date = argv.date;
const processAll = argv.all;
const verbose = argv.verbose;

// Set default model
const model = argv.model || 'anthropic/claude-3-haiku-20240307';

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
    const serviceDir = service ? path.join(updatesDir, service) : updatesDir;

    const files: string[] = [];

    if (service) {
      // If service is specified, look only in that directory
      try {
        const entries = await fs.readdir(serviceDir, { withFileTypes: true });

        for (const entry of entries) {
          if (entry.isDirectory() && (date ? entry.name === date : true)) {
            const dateDir = path.join(serviceDir, entry.name);
            const dateEntries = await fs.readdir(dateDir, {
              withFileTypes: true,
            });

            for (const dateEntry of dateEntries) {
              if (dateEntry.isFile() && dateEntry.name.endsWith('.mdx')) {
                files.push(path.join(dateDir, dateEntry.name));
              }
            }
          } else if (entry.isFile() && entry.name.endsWith('.mdx')) {
            files.push(path.join(serviceDir, entry.name));
          }
        }
      } catch (error) {
        console.error(`Error reading directory ${serviceDir}:`, error);
      }
    } else {
      // If no service is specified, search all services
      try {
        const serviceEntries = await fs.readdir(updatesDir, {
          withFileTypes: true,
        });

        for (const serviceEntry of serviceEntries) {
          if (serviceEntry.isDirectory()) {
            const servDir = path.join(updatesDir, serviceEntry.name);
            const dateEntries = await fs.readdir(servDir, {
              withFileTypes: true,
            });

            for (const dateEntry of dateEntries) {
              if (
                dateEntry.isDirectory() &&
                (date ? dateEntry.name === date : true)
              ) {
                const dateDir = path.join(servDir, dateEntry.name);
                const fileEntries = await fs.readdir(dateDir, {
                  withFileTypes: true,
                });

                for (const fileEntry of fileEntries) {
                  if (fileEntry.isFile() && fileEntry.name.endsWith('.mdx')) {
                    files.push(path.join(dateDir, fileEntry.name));
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error reading directory ${updatesDir}:`, error);
      }
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

// Generate enhanced content using OpenRouter
async function generateEnhancedContent(
  content: string,
  serviceName: string,
): Promise<string> {
  spinner.text = `Enhancing content with OpenRouter (${model})`;

  const prompt = `
You are an expert technical writer for developer documentation. Your task is to enhance the following auto-generated change summary for the ${serviceName} service to make it more human-readable, properly formatted, and with better context.

Rules:
1. Keep all technical information intact
2. Use professional but conversational tone
3. Organize content logically
4. Break down complex changes into clear explanations
5. Maintain all MDX code components and syntax
6. Use proper Markdown formatting including headings, lists, and code blocks
7. Retain all references to components like <ServiceOperations> or <APIEndpoints>
8. Keep information about breaking changes prominent
9. Do not add fictional or assumed information
10. Preserve all links and references
11. Format code examples properly

Here is the original content to enhance:

${content}

Provide only the enhanced content in proper MDX format. Do not include explanations or meta-commentary about your changes.
`;

  try {
    // Use OpenRouter to send request to model
    const result = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://meeting-baas-docs.vercel.app/', // Use your actual site URL
          'X-Title': 'MeetingBaaS Docs',
        },
        body: JSON.stringify({
          model,
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
          max_tokens: 4000,
        }),
      },
    );

    if (!result.ok) {
      const errorText = await result.text();
      throw new Error(`OpenRouter API error: ${result.status} ${errorText}`);
    }

    const responseData = (await result.json()) as {
      choices: Array<{
        message: {
          content: string;
        };
      }>;
    };

    if (verbose) {
      console.log(JSON.stringify(responseData, null, 2));
    }

    return responseData.choices[0].message.content;
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

    // Determine service name from path
    const pathParts = filePath.split(path.sep);
    const serviceIndex = pathParts.indexOf('updates') + 1;
    const serviceName = pathParts[serviceIndex] || 'unknown';

    // Generate enhanced content
    const enhancedContent = await generateEnhancedContent(content, serviceName);

    // Reconstruct the MDX file
    const finalContent = `---
${yaml.stringify(frontmatter)}
---

${enhancedContent}`;

    // Write the enhanced content back to the file
    await fs.writeFile(filePath, finalContent, 'utf-8');

    spinner.succeed(`Enhanced ${path.basename(filePath)}`);
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
