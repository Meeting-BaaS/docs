import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';
import glob from 'fast-glob';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

/**
 * Generate LLM-optimized versions of all documentation
 * This creates static files that can be served to LLMs with comprehensive content
 */
export async function generateLLMContent() {
  console.log('Generating LLM-optimized content...');

  // Define the main document categories
  const categories = {
    api: 'MeetingBaas API Documentation',
    'transcript-seeker': 'Transcript Seeker Documentation',
    'speaking-bots': 'Speaking Bots Documentation',
    'typescript-sdk': 'TypeScript SDK Documentation'
  };

  // Create LLM content directory if it doesn't exist
  const llmContentDir = path.join(process.cwd(), 'content', 'llm');
  mkdirSync(llmContentDir, { recursive: true });

  // Process each category
  for (const [category, title] of Object.entries(categories)) {
    console.log(`Processing category: ${category}`);
    
    // Find all MDX files in this category
    const files = await glob([`./content/docs/${category}/**/*.mdx`]);
    
    // Collect content from all files in the category
    const categoryContent: string[] = [`# ${title}\n\n`];
    
    for (const file of files) {
      try {
        const fileContent = readFileSync(file, 'utf-8');
        const { content, data } = matter(fileContent);
        
        // Add metadata and content from the file
        categoryContent.push(`## ${data.title || path.basename(file, '.mdx')}`);
        if (data.description) categoryContent.push(data.description);
        categoryContent.push(`\n### Source: ${file}\n`);
        categoryContent.push(content);
        categoryContent.push('\n---\n');
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
    
    // Write the combined content to a single file
    const outputPath = path.join(llmContentDir, `${category}.md`);
    writeFileSync(outputPath, categoryContent.join('\n\n'));
    console.log(`Generated LLM content for ${category} at ${outputPath}`);
  }

  // Special handling for SDK reference sections
  const sdkSubcategories = ['common', 'bots', 'calendars', 'webhooks'];
  for (const subcategory of sdkSubcategories) {
    console.log(`Processing SDK subcategory: ${subcategory}`);
    
    // Find all MDX files in this subcategory
    const files = await glob([`./content/docs/typescript-sdk/reference/${subcategory}/**/*.mdx`]);
    
    // Collect content
    const categoryContent: string[] = [`# TypeScript SDK ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Reference\n\n`];
    
    for (const file of files) {
      try {
        const fileContent = readFileSync(file, 'utf-8');
        const { content, data } = matter(fileContent);
        
        // Add content
        categoryContent.push(`## ${data.title || path.basename(file, '.mdx')}`);
        if (data.description) categoryContent.push(data.description);
        categoryContent.push(`\n### Source: ${file}\n`);
        categoryContent.push(content);
        categoryContent.push('\n---\n');
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
    
    // Write the combined content
    const outputPath = path.join(llmContentDir, `typescript-sdk-${subcategory}.md`);
    writeFileSync(outputPath, categoryContent.join('\n\n'));
    console.log(`Generated LLM content for SDK ${subcategory} at ${outputPath}`);
  }

  // Generate an "all" file with links to all categories
  const allContent = [
    `# All MeetingBaas Documentation\n\n`,
    `This file contains links to all documentation categories optimized for LLMs.\n\n`,
    ...Object.entries(categories).map(([category, title]) => 
      `- [${title}](/llms/${category})`
    ),
    ...sdkSubcategories.map(subcategory => 
      `- [TypeScript SDK ${subcategory.charAt(0).toUpperCase() + subcategory.slice(1)} Reference](/llms/typescript-sdk-${subcategory})`
    )
  ];
  
  writeFileSync(path.join(llmContentDir, 'all.md'), allContent.join('\n'));
  console.log('Generated LLM "all" content index');

  return 'LLM content generation complete';
}

// ESM module check - this replaces the CommonJS require.main === module check
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  generateLLMContent()
    .then(console.log)
    .catch(console.error);
} 