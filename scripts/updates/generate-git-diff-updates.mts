import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';

// Constants
const GIT_GREPPERS_DIR = join(process.cwd(), 'git_greppers');
const UPDATES_DIR = join(process.cwd(), 'content', 'docs', 'updates');
const META_JSON_PATH = join(UPDATES_DIR, 'meta.json');
const GIT_UPDATES_FILE_PREFIX = 'git-updates-'; // We'll keep this for backward compatibility
const TEMPLATES_DIR = join(process.cwd(), 'scripts', 'updates', 'templates');

// Export constants for use in other files
export { GIT_UPDATES_FILE_PREFIX };

// Define ServiceConfig interface to match constants.ts
interface ServiceConfig {
  name: string;
  icon: string;
  serviceKey: string;
  dirPattern?: string;
  additionalTags?: string[];
  serviceName: string;
}

// Map git diff folders to service configs - consistent with index.mdx components
const GIT_DIFF_FOLDER_MAP: Record<string, ServiceConfig> = {
  'meeting-baas-git-diffs': {
    name: 'API',
    icon: 'Webhook', // Matches <WebhookIcon /> in index.mdx
    serviceKey: 'api',
    additionalTags: ['api-reference'],
    serviceName: 'API',
  },
  'speaking-meeting-bot-git-diffs': {
    name: 'Speaking Bots',
    icon: 'Bot', // Matches <BotIcon /> in index.mdx
    serviceKey: 'speaking-bots',
    additionalTags: ['bots', 'persona'],
    serviceName: 'Speaking Bots',
  },
  'sdk-generator-git-diffs': {
    name: 'TypeScript SDK',
    icon: 'Settings', // Matches <Settings /> in index.mdx
    serviceKey: 'sdk',
    additionalTags: ['sdk', 'typescript'],
    serviceName: 'TypeScript SDK',
  },
  'mcp-on-vercel-git-diffs': {
    name: 'MCP Servers',
    icon: 'ServerCog', // Matches <ServerCog /> in index.mdx
    serviceKey: 'mcp-servers',
    additionalTags: ['mcp', 'server'],
    serviceName: 'MCP Servers',
  },
  'mcp-on-vercel-documentation-git-diffs': {
    name: 'MCP Servers Documentation',
    icon: 'ServerCog', // Use same icon as MCP Servers
    serviceKey: 'mcp-servers',
    additionalTags: ['mcp', 'server', 'documentation'],
    serviceName: 'MCP Servers Documentation',
  },
  'mcp-baas-git-diffs': {
    name: 'MCP BaaS',
    icon: 'ServerCog', // Use same icon as MCP Servers
    serviceKey: 'mcp-servers',
    additionalTags: ['mcp', 'server', 'baas'],
    serviceName: 'MCP BaaS',
  },
  'transcript-seeker-git-diffs': {
    name: 'Transcript Seeker',
    icon: 'Captions', // Matches <CaptionsIcon /> in index.mdx
    serviceKey: 'transcript-seeker',
    additionalTags: ['transcript', 'seeker'],
    serviceName: 'Transcript Seeker',
  },
};

interface CommitInfo {
  hash: string;
  date: string;
  author: string;
  message: string;
  relatedPrMr?: string;
  changedFiles?: string[];
  comments?: string[];
  type?: string;
  branch: string;
}

// Add these interfaces at the top of the file with the other interfaces
interface ParsedGitDiffData {
  date: string;
  commits: CommitInfo[];
}

interface ServiceInfo {
  serviceKey: string;
  serviceName: string;
  icon?: string;
}

/**
 * Get service information by folder name
 */
function getServiceByFolder(folderName: string): ServiceConfig {
  const mapping = GIT_DIFF_FOLDER_MAP[folderName];

  if (!mapping) {
    return {
      name: folderName,
      icon: 'Git',
      serviceKey: 'git-update',
      serviceName: folderName,
    };
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
 * Escapes special characters that might cause issues in MDX and cleans up problematic content
 */
function escapeMdxContent(text: string): string {
  // First handle basic character escaping
  let escapedText = text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;')
    .replace(/!/g, '&#33;')
    .replace(/\[/g, '&#91;')
    .replace(/\]/g, '&#93;');

  // Fix specific issues:

  // 1. ShikiError: Replace ANY problematic code language specifiers
  escapedText = escapedText.replace(/```suggestion:[-+\d]+/g, '```text');
  escapedText = escapedText.replace(
    /```(diff|idiff|version|suggestion)/g,
    '```text',
  );

  // 2. Sanitize any potentially malformed code block markers
  escapedText = escapedText.replace(/```([^a-zA-Z0-9\s])/g, '```text$1');

  // 3. Process links to avoid nested <a> tags (convert to plain text)
  escapedText = escapedText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 4. Remove any HTML tags that might cause rendering issues
  escapedText = escapedText.replace(/<\/?a[^>]*>/g, '');

  return escapedText;
}

/**
 * Generate a content page from parsed git diff data
 */
async function generateUpdatePage(
  parsedData: ParsedGitDiffData,
  diffFile: string,
  serviceInfo: ServiceInfo,
): Promise<void> {
  const date = parsedData.date;

  // Determine service key based on branch names
  let serviceKey = serviceInfo.serviceKey;

  // Check if any of the commits are from update-openapi branches
  const isApiUpdate = parsedData.commits.some(
    (commit) =>
      (commit.relatedPrMr && commit.relatedPrMr.includes('update-openapi-')) ||
      (commit.branch && commit.branch.includes('update-openapi')),
  );

  if (isApiUpdate) {
    serviceKey = 'api';
  }

  // Use the determined service key for the file name
  const fileName = `${serviceKey}-${date}`;
  const outputPath = join(UPDATES_DIR, `${fileName}.mdx`);

  // Get template
  const templatePath = join(TEMPLATES_DIR, 'git-updates.mdx.template');
  const template = await readFileSync(templatePath, 'utf-8');

  // Format date for display (YYYY-MM-DD → Month DD, YYYY)
  const [year, month, day] = date.split('-');
  const displayDate = new Date(
    `${year}-${month}-${day}T00:00:00Z`,
  ).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Generate commit list
  const commitList = parsedData.commits
    .map((commit) => {
      return (
        `### ${commit.message}\n\n` +
        `**Author:** ${commit.author}\n\n` +
        `**Date:** ${commit.date}\n\n` +
        `**Hash:** \`${commit.hash}\`\n\n` +
        (commit.relatedPrMr
          ? `**Related PR/MR:** ${commit.relatedPrMr}\n\n`
          : '')
      );
    })
    .join('\n\n');

  // Generate changed files list
  const changedFilesList = parsedData.commits
    .filter((commit) => commit.changedFiles && commit.changedFiles.length > 0)
    .flatMap((commit) => commit.changedFiles || [])
    .filter((file, index, self) => self.indexOf(file) === index) // Remove duplicates
    .map((file) => {
      const icon = getFileIcon(file);
      return `- ${icon} \`${file}\``;
    })
    .join('\n');

  // Generate PR comments
  const prComments = parsedData.commits
    .filter((commit) => commit.comments && commit.comments.length > 0)
    .map((commit) => {
      return (
        `### Comments for "${commit.message}"\n\n` +
        commit.comments
          ?.map((comment) => `> ${escapeMdxContent(comment)}`)
          .join('\n\n')
      );
    })
    .join('\n\n');

  // Replace placeholders in template
  let content = template
    .replace(/\{\{DATE\}\}/g, displayDate)
    .replace(/\{\{SERVICE_KEY\}\}/g, serviceKey)
    .replace(/\{\{SERVICE_ICON\}\}/g, serviceInfo.icon || 'Git')
    .replace(
      /\{\{SERVICE_NAME\}\}/g,
      isApiUpdate ? 'API' : serviceInfo.serviceName,
    );

  // Replace new placeholders
  content = content.replace(
    /\{\{COMMIT_LIST\}\}/g,
    commitList || 'No commits found.',
  );
  content = content.replace(
    /\{\{CHANGED_FILES_LIST\}\}/g,
    changedFilesList || 'No changed files.',
  );
  content = content.replace(
    /\{\{PR_COMMENTS\}\}/g,
    prComments || 'No pull request comments.',
  );

  await writeFileSync(outputPath, content);
  console.log(`Generated update page: ${outputPath}`);
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

  // Sort pages by date - extract dates from service-date format
  // Keep index at the beginning
  const indexPage = meta.pages.indexOf('index');
  if (indexPage !== -1) {
    meta.pages.splice(indexPage, 1);
  }

  meta.pages.sort((a: string, b: string) => {
    // Keep non-date pages at the end
    const datePatternA = a.match(/^[a-z-]+-(\d{4}-\d{2}-\d{2})$/);
    const datePatternB = b.match(/^[a-z-]+-(\d{4}-\d{2}-\d{2})$/);

    if (!datePatternA && datePatternB) return 1;
    if (datePatternA && !datePatternB) return -1;
    if (!datePatternA && !datePatternB) return 0;

    // Extract dates from page names
    const dateA = datePatternA![1];
    const dateB = datePatternB![1];

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
 * Get a human-readable repo name from the folder name
 */
function getRepoName(folderName: string): string {
  // Convert folder names like 'meeting-baas-git-diffs' to 'Meeting BaaS'
  return folderName
    .replace('-git-diffs', '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
      const commits = parseGitDiffFile(diffFile);

      // Check if any of the commits are from update-openapi branches
      const isApiUpdate = commits.some((commit) => {
        // Check for OpenAPI updates in related PR/MR or branch name
        return (
          (commit.relatedPrMr &&
            commit.relatedPrMr.includes('update-openapi-')) ||
          (commit.branch && commit.branch.includes('update-openapi'))
        );
      });

      // Get folder name from repo path
      const folderName = basename(getDirectoryName(diffFile));

      // Get service info for this folder
      const serviceInfo = getServiceByFolder(folderName);

      // Use the service key based on the actual service, preserving API updates special handling
      const finalServiceKey = isApiUpdate ? 'api' : serviceInfo.serviceKey;

      // Check if an update for this service and date already exists
      const updateFileName = `${finalServiceKey}-${date}`;
      const updateFilePath = join(UPDATES_DIR, `${updateFileName}.mdx`);

      // Also check legacy format for backward compatibility
      const legacyFileName = `${GIT_UPDATES_FILE_PREFIX}${date}`;
      const legacyFilePath = join(UPDATES_DIR, `${legacyFileName}.mdx`);

      // Also check original service key format for backward compatibility
      const originalServiceFileName = `${serviceInfo.serviceKey}-${date}`;
      const originalServiceFilePath = join(
        UPDATES_DIR,
        `${originalServiceFileName}.mdx`,
      );

      if (
        !existsSync(updateFilePath) &&
        !existsSync(legacyFilePath) &&
        !existsSync(originalServiceFilePath)
      ) {
        if (commits.length > 0) {
          const parsedData: ParsedGitDiffData = {
            date,
            commits,
          };
          await generateUpdatePage(parsedData, diffFile, serviceInfo);
          generatedPages.push(`${finalServiceKey}-${date}`);
          if (isApiUpdate) {
            console.log(
              `Generated update page for API on ${date} with ${commits.length} commits from OpenAPI branch`,
            );
          } else {
            console.log(
              `Generated update page for ${serviceInfo.serviceName} on ${date} with ${commits.length} commits`,
            );
          }
        } else {
          console.log(`No valid commits found in ${diffFile}`);
        }
      } else {
        if (isApiUpdate) {
          console.log(`Update for API on ${date} already exists, skipping`);
        } else {
          console.log(
            `Update for ${serviceInfo.serviceName} on ${date} already exists, skipping`,
          );
        }
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
