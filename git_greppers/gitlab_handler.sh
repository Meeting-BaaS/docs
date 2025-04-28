#!/bin/bash

# Check if GitLab CLI is installed
check_gitlab_cli() {
  if ! command -v glab &> /dev/null; then
    echo -e "${RED}Error:${NC} GitLab CLI (glab) is not installed, but is required for processing GitLab repositories."
    echo -e "To install GitLab CLI:"
    echo -e "  - macOS: ${CYAN}brew install glab${NC}"
    echo -e "  - Linux: ${CYAN}sudo apt install glab${NC} or download from https://gitlab.com/gitlab-org/cli/releases"
    echo -e "  - Windows: ${CYAN}scoop install glab${NC} or ${CYAN}choco install glab${NC}"
    echo -e "\nAfter installation, authenticate with: ${CYAN}glab auth login${NC}"
    exit 1
  fi
  return 0
}

# Function to fetch MR comments from GitLab
fetch_gitlab_mr_comments() {
  local mr_number=$1
  local repo_identifier=$2
  local comments=""
  local has_comments=false
  
  # Remove ! from MR number if present
  mr_number=${mr_number#\!}
  
  # Send debug output to stderr
  debug 2 "Fetching GitLab MR !$mr_number comments using GitLab CLI" >&2
  debug 3 "Raw MR number: $mr_number, Repo identifier: $repo_identifier" >&2
  
  # Get MR description using GitLab CLI
  debug 3 "Running: glab mr view $mr_number" >&2
  local mr_details=$(glab mr view "$mr_number" 2>/dev/null)
  
  if [[ -n "$mr_details" ]]; then
    debug 3 "MR details found, extracting description" >&2
    # Extract description (everything between Description and "opened by")
    local mr_description=$(echo "$mr_details" | sed -n '/^Description:/,/^opened by/p' | grep -v "^Description:" | grep -v "^opened by")
    
    if [[ -n "$mr_description" ]]; then
      comments+="MR DESCRIPTION:\n$mr_description\n\n"
      has_comments=true
      debug 3 "Added MR description to comments" >&2
    else
      debug 3 "No description found in MR details" >&2
    fi
    
    # Get MR comments using a more direct approach
    debug 3 "Running: glab mr note list $mr_number" >&2
    local mr_comments=""
    
    # Try different approaches to get comments
    # Approach 1: Using glab mr note list
    mr_comments=$(glab mr note list "$mr_number" 2>/dev/null)
    
    if [[ -z "$mr_comments" || "$mr_comments" == *"No notes found"* ]]; then
      debug 3 "No comments found using glab mr note list, trying alternative approach" >&2
      # Approach 2: Using glab api
      if command -v jq &> /dev/null; then
        debug 3 "jq is available, using glab api to fetch comments" >&2
        # Extract project path from repo identifier
        local project_path=${repo_identifier/\//%2F}
        mr_comments=$(glab api "projects/$project_path/merge_requests/$mr_number/notes" 2>/dev/null | jq -r '.[] | "Author: \(.author.name)\nDate: \(.created_at)\n\(.body)\n"')
      else
        debug 3 "jq not available, falling back to basic comment extraction" >&2
        # Approach 3: Parse from mr view output if it includes comments
        mr_comments=$(echo "$mr_details" | sed -n '/^Comments:/,/^$/p' | grep -v "^Comments:")
      fi
    else
      # Clean up the output
      mr_comments=$(echo "$mr_comments" | sed 's/^#.*//g' | grep -v "^$")
    fi
    
    if [[ -n "$mr_comments" ]]; then
      comments+="MR COMMENTS:\n$mr_comments\n\n"
      has_comments=true
      debug 3 "Added MR comments to output" >&2
    else
      debug 3 "No comments found in MR" >&2
      comments+="MR COMMENTS: None found\n\n"
    fi
    
    # Extract image URLs from the comments and description
    local image_urls=$(echo "$mr_description $mr_comments" | grep -o -E '\!\[.*\]\(https?://[^)]+\)' | grep -o -E 'https?://[^)]+' || echo "")
    
    if [[ -n "$image_urls" ]]; then
      comments+="IMAGE LINKS FOUND IN MR:\n"
      comments+=$(echo "$image_urls" | sort | uniq)
      comments+="\n\n"
      has_comments=true
      debug 3 "Added image URLs to output" >&2
    fi
  else
    # Send debug output to stderr
    debug 2 "Failed to fetch MR details or MR doesn't exist for !$mr_number" >&2
  fi
  
  if [[ "$has_comments" == "true" ]]; then
    debug 2 "Returning comments for MR !$mr_number" >&2
    printf "%b" "$comments"
  else
    debug 2 "No comments found for MR !$mr_number" >&2
    echo "No comments or description found for this MR."
  fi
}

# Function to find MR information for a commit
find_gitlab_mr_info() {
  local commit_hash=$1
  local repo_identifier=$2
  local pr_mr_info="None found"
  local pr_mr_number=""
  
  debug 2 "Looking for GitLab MR info for commit: $commit_hash" >&2
  debug 3 "Using repo_identifier: $repo_identifier" >&2
  
  # Check if the commit message contains MR references
  local commit_msg=$(git show -s --format=%B "$commit_hash")
  
  # Look for GitLab MR pattern: "Merge branch 'branch' into 'main' See merge request group/project!123"
  pr_mr_number=$(echo "$commit_msg" | grep -o -E "See merge request [^!]+![0-9]+" | grep -o -E "![0-9]+" | head -1)
  
  debug 3 "GitLab MR pattern search result: '$pr_mr_number'" >&2
  
  if [[ -n $pr_mr_number ]]; then
    # Found an MR reference in the commit message
    # Remove the ! from PR number for URL construction
    local mr_num_clean=${pr_mr_number#\!}
    pr_mr_info="GitLab MR $pr_mr_number (https://gitlab.com/$repo_identifier/-/merge_requests/$mr_num_clean)"
    debug 2 "Found MR reference in commit message: $pr_mr_info" >&2
  elif command -v glab &> /dev/null; then
    debug 2 "GitLab CLI available, attempting to use it to find MR info" >&2
    # If GitLab CLI is available, try to use it to find MR information
    local glab_mr=$(glab mr list --search "$commit_hash" --limit 1 2>/dev/null)
    debug 3 "GitLab CLI response: $glab_mr" >&2
    
    if [[ -n $glab_mr && $glab_mr != *"No merge requests match your search"* ]]; then
      # Extract MR number and title from glab output
      local mr_info=$(echo "$glab_mr" | head -1)
      local mr_num=$(echo "$mr_info" | awk '{print $1}')
      pr_mr_number="$mr_num"
      local mr_title=$(echo "$mr_info" | awk '{$1=""; print $0}' | sed 's/^ //')
      
      # Remove the ! from PR number for URL construction
      local mr_num_clean=${mr_num#\!}
      pr_mr_info="GitLab MR $mr_num: $mr_title (https://gitlab.com/$repo_identifier/-/merge_requests/$mr_num_clean)"
      debug 2 "GitLab CLI found MR: $pr_mr_info" >&2
    else
      debug 2 "No MR found using GitLab CLI" >&2
    fi
  else
    debug 2 "GitLab CLI not available" >&2
  fi
  
  # Return both the formatted info string and the PR/MR number
  echo "$pr_mr_info|$pr_mr_number"
} 