import glob from 'fast-glob';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

// Type definition for the config
type CategoryConfig = {
  title: string;
  description: string;
  patterns: string[];
  excludePatterns?: string[];
};

/**
 * Generate LLM-optimized versions of all documentation
 * This creates static files that can be served to LLMs with comprehensive content
 */
export async function run() {
  try {
    console.log('Generating LLM content...');

    // Create the content/llm directory if it doesn't exist
    const llmContentDir = './content/llm';
    if (!fs.existsSync(llmContentDir)) {
      fs.mkdirSync(llmContentDir, { recursive: true });
    }

    // Safely load the configuration (might not be available during first run)
    let categoryConfig: Record<string, CategoryConfig>;
    try {
      // Try to import the generated config
      const configModule = await import('../content/llm-config.js');
      categoryConfig = configModule.categoryConfig;

      if (!categoryConfig || Object.keys(categoryConfig).length === 0) {
        throw new Error('Config is empty');
      }
    } catch (error) {
      console.warn(
        'Could not load configuration from llm-config.js, using fallback configuration',
      );
      // Fallback default configuration
      categoryConfig = {
        all: {
          title: 'All MeetingBaas documentation content',
          description:
            'This contains all documentation across Meeting BaaS systems.',
          patterns: ['./content/docs/**/*.mdx'],
        },
        api: {
          title: 'MeetingBaas API',
          description:
            'API documentation for interacting with Meeting BaaS services.',
          patterns: ['./content/docs/api/**/*.mdx'],
        },
      };
    }

    // Process each category
    for (const [categoryPath, config] of Object.entries(categoryConfig)) {
      console.log(`Processing category: ${categoryPath}`);

      try {
        // Get file patterns from config
        const allPatterns = [...config.patterns];
        if (config.excludePatterns) {
          allPatterns.push(...config.excludePatterns);
        }

        // Find matching files
        const files = await glob(allPatterns);
        console.log(`  Found ${files.length} files`);

        if (files.length === 0) {
          console.log(`  No files found for category: ${categoryPath}`);
          continue;
        }

        // Sort files for consistent ordering
        const sortedFiles = files.sort();

        // Special handling for the 'all' category to provide more stability
        if (categoryPath === 'all') {
          console.log('  Using stable ordering for all.md');

          // Group files by top-level directory for more stable organization
          const filesByDirectory: Record<string, string[]> = {};
          for (const file of sortedFiles) {
            const parts = file.split('/');
            if (parts.length >= 3) {
              // ./content/docs/[directory]
              const dir = parts[2]; // Get the directory after ./content/docs/
              if (!filesByDirectory[dir]) {
                filesByDirectory[dir] = [];
              }
              filesByDirectory[dir].push(file);
            }
          }

          // Create content with files organized by directory
          let fullContent = `# ${config.title}\n\n${config.description}\n\n`;

          // Process each directory in alphabetical order
          const directories = Object.keys(filesByDirectory).sort();
          for (const dir of directories) {
            const dirFiles = filesByDirectory[dir].sort();

            for (const filePath of dirFiles) {
              try {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const { content, data } = matter(fileContent);

                // Extract useful metadata
                const title = data.title || path.basename(filePath, '.mdx');
                const description = data.description || '';

                // Add this file's content to the full content
                fullContent += `## ${title}\n\n`;
                if (description) fullContent += `${description}\n\n`;
                fullContent += `### Source: ${filePath}\n\n`;
                fullContent += content;
                fullContent += '\n\n---\n\n';
              } catch (error) {
                console.error(`  Error processing file ${filePath}:`, error);
                fullContent += `## Error processing ${filePath}\n\n`;
              }
            }
          }

          // Write the content to a file
          const outputFilePath = path.join(
            llmContentDir,
            `${categoryPath.replace(/\//g, '-')}.md`,
          );
          fs.writeFileSync(outputFilePath, fullContent);
          console.log(`  Generated content file: ${outputFilePath}`);
          continue; // Skip regular processing for 'all' category
        }

        // Create the content for this category
        let fullContent = `# ${config.title}\n\n${config.description}\n\n`;

        // Process each file
        for (const filePath of sortedFiles) {
          try {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const { content, data } = matter(fileContent);

            // Extract useful metadata
            const title = data.title || path.basename(filePath, '.mdx');
            const description = data.description || '';

            // Add this file's content to the full content
            fullContent += `## ${title}\n\n`;
            if (description) fullContent += `${description}\n\n`;
            fullContent += `### Source: ${filePath}\n\n`;
            fullContent += content;
            fullContent += '\n\n---\n\n';
          } catch (error) {
            console.error(`  Error processing file ${filePath}:`, error);
            fullContent += `## Error processing ${filePath}\n\n`;
          }
        }

        // Write the content to a file
        const outputFilePath = path.join(
          llmContentDir,
          `${categoryPath.replace(/\//g, '-')}.md`,
        );
        fs.writeFileSync(outputFilePath, fullContent);
        console.log(`  Generated content file: ${outputFilePath}`);
      } catch (error) {
        console.error(
          `  Error generating content for category ${categoryPath}:`,
          error,
        );
      }
    }

    console.log('LLM content generation completed successfully');
  } catch (error) {
    console.error('Error in LLM content generation:', error);
    throw error;
  }
}

// Run the function if this script is called directly
if (typeof require !== 'undefined' && require.main === module) {
  run().catch((error) => {
    console.error('Failed to generate LLM content:', error);
    process.exit(1);
  });
}
