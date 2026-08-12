#!/bin/bash

# Default to production API
API_URL="https://api.meetingbaas.com/v2/openapi.json"
OUTPUT_FILE="openapi-v2.json"

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --local) API_URL="http://localhost:3001/v2/openapi.json" ;;
    --pre-prod) API_URL="https://api.pre-prod-meetingbaas.com/v2/openapi.json" ;;
    *) echo "Unknown parameter: $1"; exit 1 ;;
  esac
  shift
done

echo "Fetching v2 OpenAPI spec from $API_URL..."

# Create a temporary file for the raw response
TEMP_FILE=$(mktemp)

# Fetch the OpenAPI spec (fail on HTTP errors, bound the request)
if ! curl --fail --silent --show-error --connect-timeout 10 --max-time 60 "$API_URL" > "$TEMP_FILE"; then
  echo "Error: Failed to fetch v2 OpenAPI spec"
  rm -f "$TEMP_FILE"
  exit 1
fi

# Validate and format the JSON with consistent indentation. Write to a
# temp file first so the committed spec is only replaced by a payload
# that parses and actually looks like an OpenAPI document.
if python3 -c '
import json
import sys

with open(sys.argv[1], "r") as f:
    data = json.load(f)

if not isinstance(data, dict) or "openapi" not in data:
    sys.exit("payload has no \"openapi\" field - not an OpenAPI spec")

with open(sys.argv[2], "w") as f:
    json.dump(data, f, indent=2, sort_keys=True, ensure_ascii=False)
' "$TEMP_FILE" "$TEMP_FILE.formatted"; then
  mv "$TEMP_FILE.formatted" "$OUTPUT_FILE"
  rm -f "$TEMP_FILE"
  echo "v2 OpenAPI spec formatted and saved to $OUTPUT_FILE"
else
  rm -f "$TEMP_FILE" "$TEMP_FILE.formatted"
  echo "Error: v2 OpenAPI spec invalid or failed to format"
  exit 1
fi

