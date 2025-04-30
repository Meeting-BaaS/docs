import { execSync } from 'child_process';

/**
 * Main function to run all update generators
 */
async function generateAllUpdates(): Promise<void> {
  console.log('Running all update generators...');

  try {
    // Run the standard updates generator
    console.log('Running service updates generator...');
    execSync('tsx ./scripts/updates/generate-updates.mts', {
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Error running service updates generator:', error);
  }

  try {
    // Run the git diff updates generator
    console.log('Running git diff updates generator...');
    execSync('tsx ./scripts/updates/generate-git-diff-updates.mts', {
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Error running git diff updates generator:', error);
  }

  console.log('All update generators completed.');
}

// Run the function when this module is executed directly
if (import.meta.url.endsWith(process.argv[1].split('/').pop() || '')) {
  generateAllUpdates().catch((error) => {
    console.error('Error generating all updates:', error);
    process.exit(1);
  });
}
