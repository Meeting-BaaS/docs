#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting cleanup process...');

// Constants
const UPDATES_DIR = 'content/docs/updates';
const META_JSON_PATH = `${UPDATES_DIR}/meta.json`;
const EXCLUDED_FILES = [
  'content/docs/mcp-servers/updates/index.mdx', // Keep this file
  `${UPDATES_DIR}/index.mdx`, // Keep main index
];

// Get all update-related files in the updates directory
function getUpdateFiles() {
  try {
    // Get all files in the updates directory
    const files = fs
      .readdirSync(UPDATES_DIR)
      .filter((file) => file.endsWith('.mdx') && !file.includes('index'))
      .map((file) => path.join(UPDATES_DIR, file));

    console.log(`Found ${files.length} update files`);
    return files;
  } catch (error) {
    console.error(`Error reading updates directory: ${error.message}`);
    return [];
  }
}

// Get any other update-related artifacts in the repo
function getServiceArtifacts() {
  // Get all untracked files related to services
  try {
    const untrackedFiles = execSync('git ls-files --others --exclude-standard')
      .toString()
      .trim()
      .split('\n')
      .filter(Boolean);

    // Filter to keep only service-related files (personas, reference, etc.)
    const serviceArtifacts = untrackedFiles.filter(
      (file) => file.includes('reference/') || file.includes('personas/'),
    );

    console.log(`Found ${serviceArtifacts.length} service artifacts`);
    return serviceArtifacts;
  } catch (error) {
    console.error(`Error getting untracked files: ${error.message}`);
    return [];
  }
}

// Find all modified files that should be reverted
function getModifiedFiles() {
  try {
    // Get all modified files excluding the ones we want to keep
    const allModified = execSync('git diff --name-only')
      .toString()
      .trim()
      .split('\n')
      .filter(Boolean)
      .filter((file) => !EXCLUDED_FILES.includes(file));

    console.log(`Found ${allModified.length} modified files`);
    return allModified;
  } catch (error) {
    console.error(`Error getting modified files: ${error.message}`);
    return [];
  }
}

// Restore meta.json to only have the index page
function resetMetaJson() {
  try {
    if (fs.existsSync(META_JSON_PATH)) {
      console.log('Resetting meta.json to only include index page');

      // Read the current meta.json
      const metaJson = JSON.parse(fs.readFileSync(META_JSON_PATH, 'utf8'));

      // Reset the pages array to only include index
      metaJson.pages = ['index'];

      // Write the updated meta.json back to the file
      fs.writeFileSync(META_JSON_PATH, JSON.stringify(metaJson, null, 2));
    }
  } catch (error) {
    console.error(`Error resetting meta.json: ${error.message}`);
  }
}

try {
  // 1. Get all files that need to be cleaned or restored
  const updateFiles = getUpdateFiles();
  const serviceArtifacts = getServiceArtifacts();
  const modifiedFiles = getModifiedFiles();

  // 2. Revert changes to modified files
  if (modifiedFiles.length > 0) {
    console.log('Restoring modified files:');
    modifiedFiles.forEach((file) => console.log(`- ${file}`));
    execSync(`git restore ${modifiedFiles.join(' ')}`, { stdio: 'inherit' });
  }

  // 3. Handle speaking-bots-openapi.json separately (in case we want to keep it)
  const keepOpenapiChanges = process.argv.includes('--keep-openapi');
  if (!keepOpenapiChanges && fs.existsSync('speaking-bots-openapi.json')) {
    console.log('Restoring speaking-bots-openapi.json');
    execSync('git restore speaking-bots-openapi.json', { stdio: 'inherit' });
  } else if (keepOpenapiChanges) {
    console.log('Keeping changes to speaking-bots-openapi.json');
  }

  // 4. Remove update files
  if (updateFiles.length > 0) {
    console.log('Removing update files:');
    updateFiles.forEach((file) => console.log(`- ${file}`));
    updateFiles.forEach((file) => {
      try {
        fs.unlinkSync(file);
      } catch (err) {
        console.error(`Error removing ${file}: ${err.message}`);
      }
    });
  }

  // 5. Remove service artifacts
  if (serviceArtifacts.length > 0) {
    console.log('Removing service artifacts:');
    serviceArtifacts.forEach((file) => console.log(`- ${file}`));
    execSync(`git clean -fd ${serviceArtifacts.join(' ')}`, {
      stdio: 'inherit',
    });
  }

  // 6. Reset meta.json
  resetMetaJson();

  console.log('Cleanup completed successfully!');
} catch (error) {
  console.error('Error during cleanup:', error.message);
  process.exit(1);
}
