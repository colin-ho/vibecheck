#!/bin/bash
# Common test utilities and setup

# Get absolute paths
TESTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPTS_DIR="$(cd "$TESTS_DIR/../scripts" && pwd)"
FIXTURES_DIR="$TESTS_DIR/fixtures"

# Create a temporary CLAUDE_DIR for testing
setup_test_env() {
    # Create temp directory that mimics ~/.claude structure
    TEST_CLAUDE_DIR=$(mktemp -d)
    export CLAUDE_DIR="$TEST_CLAUDE_DIR"

    # Create projects directory
    mkdir -p "$TEST_CLAUDE_DIR/projects"
}

# Clean up temp directory
teardown_test_env() {
    if [ -n "$TEST_CLAUDE_DIR" ] && [ -d "$TEST_CLAUDE_DIR" ]; then
        rm -rf "$TEST_CLAUDE_DIR"
    fi
}

# Copy a fixture file to the test environment
use_stats_fixture() {
    local fixture_name="$1"
    cp "$FIXTURES_DIR/stats-cache/$fixture_name" "$TEST_CLAUDE_DIR/stats-cache.json"
}

# Copy JSONL fixture projects to test environment
use_project_fixtures() {
    cp -r "$FIXTURES_DIR/projects/"* "$TEST_CLAUDE_DIR/projects/" 2>/dev/null || true
}

# Run a script from the scripts directory
run_script() {
    local script_name="$1"
    shift
    bash "$SCRIPTS_DIR/$script_name" "$@"
}

# Assert JSON field equals expected value
# Usage: assert_json_equals "$json" ".field" "expected"
assert_json_equals() {
    local json="$1"
    local path="$2"
    local expected="$3"
    local actual
    actual=$(echo "$json" | jq -r "$path")

    if [ "$actual" != "$expected" ]; then
        echo "Expected $path to be '$expected' but got '$actual'" >&2
        return 1
    fi
}

# Assert JSON field is a number greater than expected
assert_json_gt() {
    local json="$1"
    local path="$2"
    local expected="$3"
    local actual
    actual=$(echo "$json" | jq -r "$path")

    if [ "$actual" -le "$expected" ] 2>/dev/null; then
        echo "Expected $path ($actual) to be greater than $expected" >&2
        return 1
    fi
}

# Assert JSON field exists and is not null
assert_json_exists() {
    local json="$1"
    local path="$2"
    local actual
    actual=$(echo "$json" | jq -r "$path")

    if [ "$actual" = "null" ] || [ -z "$actual" ]; then
        echo "Expected $path to exist and not be null" >&2
        return 1
    fi
}

# Assert JSON is valid
assert_valid_json() {
    local json="$1"
    if ! echo "$json" | jq . >/dev/null 2>&1; then
        echo "Invalid JSON: $json" >&2
        return 1
    fi
}

# Assert array length
assert_array_length() {
    local json="$1"
    local path="$2"
    local expected="$3"
    local actual
    actual=$(echo "$json" | jq "$path | length")

    if [ "$actual" != "$expected" ]; then
        echo "Expected $path to have length $expected but got $actual" >&2
        return 1
    fi
}
