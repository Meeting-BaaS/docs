#!/bin/bash

# Check if GitHub CLI is installed
check_github_cli() {
  if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error:${NC} GitHub CLI (gh) is not installed, but is required for processing GitHub repositories."
    echo -e "To install GitHub CLI:"
    echo -e "  - macOS: ${CYAN}brew install gh${NC}"
    echo -e "  - Linux: ${CYAN}sudo apt install gh${NC} or follow instructions at https://github.com/cli/cli/blob/trunk/docs/install_linux.md"
    echo -e "  - Windows: ${CYAN}winget install GitHub.cli${NC} or ${CYAN}scoop install gh${NC} or ${CYAN}choco install gh${NC}"
    echo -e "\nAfter installation, authenticate with: ${CYAN}gh auth login${NC}"
    exit 1
  fi
  return 0
}

# Function to fetch PR comments from GitHub
fetch_github_pr_comments() {
  local pr_number=$1
  local comments=""
  local has_comments=false
  
  # Remove # from PR number if present
  pr_number=${pr_number#\#}
  
  # Send debug output to stderr
  debug 2 "Fetching GitHub PR #$pr_number comments using GitHub CLI" >&2
  
  # Get PR comments using GitHub CLI
  if gh pr view "$pr_number" --json comments &> /dev/null; then
    # Get PR description and comments
    local pr_details=$(gh pr view "$pr_number" --json title,body,comments,reviews 2>/dev/null)
    
    # Extract PR description
    local pr_body=$(echo "$pr_details" | jq -r '.body')
    if [[ -n "$pr_body" && "$pr_body" != "null" ]]; then
      comments+="PR DESCRIPTION:\n$pr_body\n\n"
      has_comments=true
    fi
    
    # Extract PR comments
    local pr_comments=$(echo "$pr_details" | jq -r '.comments[].body')
    if [[ -n "$pr_comments" && "$pr_comments" != "null" ]]; then
      comments+="PR COMMENTS:\n$pr_comments\n\n"
      has_comments=true
    fi
    
    # Extract PR review comments
    local pr_reviews=$(echo "$pr_details" | jq -r '.reviews[].body')
    if [[ -n "$pr_reviews" && "$pr_reviews" != "null" && "$pr_reviews" != "" ]]; then
      comments+="PR REVIEWS:\n$pr_reviews\n\n"
      has_comments=true
    fi
    
    # Extract image URLs from the comments and description
    local image_urls=$(echo "$pr_body $pr_comments $pr_reviews" | grep -o -E '\!\[.*\]\(https?://[^)]+\)' | grep -o -E 'https?://[^)]+' || echo "")
    
    if [[ -n "$image_urls" ]]; then
      comments+="IMAGE LINKS FOUND IN PR:\n"
      comments+=$(echo "$image_urls" | sort | uniq)
      comments+="\n\n"
      has_comments=true
    fi
  else
    # Send debug output to stderr
    debug 2 "Failed to fetch PR details or PR doesn't exist" >&2
  fi
  
  if [[ "$has_comments" == "true" ]]; then
    printf "%s" "$comments"
  else
    echo ""
  fi
}

# Function to find PR information for a commit
find_github_pr_info() {
  local commit_hash=$1
  local repo_identifier=$2
  local pr_mr_info="None found"
  local pr_mr_number=""
  
  debug 2 "Looking for GitHub PR info for commit: $commit_hash" >&2
  
  # Check if the commit message contains PR references
  local commit_msg=$(git show -s --format=%B "$commit_hash")
  
  # Look for GitHub PR pattern: "Merge pull request #123" or "PR #123" or similar
  pr_mr_number=$(echo "$commit_msg" | grep -o -E "(Merge pull request|PR) #[0-9]+" | grep -o -E "#[0-9]+" | head -1)
  
  debug 3 "GitHub PR pattern search result: '$pr_mr_number'" >&2
  
  if [[ -n $pr_mr_number ]]; then
    # Found a PR reference in the commit message
    pr_mr_info="GitHub PR $pr_mr_number (https://github.com/$repo_identifier/pull/${pr_mr_number#\#})"
    debug 2 "Found PR reference in commit message: $pr_mr_info" >&2
  elif command -v gh &> /dev/null; then
    debug 2 "GitHub CLI available, attempting to use it to find PR info" >&2
    # If GitHub CLI is available, try to use it to find PR information
    local gh_pr=$(gh pr list --search "$commit_hash" --json number,title,url --limit 1 2>/dev/null)
    debug 3 "GitHub CLI response: $gh_pr" >&2
    
    if [[ -n $gh_pr && $gh_pr != "[]" ]]; then
      local pr_details=$(echo $gh_pr | jq -r '.[0]')
      pr_mr_number="#$(echo $pr_details | jq -r '.number')"
      local pr_title=$(echo $pr_details | jq -r '.title')
      local pr_url=$(echo $pr_details | jq -r '.url')
      
      pr_mr_info="GitHub PR $pr_mr_number: $pr_title ($pr_url)"
      debug 2 "GitHub CLI found PR: $pr_mr_info" >&2
    else
      debug 2 "No PR found using GitHub CLI" >&2
    fi
  else
    debug 2 "GitHub CLI not available" >&2
  fi
  
  # Return both the formatted info string and the PR/MR number
  echo "$pr_mr_info|$pr_mr_number"
}

# Function to get recent PRs from a GitHub repository
get_recent_github_prs() {
  local repo_path=$1
  local date_range=${2:-7} # Default to 7 days
  local output_array_name=${3:-"RECENT_PRS"} # Name of the output array
  
  debug 1 "Getting recent GitHub PRs from the last $date_range days"
  
  # Check if GitHub CLI is available
  if ! command -v gh &> /dev/null; then
    debug 1 "GitHub CLI not available, skipping recent PR fetching"
    # Create an empty array with the given name
    eval "$output_array_name=()"
    return 0
  fi
  
  # Change to the repo directory
  cd "$repo_path" || return 1
  
  # Get date string for the search query
  local search_date=$(date -v-${date_range}d +%Y-%m-%d)
  
  # Get open PRs updated in the last $date_range days
  debug 2 "Searching for PRs updated after $search_date"
  local recent_prs_json=$(gh pr list --state open --json number,title,url,headRefName,updatedAt --search "updated:>$search_date")
  
  # Check if we got any results
  if [[ -z "$recent_prs_json" || "$recent_prs_json" == "[]" ]]; then
    debug 1 "No recent PRs found"
    # Create an empty array with the given name
    eval "$output_array_name=()"
    return 0
  fi
  
  # Parse the JSON and create output array
  local prs_count=$(echo "$recent_prs_json" | jq length)
  debug 1 "Found $prs_count recent PRs"
  
  # Create the array with the specified name
  eval "$output_array_name=()"
  
  # Process each PR and add to the array
  local i=0
  while [[ $i -lt $prs_count ]]; do
    local pr_json=$(echo "$recent_prs_json" | jq -r ".[$i]")
    local pr_number=$(echo "$pr_json" | jq -r '.number')
    local pr_title=$(echo "$pr_json" | jq -r '.title')
    local pr_url=$(echo "$pr_json" | jq -r '.url')
    local pr_branch=$(echo "$pr_json" | jq -r '.headRefName')
    local pr_updated=$(echo "$pr_json" | jq -r '.updatedAt')
    
    # Create an array entry with pipe-separated values that can be parsed later
    local entry="#$pr_number|$pr_title|$pr_url|$pr_branch|$pr_updated"
    
    # Add to the named array
    eval "$output_array_name+=('$entry')"
    
    ((i++))
  done
  
  debug 2 "Created array $output_array_name with $prs_count entries"
  return 0
}

# Function to generate update page for a specific PR
generate_github_pr_preview() {
  local repo_path=$1
  local repo_name=$2
  local pr_info=$3
  local git_grepper=$4
  local output_dir=$5
  
  # Parse PR info
  IFS='|' read -r pr_number pr_title pr_url pr_branch pr_updated <<< "$pr_info"
  
  debug 1 "Generating preview for GitHub PR $pr_number: $pr_title"
  
  # Change to repo directory
  cd "$repo_path" || return 1
  
  # Create a local branch name for this PR
  local local_branch="pr-preview-${pr_number#\#}"
  
  # Fetch and checkout the PR branch
  debug 2 "Fetching PR branch $pr_branch"
  git fetch origin "pull/${pr_number#\#}/head:$local_branch" || {
    debug 1 "Failed to fetch PR branch"
    return 1
  }
  
  # Checkout the branch
  git checkout "$local_branch" || {
    debug 1 "Failed to checkout PR branch"
    git branch -D "$local_branch" 2>/dev/null
    return 1
  }
  
  # Process the PR branch with git_grepper
  debug 1 "Processing PR branch with git_grepper"
  "$git_grepper" "$repo_path" 1 --with-diff --include-code --use-pr-branch "$local_branch" --pr-number "$pr_number" --repo-name "$repo_name" --output-dir "$output_dir" --with-preview

  # Store the result
  local result=$?
  
  # Cleanup: switch back to main/master branch
  git checkout $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main") 2>/dev/null || git checkout master 2>/dev/null || git checkout main 2>/dev/null
  
  # Remove the temporary branch
  git branch -D "$local_branch" 2>/dev/null
  
  return $result
} 