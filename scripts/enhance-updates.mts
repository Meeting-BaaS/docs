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
 * --days       Optional. Number of days to include (default: 7)
 * --all        Optional. Process all update files
 * --untracked  Optional. Process only untracked update files
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

// Get model from environment variable
const model = process.env.PAGE_GENERATION_OPENROUTER_NAME;
if (!model) {
  console.error('Error: PAGE_GENERATION_OPENROUTER_NAME is required in .env file');
  process.exit(1);
}

// Log the model being used in green
console.log('\x1b[32m%s\x1b[0m', `Using model: ${model}`);

// Optional parameters
const service = argv.service === 'meeting-baas' ? 'api' : argv.service;
const date = argv.date;
const days = parseInt(argv.days || '7', 10);
const processAll = argv.all;
const verbose = argv.verbose;
const localDev = argv.local || false;
const untrackedOnly = argv.untracked || false;

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

// Function to get git status of files
async function getGitStatus(): Promise<Set<string>> {
  try {
    const { execSync } = await import('child_process');
    const output = execSync('git status --porcelain', { cwd: rootDir }).toString();
    const untrackedFiles = new Set<string>();
    
    output.split('\n').forEach(line => {
      if (line.startsWith('?? ')) {
        const filePath = line.slice(3).trim();
        if (filePath.startsWith('content/docs/updates/')) {
          untrackedFiles.add(filePath);
        }
      }
    });
    
    return untrackedFiles;
  } catch (error) {
    console.warn('Could not get git status:', error);
    return new Set();
  }
}

// Find update files based on criteria
async function findUpdateFiles(): Promise<string[]> {
  spinner.text = 'Finding update files';

  try {
    const files: string[] = [];
    let untrackedFiles: Set<string> = new Set();

    // Get untracked files if needed
    if (untrackedOnly) {
      spinner.text = 'Checking git status for untracked files';
      untrackedFiles = await getGitStatus();
      if (untrackedFiles.size === 0) {
        spinner.info('No untracked update files found');
        return [];
      }
      spinner.info(`Found ${untrackedFiles.size} untracked update files`);
    }

    // First, check for files with naming pattern [service]-[date].mdx directly in the updates directory
    try {
      const entries = await fs.readdir(updatesDir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.mdx')) {
          const filePath = path.join(updatesDir, entry.name);
          
          // Skip if we're only processing untracked files and this one is tracked
          if (untrackedOnly && !untrackedFiles.has(filePath.replace(rootDir + '/', ''))) {
            continue;
          }

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
                files.push(filePath);
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

    // Sort files by date (newest first)
    files.sort((a, b) => {
      const dateA = a.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '';
      const dateB = b.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '';
      return dateB.localeCompare(dateA);
    });

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

// Function to validate components in content
function validateComponentsInContent(
    content: string,
    availableComponents: string[],
): void {
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
}

// Define OpenRouter API response types
interface OpenRouterMessage {
  role: string;
  content: string;
}

interface OpenRouterChoice {
  message: OpenRouterMessage;
  finish_reason: string;
}

interface OpenRouterResponse {
  id: string;
  model: string;
  choices: OpenRouterChoice[];
}

// Function to analyze content and determine service type
async function analyzeContent(content: string, serviceName: string): Promise<{
  service: string;
  icon: string;
  platforms: string[];
  reasoning: string;
  affected_areas: string[];
}> {
  spinner.text = `Analyzing content for service determination`;

  if (!model) {
    throw new Error('Model name is required');
  }

  const analysisPrompt = `
You are an expert technical writer analyzing changes for documentation. Your task is to analyze the following content and determine if it should be an API or Production update.

${getPrompt('instructions', 'serviceSpecific')}

Here is the content to analyze:

${content}

Provide ONLY the JSON analysis in this exact format:
\`\`\`json
{
  "service": "api|production",
  "icon": "Webhook|Zap",
  "platforms": ["Zoom", "Google Meet", "Teams"],
  "reasoning": "Brief explanation of why this service type was chosen",
  "affected_areas": ["list", "of", "modified", "areas"]
}
\`\`\`
`;

  try {
    const result = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
        ...(localDev ? {} : {
          'HTTP-Referer': 'https://meeting-baas-docs.vercel.app/',
          'X-Title': 'MeetingBaaS Docs',
        }),
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical writer analyzing changes for documentation.',
          },
          {
            role: 'user',
            content: analysisPrompt,
          },
        ],
        temperature: 0.1,
      }),
    });

    if (!result.ok) {
      throw new Error(`OpenRouter API error: ${result.status}`);
    }

    const response = (await result.json()) as OpenRouterResponse;
    const analysisContent = response.choices?.[0]?.message?.content;
    if (!analysisContent) {
      throw new Error('No analysis content received from AI');
    }

    // Extract JSON from the response
    const jsonMatch = analysisContent.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error('Could not find JSON analysis in AI response');
    }

    return JSON.parse(jsonMatch[1]);
  } catch (error) {
    console.error('Error in content analysis:', error);
    // Return default values if analysis fails
    return {
      service: 'production',
      icon: 'Zap',
      platforms: [],
      reasoning: 'Default fallback due to analysis error',
      affected_areas: ['unknown'],
    };
  }
}

// Function to enhance content
async function enhanceContent(
  content: string,
  serviceName: string,
  analysis: {
    service: string;
    icon: string;
    platforms: string[];
    reasoning: string;
    affected_areas: string[];
  },
): Promise<string> {
  spinner.text = `Enhancing content with OpenRouter (${model})`;

  if (!model) {
    throw new Error('Model name is required');
  }

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

  const prompt = `
You are an expert technical writer for developer documentation. Your task is to enhance the following auto-generated change summary for the ${serviceName} service to make it more human-readable, properly formatted, and with better context.

Project information:
- Service being documented: ${serviceName}${contentStructure}
- Service type: ${analysis.service}
- Icon: ${analysis.icon}
- Platforms: ${analysis.platforms.join(', ')}
- Reasoning: ${analysis.reasoning}
- Affected areas: ${analysis.affected_areas.join(', ')}

${fumadocsComponents}

${enhanceInstructions}

${rules}

Here is the original content to enhance:

${content}

Provide only the enhanced content in proper MDX format. Do not include explanations or meta-commentary about your changes.

${serviceSpecific}`;

  try {
    const result = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        ...(localDev ? {} : {
          'HTTP-Referer': 'https://meeting-baas-docs.vercel.app/',
          'X-Title': 'MeetingBaaS Docs',
        }),
      },
        body: JSON.stringify({
        model,
          messages: [
            {
              role: 'system',
            content: 'You are an expert technical writer for developer documentation.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
        }),
    });

    if (!result.ok) {
      throw new Error(`OpenRouter API error: ${result.status}`);
    }

    const response = (await result.json()) as OpenRouterResponse;
    const enhancedContent = response.choices?.[0]?.message?.content;
    if (!enhancedContent) {
      throw new Error('No enhanced content received from AI');
    }

    // Validate the response
    if (availableComponents.length > 0) {
      validateComponentsInContent(enhancedContent, availableComponents);
    }

    return enhancedContent;
  } catch (error) {
    console.error('Error in content enhancement:', error);
    throw error;
  }
}

// Function to validate and fix React/MDX syntax
async function validateAndFixContent(content: string): Promise<string> {
  spinner.text = `Validating and fixing React/MDX syntax`;

  if (!model) {
    throw new Error('Model name is required');
  }

  const validationPrompt = `
You are an expert React/MDX syntax validator. Your task is to fix any React/MDX syntax errors in the following content.

IMPORTANT RULES:
1. Ensure all JSX tags are properly closed
2. Fix any mismatched tags (e.g., <Tab> must have </Tab>)
3. Ensure proper nesting of components (e.g., <Accordion> must be inside <Accordions>)
4. Fix any invalid component usage
5. Ensure proper spacing in lists and tabs
6. Fix any unescaped characters in code blocks
7. Ensure proper markdown formatting

Common issues to fix:
- Mismatched closing tags
- Improper component nesting
- Missing closing tags
- Invalid component usage
- Improper spacing in lists
- Unescaped characters in code blocks

Here is the content to validate and fix:

${content}

Provide ONLY the fixed content. Do not include explanations or meta-commentary.
`;

  try {
    const result = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        ...(localDev ? {} : {
          'HTTP-Referer': 'https://meeting-baas-docs.vercel.app/',
          'X-Title': 'MeetingBaaS Docs',
        }),
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: 'You are an expert React/MDX syntax validator.',
          },
          {
            role: 'user',
            content: validationPrompt,
          },
        ],
        temperature: 0.1, // Low temperature for consistent fixes
      }),
    });

    if (!result.ok) {
      throw new Error(`OpenRouter API error: ${result.status}`);
    }

    const response = (await result.json()) as OpenRouterResponse;
    const fixedContent = response.choices?.[0]?.message?.content;
    if (!fixedContent) {
      throw new Error('No fixed content received from AI');
    }

    return fixedContent;
  } catch (error) {
    console.error('Error in content validation:', error);
    return content; // Return original content if validation fails
  }
}

// Process a single update file
async function processUpdateFile(filePath: string): Promise<void> {
  const fileName = path.basename(filePath);
  spinner.text = `Processing ${fileName}`;

  try {
    // Read the file content
    const fileContent = await fs.readFile(filePath, 'utf-8');

    // Extract frontmatter and content
    const { frontmatter, content } = extractFrontmatter(fileContent);

    // Determine service name from path or filename
    const pathParts = filePath.split(path.sep);
    const filename = pathParts[pathParts.length - 1];
    const filenameMatch = filename.match(/^([^-]+)-/);
    let serviceName = filenameMatch?.[1] || 'unknown';

    spinner.info(`Processing ${fileName} (Service: ${serviceName})`);

    // First, analyze the content
    spinner.text = `Analyzing content for ${fileName}`;
    const analysis = await analyzeContent(content, serviceName);
    spinner.info(`Analysis for ${fileName}:
  Service: ${analysis.service}
  Icon: ${analysis.icon}
  Platforms: ${analysis.platforms.join(', ') || 'none'}
  Reasoning: ${analysis.reasoning}
  Affected_areas: ${analysis.affected_areas.join(', ')}`);

    // Update frontmatter based on analysis
    const updatedFrontmatter = {
      ...frontmatter,
      icon: analysis.icon,
      service: analysis.service,
      description: analysis.platforms.length > 0 ? analysis.platforms.join(', ') : '',
    };

    // Then enhance the content
    spinner.text = `Enhancing content for ${fileName}`;
    const enhancedContent = await enhanceContent(content, serviceName, analysis);

    // Finally, validate and fix any React/MDX syntax issues
    spinner.text = `Validating React/MDX syntax for ${fileName}`;
    const validatedContent = await validateAndFixContent(enhancedContent);

    // Reconstruct the MDX file with updated frontmatter
    const finalContent = `---
${yaml.stringify(updatedFrontmatter)}
---

${validatedContent}`;

    // Determine if we need to rename the file based on service type
    const dateMatch = filename.match(/\d{4}-\d{2}-\d{2}/);
    const date = dateMatch ? dateMatch[0] : '';
    const newServiceName = analysis.service === 'api' ? 'api' : 'production';
    const newFileName = `${newServiceName}-${date}.mdx`;
    const newFilePath = path.join(path.dirname(filePath), newFileName);

    // Only rename if the service type has changed
    if (filename !== newFileName) {
      spinner.info(`Renaming file from ${filename} to ${newFileName} to match service type`);
      // Write to new file first
      await fs.writeFile(newFilePath, finalContent, 'utf-8');
      // Then delete old file
      await fs.unlink(filePath);
      filePath = newFilePath;
    } else {
      // Just write to existing file
    await fs.writeFile(filePath, finalContent, 'utf-8');
    }

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
    spinner.fail(`Failed to process ${fileName}`);
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

    spinner.succeed(`Found ${files.length} files to enhance:`);
    files.forEach(file => {
      spinner.info(`  - ${path.basename(file)}`);
    });
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
