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

# Generate git diff updates (non-destructive - only creates new files)
pnpm test:git-updates

# Regenerate all git diff updates (destructive - deletes and recreates all files)
pnpm regenerate:git-updates

# Update a single repository (e.g., speaking-meeting-bot)
pnpm update:speaking-bots

# Update any repository by name
pnpm update:repo $REPO

# Setup git updates - cleans and regenerates
pnpm setup:git-updates
```

> **Important Note**:
>
> - `test:git-updates` only creates new files without modifying existing ones
> - `regenerate:git-updates` deletes all existing update files before creating new ones (will overwrite customized files)
> - If you've customized any update files, prefer using `test:git-updates` to preserve your changes

#### Common Workflows

1. **Full Rebuild (recommended for first run)**:

   ```bash
   # Transpile TypeScript, clean updates, generate all updates, run dev server
   pnpm transpile && pnpm clean:git-updates && pnpm test:all-updates && pnpm dev
   ```

2. **Update After Code Changes**:

   ```bash
   # Transpile and regenerate all updates
   pnpm transpile && pnpm test:all-updates
   ```

3. **Clean Start for Development**:
   ```bash
   # Clean everything, transpile, and run dev
   pnpm clean && pnpm transpile && pnpm dev
   ```

### Service Updates

Service updates track changes in specific service directories and generate appropriate documentation updates.

```bash
# Generate updates for services
pnpm test:updates

# Run all update generators (git diffs + services)
pnpm test:all-updates

# Clean updates but keep OpenAPI docs
pnpm clean:updates:keep-openapi

# Clean all updates
pnpm clean:updates
```

### Other Scripts

```bash
# Transpile TypeScript files
pnpm transpile

# Run pre-build operations
pnpm build:pre

# Run post-build operations
pnpm build:post

# Run linting
pnpm lint
```

## Project Structure

```
meeting-baas-docs/
├── app/                # Next.js app directory
├── content/
│   └── docs/
│       └── updates/    # Generated update files
├── git_greppers/       # Git diff files used for updates
│   ├── config.json     # Repository configuration
│   ├── meeting-baas-git-diffs/
│   ├── sdk-generator-git-diffs/
│   └── ...
├── scripts/
│   └── updates/
│       ├── templates/  # Templates for generated files
│       │   ├── components/  # Directory for reusable components
│       │   ├── git-updates.mdx.template
│       │   ├── service-update.mdx.template
│       │   └── index.mdx.template
│       ├── generate-git-diff-updates.mts  # Git updates generator
│       ├── generators.ts                 # Service updates generator
│       └── ...
└── ...
```
