import { execSync } from 'child_process';

// Files to keep changes (don't revert)
const KEEP_CHANGES = ['speaking-bots-openapi.json'];

// Cleanup function
function cleanupTestChanges() {
  console.log('Cleaning up test changes...');

  try {
    // 1. Remove untracked files and directories
    console.log('Removing untracked files and directories...');
    execSync(
      'git clean -fd content/docs/speaking-bots/reference/personas/ content/docs/updates/speaking-bots-2025-04-25.mdx',
      {
        stdio: 'inherit',
      },
    );

    // 2. Get list of modified files
    const modifiedFiles = execSync('git diff --name-only')
      .toString()
      .trim()
      .split('\n')
      .filter((file) => file && !KEEP_CHANGES.includes(file));

    // 3. Restore modified files (except those in KEEP_CHANGES)
    if (modifiedFiles.length > 0) {
      console.log(
        'Restoring modified files (keeping changes to speaking-bots-openapi.json)...',
      );
      execSync(`git restore ${modifiedFiles.join(' ')}`, {
        stdio: 'inherit',
      });
    } else {
      console.log('No modified files to restore.');
    }

    console.log('Cleanup complete!');
  } catch (error) {
    console.error('Error during cleanup:', error.message);
    process.exit(1);
  }
}

// Run cleanup
cleanupTestChanges();
