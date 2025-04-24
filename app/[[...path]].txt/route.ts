import { NextRequest } from 'next/server';

// Set to 'force-static' to ensure this is included in the static build
export const dynamic = 'force-static';
export const revalidate = false;

// Predefined paths that we know will end with .txt for static generation
const knownTxtPaths = [
  [],  // Handle root path.txt -> path
  ['llms'],
  ['llms', 'api'],
  ['llms', 'transcript-seeker'],
  ['llms', 'speaking-bots'],
  ['llms', 'calendars'],
  ['llms', 'meetings'],
  ['llms', 'users'],
  ['llms', 'webhooks'],
  ['llms', 'sdk'],
  ['llms', 'all'],
];

// Generate static parameters for all known txt paths
export async function generateStaticParams() {
  return knownTxtPaths.map(path => ({
    path,
  }));
}

// Using the simplified, consistent handler pattern
export async function GET(
  request: NextRequest,
  context: any
) {
  try {
    // Get the request URL
    const url = new URL(request.url);
    let pathname = url.pathname;
    
    // Remove the .txt extension from the path
    pathname = pathname.replace(/\.txt$/, '');
    
    // Return redirect to the non-txt version
    return new Response(null, {
      status: 302,
      headers: {
        'Location': pathname
      }
    });
  } catch (error) {
    console.error('Error in .txt redirect handler:', error);
    
    // Fallback to /llms if any error occurs
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/llms'
      }
    });
  }
} 