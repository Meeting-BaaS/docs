#!/bin/bash

# ANSI color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Debug function with colors
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