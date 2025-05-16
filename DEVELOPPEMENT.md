# Meeting BaaS Documentation

<p align="center"><a href="https://discord.com/invite/dsvFgDTr6c"><img height="60px" src="https://user-images.githubusercontent.com/31022056/158916278-4504b838-7ecb-4ab9-a900-7dc002aade78.png" alt="Join our Discord!"></a></p>

This is a Next.js application using Fumadocs for generating and maintaining Meeting BaaS service documentation.

## Development

Run development server:

```bash
# Start development server
pnpm dev

# Build for production
pnpm build
```

Open http://localhost:3000 with your browser to see the result.

## Documentation Updates

The project includes several scripts for managing documentation updates:

### Enhancing Update Files with AI

The project includes an AI-powered enhancement script that uses OpenRouter (with Anthropic's Claude models) to improve automatically generated documentation:

```bash
# Enhance the most recent update file
pnpm enhance:updates --key=your_openrouter_api_key

# Process all update files
pnpm enhance:updates --key=your_openrouter_api_key --all

# Process updates for a specific service
pnpm enhance:updates --key=your_openrouter_api_key --service=api

# Process updates for a specific date
pnpm enhance:updates --key=your_openrouter_api_key --date=2023-10-15

# Use a different model
pnpm enhance:updates --key=your_openrouter_api_key --model=anthropic/claude-3-opus-20240229

# Enable verbose logging
pnpm enhance:updates --key=your_openrouter_api_key --verbose
```

You will need to obtain an OpenRouter API key from [openrouter.ai](https://openrouter.ai) to use this feature.

### Prompt System

The project uses a centralized prompt system in `scripts/prompts.ts` to manage all AI enhancement prompts. This system:

1. Organizes prompts into categories:
   - `codingStyle`: Fumadocs components and usage examples
   - `instructions`: Enhancement guidelines and rules
   - `templates`: Reusable templates for headers and footers
   - `formatting`: Code blocks and table formatting
   - `metadata`: Valid update types and services
   - `validation`: Required fields and validation rules

2. Provides helper functions:
   ```typescript
   // Get a specific prompt
   const prompt = getPrompt('codingStyle', 'fumadocsComponents');
   
   // Get all prompts for a category
   const allInstructions = getCategoryPrompts('instructions');
   ```

3. Includes type definitions for type safety:
   ```typescript
   type PromptCategory = 'codingStyle' | 'instructions' | 'templates' | 'formatting' | 'metadata' | 'validation';
   ```

4. Maintains consistent formatting and rules across all generated content

The prompt system ensures consistent documentation quality and makes it easy to update enhancement rules and templates.

### Git Diff Updates

Updates are automatically generated from git diff files in the `git_greppers` directory. These updates include service-specific styling with colored icons in the sidebar.

#### Setting Up Local Git Repositories

The project includes a script to automatically collect Git diffs from local repositories:

```bash
# Make the script executable
chmod +x git_greppers/local-git-setup.sh

# Run the setup script
./git_greppers/local-git-setup.sh
```

This script will:

1. Process the repositories defined in the configuration
2. Generate diff files in the appropriate folders
3. Clean existing git updates
4. Generate new update files based on the diffs

You can also run the git grepper script directly with various options:

```bash
# Basic usage with required parameters
./git_greppers/git_grepper.sh --repo-path=/path/to/repo [options]

# Available options:
#   --repo-path=<path>     Path to the repository (required)
#   --debug-level=<n>      Debug level (1-3, default: 1)
#   --max-diff-lines=<n>   Maximum number of diff lines (default: 100)
#   --no-diff              Skip generating diffs
#   --with-diff            Include full diffs in output
#   --include-code         Include code changes in output
#   --only-with-pr-mr      Only process commits with PR/MR references
#   --overwrite            Overwrite existing files
#   --days=<n>             Number of days to look back (default: 90)
#   --help                 Show help message

# Examples:
# Process with debug level 3 and only PR/MR commits
./git_greppers/git_grepper.sh --repo-path=/path/to/repo --debug-level=3 --only-with-pr-mr

# Process and overwrite existing files
./git_grepper.sh --repo-path=/path/to/repo --overwrite

# Skip diffs and only process PR/MR commits
./git_grepper.sh --repo-path=/path/to/repo --no-diff --only-with-pr-mr

# Process commits from the last 14 days
./git_grepper.sh --repo-path=/path/to/repo --days=14
```

You need to configure your repository paths in `git_greppers/config.json`:

```json
{
  "repositories": {
    "meeting-baas": "/path/to/meeting-baas",
    "speaking-meeting-bot": "/path/to/speaking-meeting-bot",
    "sdk-generator": "/path/to/sdk-generator",
    "mcp-on-vercel": "/path/to/mcp-on-vercel",
    "mcp-on-vercel-documentation": "/path/to/mcp-on-vercel-documentation",
    "mcp-baas": "/path/to/mcp-baas"
  }
}
```

Each path should point to a valid Git repository that you want to include in the documentation updates.

#### Requirements

- `jq` is required for parsing the configuration file. Install it using:
  ```bash
  brew install jq
  ```

#### Basic Commands

```bash
# Clean all git update files
pnpm clean:git-updates

# Generate git diff updates (with recommended flags)
pnpm test:git-updates --with-diff --include-code --only-with-pr-mr --overwrite --debug=2 --days=7

# Regenerate all git diff updates (destructive - deletes and recreates all files)
pnpm regenerate:git-updates

# Update a single repository (e.g., speaking-meeting-bot)
pnpm update:speaking-bots

# Update any repository by name
pnpm update:repo $REPO

# Restart updates for a specific service (e.g., meeting-baas)
SERVICE=meeting-baas DAYS=90 pnpm restart:service

# Restart updates for a service without PR/MR filter
SERVICE=meeting-baas DAYS=90 pnpm restart:service --no-pr-mr

# Restart updates for a service with overwrite flag
SERVICE=meeting-baas DAYS=90 pnpm restart:service --overwrite

# Restart updates for a service with both flags
SERVICE=meeting-baas DAYS=90 pnpm restart:service --overwrite --no-pr-mr

# Setup git updates - cleans and regenerates
pnpm setup:git-updates
```

> **Important Note**:
>
> - `test:git-updates` now includes recommended flags by default: `--with-diff --include-code --only-with-pr-mr --overwrite --debug=2 --days=7`
> - `regenerate:git-updates` deletes all existing update files before creating new ones (will overwrite customized files)
> - If you've customized any update files, prefer using `test:git-updates` with appropriate flags to preserve your changes
> - The `restart:service` command will only clean and regenerate files for the specified service, preserving updates for other services
> - Use the `--overwrite` flag to force regeneration of existing update files
> - Use the `--no-pr-mr` flag to include all commits, not just those with PR/MR references

## Three commands to update documentation with new changes only

To fetch, generate, and enhance documentation updates **only for new changes** (without modifying existing files), use the following three commands:

```bash
# 1. Generate new git diff files (skips existing ones)
./git_greppers/git_grepper.sh --repo-path=/path/to/your/repo --with-diff --include-code --only-with-pr-mr --days=7

# 2. Generate update files from new diffs (skips existing .mdx files)
pnpm tsx ./scripts/updates/generate-git-diff-updates.mts --service=meeting-baas

# 3. Enhance only new update files with AI (skips already enhanced files)
pnpm enhance:updates --service=meeting-baas --key=your_openrouter_api_key --untracked
```

> **Note:**  
> - Do **not** use the `--overwrite` flag if you want to preserve existing files.
> - These commands will only create and process files for new changes, leaving previous updates untouched.
> - The `--untracked` flag in the enhance command ensures only new files are processed.
> - The `--only-with-pr-mr` flag ensures we only process commits with associated PR/MR references.
> - The `--days=7` flag limits the lookback period to the last week of changes. 