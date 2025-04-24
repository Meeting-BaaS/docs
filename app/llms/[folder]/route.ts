import * as fs from 'node:fs/promises';
import fg from 'fast-glob';
import matter from 'gray-matter';
import path from 'node:path';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import { fileGenerator, remarkDocGen, remarkInstall } from 'fumadocs-docgen';
import remarkStringify from 'remark-stringify';
import remarkMdx from 'remark-mdx';
import { remarkAutoTypeTable } from 'fumadocs-typescript';
import { remarkInclude } from 'fumadocs-mdx/config';
import { type NextRequest } from 'next/server';

export const revalidate = false;

const processor = remark()
  .use(remarkMdx)
  .use(remarkInclude)
  .use(remarkGfm)
  .use(remarkAutoTypeTable)
  .use(remarkDocGen, { generators: [fileGenerator()] })
  .use(remarkInstall, { persist: { id: 'package-manager' } })
  .use(remarkStringify);

// Categories mapping
const categories = {
  api: 'MeetingBaas API, the main purpose of the documentation',
  'transcript-seeker': 'Transcript Seeker, the open-source transcription playground',
  'speaking-bots': 'Speaking Bots, the Pipecat-powered bots',
  'calendars': 'Calendars API, for managing calendar integrations and events',
  'meetings': 'Meetings API, for scheduling and managing virtual meetings',
  'users': 'Users API, for user management and authentication',
  'webhooks': 'Webhooks API, for event notifications and integrations',
  'sdk': 'MeetingBaas SDK, client libraries for various programming languages'
};

// Next.js 15 route handler
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ folder: string }> }
) {
  // In Next.js 15, params is a Promise
  const { folder } = await context.params;
  
  // Validate folder is in our categories
  if (!Object.keys(categories).includes(folder) && folder !== 'all') {
    return new Response(`Invalid folder: ${folder}`, { status: 404 });
  }

  // For specific folder, get files only from that folder
  const pattern = folder === 'all' 
    ? './content/docs/**/*.mdx' 
    : `./content/docs/${folder}/**/*.mdx`;
  
  // Still exclude API reference files
  const exclusionPattern = '!./content/docs/api/reference/**/*';
  
  const files = await fg([pattern, exclusionPattern]);

  const scan = files.map(async (file) => {
    const fileContent = await fs.readFile(file);
    const { content, data } = matter(fileContent.toString());

    const dir = path.dirname(file).split(path.sep).at(3);
    // Fix TypeScript error by checking if dir exists in categories
    const category = dir && Object.prototype.hasOwnProperty.call(categories, dir) 
      ? categories[dir as keyof typeof categories] 
      : `Unknown category: ${dir}`;

    const processed: unknown = await processor.process({
      path: file,
      value: content,
    });
    
    return `file: ${file}
# ${category}: ${data.title}

${data.description}
        
${processed as string}`;
  });

  const scanned = await Promise.all(scan);

  return new Response(scanned.join('\n\n'));
} 