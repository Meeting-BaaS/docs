#!/bin/bash

# Script to find all untracked git files in the content/docs/updates directory
# and automatically enhance them using pnpm enhance:updates

# Default model to use
MODEL=${1:-"anthropic/claude-3.5-haiku:beta"}

# Find all untracked files in the updates directory
UNTRACKED_FILES=$(git ls-files --others --exclude-standard content/docs/updates/*.mdx)

if [ -z "$UNTRACKED_FILES" ]; then
  echo "No untracked update files found."
  exit 0
fi

echo "Found untracked update files:"
echo "$UNTRACKED_FILES"
echo ""

# Process each file
for file in $UNTRACKED_FILES; do
  # Extract the filename without path
  filename=$(basename "$file")
  
  # Extract service and date from filename (format: service-YYYY-MM-DD.mdx)
  if [[ $filename =~ ([a-zA-Z-]+)-([0-9]{4}-[0-9]{2}-[0-9]{2})\.mdx ]]; then
    service="${BASH_REMATCH[1]}"
    date="${BASH_REMATCH[2]}"
    
    echo "Enhancing file: $filename"
    echo "Service: $service, Date: $date"
    
    # Run the enhance command
    pnpm enhance:updates --service="$service" --date="$date" --model="$MODEL" --local
    
    echo "Completed enhancing $filename"
    echo ""
  else
    echo "Warning: Could not parse service and date from filename: $filename"
    echo "Filename should follow the pattern: service-YYYY-MM-DD.mdx"
    echo ""
  fi
done

echo "Enhancement process complete!" 