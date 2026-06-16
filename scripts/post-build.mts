import { run as generateLLMContent } from './generate-llm-content.mjs';
import { generateAllUpdates } from './updates/generate-updates.mjs';
import { updateSearchIndexes } from './update-orama-index.mjs';
import { updateOramaAi } from './update-orama-ai.mjs';

async function postBuild() {
  try {
    console.log('Running post-build tasks...');

    // Sync the Orama Cloud search indexes first so search reflects the latest
    // build even if a later step fails. Both functions no-op when their Orama
    // env vars are not configured. The fulltext indexer reads the static.json
    // route body emitted by `next build`, so this must run after the build.
    await updateSearchIndexes();
    await updateOramaAi();

    await generateLLMContent();
    await generateAllUpdates();

    console.log('Post-build tasks completed successfully');
  } catch (error) {
    console.error('Error during post-build tasks:', error);
    process.exit(1);
  }
}

postBuild();
