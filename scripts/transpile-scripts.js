#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

// Find all .mts files
const mtsFiles = glob.sync(['scripts/*.mts', 'scripts/**/*.mts']);

console.log('Transpiling TypeScript files to JavaScript...');

// Ensure scripts-dist directory exists
const rootOutputDir = path.join(process.cwd(), 'scripts-dist');
if (!fs.existsSync(rootOutputDir)) {
  fs.mkdirSync(rootOutputDir, { recursive: true });
}

// For each .mts file, transpile to .mjs using tsc
for (const mtsFile of mtsFiles) {
  // Get relative path from scripts folder
  const relPath = path.relative('scripts', path.dirname(mtsFile));
  const baseName = path.basename(mtsFile, '.mts');

  // Create target directory in scripts-dist
  const targetDir = path.join(rootOutputDir, relPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const outputFile = path.join(targetDir, `${baseName}.mjs`);

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
