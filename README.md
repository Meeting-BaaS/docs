# Meeting BaaS Documentation

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

1. Process the repositories defined in the script
2. Generate diff files in the appropriate folders
3. Clean existing git updates
4. Generate new update files based on the diffs

You may need to modify the repository paths in `git_greppers/local-git-setup.sh` to match your local environment:

```bash
# Inside local-git-setup.sh
REPOSITORIES=(
  "/path/to/meeting-baas"
  "/path/to/speaking-meeting-bot"
  "/path/to/sdk-generator"
  "/path/to/mcp-on-vercel"
)
```

Each path should point to a valid Git repository that you want to include in the documentation updates.

#### Basic Commands

```bash
# Clean all git update files
pnpm clean:git-updates

# Generate git diff updates
pnpm test:git-updates

# Setup git updates - cleans and regenerates
pnpm setup:git-updates
```

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
