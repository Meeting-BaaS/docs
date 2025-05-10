#!/bin/bash

# Script to find API update files (starting with "api-"),
# detect if they mention specific platforms (Zoom, Gmeet, Teams),
# and update the frontmatter accordingly.

# Default to only process untracked files, use --all to process all api-* files
PROCESS_ALL=false

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check if PAGE_GENERATION_OPENROUTER_NAME is set
if [ -z "$PAGE_GENERATION_OPENROUTER_NAME" ]; then
  echo "Error: PAGE_GENERATION_OPENROUTER_NAME is required in .env file"
  exit 1
fi

MODEL="$PAGE_GENERATION_OPENROUTER_NAME"

# Log the model being used in green
echo -e "\e[32mUsing model: $MODEL\e[0m"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --all)
      PROCESS_ALL=true
      shift
      ;;
    *)
      # Unknown option
      echo "Unknown option: $1"
      echo "Usage: $0 [--all]"
      exit 1
      ;;
  esac
done

# Updates directory
UPDATES_DIR="content/docs/updates"

# Function to get files to process
get_files_to_process() {
  if [ "$PROCESS_ALL" = true ]; then
    # Get all api-* files
    find "$UPDATES_DIR" -name "api-*.mdx" -type f
  else
    # Get only untracked api-* files
    git ls-files --others --exclude-standard "$UPDATES_DIR" | grep "api-.*\.mdx"
  fi
}

# Function to detect platforms in a file
detect_platforms() {
  local file="$1"
  local platforms=""
  
  # Check for platform mentions
  if grep -q -i "zoom" "$file"; then
    platforms="${platforms}Zoom,"
  fi
  
  if grep -q -i "gmeet\|google meet" "$file"; then
    platforms="${platforms}Gmeet,"
  fi
  
  if grep -q -i "teams\|microsoft teams" "$file"; then
    platforms="${platforms}Teams,"
  fi
  
  # Remove trailing comma
  platforms=${platforms%,}
  
  echo "$platforms"
}

# Function to update frontmatter
update_frontmatter() {
  local file="$1"
  local platforms="$2"
  
  # Create a temporary file
  local temp_file=$(mktemp)
  
  # Extract frontmatter
  sed -n '/^---$/,/^---$/p' "$file" > "$temp_file"
  
  # Update the frontmatter
  sed -i '' 's/icon: [a-zA-Z0-9]*/icon: Zap/' "$temp_file"
  sed -i '' 's/service: [a-zA-Z0-9]*/service: production/' "$temp_file"
  
  # If platforms were detected, add them to the description
  if [ -n "$platforms" ]; then
    # Backup existing description
    local description=$(grep "description:" "$temp_file" | sed 's/description: //')
    
    # Remove existing description line
    sed -i '' '/description:/d' "$temp_file"
    
    # Update the frontmatter with platforms if they exist
    if [ -n "$platforms" ]; then
      sed -i '' "s/title:/description: API - ${platforms}\ntitle:/" "$temp_file"
    else
      sed -i '' "s/title:/description: API\ntitle:/" "$temp_file"
    fi
  fi
  
  # If no platforms found, convert to Production update
  if [ -z "$platforms" ]; then
    # Replace the entire frontmatter block
    new_frontmatter="---
title: $(date +"%B %d, %Y")
description: Production
icon: Zap
service: production
date: $(date +"%B %d, %Y")
---"
    
    # Replace the old frontmatter with the new one
    sed -i '' "1,/^---$/c\\
$new_frontmatter" "$temp_file"
  fi
  
  # Get the content after the frontmatter
  local content=$(sed '1,/^---$/d' "$file" | sed '1,/^---$/d')
  
  # Combine updated frontmatter with original content
  cat "$temp_file" > "$file"
  echo "$content" >> "$file"
  
  # Remove temporary file
  rm "$temp_file"
}

# Get the files to process
FILES=$(get_files_to_process)

if [ -z "$FILES" ]; then
  echo "No API update files found."
  exit 0
fi

echo "Found API update files to process:"
echo "$FILES"
echo ""

# Process each file
for file in $FILES; do
  echo "Processing $file..."
  
  # Detect platforms
  platforms=$(detect_platforms "$file")
  
  if [ -n "$platforms" ]; then
    echo "  Detected platforms: $platforms"
    
    # Update frontmatter
    update_frontmatter "$file" "$platforms"
    echo "  Updated frontmatter to include platforms and change service to production"
  else
    echo "  No specific platforms detected"
    
    # Still update the service and icon
    update_frontmatter "$file" ""
    echo "  Updated frontmatter to change service to production"
  fi
  
  # Extract the filename without path
  filename=$(basename "$file")
  
  # Extract service and date from filename (format: service-YYYY-MM-DD.mdx)
  if [[ $filename =~ ([a-zA-Z-]+)-([0-9]{4}-[0-9]{2}-[0-9]{2})\.mdx ]]; then
    service="${BASH_REMATCH[1]}"
    date="${BASH_REMATCH[2]}"
    
    echo "  Running enhance:updates on the file..."
    # Run the enhance command
    pnpm enhance:updates --service="$service" --date="$date" --model="$MODEL" --local
    
    echo "  Enhancement complete for $filename"
  else
    echo "  Warning: Could not parse service and date from filename: $filename"
    echo "  Skipping enhancement"
  fi
  
  echo ""
done

echo "Processing complete!"
echo "Run 'pnpm dev' to view the changes" 