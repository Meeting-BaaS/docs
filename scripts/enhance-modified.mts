import { execSync } from 'child_process';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
dotenv.config({ path: resolve(process.cwd(), '.env') });

interface EnhanceOptions {
  key?: string;
  service?: string;
  verbose?: boolean;
  model?: string;
}

async function getModifiedFiles(service?: string): Promise<string[]> {
  try {
    // Get modified and untracked files
    const gitStatus = execSync('git status --porcelain').toString();
    const files = gitStatus
      .split('\n')
      .filter(Boolean)
      .map(line => {
        // Handle both modified (M) and untracked (??) files
        const parts = line.trim().split(' ');
        return parts[parts.length - 1]; // Get the last part which is the file path
      })
      .filter((file): file is string => {
        if (!file) return false;
        // Only include MDX files in the updates directory
        if (!file.endsWith('.mdx')) return false;
        if (!file.includes('/updates/')) return false;
        // If service is specified, only include files for that service
        if (service) {
          if (service === 'meeting-baas') {
            return file.startsWith('content/docs/updates/api-');
          }
          return file.startsWith(`content/docs/updates/${service}-`);
        }
        return true;
      });

    return files;
  } catch (error) {
    console.error('Error getting modified files:', error);
    return [];
  }
}

async function main() {
  const args = process.argv.slice(2);
  const options: EnhanceOptions = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--key' && args[i + 1]) {
      options.key = args[++i];
    } else if (arg === '--service' && args[i + 1]) {
      options.service = args[++i];
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (arg === '--model' && args[i + 1]) {
      options.model = args[++i];
    }
  }

  // Get OpenAI key
  const key = options.key || process.env.OPENROUTER_API_KEY;
  if (!key) {
    console.error('Error: OpenRouter API key is required');
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

  // Get modified files
  const files = await getModifiedFiles(options.service);
  if (files.length === 0) {
    console.log('No modified files found to enhance');
    process.exit(0);
  }

  console.log(`Found ${files.length} files to enhance:`);
  files.forEach(file => console.log(`- ${file}`));

  // Enhance each file
  for (const file of files) {
    console.log(`\nEnhancing ${file}...`);
    try {
      // Extract date from filename (e.g., api-2025-05-02.mdx -> 2025-05-02)
      const dateMatch = file.match(/\d{4}-\d{2}-\d{2}/);
      const date = dateMatch ? dateMatch[0] : null;

      // Build the command with all arguments
      const enhanceArgs = [
        '--key', key,
        '--service', options.service || 'api',
        ...(date ? ['--date', date] : []),
        '--all',
        ...(options.verbose ? ['--verbose'] : []),
      ];

      // Log the command being executed
      console.log(`Running: pnpm enhance:updates ${enhanceArgs.join(' ')}`);
      
      // Execute the command
      execSync(`pnpm enhance:updates ${enhanceArgs.join(' ')}`, { stdio: 'inherit' });
      console.log(`Successfully enhanced ${file}`);
    } catch (error) {
      console.error(`Error enhancing ${file}:`, error);
    }
  }

  console.log('\nEnhancement complete!');
}

main().catch(console.error); 