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

# Process commits and generate diff files
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
  
  # If no commits found
  if [ -z "$commits" ]; then
    echo -e "${RED}No commits found in the last 2 months on the '$primary_branch' branch.${NC}"
    exit 0
  fi

  local commit_count=$(echo "$commits" | wc -l | tr -d ' ')
  debug 1 "Found $commit_count commits in the last 2 months"
  echo "#KEY#TOTAL_FOUND# $commit_count" >> "$log_file"
  
  if [ "$only_with_pr_mr" = true ]; then
    debug 1 "Only processing commits with related PR/MR references"
    echo "#KEY#ONLY_WITH_PR_MR# true" >> "$log_file"
  fi
  
  # Initialize previous commit variable
  local prev_commit=""
  local processed_count=0
  local skipped_count=0
  local current_date=""
  local current_file=""
  
  # Process each commit
  for commit in $commits; do
    local commit_date=$(git show -s --format=%ci "$commit")
    local commit_msg=$(git show -s --format=%s "$commit")
    local commit_author=$(git show -s --format=%an "$commit")
    
    # Get PR/MR info and number
    local pr_mr_result=""
    local pr_mr_info=""
    local pr_mr_number=""
    
    if [[ $repo_type == "github" ]]; then
      debug 1 "Looking for GitHub PR info for commit: $commit" >&2
      pr_mr_result=$(find_github_pr_info "$commit" "$repo_identifier" 2>/dev/null)
    elif [[ $repo_type == "gitlab" ]]; then
      debug 1 "Looking for GitLab MR info for commit: $commit" >&2
      pr_mr_result=$(find_gitlab_mr_info "$commit" "$repo_identifier" 2>/dev/null)
    fi
    
    if [[ -n $pr_mr_result ]]; then
      pr_mr_info=$(echo "$pr_mr_result" | cut -d'|' -f1)
      pr_mr_number=$(echo "$pr_mr_result" | cut -d'|' -f2)
      
      if [[ "$pr_mr_info" != "None found" ]]; then
        debug 1 "Found PR/MR for commit $commit: $pr_mr_info" >&2
      else
        debug 1 "No PR/MR found for commit $commit" >&2
      fi
    fi
    
    # Skip commits without related PR/MR if only_with_pr_mr is true
    if [ "$only_with_pr_mr" = true ] && [[ "$pr_mr_info" == "None found" ]]; then
      debug 2 "Skipping commit $commit - no related PR/MR found" >&2
      if [ -n "$prev_commit" ]; then
        skipped_count=$((skipped_count + 1))
      fi
      prev_commit=$commit
      continue
    fi
    
    debug 1 "Processing commit: $commit by $commit_author"
    
    # Get merge commit info if applicable
    local merge_result=$(get_merge_commit_info "$commit")
    local is_merge=$(echo "$merge_result" | cut -d'|' -f1)
    local merge_info=$(echo "$merge_result" | cut -d'|' -f2-)
    
    # Skip the first commit as we need pairs for diff
    if [ -n "$prev_commit" ]; then
      processed_count=$((processed_count + 1))
      
      # Extract the date part for grouping
      local commit_day=$(extract_date "$commit_date")
      
      # Check if we need a new file for a new day
      if [[ "$commit_day" != "$current_date" ]]; then
        current_date="$commit_day"
        current_file="$output_dir/diffs-$current_date.diff"
        debug 1 "New day detected: $current_date, creating new file: $current_file"
        
        # Create or clear the file for this day
        echo "#KEY#DATE# $current_date" > "$current_file"
        echo "#KEY#MAX_DIFF_LINES# $max_diff_lines" >> "$current_file"
        echo "#KEY#EXCLUDES# pnpm.lock, TypeScript build files, Rust build files" >> "$current_file"
        echo "" >> "$current_file"
      fi
      
      echo "#KEY#PROCESS_COMMIT# $processed_count/$commit_count $commit_date - $commit_msg" >> "$log_file"
      debug 1 "Appending to diff file: $current_file"
      
      # Print progress with unbuffered output
      printf "${CYAN}[%s/%s] Processing:${NC} %s - %s\n" "$processed_count" "$commit_count" "$commit_date" "$commit_msg"
      
      # Create diff section header
      echo "#KEY#START_COMMIT#" >> "$current_file"
      echo "=================================================================" >> "$current_file"
      echo "#KEY#COMMIT_HASH# $commit" >> "$current_file"
      echo "#KEY#COMMIT_DATE# $commit_date" >> "$current_file"
      echo "#KEY#COMMIT_AUTHOR# $commit_author" >> "$current_file"
      echo "#KEY#COMMIT_MESSAGE# $commit_msg" >> "$current_file"
      echo "#KEY#RELATED_PR_MR# $pr_mr_info" >> "$current_file"
      
      # Add list of changed files
      echo "" >> "$current_file"
      echo "#KEY#CHANGED_FILES#" >> "$current_file"
      git diff --name-only "$prev_commit" "$commit" | sort | while read -r file; do
        echo "- $file" >> "$current_file"
      done
      echo "" >> "$current_file"
      
      # Fetch and add PR/MR comments if available
      local pr_mr_comments=""
      if [[ $repo_type == "github" && -n "$pr_mr_number" && "$pr_mr_number" != "None found" ]]; then
        debug 2 "Fetching GitHub PR comments for $pr_mr_number"
        pr_mr_comments=$(fetch_github_pr_comments "$pr_mr_number" 2>/dev/null)
      elif [[ $repo_type == "gitlab" && -n "$pr_mr_number" && "$pr_mr_number" != "None found" ]]; then
        debug 2 "Fetching GitLab MR comments for $pr_mr_number"
        # Capture only the actual comments, not debug output
        pr_mr_comments=$(fetch_gitlab_mr_comments "$pr_mr_number" "$repo_identifier" 2>/dev/null)
      fi
      
      if [[ -n "$pr_mr_comments" ]]; then
        echo "#KEY#PR_MR_COMMENTS#" >> "$current_file"
        echo -e "$pr_mr_comments" >> "$current_file"
        echo "" >> "$current_file"
      fi
      
      # Add merge info if this is a merge commit
      if [[ $is_merge == "true" ]]; then
        echo "#KEY#MERGE_COMMIT_DETAILS#" >> "$current_file"
        echo -e "$merge_info" >> "$current_file"
        echo "" >> "$current_file"
      fi
      
      echo "#KEY#DIFF_RANGE# FROM: $prev_commit TO: $commit" >> "$current_file"
      echo "=================================================================" >> "$current_file"
      echo "" >> "$current_file"
          
      # Create a pattern for exclusion and limit context lines using -U option
      if [ "$skip_diff" = false ]; then
        echo "#KEY#GIT_DIFF#" >> "$current_file"
        echo "" >> "$current_file"
        
        git diff --diff-filter=ACMRTUXB -U"$max_diff_lines" "$prev_commit" "$commit" -- \
          ":(exclude)pnpm-lock.yaml" \
          ":(exclude)package-lock.json" \
          ":(exclude)yarn.lock" \
          ":(exclude)Cargo.lock" \
          ":(exclude)poetry.lock" \
          ":(exclude)pyproject.toml" \
          ":(exclude)*.toml" \
          ":(exclude)*.lock" \
          ":(exclude)*.conf" \
          ":(exclude)*.config" \
          ":(exclude).env*" \
          ":(exclude)**/target/**" \
          ":(exclude)**/dist/**" \
          ":(exclude)**/build/**" \
          ":(exclude)**/*.js.map" \
          ":(exclude)**/*.d.ts" \
          ":(exclude)**/node_modules/**" \
          >> "$current_file"
        
        debug 2 "Diff generated and appended to $current_file"
      else
        echo "#KEY#GIT_DIFF_SKIPPED# (--no-diff flag used)" >> "$current_file"
        debug 2 "Diff generation skipped as requested"
      fi
      
      echo "#KEY#END_COMMIT#" >> "$current_file"
      echo "#KEY#DIFF_ADDED# $current_file" >> "$log_file"
    else
      debug 1 "Skipping first commit as we need pairs for diff"
      
      # Initialize the current date using the first commit
      current_date=$(extract_date "$commit_date")
      current_file="$output_dir/diffs-$current_date.diff"
      debug 1 "Initial day detected: $current_date, will create file: $current_file"
    fi
    
    # Update previous commit
    prev_commit=$commit
  done
  
  # Return the number of processed commits and skipped commits
  echo "$processed_count|$skipped_count"
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