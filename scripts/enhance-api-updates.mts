#!/usr/bin/env tsx

/**
 * This script enhances API update MDX files by detecting platform mentions
 * and updating frontmatter with appropriate descriptions.
 *
 * Usage:
 * pnpm enhance:api-updates [options]
 *
 * Options:
 * --model      Optional. Model to use (default: anthropic/claude-3.5-haiku:beta)
 * --all        Optional. Process all API files (default: only untracked files)
 * --verbose    Optional. Enable verbose logging
 */

import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import fs from 'fs/promises';
import minimist from 'minimist';
import fetch from 'node-fetch';
import ora from 'ora';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import * as yaml from 'yaml';

// Load environment variables
dotenv.config();

// Parse command line arguments
const argv = minimist(process.argv.slice(2));

// Get API key from environment variable
const apiKey = process.env.OPENROUTER_API_KEY;
if (!apiKey) {
  console.error(
    'Error: API key is required. Set OPENROUTER_API_KEY in .env file',
  );
  process.exit(1);
}

// Optional parameters
const processAll = argv.all || false;
const verbose = argv.verbose || false;

// Set default model
const model = argv.model || 'anthropic/claude-3.5-haiku:beta';

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const updatesDir = path.join(rootDir, 'content', 'docs', 'updates');

// Spinner for loading states
const spinner = ora('Initializing');

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

// Find API update files that need processing
async function findApiUpdateFiles(): Promise<string[]> {
  spinner.text = 'Finding API update files';

  try {
    let files: string[] = [];

    // Get all API update files with .mdx extension
    const entries = await fs.readdir(updatesDir, { withFileTypes: true });

    const apiFiles = entries
      .filter(
        (entry) =>
          entry.isFile() &&
          entry.name.endsWith('.mdx') &&
          entry.name.startsWith('api-'),
      )
      .map((entry) => path.join(updatesDir, entry.name));

    // If we want all files, return them
    if (processAll) {
      return apiFiles;
    }

    // Otherwise, get only untracked files from Git
    try {
      const gitOutput = execSync('git ls-files --others --exclude-standard', {
        cwd: rootDir,
        encoding: 'utf-8',
      });

      const untrackedFiles = gitOutput
        .split('\n')
        .filter(
          (file) =>
            file.includes('content/docs/updates/api-') && file.endsWith('.mdx'),
        )
        .map((file) => path.join(rootDir, file));

      files = untrackedFiles;

      if (files.length === 0) {
        console.log(
          'No untracked API update files found. Use --all to process all API files.',
        );
      }
    } catch (error) {
      console.error('Error getting untracked files from Git:', error);
      // Fallback to processing all files if Git command fails
      return apiFiles;
    }

    return files;
  } catch (error) {
    console.error('Error finding API update files:', error);
    return [];
  }
}

// Detect platform mentions in content using AI
async function enhanceApiUpdate(
  filePath: string,
  content: string,
  frontmatter: Record<string, any>,
): Promise<{
  updatedFrontmatter: Record<string, any>;
  enhancedContent: string;
}> {
  spinner.text = `Enhancing API update ${path.basename(filePath)} with OpenRouter (${model})`;

  // Create the prompt for platform detection and content enhancement
  const prompt = `
You are an expert technical writer for developer documentation. Your task is to analyze this API update document, detect mentioned platforms, and enhance the content for better readability.

First, analyze the content to identify if any of these platforms are mentioned:
- Zoom
- Gmeet (or Google Meet)
- Teams (or Microsoft Teams)

Then, determine if this update primarily focuses on backend infrastructure changes or if it directly impacts the public API that developers use.

Here is the content to analyze:

${content}

Please provide your response in this format:
1. A comma-separated list of detected platforms (e.g., "Zoom, Teams" or "none" if none are detected)
2. A determination of whether this is primarily an internal infrastructure update (true/false)
3. Enhanced content with better spacing, formatting, and organization

For the enhanced content:
- Add appropriate line breaks between list items
- Format tabs and accordions properly
- Ensure consistent indentation
- Break up long runs of text
- Improve readability while maintaining all technical information
`;

  try {
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://meeting-baas-docs.vercel.app/',
      'X-Title': 'MeetingBaaS Docs',
    };

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
    const responseContent =
      choice.message?.content ?? choice.delta?.content ?? null;

    if (!responseContent) {
      console.error('First choice data:', JSON.stringify(choice, null, 2));
      throw new Error('No content found in the model response');
    }

    // Parse the AI response to extract platforms, infrastructure flag, and enhanced content
    const lines = responseContent.split('\n');

    // Extract detected platforms
    let detectedPlatforms = 'none';
    let isInfrastructureUpdate = false;
    let startContentIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Look for platform list (typically first non-empty line)
      if ((line && !detectedPlatforms) || detectedPlatforms === 'none') {
        if (line.match(/^(zoom|gmeet|teams|none|,)/i)) {
          detectedPlatforms = line;
          continue;
        }
      }

      // Look for infrastructure determination (usually the second data point)
      if (line.match(/^(true|false)$/i)) {
        isInfrastructureUpdate = line.toLowerCase() === 'true';
        startContentIndex = i + 1;
        break;
      }

      // If we find a markdown header, assume content has started
      if (line.startsWith('#')) {
        startContentIndex = i;
        break;
      }
    }

    // Get the enhanced content (everything after the detected data points)
    const enhancedContent = lines.slice(startContentIndex).join('\n');

    // Update frontmatter based on detected information
    const updatedFrontmatter = { ...frontmatter };

    // Change icon to Zap and service to production for internal infrastructure updates
    if (isInfrastructureUpdate) {
      updatedFrontmatter.icon = 'Zap';
      updatedFrontmatter.service = 'production';
    }

    // Add platform information to description if platforms were detected
    if (detectedPlatforms && detectedPlatforms !== 'none') {
      const platforms = detectedPlatforms
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p !== 'none' && p !== '');

      if (platforms.length > 0) {
        // If there's an existing description, append to it; otherwise create a new one
        const platformList = platforms.join(', ');
        if (updatedFrontmatter.description) {
          updatedFrontmatter.description += ` (${platformList})`;
        } else {
          updatedFrontmatter.description = `API updates for ${platformList}`;
        }
      }
    }

    return {
      updatedFrontmatter,
      enhancedContent,
    };
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw error;
  }
}

// Process a single API update file
async function processApiUpdateFile(filePath: string): Promise<void> {
  spinner.text = `Processing ${path.basename(filePath)}`;

  try {
    // Read the file content
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Extract frontmatter and content
    const { frontmatter, content } = extractFrontmatter(fileContent);

    // Enhance the API update with AI
    const { updatedFrontmatter, enhancedContent } = await enhanceApiUpdate(
      filePath,
      content,
      frontmatter,
    );

    // Reconstruct the MDX file
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
  spinner.start('Starting API update enhancement process');

  try {
    // Find API files to process
    const files = await findApiUpdateFiles();

    if (files.length === 0) {
      spinner.fail('No API update files found matching criteria');
      return;
    }

    spinner.succeed(`Found ${files.length} API files to enhance`);
    spinner.start();

    // Process each file
    for (const file of files) {
      await processApiUpdateFile(file);
    }

    spinner.succeed(`Enhanced ${files.length} API update files`);
  } catch (error) {
    spinner.fail('Enhancement process failed');
    console.error('Error in enhancement process:', error);
  }
}

// Run the script
main().catch(console.error);
