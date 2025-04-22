import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { format } from 'date-fns';
import { execSync } from 'child_process';

interface APIChange {
  path: string;
  method: string;
  type: 'breaking' | 'enhancement' | 'feature';
  description: string;
  category?: string;
}

function getGitChanges(): { modified: string[], untracked: string[] } {
  try {
    // Get modified files
    const modifiedOutput = execSync('git diff --name-only HEAD').toString();
    const modified = modifiedOutput.split('\n')
      .filter(file => file.startsWith('content/docs/api/reference/') && file.endsWith('.mdx'));

    // Get untracked files
    const untrackedOutput = execSync('git ls-files --others --exclude-standard').toString();
    const untracked = untrackedOutput.split('\n')
      .filter(file => file.startsWith('content/docs/api/reference/') && file.endsWith('.mdx'));

    return { modified, untracked };
  } catch (error) {
    console.error('Error getting git changes:', error);
    return { modified: [], untracked: [] };
  }
}

function categorizeChange(path: string, content: string): APIChange {
  const categoryMatches = {
    '/bots/': 'Bots',
    '/calendar': 'Calendar',
    '/webhook': 'Webhooks',
    '/screenshot': 'Screenshots',
    '/transcribe': 'Transcription'
  };

  // Determine category
  const category = Object.entries(categoryMatches)
    .find(([key]) => path.includes(key))?.[1] || 'API';

  // Check for breaking changes in content
  const isBreaking = content.toLowerCase().includes('breaking') ||
    content.includes('deprecated') ||
    content.includes('removed');

  // Check if it's a new feature
  const isNewFeature = path.startsWith('content/docs/api/reference/') && 
    !path.includes('index.mdx') &&
    !path.includes('meta.json');

  // Extract method from content
  const methodMatch = content.match(/method":"(GET|POST|PUT|DELETE|PATCH)"/i);
  const method = methodMatch ? methodMatch[1] : 'GET';

  // Extract description from content
  const descMatch = content.match(/description":\s*"([^"]+)"/);
  const description = descMatch ? descMatch[1] : 'API endpoint updated';

  // Clean up the path to match API format
  const apiPath = path
    .replace('content/docs/api/reference/', '')
    .replace('.mdx', '')
    .replace(/_/g, '/')
    .replace(/\/index$/, '');

  return {
    path: `/${apiPath}`,
    method,
    type: isBreaking ? 'breaking' : isNewFeature ? 'feature' : 'enhancement',
    description,
    category
  };
}

function detectChangesFromOpenAPI(): APIChange[] {
  const changes: APIChange[] = [];
  const { modified, untracked } = getGitChanges();
  
  try {
    // Process both modified and untracked files
    [...modified, ...untracked].forEach(file => {
      if (!file) return;
      
      try {
        const content = readFileSync(file, 'utf-8');
        const change = categorizeChange(file, content);
        changes.push(change);
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    });

  } catch (error) {
    console.error('Error detecting OpenAPI changes:', error);
  }

  // Group changes by category
  return changes.sort((a, b) => {
    // Sort by category first
    if (a.category !== b.category) {
      return (a.category || '').localeCompare(b.category || '');
    }
    // Then by type (breaking > feature > enhancement)
    const typeOrder = { breaking: 0, feature: 1, enhancement: 2 };
    return typeOrder[a.type] - typeOrder[b.type];
  });
}

function getUpdateIcon(changes: APIChange[]): string {
  // Map categories to relevant icons
  const categoryIcons: Record<string, string[]> = {
    'Bots': ['Bot', 'Robot', 'Cpu'],
    'Calendar': ['Calendar', 'Clock', 'Timer'],
    'Webhooks': ['Webhook', 'Link', 'Connection'],
    'Screenshots': ['Camera', 'Image', 'Screenshot'],
    'Transcription': ['FileAudio', 'Mic', 'Waveform'],
    'General': ['Code', 'Terminal', 'Api']
  };

  // Get all categories from changes
  const categories = [...new Set(changes.map(c => c.category || 'General'))];
  
  // If there's only one category, use its icon set
  if (categories.length === 1) {
    const icons = categoryIcons[categories[0]] || categoryIcons.General;
    return icons[Math.floor(Math.random() * icons.length)];
  }

  // If there are breaking changes, use warning-related icons
  if (changes.some(c => c.type === 'breaking')) {
    return ['AlertTriangle', 'AlertCircle', 'Shield'][Math.floor(Math.random() * 3)];
  }

  // For mixed changes, use general API/update icons
  const generalIcons = ['Rocket', 'Zap', 'Upload', 'RefreshCw', 'Code'];
  return generalIcons[Math.floor(Math.random() * generalIcons.length)];
}

export async function generateAPIUpdates() {
  try {
    // Create updates directory if it doesn't exist
    const updatesDir = join(process.cwd(), 'content', 'docs', 'api', 'updates');
    if (!existsSync(updatesDir)) {
      mkdirSync(updatesDir, { recursive: true });
    }

    // Get current date for the update file name
    const currentDate = new Date();
    const dateString = format(currentDate, 'yyyy-MM-dd');
    
    // Detect changes from OpenAPI spec
    const changes = detectChangesFromOpenAPI();

    // Only generate update if there are changes
    if (changes.length === 0) {
      console.log('No API changes detected');
      return;
    }

    // Select an appropriate icon
    const icon = getUpdateIcon(changes);

    // Group changes by category
    const changesByCategory = changes.reduce((acc, change) => {
      const category = change.category || 'General';
      if (!acc[category]) acc[category] = [];
      acc[category].push(change);
      return acc;
    }, {} as Record<string, APIChange[]>);

    // Generate update page
    const updateContent = `---
title: ${format(currentDate, 'MMMM do, yyyy')}
description: Latest changes to the Meeting BaaS API
icon: ${icon}
---

<Callout type="info" icon={<Info className="h-5 w-5" />}>
  Paris, ${format(currentDate, 'MMMM do, yyyy')}.
</Callout>

We're excited to announce several improvements to our API endpoints.

${Object.entries(changesByCategory).map(([category, categoryChanges]) => `
## ${category}

${categoryChanges.filter(c => c.type === 'breaking').map(change => `
<Callout type="warn">
### ${change.method} ${change.path}

${change.description}
</Callout>
`).join('\n')}

${categoryChanges.filter(c => c.type === 'feature').map(change => `
### ${change.method} ${change.path}

${change.description}
`).join('\n')}

${categoryChanges.filter(c => c.type === 'enhancement').map(change => `
### ${change.method} ${change.path}

${change.description}
`).join('\n')}`).join('\n')}

## Implementation Timeline

These changes are now live in production.
`;

    // Write update page with date in filename
    const updatePath = join(updatesDir, `api-update-${dateString}.mdx`);
    writeFileSync(updatePath, updateContent);

    // Update meta.json
    const metaPath = join(updatesDir, 'meta.json');
    const meta = existsSync(metaPath) 
      ? JSON.parse(readFileSync(metaPath, 'utf-8'))
      : {
          title: "API Updates",
          icon: "Webhook",
          pages: []
        };
    
    const updateFileName = `api-update-${dateString}`;
    if (!meta.pages.includes(updateFileName)) {
      meta.pages.unshift(updateFileName); // Add new update at the start
      writeFileSync(metaPath, JSON.stringify(meta, null, 2));
    }

    console.log(`Generated API update page for ${dateString} with ${changes.length} changes`);
  } catch (error) {
    console.error('Failed to generate API updates:', error);
    process.exit(1);
  }
} 