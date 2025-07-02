import { generateDocs } from './generate-docs.mjs';
import { generateSDKUpdates } from './generate-sdk-updates.mjs';
import { generateAPIUpdates } from './generate-api-updates.mjs';
import { generateLlmConfig } from './generate-llm-config.mjs';
import fs from 'fs';
import path from 'path';

// Main run function
async function run() {
  console.log('Running pre-build script...');
  
  try {
    // Step 1: Generate API docs from OpenAPI specs
    console.log('Generating API docs from OpenAPI specs...');
    await generateDocs();
    
    // Step 2: Generate LLM configuration based on content structure
    // This must be done before trying to generate LLM content
    console.log('Generating LLM configuration...');
    await generateLlmConfig();
    
    // Step 3: Generate LLM-optimized content
    // We'll use a direct import here to avoid module loading issues
    console.log('Generating LLM-optimized content...');
    
    try {
      // When transpiled to JS, this path needs the .mjs extension
      const generateLlmContent = await import('./generate-llm-content.mjs');
      
      if (typeof generateLlmContent.run === 'function') {
        await generateLlmContent.run();
      } else {
        console.warn('Warning: No run function found in LLM content generator. Skipping content generation.');
      }
    } catch (error) {
      console.error('Error loading or running LLM content generator:', error);
    }
    
    console.log('Pre-build script completed successfully');
  } catch (error) {
    console.error('Error in pre-build script:', error);
    process.exit(1);
  }
}

// Run the script
run();
