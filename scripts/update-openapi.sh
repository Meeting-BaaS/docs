#!/bin/bash

# Default to production API
API_URL="https://api.meetingbaas.com/openapi.json"
OUTPUT_FILE="openapi.json"

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --local) API_URL="http://localhost:3001/openapi.json" ;;
    *) echo "Unknown parameter: $1"; exit 1 ;;
  esac
  shift
done

echo "Fetching OpenAPI spec from $API_URL..."

# Create a temporary file for the raw response
TEMP_FILE=$(mktemp)

# Fetch the OpenAPI spec
curl -s "$API_URL" > "$TEMP_FILE"

if [ $? -ne 0 ]; then
  echo "Error: Failed to fetch OpenAPI spec"
  rm "$TEMP_FILE"
  exit 1
fi

# Format the JSON with consistent indentation
python3 -c '
import json
import sys

with open(sys.argv[1], "r") as f:
    data = json.load(f)

with open(sys.argv[2], "w") as f:
    json.dump(data, f, indent=2, sort_keys=True, ensure_ascii=False)
' "$TEMP_FILE" "$OUTPUT_FILE"

# Clean up
rm "$TEMP_FILE"

if [ $? -eq 0 ]; then
  echo "OpenAPI spec formatted and saved to $OUTPUT_FILE"
else
  echo "Error: Failed to format OpenAPI spec"
  exit 1
fi