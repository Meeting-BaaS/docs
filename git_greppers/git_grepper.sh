#!/bin/bash

# Force unbuffered output for all commands
export PYTHONUNBUFFERED=1
export PYTHONIOENCODING=UTF-8
# Ensure stdout is not buffered
if [ -t 1 ]; then
  # If stdout is a terminal, disable line buffering
  stdbuf -o0 true
fi

# Script to generate git diffs from commits on master/main branch for the last 2 months
# Also finds related PRs/MRs from GitHub or GitLab
# Usage: ./git_grepper.sh [repository_path] [debug_level] [flags]
#
# Supported flags:
#   --no-diff           Skip generating diffs (faster for large repositories)
#   --only-with-pr-mr   Only process commits with related PR/MR references
#
# Example: ./git_grepper.sh /path/to/repo 3 --no-diff --only-with-pr-mr

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

# Check if --no-diff or --only-with-pr-mr flags are present in any position
for arg in "$@"; do
  if [[ "$arg" == "--no-diff" || "$arg" == "-no-diff" ]]; then
    SKIP_DIFF=true
    debug 1 "Flag detected: No diff generation (--no-diff)"
  elif [[ "$arg" == "--only-with-pr-mr" || "$arg" == "-only-with-pr-mr" ]]; then
    ONLY_WITH_PR_MR=true
    debug 1 "Flag detected: Only processing commits with PR/MR references (--only-with-pr-mr)"
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

debug 1 "Script started with parameters: REPO_PATH=$REPO_PATH, DEBUG_LEVEL=$DEBUG_LEVEL, MAX_DIFF_LINES=$MAX_DIFF_LINES, SKIP_DIFF=$SKIP_DIFF, ONLY_WITH_PR_MR=$ONLY_WITH_PR_MR"

# Check if the provided path is a git repository
validate_git_repo "$REPO_PATH"

# Extract the repository folder name
REPO_FOLDER=$(basename "$(cd "$REPO_PATH" && pwd)")
# Create output directory name based on repo folder name
OUTPUT_DIR="${LAUNCH_DIR}/${REPO_FOLDER}-git-diffs"

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
printf "${CYAN}Generating diffs for commits from the last 2 months...${NC}\n"
printf "${CYAN}Excluding pnpm.lock and build files from TypeScript/Rust${NC}\n"
printf "${CYAN}Grouping all commits by day${NC}\n"
printf "${CYAN}Including PR/MR comments and images if available${NC}\n"
if [ "$ONLY_WITH_PR_MR" = true ]; then
  printf "${CYAN}Only processing commits with related PR/MR references${NC}\n"
fi
printf "${CYAN}Output will be saved to: %s/${NC}\n" "$OUTPUT_DIR"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"
debug 1 "Created output directory: $OUTPUT_DIR"

# Create log file
LOG_FILE=$(create_log_file "$OUTPUT_DIR" "$PRIMARY_BRANCH" "$REPO_FOLDER" "$MAX_DIFF_LINES")

# Get list of commits sorted by date (oldest first)
COMMITS=$(git log --after="2 months ago" --format="%H" $PRIMARY_BRANCH)

# Process commits
PROCESS_RESULT=$(process_commits "$COMMITS" "$REPO_PATH" "$OUTPUT_DIR" "$PRIMARY_BRANCH" "$MAX_DIFF_LINES" "$SKIP_DIFF" "$REPO_TYPE" "$REPO_IDENTIFIER" "$LOG_FILE" "$ONLY_WITH_PR_MR")
PROCESSED_COUNT=$(echo "$PROCESS_RESULT" | cut -d'|' -f1)
SKIPPED_COUNT=$(echo "$PROCESS_RESULT" | cut -d'|' -f2)

# Summarize results
summarize_results "$OUTPUT_DIR" "$REPO_FOLDER" "$PROCESSED_COUNT" "$SKIPPED_COUNT" "$LOG_FILE" "$ONLY_WITH_PR_MR"