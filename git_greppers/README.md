# Git Greppers

A set of bash scripts to generate git diffs from recent commits, with PR/MR information from GitHub or GitLab.

## Overview

Git Greppers extracts commit history from a git repository and generates daily diff files that include:

- Commit details (hash, date, author, message)
- Related PR/MR information from GitHub or GitLab
- PR/MR comments and discussion
- Changed files list
- Code diffs with configurable context lines

## Requirements

- Bash shell environment
- Git
- GitHub CLI (`gh`) for GitHub repositories
- GitLab CLI (`glab`) for GitLab repositories

## Installation

1. Clone or download this repository
2. Make the scripts executable:
   ```bash
   chmod +x git_greppers/*.sh
   ```

## Usage

### Quick Start

The easiest way to run Git Greppers is with the helper script:

```bash
./git_grepper_helper.sh --repo /path/to/repository
```

### Manual Execution

You can also run the main script directly:

```bash
./git_grepper.sh /path/to/repository [debug_level] [flags]
```

### Options

- `--repo PATH` - Set repository path (default: current directory)
- `--verbose` or `-v` - Increase verbosity
- `--quiet` or `-q` - Decrease verbosity
- `--debug LEVEL` - Set debug level (0-3, default: 1)
- `--no-diff` - Skip generating diffs (faster for large repositories)
- `--only-with-pr-mr` - Only process commits with related PR/MR references
- `--help` or `-h` - Show help message

## Output Format

Git Greppers uses a consistent `#KEY#` format for all output files to facilitate automated parsing:

### Log File Keys

- `#KEY#BRANCH#` - Primary branch name (main or master)
- `#KEY#GENERATED_DATE#` - Date when the processing started
- `#KEY#REPOSITORY#` - Repository folder name
- `#KEY#EXCLUDES#` - Files excluded from diff generation
- `#KEY#MAX_DIFF_LINES#` - Maximum diff context lines
- `#KEY#GROUP_BY#` - Grouping method (day)
- `#KEY#INCLUDES#` - What's included in the output
- `#KEY#TOTAL_FOUND#` - Total number of commits found
- `#KEY#ONLY_WITH_PR_MR#` - Whether only processing commits with PR/MR references
- `#KEY#PROCESS_COMMIT#` - Processing a specific commit
- `#KEY#DIFF_ADDED#` - Diff file created/updated
- `#KEY#DIFF_FILES_SUMMARY#` - Summary of all diff files created
- `#KEY#TOTAL_COMMITS#` - Total commits processed
- `#KEY#SKIPPED_COMMITS#` - Commits skipped (no PR/MR)
- `#KEY#COMPLETED_AT#` - Date when processing completed

### Diff File Keys

- `#KEY#DATE#` - Date for this diff file
- `#KEY#MAX_DIFF_LINES#` - Maximum diff context lines
- `#KEY#EXCLUDES#` - Files excluded from diff generation
- `#KEY#START_COMMIT#` - Start of a new commit entry
- `#KEY#COMMIT_HASH#` - Commit hash
- `#KEY#COMMIT_DATE#` - Commit date and time
- `#KEY#COMMIT_AUTHOR#` - Commit author
- `#KEY#COMMIT_MESSAGE#` - Commit message
- `#KEY#RELATED_PR_MR#` - Related PR/MR information
- `#KEY#CHANGED_FILES#` - List of changed files
- `#KEY#PR_MR_COMMENTS#` - PR/MR comments and discussion
- `#KEY#MERGE_COMMIT_DETAILS#` - Merge commit information if applicable
- `#KEY#DIFF_RANGE#` - Commit range for the diff
- `#KEY#GIT_DIFF#` - Git diff content
- `#KEY#GIT_DIFF_SKIPPED#` - Indicator that diff was skipped
- `#KEY#END_COMMIT#` - End of a commit entry

## Output Files

Generated files are saved in a directory named `[repository-name]-git-diffs`, with:

1. `processing.log` - Contains processing information and summary
2. `diffs-YYYY-MM-DD.diff` - Daily diff files containing commit information

## Examples

### Get diffs from a GitHub repository:

```bash
./git_grepper.sh ~/projects/my-github-repo 1
```

### Get only PR information without diffs (faster):

```bash
./git_grepper.sh ~/projects/my-github-repo 2 --no-diff --only-with-pr-mr
```

### Using helper script with increased verbosity:

```bash
./git_grepper_helper.sh --repo ~/projects/my-repo --verbose
```

## Script Architecture

- `git_grepper.sh` - Main script
- `git_grepper_helper.sh` - Helper script with simplified interface
- `utils.sh` - Utility functions
- `github_handler.sh` - GitHub-specific functions
- `gitlab_handler.sh` - GitLab-specific functions
- `processing.sh` - Commit processing and diff generation

## Parsing Output

The `#KEY#` format makes it easy to parse the output with tools like `grep`, `awk` or `sed`:

```bash
# Get all commit hashes
grep "#KEY#COMMIT_HASH#" diffs-*.diff | awk '{print $2}'

# Get all PR/MR links
grep "#KEY#RELATED_PR_MR#" diffs-*.diff | grep -v "None found"
```
