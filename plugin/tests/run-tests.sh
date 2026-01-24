#!/bin/bash
# Main test runner for plugin scripts
# Installs bats-core if needed and runs all tests

set -e

TESTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BATS_DIR="$TESTS_DIR/bats"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=== Claude Wrapped Plugin Tests ==="
echo

# Check for jq dependency
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is required but not installed${NC}"
    echo "Install with: brew install jq (macOS) or apt-get install jq (Linux)"
    exit 1
fi

# Install bats-core if not present
if [ ! -d "$BATS_DIR" ]; then
    echo -e "${YELLOW}Installing bats-core...${NC}"
    git clone --depth 1 https://github.com/bats-core/bats-core.git "$BATS_DIR" 2>/dev/null
    echo -e "${GREEN}bats-core installed${NC}"
fi

# Run specific test file if provided, otherwise run all
if [ -n "$1" ]; then
    if [ -f "$TESTS_DIR/$1" ]; then
        echo "Running: $1"
        "$BATS_DIR/bin/bats" "$TESTS_DIR/$1"
    elif [ -f "$TESTS_DIR/$1.bats" ]; then
        echo "Running: $1.bats"
        "$BATS_DIR/bin/bats" "$TESTS_DIR/$1.bats"
    else
        echo -e "${RED}Test file not found: $1${NC}"
        exit 1
    fi
else
    # Run all .bats files
    echo "Running all tests..."
    echo
    "$BATS_DIR/bin/bats" "$TESTS_DIR"/*.bats
fi

echo
echo -e "${GREEN}All tests completed!${NC}"
