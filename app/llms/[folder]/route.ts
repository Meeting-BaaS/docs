import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import glob from 'fast-glob';

// Set to 'force-static' to ensure this is included in the static build
export const dynamic = 'force-static';
export const revalidate = false;

// Define a type for category configuration
type CategoryConfig = {
  title: string;
  description: string;
  patterns: string[];
  excludePatterns?: string[];
}

// Centralized category configuration system
// This defines the relationship between route identifiers and content locations
const categoryConfig: Record<string, CategoryConfig> = {
  // Main categories
  'all': {
    title: 'All MeetingBaas documentation content',
    description: 'This contains all documentation across Meeting BaaS systems. Each section below is from a different part of the documentation.',
    patterns: ['./content/docs/**/*.mdx'],
  },
  
  // API documentation sections
  'api': {
    title: 'MeetingBaas API, the main purpose of the documentation',
    description: 'API documentation for interacting with Meeting BaaS services.',
    patterns: ['./content/docs/api/**/*.mdx'],
  },
  
  // API reference subsections - these are organized under api/reference/
  'calendars': {
    title: 'Calendars API, for managing calendar integrations and events',
    description: 'Documentation for calendar integration endpoints and functionality.',
    patterns: ['./content/docs/api/reference/calendars/**/*.mdx'],
  },
  'meetings': {
    title: 'Meetings API, for scheduling and managing virtual meetings',
    description: 'Documentation for meeting management endpoints and functionality.',
    patterns: [
      './content/docs/api/reference/meetings/**/*.mdx',
      './content/docs/meetings/**/*.mdx'
    ],
  },
  'users': {
    title: 'Users API, for user management and authentication',
    description: 'Documentation for user management endpoints and functionality.',
    patterns: [
      './content/docs/api/reference/users/**/*.mdx',
      './content/docs/users/**/*.mdx'
    ],
  },
  'webhooks': {
    title: 'Webhooks API, for event notifications and integrations',
    description: 'Documentation for webhook integration endpoints and functionality.',
    patterns: ['./content/docs/api/reference/webhooks/**/*.mdx'],
  },
  
  // SDK documentation
  'sdk': {
    title: 'MeetingBaas SDK, client libraries for various programming languages',
    description: 'Client libraries for integrating with Meeting BaaS in various programming languages.',
    patterns: ['./content/docs/sdk/**/*.mdx', './content/docs/typescript-sdk/**/*.mdx'],
  },
  
  // TypeScript SDK sections
  'typescript-sdk': {
    title: 'TypeScript SDK for MeetingBaas',
    description: 'TypeScript SDK documentation for programmatically interacting with Meeting BaaS APIs.',
    patterns: ['./content/docs/typescript-sdk/**/*.mdx'],
  },
  'typescript-sdk-common': {
    title: 'Common TypeScript SDK methods and types',
    description: 'Common utilities and types used across the TypeScript SDK.',
    patterns: ['./content/docs/typescript-sdk/reference/common/**/*.mdx'],
  },
  'typescript-sdk-bots': {
    title: 'Bot-related TypeScript SDK methods and types',
    description: 'Bot integration methods and types in the TypeScript SDK.',
    patterns: ['./content/docs/typescript-sdk/reference/bots/**/*.mdx'],
  },
  'typescript-sdk-calendars': {
    title: 'Calendar-related TypeScript SDK methods and types',
    description: 'Calendar integration methods and types in the TypeScript SDK.',
    patterns: ['./content/docs/typescript-sdk/reference/calendars/**/*.mdx'],
  },
  'typescript-sdk-webhooks': {
    title: 'Webhook-related TypeScript SDK methods and types',
    description: 'Webhook integration methods and types in the TypeScript SDK.',
    patterns: ['./content/docs/typescript-sdk/reference/webhooks/**/*.mdx'],
  },
  
  // Other standalone sections
  'transcript-seeker': {
    title: 'Transcript Seeker, the open-source transcription playground',
    description: 'Documentation for the Transcript Seeker transcription playground.',
    patterns: ['./content/docs/transcript-seeker/**/*.mdx'],
  },
  'speaking-bots': {
    title: 'Speaking Bots, the Pipecat-powered bots',
    description: 'Documentation for Speaking Bots powered by Pipecat.',
    patterns: ['./content/docs/speaking-bots/**/*.mdx'],
  },
};

// Generate all possible static paths at build time
export async function generateStaticParams() {
  return Object.keys(categoryConfig).map(folder => ({ 
    folder 
  }));
}

// Function to gather MDX content for a folder
async function getContentForFolder(folder: string): Promise<string> {
  try {
    // Get the category configuration
    const config = categoryConfig[folder];
    if (!config) {
      return `# Error: Unknown Category\n\nNo configuration found for category: ${folder}`;
    }
    
    // Get file patterns from config
    const allPatterns = [...config.patterns];
    if (config.excludePatterns) {
      allPatterns.push(...config.excludePatterns);
    }
    
    // Find matching files
    const files = await glob(allPatterns);
    
    // Debug logging
    console.log(`Category ${folder}: Found ${files.length} files with patterns:`, allPatterns);
    
    if (files.length === 0) {
      return `# ${config.title}\n\n${config.description}\n\nNo content found for this category.\n\nPatterns searched: ${allPatterns.join(', ')}`;
    }
    
    // Create header for the content
    let fullContent = `# ${config.title}\n\n${config.description}\n\n`;
    
    // Process each file
    for (const filePath of files) {
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
        console.error(`Error processing file ${filePath}:`, error);
        fullContent += `## Error processing ${filePath}\n\n`;
      }
    }
    
    return fullContent;
  } catch (error) {
    console.error(`Error getting content for folder ${folder}:`, error);
    return `# ${categoryConfig[folder]?.title || folder}\n\nError processing content for this category.`;
  }
}

// Single parameter route handler for maximum compatibility
export async function GET(request: Request) {
  try {
    // Extract folder from URL path
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    // Parse the URL to extract the folder name
    // Expected format: /llms/{folder}
    const parts = pathname.split('/').filter(Boolean);
    const folder = parts.length >= 2 ? parts[1] : 'all';
    
    // Check if the folder exists in our categories
    if (!Object.keys(categoryConfig).includes(folder)) {
      // Generate index page with available categories if category not found
      let content = "# Available LLM Content Categories\n\n";
      
      for (const [key, config] of Object.entries(categoryConfig)) {
        content += `- [/llms/${key}](${key}) - ${config.title}\n`;
      }
      
      content += "\n[All Content](/llms/all)";
      
      return new Response(content, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8'
        }
      });
    }
    
    // Get the content for this folder
    const content = await getContentForFolder(folder);
    
    // Return the content
    return new Response(content, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error in GET handler:', error);
    return new Response('Error processing request', { status: 500 });
  }
} 