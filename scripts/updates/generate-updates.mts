import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { pathToFileURL } from 'url';
import * as constants from './constants';
import * as generators from './generators';
import * as utils from './utils';

// Extract what we need from the constants module
const {
  SERVICES,
  CURRENT_DATE,
  UPDATES_DIR,
  META_JSON_PATH,
  LLM_CONTENT_DIR,
  API_REF_PATH,
  PACKAGE_JSON_PATH,
} = constants;

/**
 * Main function to generate updates for all configured services
 */
export async function generateAllUpdates(): Promise<void> {
  console.log('Generating updates for all services...');

  // Get the actual objects from the default exports
  const generatorsObj =
    'default' in generators ? (generators as any).default : generators;
  const utilsObj = 'default' in utils ? (utils as any).default : utils;

  // Generate updates for all services in parallel
  const generateServiceUpdate = generatorsObj.generateServiceUpdate;
  const updatePromises = SERVICES.map(
    (service: import('./types').ServiceConfig) =>
      generateServiceUpdate(service),
  );
  const updateResults = await Promise.all(updatePromises);

  // Filter out null results and get the generated update filenames
  const generatedUpdates = updateResults.filter(Boolean) as string[];

  // Update meta.json with new pages if any updates were generated
  if (generatedUpdates.length > 0) {
    await utilsObj.updateMetaJson(generatedUpdates);
    console.log(`Generated ${generatedUpdates.length} update pages`);

    // Explicitly add meta.json to git
    try {
      const metaJsonPath = join(UPDATES_DIR, 'meta.json');
      if (existsSync(metaJsonPath)) {
        execSync(`git add "${metaJsonPath}"`);
        console.log(`Added meta.json to git: ${metaJsonPath}`);
      }
    } catch (error) {
      console.error('Error adding meta.json to git:', error);
    }
  } else {
    console.log('No updates generated');
  }
}

/**
 * Generate SDK updates based on package.json version
 */
export async function generateSDKUpdates(): Promise<string | null> {
  try {
    // Read SDK version from package.json
    const packageJsonPath = join(process.cwd(), PACKAGE_JSON_PATH);
    if (!existsSync(packageJsonPath)) {
      console.log('No package.json found, skipping SDK updates');
      return null;
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const sdkVersion =
      packageJson.dependencies?.['@meeting-baas/sdk']?.replace('^', '') || null;

    if (!sdkVersion) {
      console.log('No SDK version found in package.json');
      return null;
    }

    // Get generators object for calling the function
    const generatorsObj =
      'default' in generators ? (generators as any).default : generators;
    const generateServiceUpdate = generatorsObj.generateServiceUpdate;

    // Use common function for SDK updates
    return generateServiceUpdate({
      name: `TypeScript SDK ${sdkVersion}`,
      dirPattern: 'content/docs/typescript-sdk/',
      icon: 'Code',
      serviceKey: `sdk-update-${sdkVersion.replace(/\./g, '-')}`,
      additionalTags: ['sdk', 'typescript', 'release'],
    });
  } catch (error) {
    console.error('Failed to generate SDK updates:', error);
    return null;
  }
}

/**
 * Generate Speaking Bots updates
 */
export async function generateSpeakingBotsUpdates(): Promise<string | null> {
  // Get generators object for calling the function
  const generatorsObj =
    'default' in generators ? (generators as any).default : generators;
  const generateServiceUpdate = generatorsObj.generateServiceUpdate;

  return generateServiceUpdate({
    name: 'Speaking Bots',
    dirPattern: 'content/docs/speaking-bots/',
    icon: 'Brain',
    serviceKey: 'speaking-bots',
    openapiFile: 'speaking-bots-openapi.json',
    additionalTags: ['bots', 'persona'],
  });
}

/**
 * Generate MCP Servers updates
 */
export async function generateMCPServersUpdates(): Promise<string | null> {
  // Get generators object for calling the function
  const generatorsObj =
    'default' in generators ? (generators as any).default : generators;
  const generateServiceUpdate = generatorsObj.generateServiceUpdate;

  return generateServiceUpdate({
    name: 'MCP Servers',
    dirPattern: 'content/docs/mcp-servers/',
    icon: 'Server',
    serviceKey: 'mcp-servers',
    additionalTags: ['mcp', 'server'],
  });
}

// Check if run directly
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  generateAllUpdates().catch((error) => {
    console.error('Error generating updates:', error);
    process.exit(1);
  });
}

/**
 * Helper function to add untracked files and the new update file to git
 */
function addToGit(
  config: import('./types').ServiceConfig,
  updateFilename: string,
): string {
  const updateFilePath = join(UPDATES_DIR, updateFilename);
  const allChanges = [config.dirPattern, updateFilePath];
  const modified = execSync(`git ls-files --modified`).toString().split('\n');

  // Add untracked files and the new update file to git
  try {
    // Add all untracked files related to this service
    if (allChanges.some((file) => !modified.includes(file))) {
      console.log(`Adding untracked files for ${config.name} to git...`);

      // First, try to add directories with -A flag to handle nested files
      try {
        execSync(`git add -A "${config.dirPattern}"`);
        console.log(
          `  - Added directory with all contents: ${config.dirPattern}`,
        );
      } catch (dirError) {
        console.error(
          `  - Failed to add directory: ${config.dirPattern}`,
          dirError,
        );

        // If directory add fails, try individual files
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
