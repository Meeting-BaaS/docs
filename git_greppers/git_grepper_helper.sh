#!/bin/bash

# Helper script for git_grepper.sh
# This script simplifies running git_grepper.sh with common options

# Why struggle with Python when you can bash your head against shell scripts instead?

# Default values
REPO_PATH=$(pwd)
DEBUG_LEVEL=1
INCLUDE_DIFF=true
ONLY_PR_MR=false

# Show usage information
usage() {
    echo "Usage: $(basename "$0") [OPTIONS]"
    echo
    echo "Helper script for git_grepper.sh to simplify running the script with common options."
    echo
    echo "Options: (prefer using double-dash format '--option' rather than single-dash)"
    echo "  -r, --repo PATH    Set repository path (default: current directory)"
    echo "  -v, --verbose      Increase verbosity (debug level)"
    echo "  -q, --quiet        Decrease verbosity (debug level)"
    echo "  -d, --debug LEVEL  Set debug level (0-3, default: 1)"
    echo "  --no-diff          Skip generating diffs (faster for large repositories)"
    echo "  --only-with-pr-mr  Only process commits with related PR/MR references"
    echo "  -h, --help         Show this help message"
    echo
    echo "Examples:"
    echo "  $(basename "$0") --repo /path/to/repo --debug 2"
    echo "  $(basename "$0") -r /path/to/repo -v --no-diff"
    echo "  $(basename "$0") --repo /path/to/repo --only-with-pr-mr"
    echo
    echo "Note: Output directory will be created in the current directory as '<repo-name>-git-diffs'"
    echo
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -r|--repo)
            REPO_PATH="$2"
            shift 2
            ;;
        -v|--verbose)
            DEBUG_LEVEL=$((DEBUG_LEVEL + 1))
            shift
            ;;
        -q|--quiet)
            DEBUG_LEVEL=$((DEBUG_LEVEL - 1))
            shift
            ;;
        -d|--debug)
            DEBUG_LEVEL="$2"
            shift 2
            ;;
        --no-diff|-no-diff)
            INCLUDE_DIFF=false
            shift
            ;;
        --only-with-pr-mr|-only-with-pr-mr)
            ONLY_PR_MR=true
            shift
            ;;
        -h|--help)
            usage
            ;;
        *)
            echo "Unknown option: $1"
            usage
            ;;
    esac
done

# Ensure debug level is within valid range
if [[ $DEBUG_LEVEL -lt 0 ]]; then
    DEBUG_LEVEL=0
elif [[ $DEBUG_LEVEL -gt 3 ]]; then
    DEBUG_LEVEL=3
fi

# Prepare command
CMD="./git_grepper.sh \"$REPO_PATH\" $DEBUG_LEVEL"
if [[ $INCLUDE_DIFF == false ]]; then
    CMD="$CMD --no-diff"
fi
if [[ $ONLY_PR_MR == true ]]; then
    CMD="$CMD --only-with-pr-mr"
fi

# Execute git_grepper.sh with the given options
echo "Executing: $CMD"
eval "$CMD" 