import fs from 'fs';
import path from 'path';
import glob from 'fast-glob';

// Type definitions
type CategoryConfig = {
  title: string;
  description: string;
  patterns: string[];
  excludePatterns?: string[];
}

// Known category titles and descriptions
const categoryDescriptions: Record<string, {title: string; description: string}> = {
  'api': {
    title: 'MeetingBaas API, the main purpose of the documentation',
    description: 'API documentation for interacting with Meeting BaaS services.'
  },
  'api/all': {
    title: 'Complete MeetingBaas API Reference',
    description: 'Complete API reference for all MeetingBaas endpoints generated from OpenAPI specifications.'
  },
  'sdk': {
    title: 'MeetingBaas SDK, client libraries for various programming languages',
    description: 'Client libraries for integrating with Meeting BaaS in various programming languages.'
  },
  'typescript-sdk': {
    title: 'TypeScript SDK for MeetingBaas',
    description: 'TypeScript SDK documentation for programmatically interacting with Meeting BaaS APIs.'
  },
  'all': {
    title: 'All MeetingBaas documentation content',
    description: 'This contains all documentation across Meeting BaaS systems. Each section below is from a different part of the documentation.'
  },
  'transcript-seeker': {
    title: 'Transcript Seeker, the open-source transcription playground',
    description: 'Documentation for the Transcript Seeker transcription playground.'
  },
  'speaking-bots': {
    title: 'Speaking Bots, the Pipecat-powered bots',
    description: 'Documentation for Speaking Bots powered by Pipecat.'
  },
  'speaking-bots/all': {
    title: 'Complete Speaking Bots API Reference',
    description: 'Complete API reference for all Speaking Bots endpoints generated from OpenAPI specifications.'
  },
  'calendars': {
    title: 'Calendars API, for managing calendar integrations and events',
    description: 'Documentation for calendar integration endpoints and functionality.'
  },
  'meetings': {
    title: 'Meetings API, for scheduling and managing virtual meetings',
    description: 'Documentation for meeting management endpoints and functionality.'
  },
  'users': {
    title: 'Users API, for user management and authentication',
    description: 'Documentation for user management endpoints and functionality.'
  },
  'webhooks': {
    title: 'Webhooks API, for event notifications and integrations',
    description: 'Documentation for webhook integration endpoints and functionality.'
  }
};

// Function to generate category config
async function generateCategoryConfig(): Promise<Record<string, CategoryConfig>> {
  const config: Record<string, CategoryConfig> = {};
  
  // Add the 'all' category
  config['all'] = {
    title: categoryDescriptions['all'].title,
    description: categoryDescriptions['all'].description,
    patterns: ['./content/docs/**/*.mdx']
  };
  
  // Scan for top-level directories in content/docs
  const topLevelDirs = await glob('./content/docs/*', { onlyDirectories: true });
  
  // Process each top-level directory
  for (const dir of topLevelDirs) {
    const dirName = path.basename(dir);
    
    // Add the top-level directory as a category
    const key = dirName;
    config[key] = {
      title: categoryDescriptions[key]?.title || `${dirName} Documentation`,
      description: categoryDescriptions[key]?.description || `Documentation for ${dirName}.`,
      patterns: [`./content/docs/${dirName}/**/*.mdx`]
    };
    
    // Check for a reference directory (API reference)
    if (await fs.promises.stat(`${dir}/reference`).catch(() => null)) {
      // Add a /all subcategory for reference docs
      const refKey = `${dirName}/all`;
      config[refKey] = {
        title: categoryDescriptions[refKey]?.title || `Complete ${dirName} Reference`,
        description: categoryDescriptions[refKey]?.description || `Complete reference for ${dirName}.`,
        patterns: [`./content/docs/${dirName}/reference/**/*.mdx`]
      };
      
      // Scan for subcategories in the reference directory
      const refSubDirs = await glob(`./content/docs/${dirName}/reference/*`, { onlyDirectories: true });
      
      for (const refSubDir of refSubDirs) {
        const subDirName = path.basename(refSubDir);
        const subKey = `${dirName}/${subDirName}`;
        
        config[subKey] = {
          title: categoryDescriptions[subKey]?.title || `${subDirName} ${dirName} Reference`,
          description: categoryDescriptions[subKey]?.description || `Reference documentation for ${subDirName} in ${dirName}.`,
          patterns: [`./content/docs/${dirName}/reference/${subDirName}/**/*.mdx`]
        };
        
        // Also add a top-level entry for important API sections
        if (['calendars', 'meetings', 'users', 'webhooks'].includes(subDirName)) {
          config[subDirName] = {
            title: categoryDescriptions[subDirName]?.title || `${subDirName} API`,
            description: categoryDescriptions[subDirName]?.description || `Documentation for ${subDirName}.`,
            patterns: [`./content/docs/${dirName}/reference/${subDirName}/**/*.mdx`]
          };
        }
      }
    }
    
    // Special handling for TypeScript SDK
    if (dirName === 'typescript-sdk') {
      // Check for SDK reference subdirectories
      const sdkRefDirs = await glob('./content/docs/typescript-sdk/reference/*', { onlyDirectories: true });
      
      for (const sdkRefDir of sdkRefDirs) {
        const sdkSubDirName = path.basename(sdkRefDir);
        const sdkSubKey = `typescript-sdk-${sdkSubDirName}`;
        
        config[sdkSubKey] = {
          title: categoryDescriptions[sdkSubKey]?.title || `${sdkSubDirName}-related TypeScript SDK methods and types`,
          description: categoryDescriptions[sdkSubKey]?.description || `${sdkSubDirName} integration methods and types in the TypeScript SDK.`,
          patterns: [`./content/docs/typescript-sdk/reference/${sdkSubDirName}/**/*.mdx`]
        };
      }
    }
  }
  
  return config;
}

// Function to generate txt redirect paths
async function generateTxtRedirectPaths(config: Record<string, CategoryConfig>): Promise<string[][]> {
  const paths: string[][] = [[]]; // Include root path
  
  // Add llms root
  paths.push(['llms']);
  
  // Add all configuration keys as paths
  for (const key of Object.keys(config)) {
    if (key === '') continue;
    
    // Split by '/' and add 'llms' prefix
    const segments = key.split('/');
    paths.push(['llms', ...segments]);
  }
  
  return paths;
}

// Function to write the category config to a TypeScript file
async function writeCategoryConfigFile(config: Record<string, CategoryConfig>, txtPaths: string[][]) {
  // Generate the configuration file content using proper ESM syntax with type index signature
  const fileContent = `// This file is auto-generated by generate-llm-config.mts
// Do not edit this file directly

// Define the type for category configuration
export type CategoryConfig = {
  title: string;
  description: string;
  patterns: string[];
  excludePatterns?: string[];
};

// Define the type for the complete configuration map with an index signature
export type CategoryConfigMap = Record<string, CategoryConfig>;

// Auto-generated category configuration
export const categoryConfig: CategoryConfigMap = ${JSON.stringify(config, null, 2)};

// Auto-generated .txt redirect paths
export const knownTxtPaths: string[][] = ${JSON.stringify(txtPaths, null, 2)};
`;

  // Write the configuration file
  fs.writeFileSync('./content/llm-config.ts', fileContent);
  console.log('Generated LLM configuration file at ./content/llm-config.ts');
  
  // Create a JavaScript version (ESM) for dynamic imports
  // This is necessary because Next.js and Node.js handle ES modules differently
  const jsFileContent = `// This file is auto-generated by generate-llm-config.mts
// Do not edit this file directly

// Auto-generated category configuration
export const categoryConfig = ${JSON.stringify(config, null, 2)};

// Auto-generated .txt redirect paths
export const knownTxtPaths = ${JSON.stringify(txtPaths, null, 2)};
`;

  fs.writeFileSync('./content/llm-config.js', jsFileContent);
  console.log('Generated LLM configuration file at ./content/llm-config.js');
}

// Main function
export async function generateLlmConfig() {
  try {
    console.log('Generating LLM category configuration...');
    
    // Generate the configuration based on content structure
    const config = await generateCategoryConfig();
    console.log(`Generated configuration for ${Object.keys(config).length} categories`);
    
    // Generate txt redirect paths
    const txtPaths = await generateTxtRedirectPaths(config);
    console.log(`Generated ${txtPaths.length} txt redirect paths`);
    
    // Write the configuration files (both TS and JS)
    await writeCategoryConfigFile(config, txtPaths);
    
    console.log('LLM configuration generated successfully');
  } catch (error) {
    console.error('Error generating LLM configuration:', error);
    throw error;
  }
}

// Run the function if this script is called directly
if (typeof require !== 'undefined' && require.main === module) {
  generateLlmConfig().catch((error) => {
    console.error('Failed to generate LLM configuration:', error);
    process.exit(1);
  });
} 