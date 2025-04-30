#!/bin/bash

# Set the current directory to the one where this script is located
cd "$(dirname "$0")" || exit 1

# Default paths - use full paths to avoid issues
GIT_GREPPER=${GIT_GREPPER:-"$(pwd)/git_grepper.sh"}
CONFIG_PATH=${CONFIG_PATH:-"$(pwd)/config.json"}
OUTPUT_DIR=${OUTPUT_DIR:-"$(pwd)/updates"}

# Repository path resolution function
get_repo_path() {
  local repo_name=$1
  case "$repo_name" in
    "meeting-baas")
      echo "/Users/lazrossi/Spoke/meeting-baas"
      ;;
    "speaking-meeting-bot")
      echo "/Users/lazrossi/Spoke/speaking-meeting-bot"
      ;;
    "sdk-generator")
      echo "/Users/lazrossi/Documents/code/mcp-s/sdk-generator"
      ;;
    "mcp-on-vercel")
      echo "/Users/lazrossi/Documents/code/mcp-s/mcp-on-vercel"
      ;;
    "mcp-on-vercel-documentation")
      echo "/Users/lazrossi/Documents/code/mcp-s/mcp-on-vercel-documentation"
      ;;
    "mcp-baas")
      echo "/Users/lazrossi/Documents/code/mcp-baas"
      ;;
    *)
      echo "$repo_name"  # If not a known repo name, assume it's a path
      ;;
  esac
}

# Default values
REPO_NAME=${1:-""}
REPO_PATH=$(get_repo_path "$REPO_NAME")
DRY_RUN=${2:-0}
WITH_DIFF=${3:-"--with-diff"}
WITH_CODE=${4:-"--include-code"}
CHECKOUT_DEPTH=${CHECKOUT_DEPTH:-1}
PREVIEW_MODE=${PREVIEW_MODE:-0}
GENERATE_PR_PREVIEWS=${GENERATE_PR_PREVIEWS:-0}
PR_DAYS_RANGE=${PR_DAYS_RANGE:-7}
DEBUG_LEVEL=${DEBUG_LEVEL:-1}

# Source utility functions and handlers
source "$(pwd)/utils.sh" || { echo "Failed to source utils.sh"; exit 1; }
source "$(pwd)/github_handler.sh" || { echo "Failed to source github_handler.sh"; exit 1; }
source "$(pwd)/gitlab_handler.sh" || { echo "Failed to source gitlab_handler.sh"; exit 1; }

# Check if jq is installed
check_jq

# Check for required parameters
if [[ -z "$REPO_NAME" ]]; then
  echo "Error: Repository name or path is required."
  echo "Usage: $0 <repo_name_or_path> [dry_run] [--with-diff|--no-diff] [--include-code|--no-code]"
  exit 1
fi

# Initialize debug function
init_debug "$DEBUG_LEVEL"

# If REPO_NAME is a path, extract the basename as the actual repo name
if [[ "$REPO_NAME" == "$REPO_PATH" ]]; then
  REPO_NAME=$(basename "$REPO_PATH")
fi

debug 1 "Processing repository: $REPO_NAME (path: $REPO_PATH)"

# Check if the repository directory exists
if [[ ! -d "$REPO_PATH" ]]; then
  debug 0 "Repository directory not found: $REPO_PATH"
  exit 1
fi

# Check if OUTPUT_DIR exists
if [[ ! -d "$OUTPUT_DIR" ]]; then
  mkdir -p "$OUTPUT_DIR"
fi

# Function to determine the repository type (GitHub/GitLab)
determine_repo_type() {
  local repo_path=$1
  
  cd "$repo_path" || return "unknown"
  
  # Get the remote URL
  local remote_url=$(git remote get-url origin 2>/dev/null)
  
  if [[ -z "$remote_url" ]]; then
    debug 1 "No remote URL found, assuming local repository"
    echo "local"
    return
  fi
  
  if [[ "$remote_url" == *"github.com"* ]]; then
    debug 2 "Detected GitHub repository"
    echo "github"
    return
  elif [[ "$remote_url" == *"gitlab.com"* ]]; then
    debug 2 "Detected GitLab repository"
    echo "gitlab"
    return
  else
    debug 2 "Unknown repository type, using default handler"
    echo "unknown"
    return
  fi
}

# Function to get repository identifier (owner/repo)
get_repo_identifier() {
  local repo_path=$1
  local repo_type=$2
  local identifier=""
  
  cd "$repo_path" || return ""
  
  # Get the remote URL
  local remote_url=$(git remote get-url origin 2>/dev/null)
  
  if [[ -z "$remote_url" ]]; then
    debug 1 "No remote URL found, returning empty identifier"
    echo ""
    return
  fi
  
  # Handle different URL formats
  if [[ "$remote_url" =~ ^https://.*$ ]]; then
    # HTTPS URL format
    identifier=$(echo "$remote_url" | sed -E 's|https://([^/]+)/(.+)\.git$|\2|' | sed -E 's|https://([^/]+)/(.+)$|\2|')
  elif [[ "$remote_url" =~ ^git@.*$ ]]; then
    # SSH URL format
    identifier=$(echo "$remote_url" | sed -E 's|git@([^:]+):(.+)\.git$|\2|' | sed -E 's|git@([^:]+):(.+)$|\2|')
  else
    # Other formats, try best effort
    identifier=$(echo "$remote_url" | grep -oE '[^/]+/[^/]+$' | sed 's/\.git$//')
  fi
  
  debug 2 "Repository identifier: $identifier"
  echo "$identifier"
}

# Main function to process a repository
process_repository() {
  local repo_path=$1
  local output_dir=$2
  local repo_name=$3
  local dry_run=$4
  local with_diff=$5
  local with_code=$6
  local pr_previews=$7
  local pr_days_range=$8
  local preview_mode=$9
  
  # Determine repository type
  local repo_type=$(determine_repo_type "$repo_path")
  local repo_identifier=$(get_repo_identifier "$repo_path" "$repo_type")
  
  debug 1 "Repository type: $repo_type"
  debug 1 "Repository identifier: $repo_identifier"
  
  # Run git_grepper for the main branch
  debug 1 "Running git_grepper on main branch"
  if [[ "$dry_run" -eq 0 ]]; then
    "$GIT_GREPPER" "$repo_path" "$CHECKOUT_DEPTH" "$with_diff" "$with_code" --repo-name "$repo_name" --output-dir "$output_dir"
    if [[ $? -ne 0 ]]; then
      debug 0 "Error: git_grepper failed for $repo_name"
      return 1
    fi
  else
    debug 1 "Dry run: would execute git_grepper for main branch"
  fi
  
  # Process PR/MR previews if enabled
  if [[ "$pr_previews" -eq 1 ]]; then
    debug 1 "Generating PR/MR previews for repository: $repo_name"
    
    case "$repo_type" in
      github)
        debug 1 "Processing GitHub PRs"
        check_github_cli
        
        # Get recent PRs using our GitHub handler function
        get_recent_github_prs "$repo_path" "$pr_days_range" "RECENT_PRS"
        
        # Process each PR to generate preview pages
        local pr_count=${#RECENT_PRS[@]}
        debug 1 "Found $pr_count recent PRs to process"
        
        for pr_info in "${RECENT_PRS[@]}"; do
          if [[ "$dry_run" -eq 0 ]]; then
            generate_github_pr_preview "$repo_path" "$repo_name" "$pr_info" "$GIT_GREPPER" "$output_dir"
          else
            debug 1 "Dry run: would generate GitHub PR preview for $pr_info"
          fi
        done
        ;;
        
      gitlab)
        debug 1 "Processing GitLab MRs"
        check_gitlab_cli
        
        # Get recent MRs using our GitLab handler function
        get_recent_gitlab_mrs "$repo_path" "$pr_days_range" "RECENT_MRS"
        
        # Process each MR to generate preview pages
        local mr_count=${#RECENT_MRS[@]}
        debug 1 "Found $mr_count recent MRs to process"
        
        for mr_info in "${RECENT_MRS[@]}"; do
          if [[ "$dry_run" -eq 0 ]]; then
            generate_gitlab_mr_preview "$repo_path" "$repo_name" "$mr_info" "$GIT_GREPPER" "$output_dir"
          else
            debug 1 "Dry run: would generate GitLab MR preview for $mr_info"
          fi
        done
        ;;
        
      *)
        debug 1 "Repository type $repo_type does not support PR/MR previews"
        ;;
    esac
  fi
  
  return 0
}

# Parse additional arguments
for arg in "$@"; do
  case "$arg" in
    --with-diff) WITH_DIFF="--with-diff" ;;
    --no-diff) WITH_DIFF="--no-diff" ;;
    --include-code) WITH_CODE="--include-code" ;;
    --no-code) WITH_CODE="--no-code" ;;
    --preview) PREVIEW_MODE=1 ;;
    --generate-pr-previews) GENERATE_PR_PREVIEWS=1 ;;
    --pr-days=*) PR_DAYS_RANGE="${arg#*=}" ;;
  esac
done

# Run the main process
debug 1 "Starting update for repository: $REPO_NAME"
process_repository "$REPO_PATH" "$OUTPUT_DIR" "$REPO_NAME" "$DRY_RUN" "$WITH_DIFF" "$WITH_CODE" "$GENERATE_PR_PREVIEWS" "$PR_DAYS_RANGE" "$PREVIEW_MODE"

exit_code=$?
debug 1 "Finished processing repository $REPO_NAME with exit code $exit_code"
exit $exit_code 