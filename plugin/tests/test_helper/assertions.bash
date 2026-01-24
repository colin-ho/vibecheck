#!/bin/bash
# Additional JSON assertion helpers

# Assert JSON field matches regex
assert_json_matches() {
    local json="$1"
    local path="$2"
    local regex="$3"
    local actual
    actual=$(echo "$json" | jq -r "$path")

    if ! [[ "$actual" =~ $regex ]]; then
        echo "Expected $path to match '$regex' but got '$actual'" >&2
        return 1
    fi
}

# Assert JSON field is numeric
assert_json_numeric() {
    local json="$1"
    local path="$2"
    local actual
    actual=$(echo "$json" | jq -r "$path")

    if ! [[ "$actual" =~ ^-?[0-9]+\.?[0-9]*$ ]]; then
        echo "Expected $path to be numeric but got '$actual'" >&2
        return 1
    fi
}

# Assert JSON field is boolean
assert_json_boolean() {
    local json="$1"
    local path="$2"
    local actual
    actual=$(echo "$json" | jq -r "$path")

    if [ "$actual" != "true" ] && [ "$actual" != "false" ]; then
        echo "Expected $path to be boolean but got '$actual'" >&2
        return 1
    fi
}

# Assert JSON array contains value
assert_array_contains() {
    local json="$1"
    local path="$2"
    local expected="$3"
    local found
    found=$(echo "$json" | jq "$path | index(\"$expected\")")

    if [ "$found" = "null" ]; then
        echo "Expected $path to contain '$expected'" >&2
        return 1
    fi
}

# Assert JSON field is in range
assert_json_in_range() {
    local json="$1"
    local path="$2"
    local min="$3"
    local max="$4"
    local actual
    actual=$(echo "$json" | jq -r "$path")

    if ! [[ "$actual" =~ ^-?[0-9]+\.?[0-9]*$ ]]; then
        echo "Expected $path to be numeric but got '$actual'" >&2
        return 1
    fi

    if (( $(echo "$actual < $min" | bc -l) )) || (( $(echo "$actual > $max" | bc -l) )); then
        echo "Expected $path ($actual) to be in range [$min, $max]" >&2
        return 1
    fi
}

# Assert JSON object has key
assert_json_has_key() {
    local json="$1"
    local path="$2"
    local key="$3"
    local found
    found=$(echo "$json" | jq "$path | has(\"$key\")")

    if [ "$found" != "true" ]; then
        echo "Expected $path to have key '$key'" >&2
        return 1
    fi
}

# Assert string contains substring
assert_contains() {
    local haystack="$1"
    local needle="$2"

    if [[ "$haystack" != *"$needle"* ]]; then
        echo "Expected string to contain '$needle'" >&2
        return 1
    fi
}

# Assert string starts with prefix
assert_starts_with() {
    local string="$1"
    local prefix="$2"

    if [[ "$string" != "$prefix"* ]]; then
        echo "Expected string to start with '$prefix'" >&2
        return 1
    fi
}

# Assert output is base64url encoded (no +, /, or =)
assert_base64url() {
    local string="$1"

    if [[ "$string" =~ [+/=] ]]; then
        echo "Expected base64url encoding (found +, /, or =)" >&2
        return 1
    fi

    if ! [[ "$string" =~ ^[A-Za-z0-9_-]+$ ]]; then
        echo "Expected base64url characters only" >&2
        return 1
    fi
}
