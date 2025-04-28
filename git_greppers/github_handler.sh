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