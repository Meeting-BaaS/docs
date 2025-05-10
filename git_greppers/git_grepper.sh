#!/bin/bash

# Force unbuffered output for all commands
export PYTHONUNBUFFERED=1
export PYTHONIOENCODING=UTF-8
# Ensure stdout is not buffered
if [ -t 1 ]; then
  # If stdout is a terminal, disable line buffering
  stdbuf -o0 true
fi

# Script to generate git diffs from commits on master/main branch for the last N days
# Also finds related PRs/MRs from GitHub or GitLab
# Usage: ./git_grepper.sh [repository_path] [debug_level] [flags]
#
# Supported flags:
#   --no-diff           Skip generating diffs (faster for large repositories)
#   --only-with-pr-mr   Only process commits with related PR/MR references
#   --overwrite         Overwrite existing files (default: skip existing files)
#   --days N            Number of days to look back (default: 7)
#
# Example: ./git_grepper.sh /path/to/repo 3 --no-diff --only-with-pr-mr --overwrite --days 14

# Store the launch directory
LAUNCH_DIR=$(pwd)

# Source utility scripts
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"
source "${SCRIPT_DIR}/utils.sh"
source "${SCRIPT_DIR}/github_handler.sh"
source "${SCRIPT_DIR}/gitlab_handler.sh"
source "${SCRIPT_DIR}/processing.sh"

# Set default values
REPO_PATH=${1:-.}
DEBUG_LEVEL=${2:-1}  # Debug levels: 0=none, 1=normal, 2=verbose, 3=very verbose
MAX_DIFF_LINES=100   # Maximum number of lines per diff block
SKIP_DIFF=false      # Default to include diffs
ONLY_WITH_PR_MR=false # Default to include all commits
OVERWRITE=false      # Default to skip existing files
DAYS=7              # Default to 7 days

# Check if --no-diff or --only-with-pr-mr flags are present in any position
for arg in "$@"; do
  if [[ "$arg" == "--no-diff" || "$arg" == "-no-diff" ]]; then
    SKIP_DIFF=true
    debug 1 "Flag detected: No diff generation (--no-diff)"
  elif [[ "$arg" == "--only-with-pr-mr" || "$arg" == "-only-with-pr-mr" ]]; then
    ONLY_WITH_PR_MR=true
    debug 1 "Flag detected: Only processing commits with PR/MR references (--only-with-pr-mr)"
  elif [[ "$arg" == "--overwrite" || "$arg" == "-overwrite" ]]; then
    OVERWRITE=true
    debug 1 "Flag detected: Will overwrite existing files (--overwrite)"
  elif [[ "$arg" =~ ^--days=([0-9]+)$ ]]; then
    DAYS="${BASH_REMATCH[1]}"
    debug 1 "Flag detected: Will look back $DAYS days (--days=$DAYS)"
  elif [[ "$arg" =~ ^--days[[:space:]]([0-9]+)$ ]]; then
    DAYS="${BASH_REMATCH[1]}"
    debug 1 "Flag detected: Will look back $DAYS days (--days $DAYS)"
  fi
done

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Debug function with colors and unbuffered output
debug() {
  local level=$1
  local message=$2
  
  if [[ $DEBUG_LEVEL -ge $level ]]; then
    # Select color based on debug level
    case $level in
      1) printf "${GREEN}[DEBUG-$level]${NC} %s\n" "$message" ;;
      2) printf "${YELLOW}[DEBUG-$level]${NC} %s\n" "$message" ;;
      3) printf "${RED}[DEBUG-$level]${NC} %s\n" "$message" ;;
      *) printf "[DEBUG-$level] %s\n" "$message" ;;
    esac
  fi
}

debug 1 "Script started with parameters: REPO_PATH=$REPO_PATH, DEBUG_LEVEL=$DEBUG_LEVEL, MAX_DIFF_LINES=$MAX_DIFF_LINES, SKIP_DIFF=$SKIP_DIFF, ONLY_WITH_PR_MR=$ONLY_WITH_PR_MR, OVERWRITE=$OVERWRITE, DAYS=$DAYS"

# Check if the provided path is a git repository
validate_git_repo "$REPO_PATH"

# Extract the repository folder name
REPO_FOLDER=$(basename "$(cd "$REPO_PATH" && pwd)")
# Create output directory name based on repo folder name
OUTPUT_DIR="${SCRIPT_DIR}/${REPO_FOLDER}-git-diffs"

debug 1 "Repository folder name: $REPO_FOLDER"
debug 1 "Output directory will be: $OUTPUT_DIR"

# Change to the repository directory
cd "$REPO_PATH" || exit 1
debug 1 "Changed directory to: $(pwd)"

# Determine if the repository uses master or main as the primary branch
PRIMARY_BRANCH=$(determine_primary_branch "$REPO_PATH")
debug 1 "Found '$PRIMARY_BRANCH' branch"

# Get repository type and URL
REPO_INFO=$(get_repo_info "$REPO_PATH")
REPO_TYPE=$(echo "$REPO_INFO" | cut -d'|' -f1)
REMOTE_URL=$(echo "$REPO_INFO" | cut -d'|' -f2)

debug 1 "Remote URL: $REMOTE_URL"

# Setup based on repository type
IS_GITHUB=false
IS_GITLAB=false
REPO_IDENTIFIER=""

if [[ $REPO_TYPE == "github" ]]; then
  IS_GITHUB=true
  debug 1 "GitHub repository detected"
  
  # Check GitHub CLI availability
  check_github_cli
  
  # Extract repository identifier
  REPO_IDENTIFIER=$(extract_repo_identifier "github" "$REMOTE_URL")
  debug 1 "Repository identifier: $REPO_IDENTIFIER"
  
elif [[ $REPO_TYPE == "gitlab" ]]; then
  IS_GITLAB=true
  debug 1 "GitLab repository detected"
  
  # Check GitLab CLI availability
  check_gitlab_cli
  
  # Extract repository identifier
  REPO_IDENTIFIER=$(extract_repo_identifier "gitlab" "$REMOTE_URL")
  debug 1 "Repository identifier: $REPO_IDENTIFIER"
  
else
  debug 1 "Repository is neither GitHub nor GitLab, or no remote origin configured"
fi

# Display processing information
printf "${CYAN}Using '%s' as the primary branch.${NC}\n" "$PRIMARY_BRANCH"
printf "${CYAN}Generating diffs for commits from the last %d days...${NC}\n" "$DAYS"
printf "${CYAN}Excluding pnpm.lock and build files from TypeScript/Rust${NC}\n"
printf "${CYAN}Grouping all commits by day${NC}\n"
printf "${CYAN}Including PR/MR comments and images if available${NC}\n"
if [ "$ONLY_WITH_PR_MR" = true ]; then
  printf "${CYAN}Only processing commits with related PR/MR references${NC}\n"
fi
if [ "$OVERWRITE" = true ]; then
  printf "${CYAN}Will overwrite existing files${NC}\n"
else
  printf "${CYAN}Will skip existing files${NC}\n"
fi
printf "${CYAN}Output will be saved to: %s/${NC}\n" "$OUTPUT_DIR"

# Create output directory if it doesn't exist
if [ ! -d "$OUTPUT_DIR" ]; then
  mkdir -p "$OUTPUT_DIR"
  chmod 755 "$OUTPUT_DIR"
  debug 1 "Created output directory: $OUTPUT_DIR"
else
  debug 1 "Output directory already exists: $OUTPUT_DIR"
  if [ "$OVERWRITE" = true ]; then
    debug 1 "Overwrite flag is set, will overwrite existing files"
  else
    debug 1 "Overwrite flag is not set, will skip existing files"
  fi
fi

# Create log file
LOG_FILE=$(create_log_file "$OUTPUT_DIR" "$PRIMARY_BRANCH" "$REPO_FOLDER" "$MAX_DIFF_LINES")
chmod 644 "$LOG_FILE"
debug 1 "Created log file: $LOG_FILE"

# Get list of commits sorted by date (oldest first)
debug 1 "Looking for commits from the last $DAYS days on branch $PRIMARY_BRANCH" >&2
COMMITS=$(git log --after="$DAYS days ago" --format="%H" $PRIMARY_BRANCH)
COMMIT_COUNT=$(echo "$COMMITS" | wc -l | tr -d ' ')
debug 1 "Found $COMMIT_COUNT commits in the last $DAYS days" >&2

# Show commit details in debug mode
if [ "$DEBUG_LEVEL" -ge 2 ]; then
  debug 2 "Recent commits:" >&2
  git log --after="$DAYS days ago" --format="%h %ai %s" $PRIMARY_BRANCH | while read -r line; do
    debug 2 "  $line" >&2
  done
fi

if [ "$COMMIT_COUNT" -eq 0 ]; then
  echo -e "${YELLOW}No commits found in the last $DAYS days on branch $PRIMARY_BRANCH${NC}"
  exit 1
fi

# Process commits and get results
PROCESS_RESULT=$(process_commits "$COMMITS" "$REPO_PATH" "$OUTPUT_DIR" "$PRIMARY_BRANCH" "$MAX_DIFF_LINES" "$SKIP_DIFF" "$REPO_TYPE" "$REPO_IDENTIFIER" "$LOG_FILE" "$ONLY_WITH_PR_MR" "$OVERWRITE" "$DAYS" 2>&1)
PROCESS_EXIT_CODE=$?

# Extract the counts and file operations from the last line of output
PROCESSED_COUNT=$(echo "$PROCESS_RESULT" | tail -n1 | cut -d'|' -f1)
SKIPPED_COUNT=$(echo "$PROCESS_RESULT" | tail -n1 | cut -d'|' -f2)
CREATED_FILES=$(echo "$PROCESS_RESULT" | tail -n1 | cut -d'|' -f3)
SKIPPED_FILES=$(echo "$PROCESS_RESULT" | tail -n1 | cut -d'|' -f4)
OVERWRITTEN_FILES=$(echo "$PROCESS_RESULT" | tail -n1 | cut -d'|' -f5)

# Check if process_commits failed
if [ $PROCESS_EXIT_CODE -ne 0 ]; then
  echo -e "${RED}Error processing commits.${NC}"
  exit 1
fi

# Check if we processed any commits
if [ "$PROCESSED_COUNT" -eq 0 ]; then
  echo -e "${YELLOW}No commits were processed.${NC}"
  if [ "$ONLY_WITH_PR_MR" = true ]; then
    echo -e "${YELLOW}This might be because no commits had PR/MR references in the last $DAYS days.${NC}"
  fi
  
  # Show skipped files even when no commits were processed
  if [ -n "$SKIPPED_FILES" ]; then
    echo -e "\n${YELLOW}Files that would have been written but were skipped (already exist):${NC}"
    for file in $SKIPPED_FILES; do
      echo -e "  ${YELLOW}$file${NC}"
    done
  fi
  
  exit 1
fi

# Print summary
echo -e "\n${GREEN}Processing complete!${NC}"
echo -e "Total commits found: ${CYAN}$COMMIT_COUNT${NC}"
echo -e "Processed commits: ${CYAN}$PROCESSED_COUNT${NC}"
echo -e "Skipped commits: ${YELLOW}$SKIPPED_COUNT${NC}"

# Print file operations
if [ -n "$CREATED_FILES" ]; then
  echo -e "\n${GREEN}Created files:${NC}"
  for file in $CREATED_FILES; do
    echo -e "  ${CYAN}$file${NC}"
  done
fi

if [ -n "$SKIPPED_FILES" ]; then
  echo -e "\n${YELLOW}Skipped files (already exist):${NC}"
  for file in $SKIPPED_FILES; do
    echo -e "  ${YELLOW}$file${NC}"
  done
fi

if [ -n "$OVERWRITTEN_FILES" ]; then
  echo -e "\n${MAGENTA}Overwritten files:${NC}"
  for file in $OVERWRITTEN_FILES; do
    echo -e "  ${MAGENTA}$file${NC}"
  done
fi

echo -e "\nOutput directory: ${CYAN}$OUTPUT_DIR${NC}"
echo -e "Log file: ${CYAN}$LOG_FILE${NC}"

exit 0