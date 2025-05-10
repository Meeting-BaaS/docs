#!/bin/bash

# Function to get detailed information about a merge commit
get_merge_commit_info() {
  local commit_hash=$1
  local is_merge=false
  local merge_info=""
  
  # Check if this is a merge commit (has more than one parent)
  local parent_count=$(git cat-file -p "$commit_hash" | grep -c "^parent ")
  
  debug 2 "Commit $commit_hash has $parent_count parents"
  
  if [[ $parent_count -gt 1 ]]; then
    is_merge=true
    debug 2 "This is a merge commit"
    
    # Get parent commit hashes
    local parent_hashes=($(git cat-file -p "$commit_hash" | grep "^parent " | sed 's/^parent //'))
    
    # Add detailed information about each parent
    merge_info="MERGE COMMIT WITH ${#parent_hashes[@]} PARENTS:\n"
    
    for ((i=0; i<${#parent_hashes[@]}; i++)); do
      local parent_hash=${parent_hashes[$i]}
      local parent_date=$(git show -s --format=%ci "$parent_hash")
      local parent_author=$(git show -s --format=%an "$parent_hash")
      local parent_msg=$(git show -s --format=%s "$parent_hash")
      
      debug 3 "Parent $i: $parent_hash by $parent_author - $parent_msg"
      
      merge_info+="PARENT $((i+1)):\n"
      merge_info+="  HASH: $parent_hash\n"
      merge_info+="  DATE: $parent_date\n"
      merge_info+="  AUTHOR: $parent_author\n"
      merge_info+="  MESSAGE: $parent_msg\n"
    done
  else
    debug 2 "This is a regular (non-merge) commit"
  fi
  
  echo -e "$is_merge|$merge_info"
}

# Function to process commits and generate diff files
process_commits() {
  local commits=$1
  local repo_path=$2
  local output_dir=$3
  local primary_branch=$4
  local max_diff_lines=$5
  local skip_diff=$6
  local repo_type=$7
  local repo_identifier=$8
  local log_file=$9
  local only_with_pr_mr=${10:-false}
  local overwrite=${11:-false}
  local days=${12:-7}
  local include_code=${13:-false}
  
  # Initialize counters
  local processed_count=0
  local skipped_count=0
  local commit_count=0
  
  # Initialize file tracking arrays
  local created_files=()
  local skipped_files=()
  local overwritten_files=()
  
  # Create a temporary file to store processed commit hashes
  local temp_file=$(mktemp)
  trap 'rm -f "$temp_file"' EXIT
  
  # Count total commits
  commit_count=$(echo "$commits" | wc -l)
  
  if [ "$commit_count" -eq 0 ]; then
    echo "No commits found in the last $days days" >&2
    return 1
  fi
  
  debug 1 "Found $commit_count commits to process" >&2
  
  if [ "$only_with_pr_mr" = true ]; then
    debug 1 "Only processing commits with related PR/MR references" >&2
  fi
  
  if [ "$include_code" = true ]; then
    debug 1 "Will include code changes in the output" >&2
  fi
  
  # Process each commit
  while IFS= read -r commit; do
    # Skip if commit is empty
    if [ -z "$commit" ]; then
      continue
    fi
    
    # Check if we've already processed this commit
    if grep -q "^$commit$" "$temp_file"; then
      debug 2 "Skipping duplicate commit: $commit" >&2
      ((skipped_count++))
      continue
    fi
    
    # Get commit details
    local commit_date=$(git show -s --format=%ai "$commit")
    local commit_msg=$(git show -s --format=%B "$commit")
    local commit_author=$(git show -s --format=%an "$commit")
    local commit_branch=$(git show -s --format=%D "$commit" | grep -o 'origin/[^,]*' | sed 's/origin\///')
    
    debug 2 "Processing commit: $commit" >&2
    debug 3 "Commit date: $commit_date" >&2
    debug 3 "Commit message: $commit_msg" >&2
    debug 3 "Commit author: $commit_author" >&2
    debug 3 "Commit branch: $commit_branch" >&2
    
    # Check for related PR/MR references
    local has_pr_mr=false
    local pr_mr_refs=""
    
    # Check for GitHub PR references (#123)
    if [[ "$commit_msg" =~ (#[0-9]+) ]]; then
      has_pr_mr=true
      pr_mr_refs="${BASH_REMATCH[0]}"
      debug 2 "Found GitHub PR reference: $pr_mr_refs" >&2
    fi
    
    # Check for GitLab MR references (!123)
    if [[ "$commit_msg" =~ (![0-9]+) ]]; then
      has_pr_mr=true
      pr_mr_refs="${pr_mr_refs:+$pr_mr_refs }${BASH_REMATCH[0]}"
      debug 2 "Found GitLab MR reference: ${BASH_REMATCH[0]}" >&2
    fi
    
    # Check for merge commit messages
    if [[ "$commit_msg" =~ (Merge (pull request|branch) .* into .*|Merge branch .* into .*) ]]; then
      has_pr_mr=true
      pr_mr_refs="${pr_mr_refs:+$pr_mr_refs }${BASH_REMATCH[0]}"
      debug 2 "Found merge commit message: ${BASH_REMATCH[0]}" >&2
    fi
    
    # Check branch name for feature branches
    if [[ "$commit_branch" =~ (feature|bugfix|hotfix|release)/.* ]]; then
      has_pr_mr=true
      pr_mr_refs="${pr_mr_refs:+$pr_mr_refs }Branch: $commit_branch"
      debug 2 "Found feature branch: $commit_branch" >&2
    fi
    
    if [ "$has_pr_mr" = true ]; then
      debug 2 "Found PR/MR references in commit message: $pr_mr_refs" >&2
    else
      debug 2 "No PR/MR references found in commit message" >&2
      debug 3 "Commit message: $commit_msg" >&2
    fi
    
    # Skip if we only want PR/MR commits and this one doesn't have any
    if [ "$only_with_pr_mr" = true ] && [ "$has_pr_mr" = false ]; then
      debug 2 "Skipping commit without PR/MR reference: $commit" >&2
      ((skipped_count++))
      continue
    fi
    
    # Get the date for the output file
    local file_date=$(date -j -f "%Y-%m-%d %H:%M:%S %z" "$commit_date" "+%Y-%m-%d" 2>/dev/null || date -d "$commit_date" "+%Y-%m-%d")
    debug 2 "File date: $file_date" >&2
    local current_file="${output_dir}/diffs-${file_date}.diff"
    debug 2 "Output file: $current_file" >&2
    
    # Check if file exists and handle overwrite
    if [ -f "$current_file" ] && [ "$overwrite" = false ]; then
      debug 2 "File already exists and overwrite is false: $current_file" >&2
      skipped_files+=("$current_file")
      ((skipped_count++))
      continue
    fi
    
    # Create new file if it doesn't exist
    if [ ! -f "$current_file" ]; then
      debug 2 "Creating new file for date $file_date: $current_file" >&2
      echo "#KEY#DATE# $file_date" > "$current_file"
      echo "#KEY#MAX_DIFF_LINES# $max_diff_lines" >> "$current_file"
      echo "#KEY#EXCLUDES# pnpm.lock,*.js.map,*.d.ts.map,*.tsbuildinfo" >> "$current_file"
      created_files+=("$current_file")
    elif [ "$overwrite" = true ]; then
      debug 2 "Overwriting existing file: $current_file" >&2
      echo "#KEY#DATE# $file_date" > "$current_file"
      echo "#KEY#MAX_DIFF_LINES# $max_diff_lines" >> "$current_file"
      echo "#KEY#EXCLUDES# pnpm.lock,*.js.map,*.d.ts.map,*.tsbuildinfo" >> "$current_file"
      overwritten_files+=("$current_file")
    else
      debug 2 "Appending to existing file: $current_file" >&2
    fi
    
    # Write commit information
    echo "#KEY#START_COMMIT#" >> "$current_file"
    echo "#KEY#COMMIT_HASH# $commit" >> "$current_file"
    echo "#KEY#COMMIT_DATE# $commit_date" >> "$current_file"
    echo "#KEY#COMMIT_AUTHOR# $commit_author" >> "$current_file"
    echo "#KEY#COMMIT_MESSAGE# $commit_msg" >> "$current_file"
    
    # Get related PR/MR information
    if [ "$has_pr_mr" = true ]; then
      local pr_mr_info=""
      if [ "$repo_type" = "github" ]; then
        debug 2 "Getting GitHub PR info for commit: $commit" >&2
        pr_mr_info=$(get_github_pr_info "$repo_identifier" "$commit_msg")
      elif [ "$repo_type" = "gitlab" ]; then
        debug 2 "Getting GitLab MR info for commit: $commit" >&2
        pr_mr_info=$(get_gitlab_mr_info "$repo_identifier" "$commit_msg")
      fi
      
      if [ -n "$pr_mr_info" ]; then
        debug 2 "Found PR/MR info: $pr_mr_info" >&2
        echo "#KEY#RELATED_PR_MR# $pr_mr_info" >> "$current_file"
      else
        debug 2 "No PR/MR info found" >&2
      fi
    fi
    
    # Get changed files
    local changed_files=$(git show --name-only --format="" "$commit")
    debug 2 "Changed files: $changed_files" >&2
    echo "#KEY#CHANGED_FILES# $changed_files" >> "$current_file"
    
    # Get PR/MR comments if available
    if [ "$has_pr_mr" = true ]; then
      local comments=""
      if [ "$repo_type" = "github" ]; then
        debug 2 "Getting GitHub PR comments for commit: $commit" >&2
        comments=$(get_github_pr_comments "$repo_identifier" "$commit_msg")
      elif [ "$repo_type" = "gitlab" ]; then
        debug 2 "Getting GitLab MR comments for commit: $commit" >&2
        comments=$(get_gitlab_mr_comments "$repo_identifier" "$commit_msg")
      fi
      
      if [ -n "$comments" ]; then
        debug 2 "Found PR/MR comments" >&2
        echo "#KEY#PR_MR_COMMENTS# $comments" >> "$current_file"
      else
        debug 2 "No PR/MR comments found" >&2
      fi
    fi
    
    # Get diff if not skipped
    if [ "$skip_diff" = false ]; then
      local diff_range=$(git show --format="" "$commit" | grep -n "^diff --git" | head -n1 | cut -d: -f1)
      if [ -n "$diff_range" ]; then
        debug 2 "Generating diff for commit: $commit" >&2
        echo "#KEY#DIFF_RANGE# $diff_range" >> "$current_file"
        echo "#KEY#GIT_DIFF#" >> "$current_file"
        
        if [ "$include_code" = true ]; then
          # Include full code changes
          git show "$commit" | tail -n +$diff_range >> "$current_file"
        else
          # Only include file names and basic diff info
          git show --name-only --format="" "$commit" >> "$current_file"
        fi
      else
        debug 2 "No changes found in commit: $commit" >&2
      fi
    else
      debug 2 "Diff generation disabled for commit: $commit" >&2
      echo "#KEY#GIT_DIFF_SKIPPED# Diff generation disabled" >> "$current_file"
    fi
    
    echo "#KEY#END_COMMIT#" >> "$current_file"
    
    # Add commit to processed list
    echo "$commit" >> "$temp_file"
    
    # Increment processed count
    ((processed_count++))
    
    # Log progress
    printf "${CYAN}[%d/%d] Processing:${NC} %s - %s\n" "$processed_count" "$commit_count" "$commit_date" "$commit_msg" >&2
    
  done <<< "$commits"
  
  # Return the counts and file operations
  echo "$processed_count|$skipped_count|${created_files[*]}|${skipped_files[*]}|${overwritten_files[*]}"
  return 0
}

# Summarize results
summarize_results() {
  local output_dir=$1
  local repo_folder=$2
  local processed_count=$3
  local skipped_count=$4
  local log_file=$5
  local only_with_pr_mr=$6
  
  # List all generated diff files
  local diff_files=$(find "$output_dir" -name "diffs-*.diff" | sort)
  local diff_count=$(echo "$diff_files" | wc -l | tr -d ' ')
  
  printf "${GREEN}Diff generation complete for ${CYAN}%s${GREEN}.${NC}\n" "$repo_folder"
  printf "${GREEN}Created %s daily diff files in ${CYAN}%s${GREEN} directory:${NC}\n" "$diff_count" "$output_dir"
  
  echo "#KEY#DIFF_FILES_SUMMARY#" >> "$log_file"
  for file in $diff_files; do
    local file_size=$(wc -l < "$file")
    printf "  - ${CYAN}%s${NC} (${YELLOW}%s lines${NC})\n" "$(basename "$file")" "$file_size"
    echo "  - $(basename "$file") ($file_size lines)" >> "$log_file"
  done
  
  printf "${GREEN}Total commits processed:${NC} ${YELLOW}%s${NC}\n" "$processed_count"
  echo "#KEY#TOTAL_COMMITS# $processed_count" >> "$log_file"
  
  if [ "$skipped_count" -gt 0 ]; then
    printf "${GREEN}Commits skipped (no PR/MR):${NC} ${YELLOW}%s${NC}\n" "$skipped_count"
    echo "#KEY#SKIPPED_COMMITS# $skipped_count" >> "$log_file"
  fi
  
  echo "#KEY#COMPLETED_AT# $(date)" >> "$log_file"
  debug 1 "Script completed successfully"
} 