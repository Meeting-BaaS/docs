import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Interface for git changes
 */
export interface GitChanges {
  modified: string[];
  added: string[];
  deleted: string[];
}

/**
 * Sanitizes content for MDX format
 */
export function sanitizeForMdx(content: string): string {
  return content.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Gets git changes including modified, added, and deleted files
 */
export function getGitChanges(): GitChanges {
  // Get git status for changes
  const gitStatus = execSync('git status --porcelain', {
    maxBuffer: 10 * 1024 * 1024, // 10MB buffer limit
  }).toString();

  // Parse git status output
  const modified: string[] = [];
  const added: string[] = [];
  const deleted: string[] = [];

  gitStatus.split('\n').forEach((line) => {
    if (!line) return;
    const status = line.substring(0, 2).trim();
    const file = line.substring(3);

    if (status === 'M' || status === 'MM') {
      modified.push(file);
    } else if (status === 'A' || status === '??') {
      added.push(file);
    } else if (status === 'D') {
      deleted.push(file);
    }
  });

  // Get untracked files and directories explicitly
  try {
    // This command lists all untracked files recursively
    const untrackedFiles = execSync(
      'git ls-files --others --exclude-standard',
      {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer limit
      },
    )
      .toString()
      .trim()
      .split('\n')
      .filter(Boolean);

    // Add untracked files to the added array
    added.push(...untrackedFiles);
  } catch (err) {
    console.error('Error getting untracked files:', err);
  }

  return { modified, added, deleted };
}

/**
 * Updates meta.json with new update pages
 */
export async function updateMetaJson(newPages: string[]): Promise<void> {
  try {
    // Filter out null values
    const validPages = newPages.filter(Boolean);

    if (validPages.length === 0) {
      console.log('No new pages to add to meta.json');
      return;
    }

    // Path to meta.json
    const metaPath = join(
      process.cwd(),
      'content',
      'docs',
      'updates',
      'meta.json',
    );

    // Define type for meta.json structure
    interface MetaJson {
      title: string;
      icon: string;
      description: string;
      root: boolean;
      sortBy: string;
      sortOrder: string;
      pages: string[];
    }

    // Read current meta.json
    let meta: MetaJson = {
      title: 'Updates',
      icon: 'MonitorUp',
      description:
        'Latest updates, improvements, and changes to Meeting BaaS services',
      root: true,
      sortBy: 'date',
      sortOrder: 'desc',
      pages: ['index'],
    };

    if (existsSync(metaPath)) {
      meta = JSON.parse(readFileSync(metaPath, 'utf-8')) as MetaJson;
    }

    // Add new pages to the pages array if they don't already exist
    for (const page of validPages) {
      const pageName = page.replace('.mdx', '');
      if (!meta.pages.includes(pageName)) {
        meta.pages.unshift(pageName); // Add to start of array for most recent
      }
    }

    // Write updated meta.json
    writeFileSync(metaPath, JSON.stringify(meta, null, 2));

    console.log(`Updated meta.json with ${validPages.length} new pages`);
  } catch (error) {
    console.error('Failed to update meta.json:', error);
  }
}
