import { format } from 'date-fns';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';

// Constants
const GIT_GREPPERS_DIR = join(process.cwd(), 'git_greppers');
const UPDATES_DIR = join(process.cwd(), 'content', 'docs', 'updates');
const META_JSON_PATH = join(UPDATES_DIR, 'meta.json');

// Map git diff folders to service keys with hardcoded icons
const GIT_DIFF_FOLDER_MAP: Record<string, { icon: string; name: string }> = {
  'meeting-baas-git-diffs': { icon: 'Server', name: 'Meeting BaaS API' },
  'speaking-meeting-bot-git-diffs': { icon: 'Brain', name: 'Speaking Bots' },
  'sdk-generator-git-diffs': { icon: 'Braces', name: 'TypeScript SDK' },
  'mcp-on-vercel-git-diffs': { icon: 'ServerCog', name: 'MCP Servers' },
  // Add more mappings as new git diff folders are added
};

interface CommitInfo {
  hash: string;
  date: string;
  author: string;
  message: string;
  relatedPrMr: string;
  comments: string[];
  changedFiles: string[];
}

/**
 * Get service information by folder name
 */
function getServiceByFolder(folderName: string): {
  icon: string;
  name: string;
} {
  const mapping = GIT_DIFF_FOLDER_MAP[folderName];

  if (!mapping) {
    return { icon: 'Git', name: folderName };
  }

  return mapping;
}

/**
 * Get the appropriate icon for a file path based on its content/service
 */
function getFileIcon(filePath: string): string {
  const normalizedPath = filePath.toLowerCase();

  // API-related files
  if (
    normalizedPath.includes('/api/') ||
    normalizedPath.includes('api_server') ||
    normalizedPath.includes('openapi')
  ) {
    return '🔌'; // API
  }

  // TypeScript/SDK files
  if (
    normalizedPath.includes('.ts') ||
    normalizedPath.includes('/sdk/') ||
    normalizedPath.includes('/typescript/') ||
    normalizedPath.includes('package.json')
  ) {
    return '📦'; // SDK
  }

  // MCP Server files
  if (
    normalizedPath.includes('/mcp') ||
    normalizedPath.includes('server') ||
    normalizedPath.includes('/server/')
  ) {
    return '🖥️'; // Server
  }

  // Speaking Bot files
  if (
    normalizedPath.includes('/bot') ||
    normalizedPath.includes('bot') ||
    normalizedPath.includes('/persona/') ||
    normalizedPath.includes('speaking')
  ) {
    return '🤖'; // Bot
  }

  // Transcript/Audio files
  if (
    normalizedPath.includes('transcript') ||
    normalizedPath.includes('audio') ||
    normalizedPath.includes('speech') ||
    normalizedPath.includes('voice')
  ) {
    return '🎙️'; // Microphone
  }

  // UI/Frontend files
  if (
    normalizedPath.includes('.css') ||
    normalizedPath.includes('.html') ||
    normalizedPath.includes('components') ||
    normalizedPath.includes('ui/')
  ) {
    return '🖼️'; // UI
  }

  // Docs files
  if (
    normalizedPath.includes('.md') ||
    normalizedPath.includes('docs') ||
    normalizedPath.includes('readme')
  ) {
    return '📄'; // Document
  }

  // Default icon
  return '📁'; // Generic file
}

/**
 * Parses a git diff file and extracts commit information
 */
function parseGitDiffFile(filePath: string): CommitInfo[] {
  const content = readFileSync(filePath, 'utf-8');
  const commits: CommitInfo[] = [];

  let currentCommit: Partial<CommitInfo> = {};
  let inCommit = false;

  // Split the file by lines and process each line
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('#KEY#START_COMMIT#')) {
      inCommit = true;
      currentCommit = {};
    } else if (line.startsWith('#KEY#END_COMMIT#')) {
      if (inCommit && currentCommit.hash) {
        commits.push(currentCommit as CommitInfo);
      }
      inCommit = false;
    } else if (inCommit) {
      if (line.startsWith('#KEY#COMMIT_HASH#')) {
        currentCommit.hash = line.replace('#KEY#COMMIT_HASH#', '').trim();
      } else if (line.startsWith('#KEY#COMMIT_DATE#')) {
        currentCommit.date = line.replace('#KEY#COMMIT_DATE#', '').trim();
      } else if (line.startsWith('#KEY#COMMIT_AUTHOR#')) {
        currentCommit.author = line.replace('#KEY#COMMIT_AUTHOR#', '').trim();
      } else if (line.startsWith('#KEY#COMMIT_MESSAGE#')) {
        currentCommit.message = line.replace('#KEY#COMMIT_MESSAGE#', '').trim();
      } else if (line.startsWith('#KEY#RELATED_PR_MR#')) {
        currentCommit.relatedPrMr = line
          .replace('#KEY#RELATED_PR_MR#', '')
          .trim();
      } else if (line.startsWith('#KEY#CHANGED_FILES#')) {
        // Get the changed files (may span multiple lines)
        const changedFiles: string[] = [];
        let j = i + 1;
        while (j < lines.length && !lines[j].startsWith('#KEY#')) {
          if (lines[j].trim().startsWith('-')) {
            changedFiles.push(lines[j].trim().substring(2));
          }
          j++;
        }
        currentCommit.changedFiles = changedFiles;
      } else if (line.startsWith('#KEY#PR_MR_COMMENTS#')) {
        // Get the PR/MR comments (may span multiple lines)
        const comments: string[] = [];
        let j = i + 1;
        while (
          j < lines.length &&
          !lines[j].startsWith('#KEY#DIFF_RANGE#') &&
          !lines[j].startsWith('#KEY#END_COMMIT#')
        ) {
          if (lines[j].trim()) {
            comments.push(lines[j].trim());
          }
          j++;
        }
        currentCommit.comments = comments;
      }
    }
  }

  return commits;
}

/**
 * Finds all git diff files in git_greppers directories
 */
function findGitDiffFiles(): string[] {
  const diffFiles: string[] = [];

  // Check if git_greppers directory exists
  if (!existsSync(GIT_GREPPERS_DIR)) {
    console.log('Git greppers directory not found');
    return diffFiles;
  }

  // Find all subdirectories that match the pattern *-git-diffs
  const subdirs = readdirSync(GIT_GREPPERS_DIR, { withFileTypes: true })
    .filter(
      (dirent) => dirent.isDirectory() && dirent.name.endsWith('-git-diffs'),
    )
    .map((dirent) => join(GIT_GREPPERS_DIR, dirent.name));

  // Find all diff files in each subdir
  subdirs.forEach((subdir) => {
    const files = readdirSync(subdir)
      .filter((file) => file.startsWith('diffs-') && file.endsWith('.diff'))
      .map((file) => join(subdir, file));

    diffFiles.push(...files);
  });

  return diffFiles;
}

/**
 * Get directory name from a path
 */
function getDirectoryName(path: string): string {
  return path.split('/').slice(0, -1).join('/');
}

/**
 * Escapes special characters that might cause issues in MDX
 */
function escapeMdxContent(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;')
    .replace(/!/g, '&#33;')
    .replace(/\[/g, '&#91;')
    .replace(/\]/g, '&#93;');
}

/**
 * Generates an update page for a given date and commits
 */
function generateUpdatePage(
  date: string,
  commits: CommitInfo[],
  repoPath: string,
): string {
  const formattedDate = format(new Date(date), 'MMMM do, yyyy');
  const fileName = `git-updates-${date}`;
  const filePath = join(UPDATES_DIR, `${fileName}.mdx`);

  // Get folder name from repo path
  const folderName = basename(getDirectoryName(repoPath));

  // Get service info for this folder
  const serviceInfo = getServiceByFolder(folderName);

  // Group commits by type (e.g., feature, bugfix) based on commit message
  const categorizedCommits: Record<string, CommitInfo[]> = {
    Features: [],
    'Bug Fixes': [],
    Improvements: [],
    Other: [],
  };

  commits.forEach((commit) => {
    const message = commit.message.toLowerCase();

    if (
      message.includes('feat') ||
      message.includes('feature') ||
      message.includes('add')
    ) {
      categorizedCommits['Features'].push(commit);
    } else if (
      message.includes('fix') ||
      message.includes('bug') ||
      message.includes('issue')
    ) {
      categorizedCommits['Bug Fixes'].push(commit);
    } else if (
      message.includes('improve') ||
      message.includes('enhance') ||
      message.includes('refactor') ||
      message.includes('update')
    ) {
      categorizedCommits['Improvements'].push(commit);
    } else {
      categorizedCommits['Other'].push(commit);
    }
  });

  // Generate content
  let content = `---
title: ${formattedDate}
description: Changes from recent development in ${serviceInfo.name}
icon: ${serviceInfo.icon}
---

<Callout type="info" icon={<Info className="h-5 w-5" />}>
  Paris, ${formattedDate}.
</Callout>

These changes were extracted from recent development activity in the ${serviceInfo.name} repository.

`;

  // Add each category of commits
  Object.entries(categorizedCommits).forEach(([category, categoryCommits]) => {
    if (categoryCommits.length > 0) {
      content += `## ${category}\n\n`;

      categoryCommits.forEach((commit) => {
        // Clean up commit message (remove merge prefix if present)
        let message = commit.message
          .replace(/^Merge (branch|pull request) .* (into|from) .*$/i, '')
          .trim();
        if (!message) {
          message = commit.message; // Use original if cleaning emptied it
        }

        content += `### ${message}\n\n`;

        if (commit.relatedPrMr && !commit.relatedPrMr.includes('None found')) {
          content += `<Callout type="note">
${commit.relatedPrMr}
</Callout>\n\n`;
        }

        if (commit.changedFiles && commit.changedFiles.length > 0) {
          content += `#### Changed Files\n\n`;
          commit.changedFiles.forEach((file) => {
            const icon = getFileIcon(file);
            content += `- ${icon} \`${file}\`\n`;
          });
          content += '\n';
        }

        // Add PR/MR comments in a code block
        if (commit.comments && commit.comments.length > 0) {
          content += `#### PR/MR Comments\n\n`;
          content += `\`\`\`text\n`; // Specify text format to avoid MDX parsing
          commit.comments.forEach((comment) => {
            // Escape any problematic characters for MDX
            content += `${escapeMdxContent(comment)}\n`;
          });
          content += `\`\`\`\n\n`;
        }
      });
    }
  });

  // Write the file
  writeFileSync(filePath, content);

  return fileName;
}

/**
 * Updates the meta.json file with new update pages
 */
function updateMetaJson(newPages: string[]): void {
  const metaJsonPath = META_JSON_PATH;

  // Read existing meta.json
  let meta: any = {
    title: 'Updates',
    icon: 'MonitorUp',
    description:
      'Latest updates, improvements, and changes to Meeting BaaS services',
    root: true,
    sortBy: 'date',
    sortOrder: 'desc',
    pages: ['index'],
  };

  if (existsSync(metaJsonPath)) {
    try {
      meta = JSON.parse(readFileSync(metaJsonPath, 'utf-8'));
    } catch (error) {
      console.error('Error reading meta.json:', error);
    }
  }

  // Add new pages to the pages array if they don't already exist
  newPages.forEach((page) => {
    if (!meta.pages.includes(page)) {
      meta.pages.push(page);
    }
  });

  // Sort pages by date (the format is git-updates-YYYY-MM-DD)
  // Keep index at the beginning
  const indexPage = meta.pages.indexOf('index');
  if (indexPage !== -1) {
    meta.pages.splice(indexPage, 1);
  }

  meta.pages.sort((a: string, b: string) => {
    // Keep non-git-updates pages at the end
    if (!a.startsWith('git-updates-') && b.startsWith('git-updates-')) return 1;
    if (a.startsWith('git-updates-') && !b.startsWith('git-updates-'))
      return -1;
    if (!a.startsWith('git-updates-') && !b.startsWith('git-updates-'))
      return 0;

    // Extract dates from page names
    const dateA = a.replace('git-updates-', '');
    const dateB = b.replace('git-updates-', '');

    // Compare dates (newest first)
    return dateB.localeCompare(dateA);
  });

  // Add index back to the beginning
  if (indexPage !== -1) {
    meta.pages.unshift('index');
  }

  // Write back meta.json
  writeFileSync(metaJsonPath, JSON.stringify(meta, null, 2));
  console.log(`Updated meta.json with new pages: ${newPages.join(', ')}`);
}

/**
 * Main function to generate updates from git diff files
 */
export async function generateGitDiffUpdates(): Promise<string[]> {
  console.log('Generating updates from git diff files...');

  // Find all git diff files
  const diffFiles = findGitDiffFiles();
  console.log(`Found ${diffFiles.length} diff files`);

  // Process each diff file
  const generatedPages: string[] = [];

  for (const diffFile of diffFiles) {
    const filename = basename(diffFile);
    const match = filename.match(/diffs-(\d{4}-\d{2}-\d{2})\.diff/);

    if (match) {
      const date = match[1];

      // Check if an update for this date already exists
      const updateFileName = `git-updates-${date}`;
      const updateFilePath = join(UPDATES_DIR, `${updateFileName}.mdx`);

      if (!existsSync(updateFilePath)) {
        const commits = parseGitDiffFile(diffFile);

        if (commits.length > 0) {
          const page = generateUpdatePage(date, commits, diffFile);
          generatedPages.push(page);
          console.log(
            `Generated update page for ${date} with ${commits.length} commits`,
          );
        } else {
          console.log(`No valid commits found in ${diffFile}`);
        }
      } else {
        console.log(`Update for ${date} already exists, skipping`);
      }
    } else {
      console.log(`Invalid filename format: ${filename}`);
    }
  }

  // Update meta.json with new pages
  if (generatedPages.length > 0) {
    updateMetaJson(generatedPages);
  }

  return generatedPages;
}

// Run the function automatically when this module is executed directly
if (import.meta.url.endsWith(basename(process.argv[1]))) {
  generateGitDiffUpdates().catch((error) => {
    console.error('Error generating git diff updates:', error);
    process.exit(1);
  });
}
