#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('fast-glob');

// Find all .mts files and .ts files in scripts/updates
const mtsFiles = glob.sync(['scripts/*.mts', 'scripts/**/*.mts']);
const tsUtilFiles = glob.sync(['scripts/updates/*.ts']);

console.log('Transpiling TypeScript files to JavaScript...');

// Ensure scripts-dist directory exists
const rootOutputDir = path.join(process.cwd(), 'scripts-dist');
if (!fs.existsSync(rootOutputDir)) {
  fs.mkdirSync(rootOutputDir, { recursive: true });
}

// Function to add .mjs extension to local imports
function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // This regex matches import statements for local files without extensions
  const importRegex = /import\s+(?:[\w*\s{},]*\s+from\s+)?['"](\.\/.+?)['"];/g;

  content = content.replace(importRegex, (match, importPath) => {
    // Only add .mjs if there's no extension already
    if (!path.extname(importPath)) {
      return match
        .replace(`'${importPath}'`, `'${importPath}.mjs'`)
        .replace(`"${importPath}"`, `"${importPath}.mjs"`);
    }
    return match;
  });

  fs.writeFileSync(filePath, content);
}

// For each .mts file, transpile to .mjs using esbuild
for (const mtsFile of mtsFiles) {
  // Create correct relative path that preserves directory structure
  const relativePath = path.relative('scripts', mtsFile).replace(/\.mts$/, '');
  const outputFile = path.join(rootOutputDir, `${relativePath}.mjs`);
  const outputDir = path.dirname(outputFile);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Transpiling ${mtsFile} to ${outputFile}...`);

  // Use esbuild for fast transpilation
  const esbuildCommand = `npx esbuild ${mtsFile} --format=esm --platform=node --outfile=${outputFile}`;
  try {
    execSync(esbuildCommand, { stdio: 'inherit' });

    // Fix imports in the generated file
    fixImports(outputFile);

    console.log(`  ✅ Successfully transpiled ${mtsFile}`);
  } catch (error) {
    console.error(`  ❌ Error transpiling ${mtsFile}:`, error);
    process.exit(1);
  }
}

// For each utility .ts file, transpile to .mjs using esbuild
for (const tsFile of tsUtilFiles) {
  const relativePath = path.relative('scripts', tsFile).replace(/\.ts$/, '');
  const outputFile = path.join(rootOutputDir, `${relativePath}.mjs`);
  const outputDir = path.dirname(outputFile);

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log(`Transpiling ${tsFile} to ${outputFile}...`);

  // Use esbuild for fast transpilation with ESM modules
  const esbuildCommand = `npx esbuild ${tsFile} --format=esm --platform=node --outfile=${outputFile}`;
  try {
    execSync(esbuildCommand, { stdio: 'inherit' });

    // Fix imports in the generated file
    fixImports(outputFile);

    console.log(`  ✅ Successfully transpiled ${tsFile}`);
  } catch (error) {
    console.error(`  ❌ Error transpiling ${tsFile}:`, error);
    process.exit(1);
  }
}

console.log('All files transpiled successfully!');
