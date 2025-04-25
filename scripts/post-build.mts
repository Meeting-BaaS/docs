import { run as generateLLMContent } from './generate-llm-content.mjs';
import { generateAllUpdates } from './updates/generate-updates.mjs';

async function postBuild() {
  try {
    console.log('Running post-build tasks...');

    // First generate LLM content
    await generateLLMContent();

    // Then generate updates based on that content
    await generateAllUpdates();

    console.log('Post-build tasks completed successfully');
  } catch (error) {
    console.error('Error during post-build tasks:', error);
    process.exit(1);
  }
}

postBuild();
