import { run as generateLLMContent } from './generate-llm-content.mjs';

async function postBuild() {
  try {
    console.log('Running post-build tasks...');

    await generateLLMContent();

    console.log('Post-build tasks completed successfully');
  } catch (error) {
    console.error('Error during post-build tasks:', error);
    process.exit(1);
  }
}

postBuild();
