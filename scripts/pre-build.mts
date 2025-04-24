import { generateDocs } from './generate-docs.mjs';
import { generateSDKUpdates } from './generate-sdk-updates.mjs';
import { generateSDKReference } from './generate-sdk-reference.mjs';
import { generateAPIUpdates } from './generate-api-updates.mjs';
import { generateLLMContent } from './generate-llm-content.mjs';

async function run() {
  // Generate API docs
  await generateDocs();
  
  // Generate SDK reference
  await generateSDKReference();
  
  // Generate LLM-optimized content
  await generateLLMContent();
}

run().catch(error => {
  console.error(error);
  process.exit(1);
});
