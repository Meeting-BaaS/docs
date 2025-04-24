#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

// Find all .mts files
const mtsFiles = glob.sync(['scripts/*.mts']);

console.log('Transpiling TypeScript files to JavaScript...');

// Ensure scripts-dist directory exists
const outputDir = path.join(process.cwd(), 'scripts-dist');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// For each .mts file, transpile to .mjs using tsc
for (const mtsFile of mtsFiles) {
  const baseName = path.basename(mtsFile, '.mts');
  const outputFile = path.join(outputDir, `${baseName}.mjs`);
  
  console.log(`Transpiling ${mtsFile} to ${outputFile}...`);
  
  // Use esbuild for fast transpilation
  const esbuildCommand = `npx esbuild ${mtsFile} --format=esm --platform=node --outfile=${outputFile}`;
  try {
    execSync(esbuildCommand, { stdio: 'inherit' });
    console.log(`  ✅ Successfully transpiled ${mtsFile}`);
  } catch (error) {
    console.error(`  ❌ Error transpiling ${mtsFile}:`, error);
    process.exit(1);
  }
}

console.log('All files transpiled successfully!'); 