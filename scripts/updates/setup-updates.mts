#!/usr/bin/env tsx

// Directly import directly from the files like other modules do
import { cleanGitUpdates } from './clean-git-updates.mjs';
import { generateGitDiffUpdates } from './generate-git-diff-updates.mjs';

/**
 * Setup updates - clean existing git updates and regenerate them
 */
async function setupUpdates(): Promise<void> {
  console.log('Setting up updates...');

  // First clean up existing git updates
  cleanGitUpdates();

  // Then regenerate updates
  try {
    const generatedPages = await generateGitDiffUpdates();
    console.log(`Generated ${generatedPages.length} update pages`);
  } catch (error) {
    console.error('Error generating git diff updates:', error);
  }

  console.log('Updates setup complete!');
}

// Run the function automatically when this module is executed directly
if (import.meta.url.endsWith(process.argv[1])) {
  setupUpdates().catch((error) => {
    console.error('Error setting up updates:', error);
    process.exit(1);
  });
}

export { setupUpdates };
