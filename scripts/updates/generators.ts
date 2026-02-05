import { execSync } from 'child_process';
import { format } from 'date-fns';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { ServiceConfig } from './types';
import { getGitChanges, sanitizeForMdx } from './utils';

// Define constants
const CURRENT_DATE = format(new Date(), 'yyyy-MM-dd');
const UPDATES_DIR = './content/docs/updates';
const TEMPLATES_DIR = './scripts/updates/templates';
const GIT_UPDATES_FILE_PREFIX = 'git-updates-';

/**
 * Generates an update file for a service based on git changes
 */
export async function generateServiceUpdate(
  config: ServiceConfig,
): Promise<string | null> {
  console.log(`Generating updates for ${config.name}...`);

  try {
    // Check if directory exists for the service
    if (!existsSync(config.dirPattern)) {
      console.log(`Directory not found for ${config.name}, skipping`);
      return null;
    }

    // Get git changes
    const { modified, added, deleted } = getGitChanges();

    // Group all files by their containing folder
    const allChanges = [...modified, ...added, ...deleted];

    // Filter files related to this service
    const serviceFiles = allChanges.filter((file) => {
      // Check if file path matches the service directory pattern
      const isMatch = file.startsWith(config.dirPattern);

      // If there are excludes, check if file should be excluded
      if (isMatch && config.excludePatterns?.length) {
        return !config.excludePatterns.some((pattern: string) =>
          file.includes(pattern),
        );
      }

      return isMatch;
    });

    // If no changes, skip update
    if (serviceFiles.length === 0) {
      console.log(`No changes detected for ${config.name}, skipping`);
      return null;
    }

    // Ensure updates directory exists
    if (!existsSync(UPDATES_DIR)) {
      mkdirSync(UPDATES_DIR, { recursive: true });
    }

    // Create filename with current date and service key
    const TODAY = format(new Date(), 'yyyy-MM-dd');
    const updateFilename = `${config.serviceKey}-${TODAY}.mdx`;
    const updatePath = join(UPDATES_DIR, updateFilename);

    // Group files by root folder
    const filesByFolder: Record<string, string[]> = {};
    const rootFolders = new Set<string>();

    serviceFiles.forEach((file) => {
      // Skip the top-level directory itself
      if (file === config.dirPattern) return;

      // Get the immediate subfolder after the main pattern
      const relativePath = file.slice(config.dirPattern.length).split('/');
      const rootFolder = relativePath[0] || 'root';

      if (!filesByFolder[rootFolder]) {
        filesByFolder[rootFolder] = [];
      }

      filesByFolder[rootFolder].push(file);
      rootFolders.add(rootFolder);
    });

    // If there's only one file changed, focus on that single file
    const isSingleFile = serviceFiles.length === 1;

    // Get git diff for service files
    let gitDiff = '';
    try {
      if (isSingleFile) {
        // For a single file, get a focused diff
        gitDiff = execSync(`git diff HEAD -- "${serviceFiles[0]}"`).toString();
      } else {
        // For multiple files, get diffs grouped by folder
        gitDiff = execSync(
          `git diff HEAD -- "${config.dirPattern}"`,
        ).toString();
      }
    } catch (err) {
      console.error(`Error getting git diff for ${config.name}:`, err);
      gitDiff = 'Error retrieving git diff.';
    }

    // Generate content based on template
    const templatePath = join(TEMPLATES_DIR, 'service-update.mdx.template');

    // Template file is required - check if it exists
    if (!existsSync(templatePath)) {
      throw new Error(
        `Template file not found: ${templatePath}. The templates directory must be included in your project.`,
      );
    }

    // Set up template variables
    const fileName = isSingleFile
      ? (serviceFiles[0].split('/').pop() ?? 'unknown')
      : '';
    const foldersList = Array.from(rootFolders)
      .map((folder) => `- ${folder}`)
      .join('\n');
    const filesList = serviceFiles.join('\n');
    const sanitizedGitDiff = sanitizeForMdx(gitDiff);
    const tagsString = config.additionalTags?.join(', ') ?? '';

    // Use template file
    const templateContent = readFileSync(templatePath, 'utf-8');

    // Replace template variables with actual values
    let updateContent = templateContent
      .replace(/\{\{TODAY\}\}/g, TODAY)
      .replace(/\{\{SERVICE_NAME\}\}/g, config.name)
      .replace(/\{\{SERVICE_ICON\}\}/g, config.icon)
      .replace(/\{\{TAGS\}\}/g, tagsString)
      .replace(/\{\{FILE_NAME\}\}/g, fileName)
      .replace(/\{\{FOLDERS_LIST\}\}/g, foldersList)
      .replace(/\{\{FILES_LIST\}\}/g, filesList)
      .replace(/\{\{GIT_DIFF\}\}/g, sanitizedGitDiff);

    // Use different templates based on single file vs multiple files
    if (isSingleFile) {
      updateContent = updateContent.replace(
        /\{\{SINGLE_FILE_DISPLAY\}\}/g,
        'block',
      );
      updateContent = updateContent.replace(
        /\{\{MULTI_FILE_DISPLAY\}\}/g,
        'none',
      );
    } else {
      updateContent = updateContent.replace(
        /\{\{SINGLE_FILE_DISPLAY\}\}/g,
        'none',
      );
      updateContent = updateContent.replace(
        /\{\{MULTI_FILE_DISPLAY\}\}/g,
        'block',
      );
    }

    // Write update file
    writeFileSync(updatePath, updateContent);
    console.log(`Generated update: ${updatePath}`);

    // Return the filename for meta.json update
    return updateFilename;
  } catch (error) {
    console.error(`Error generating update for ${config.name}:`, error);
    return null;
  }
}

/**
 * Creates or restores the index.mdx file from the template
 */
export async function createIndexFile(): Promise<void> {
  console.log('Creating or restoring index.mdx file...');

  // Ensure updates directory exists
  if (!existsSync(UPDATES_DIR)) {
    mkdirSync(UPDATES_DIR, { recursive: true });
  }

  const indexPath = join(UPDATES_DIR, 'index.mdx');
  const templatePath = join(TEMPLATES_DIR, 'index.mdx.template');

  // Check if template exists
  if (!existsSync(templatePath)) {
    throw new Error(
      `Template file not found: ${templatePath}. The templates directory must be included in your project.`,
    );
  }

  try {
    // Read template content
    const templateContent = readFileSync(templatePath, 'utf-8');

    // Write to index.mdx
    writeFileSync(indexPath, templateContent);
    console.log(`Successfully created/restored index.mdx`);
  } catch (error) {
    console.error('Error creating index.mdx file:', error);
  }
}
