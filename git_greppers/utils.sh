#!/bin/bash

# Debug levels:
# 0 - Error messages only
# 1 - Basic info (default)
# 2 - Detailed info
# 3 - Verbose debugging

# Initialize debug function with specified level
init_debug() {
  DEBUG_LEVEL=${1:-1}
}

# Debug function with colored output
debug() {
  local level=$1
  local message=$2
  
  # Only show messages at or below the current debug level
  if [[ $level -le $DEBUG_LEVEL ]]; then
    case $level in
      0) # Error - Red
        echo -e "\033[0;31m[ERROR]\033[0m $message" >&2
        ;;
      1) # Info - Blue
        echo -e "\033[0;34m[INFO]\033[0m $message"
        ;;
      2) # Detail - Green
        echo -e "\033[0;32m[DEBUG]\033[0m $message"
        ;;
      3) # Verbose - Yellow
        echo -e "\033[0;33m[TRACE]\033[0m $message"
        ;;
    esac
  fi
}

# Check if jq is installed
check_jq() {
  if ! command -v jq &> /dev/null; then
    debug 0 "jq is not installed. Please install it:"
    debug 0 "  macOS: brew install jq"
    debug 0 "  Ubuntu/Debian: apt-get install jq"
    debug 0 "  RHEL/CentOS: yum install jq"
    exit 1
  fi
}

# Function to extract value from git config
get_git_config() {
  local repo_path=$1
  local key=$2
  local default_value=$3
  
  cd "$repo_path" || return "$default_value"
  
  local value
  value=$(git config --get "$key" 2>/dev/null)
  
  if [[ -z "$value" && -n "$default_value" ]]; then
    echo "$default_value"
  else
    echo "$value"
  fi
}

# Function to get default branch name for a repository
get_default_branch() {
  local repo_path=$1
  local default_branch
  
  cd "$repo_path" || return "main"
  
  # Try to get the default branch from the remote
  default_branch=$(git symbolic-ref refs/remotes/origin/HEAD 2>/dev/null | sed 's@^refs/remotes/origin/@@')
  
  # If that fails, try to get it from the local HEAD
  if [[ -z "$default_branch" ]]; then
    default_branch=$(git symbolic-ref --short HEAD 2>/dev/null)
  fi
  
  # Fallback to common default names
  if [[ -z "$default_branch" ]]; then
    for branch in main master; do
      if git show-ref --verify --quiet refs/heads/$branch; then
        default_branch=$branch
        break
      fi
    done
  fi
  
  # Final fallback
  if [[ -z "$default_branch" ]]; then
    default_branch="main"
  fi
  
  echo "$default_branch"
}

# Function to get the current branch name
get_current_branch() {
  local repo_path=$1
  
  cd "$repo_path" || return ""
  
  git rev-parse --abbrev-ref HEAD 2>/dev/null
}

# Function to check if the current working directory is clean
is_repo_clean() {
  local repo_path=$1
  
  cd "$repo_path" || return 1
  
  if [[ -n "$(git status --porcelain)" ]]; then
    return 1
  else
    return 0
  fi
}

# Function to safely checkout a branch
safe_checkout() {
  local repo_path=$1
  local branch=$2
  
  cd "$repo_path" || return 1
  
  # Save the current branch
  local current_branch
  current_branch=$(get_current_branch "$repo_path")
  
  # Check if the repo is clean
  if ! is_repo_clean "$repo_path"; then
    debug 0 "Repository working directory is not clean. Cannot checkout branch."
    return 1
  fi
  
  # Checkout the target branch
  debug 2 "Checking out branch: $branch"
  if ! git checkout "$branch" 2>/dev/null; then
    debug 0 "Failed to checkout branch: $branch"
    return 1
  fi
  
  return 0
}

# Function to extract repository info from URL
parse_repo_url() {
  local repo_url=$1
  local info_type=$2  # "owner", "repo", or "full"
  
  # Handle SSH format: git@github.com:owner/repo.git
  if [[ "$repo_url" =~ ^git@.+:.+/.+\.git$ ]]; then
    local repo_path
    repo_path=$(echo "$repo_url" | sed -E 's|git@.+:(.+)\.git|\1|')
    
    if [[ "$info_type" == "owner" ]]; then
      echo "$repo_path" | cut -d '/' -f 1
    elif [[ "$info_type" == "repo" ]]; then
      echo "$repo_path" | cut -d '/' -f 2
    else  # full
      echo "$repo_path"
    fi
    return
  fi
  
  # Handle HTTPS format: https://github.com/owner/repo.git
  if [[ "$repo_url" =~ ^https?://.+/.+/.+$ ]]; then
    local repo_path
    repo_path=$(echo "$repo_url" | sed -E 's|https?://.+/(.+/.+)(\.git)?|\1|')
    
    if [[ "$info_type" == "owner" ]]; then
      echo "$repo_path" | cut -d '/' -f 1
    elif [[ "$info_type" == "repo" ]]; then
      echo "$repo_path" | cut -d '/' -f 2 | sed 's/\.git$//'
    else  # full
      echo "$repo_path" | sed 's/\.git$//'
    fi
    return
  fi
  
  # Unknown format
  echo ""
}

# Function to safely create a temp branch
create_temp_branch() {
  local repo_path=$1
  local base_name=$2
  local timestamp
  
  cd "$repo_path" || return ""
  
  timestamp=$(date +%Y%m%d%H%M%S)
  local temp_branch="${base_name}-${timestamp}"
  
  debug 2 "Creating temporary branch: $temp_branch"
  git checkout -b "$temp_branch" 2>/dev/null
  
  echo "$temp_branch"
}

# Function to cleanup temp branch and restore original state
cleanup_temp_branch() {
  local repo_path=$1
  local temp_branch=$2
  local original_branch=$3
  
  cd "$repo_path" || return 1
  
  # Make sure we're on the temp branch
  local current_branch
  current_branch=$(get_current_branch "$repo_path")
  
  if [[ "$current_branch" == "$temp_branch" ]]; then
    # Checkout the original branch
    debug 2 "Checking out original branch: $original_branch"
    git checkout "$original_branch" 2>/dev/null
    
    # Delete the temp branch
    debug 2 "Deleting temporary branch: $temp_branch"
    git branch -D "$temp_branch" 2>/dev/null
  else
    debug 0 "Current branch is not the temp branch, skipping cleanup"
  fi
}

# Parse JSON content from a variable
parse_json() {
  local json_content=$1
  local json_path=$2
  
  echo "$json_content" | jq -r "$json_path" 2>/dev/null
}

# Check if a command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Function to format date for display
format_date() {
  local date_string=$1
  local format=${2:-"%Y-%m-%d %H:%M:%S"}
  
  if command_exists gdate; then
    # macOS with GNU date installed as gdate
    gdate -d "$date_string" +"$format" 2>/dev/null
  elif command_exists date; then
    # Try with native date
    date -d "$date_string" +"$format" 2>/dev/null || \
    date -jf "%Y-%m-%dT%H:%M:%SZ" "$date_string" +"$format" 2>/dev/null || \
    echo "$date_string"
  else
    echo "$date_string"
  fi
}

# Get relative date (e.g., "2 days ago") 
get_relative_date() {
  local date_string=$1
  
  if command_exists gdate; then
    # macOS with GNU date installed
    local seconds_diff
    seconds_diff=$(($(gdate +%s) - $(gdate -d "$date_string" +%s)))
    
    if (( seconds_diff < 60 )); then
      echo "just now"
    elif (( seconds_diff < 3600 )); then
      echo "$(( seconds_diff / 60 )) minutes ago"
    elif (( seconds_diff < 86400 )); then
      echo "$(( seconds_diff / 3600 )) hours ago"
    elif (( seconds_diff < 604800 )); then
      echo "$(( seconds_diff / 86400 )) days ago"
    elif (( seconds_diff < 2592000 )); then
      echo "$(( seconds_diff / 604800 )) weeks ago"
    else
      echo "$(( seconds_diff / 2592000 )) months ago"
    fi
  else
    # Fallback to formatted date
    format_date "$date_string"
  fi
}

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to validate a git repository
validate_git_repo() {
  local repo_path=$1
  if [ ! -d "$repo_path/.git" ]; then
    echo -e "${RED}Error:${NC} $repo_path is not a git repository."
    exit 1
  fi
  return 0
}

# Function to determine primary branch (main or master)
determine_primary_branch() {
  local repo_path=$1
  if git -C "$repo_path" show-ref --verify --quiet refs/heads/main; then
    echo "main"
  elif git -C "$repo_path" show-ref --verify --quiet refs/heads/master; then
    echo "master"
  else
    echo -e "${RED}Error:${NC} Neither 'main' nor 'master' branch found in this repository."
    exit 1
  fi
}

# Function to extract date part only (YYYY-MM-DD) from the full timestamp
extract_date() {
  local timestamp=$1
  echo "$timestamp" | cut -d' ' -f1
}

# Get repository info
get_repo_info() {
  local repo_path=$1
  
  # Detect if we're using GitHub or GitLab by checking remote URL
  local remote_url=$(git -C "$repo_path" config --get remote.origin.url)
  
  if [[ $remote_url == *"github.com"* ]]; then
    echo "github|$remote_url"
  elif [[ $remote_url == *"gitlab.com"* ]]; then
    echo "gitlab|$remote_url"
  else
    echo "unknown|$remote_url"
  fi
}

# Extract repository identifier from URL
extract_repo_identifier() {
  local repo_type=$1
  local repo_url=$2
  
  # Send debug output to stderr
  debug 3 "Extracting repository identifier from URL: $repo_url for type: $repo_type" >&2
  
  # Remove .git suffix if present and transform SSH URL to HTTPS format if needed
  local url=$(echo $repo_url | sed -e 's/\.git$//' -e 's/git@github.com:/https:\/\/github.com\//' -e 's/git@gitlab.com:/https:\/\/gitlab.com\//')
  
  # Send debug output to stderr
  debug 3 "Transformed URL: $url" >&2
  
  # Extract owner/repo format
  local repo_identifier=""
  if [[ $repo_type == "github" ]]; then
    repo_identifier=$(echo $url | sed -e 's/https:\/\/github.com\///')
    # Send debug output to stderr
    debug 3 "GitHub repo identifier: $repo_identifier" >&2
  elif [[ $repo_type == "gitlab" ]]; then
    # Handle both https://gitlab.com/org/repo and git@gitlab.com:org/repo formats
    repo_identifier=$(echo $url | sed -e 's/https:\/\/gitlab.com\///' -e 's/git@gitlab.com://')
    # Send debug output to stderr
    debug 3 "GitLab repo identifier: $repo_identifier" >&2
    # Store the repo identifier in a global variable so it can be accessed by the fetch_gitlab_mr_comments function
    GITLAB_REPO_IDENTIFIER="$repo_identifier"
  else
    # Send debug output to stderr
    debug 3 "Unknown repo type: $repo_type" >&2
    repo_identifier="unknown"
  fi
  
  echo "$repo_identifier"
}

# Create log file
create_log_file() {
  local output_dir=$1
  local primary_branch=$2
  local repo_folder=$3
  local max_diff_lines=$4
  
  local log_file="$output_dir/processing.log"
  echo "#KEY#BRANCH# $primary_branch" > "$log_file"
  echo "#KEY#GENERATED_DATE# $(date)" >> "$log_file"
  echo "#KEY#REPOSITORY# $repo_folder" >> "$log_file"
  echo "#KEY#EXCLUDES# pnpm.lock, TypeScript build files, Rust build files" >> "$log_file"
  echo "#KEY#MAX_DIFF_LINES# $max_diff_lines" >> "$log_file"
  echo "#KEY#GROUP_BY# day" >> "$log_file"
  echo "#KEY#INCLUDES# PR/MR comments and images when available" >> "$log_file"
  echo "" >> "$log_file"
  
  echo "$log_file"
} 