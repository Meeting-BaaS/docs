import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import glob from 'fast-glob';

// Set to 'force-static' to ensure this is included in the static build
export const dynamic = 'force-static';
export const revalidate = false;

// Categories mapping with type safety
const categories: Record<string, string> = {
  api: 'MeetingBaas API, the main purpose of the documentation',
  'transcript-seeker': 'Transcript Seeker, the open-source transcription playground',
  'speaking-bots': 'Speaking Bots, the Pipecat-powered bots',
  'calendars': 'Calendars API, for managing calendar integrations and events',
  'meetings': 'Meetings API, for scheduling and managing virtual meetings',
  'users': 'Users API, for user management and authentication',
  'webhooks': 'Webhooks API, for event notifications and integrations',
  'sdk': 'MeetingBaas SDK, client libraries for various programming languages',
  'all': 'All MeetingBaas documentation content'
};

// Generate all possible static paths at build time
export async function generateStaticParams() {
  return Object.keys(categories).map(folder => ({ 
    folder 
  }));
}

// Function to gather MDX content for a folder
async function getContentForFolder(folder: string): Promise<string> {
  try {
    // Define the pattern to match files based on the folder
    const pattern = folder === 'all' 
      ? './content/docs/**/*.mdx' 
      : `./content/docs/${folder}/**/*.mdx`;
    
    // Exclude API reference files for most requests
    const exclusionPattern = '!./content/docs/api/reference/**/*';
    
    // Find matching files
    const files = await glob([pattern, exclusionPattern]);
    
    if (files.length === 0) {
      return `# ${categories[folder]}\n\nNo content found for this category.`;
    }
    
    // Process each file
    const contentPromises = files.map(async (filePath) => {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { content, data } = matter(fileContent);
      
      // Get directory name for categorization
      const dir = path.dirname(filePath).split(path.sep).at(2);
      
      return `## ${data.title || 'Untitled'}\n\n${data.description || ''}\n\n### File: ${filePath}\n\n${content.slice(0, 1000)}${content.length > 1000 ? '...(truncated)' : ''}`;
    });
    
    const contentParts = await Promise.all(contentPromises);
    
    // Create the full content with a header
    return `# ${categories[folder]}\n\n${contentParts.join('\n\n---\n\n')}`;
  } catch (error) {
    console.error(`Error getting content for folder ${folder}:`, error);
    return `# ${categories[folder]}\n\nError processing content for this category.`;
  }
}

// Using the working pattern with context: any
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    // Get the folder parameter safely
    const folder = context?.params?.folder || 'all';
    
    // Check if the folder exists in our categories
    if (!Object.keys(categories).includes(folder)) {
      return new Response(`Category not found: ${folder}`, { status: 404 });
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