#!/usr/bin/env node
/**
 * Generates internal documentation from meeting-baas-v2/docs at BUILD TIME.
 *
 * IMPORTANT: Output is gitignored - these docs are NEVER committed to the docs repo.
 * They exist only during local dev/build and are regenerated fresh each time.
 *
 * Run: node scripts/generate-internal-docs.cjs
 * Output: content/docs/internal/ (gitignored)
 */

const fs = require("fs");
const path = require("path");

// Source: meeting-baas-v2/docs
const DOCS_SOURCE = process.env.INTERNAL_DOCS_PATH || path.join(__dirname, "../../meeting-baas-v2/docs");

// Output: baas-docs (GITIGNORED)
const OUTPUT_DIR = path.join(__dirname, "../content/docs/internal");

// ============================================================================
// Helpers
// ============================================================================

function slugify(filename) {
  return filename
    .replace(/\.md$/, '')
    .toLowerCase()
    .replace(/_/g, '-');
}

function titleFromFilename(filename) {
  return filename
    .replace(/\.md$/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function extractDescription(content) {
  // Try to get first paragraph or heading
  const lines = content.split('\n').filter(l => l.trim());
  for (const line of lines) {
    if (line.startsWith('#')) continue;
    if (line.trim().length > 20) {
      return line.trim().slice(0, 150).replace(/["\n]/g, ' ') + '...';
    }
  }
  return 'Internal documentation';
}

function escapeMdxContent(content) {
  // Escape characters that would be parsed as JSX
  // But be careful not to escape inside code blocks
  const lines = content.split('\n');
  let inCodeBlock = false;

  return lines.map(line => {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      return line;
    }
    if (inCodeBlock) {
      return line;
    }
    // Escape braces and angle brackets outside code blocks
    // Angle brackets in generic types like BTreeMap<K, V> are parsed as JSX tags
    return line
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }).join('\n');
}

// ============================================================================
// Main
// ============================================================================

function main() {
  console.log("Generating internal docs...");
  console.log(`  Source: ${DOCS_SOURCE}`);
  console.log(`  Output: ${OUTPUT_DIR} (gitignored)`);

  // Check if source exists
  if (!fs.existsSync(DOCS_SOURCE)) {
    console.log("  Source directory not found - skipping internal docs generation");
    console.log("  (This is expected on CI/Vercel builds without the private repo)");
    return;
  }

  // Get all .md files
  const files = fs.readdirSync(DOCS_SOURCE)
    .filter(f => f.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.log("  No .md files found in source directory");
    return;
  }

  console.log(`  Found ${files.length} internal docs`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate each doc
  const pages = [];

  files.forEach(filename => {
    const slug = slugify(filename);
    const title = titleFromFilename(filename);
    const sourcePath = path.join(DOCS_SOURCE, filename);
    const content = fs.readFileSync(sourcePath, 'utf-8');
    const description = extractDescription(content);

    // Create MDX with frontmatter
    const mdx = `---
title: "${title}"
description: "${description}"
icon: FileText
---

${escapeMdxContent(content)}
`;

    const outputPath = path.join(OUTPUT_DIR, `${slug}.mdx`);
    fs.writeFileSync(outputPath, mdx);
    pages.push(slug);
    console.log(`  Generated: ${slug}.mdx`);
  });

  // Generate index page
  const indexMdx = `---
title: Internal Docs
description: Internal engineering documentation (not public)
icon: Lock
---

# Internal Documentation

<Callout type="warning">
  These docs are internal engineering references. They are NOT committed to the docs repository and are generated dynamically at build time from the private \`meeting-baas-v2\` repo.
</Callout>

## Documents

${files.map(f => {
  const slug = slugify(f);
  const title = titleFromFilename(f);
  return `- [${title}](./${slug})`;
}).join('\n')}

---

*Generated at build time from \`meeting-baas-v2/docs/\`*
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.mdx'), indexMdx);
  pages.unshift('index');

  // Generate meta.json
  const meta = {
    title: "Internal",
    icon: "Lock",
    pages
  };
  fs.writeFileSync(path.join(OUTPUT_DIR, 'meta.json'), JSON.stringify(meta, null, 2));

  console.log(`\nGenerated ${files.length + 1} files in ${OUTPUT_DIR}`);
  console.log("Remember: This folder is gitignored - content stays private!");
}

main();
