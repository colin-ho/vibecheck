#!/bin/bash
# Generate a Claude Wrapped URL from the user's data
# This script outputs a URL that can be opened in a browser

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_URL="${WRAPPED_URL:-http://localhost:5173}"

# Generate bundle JSON
BUNDLE=$("$SCRIPT_DIR/bundle.sh" 2>/dev/null)

if [ -z "$BUNDLE" ] || [ "$BUNDLE" = "{}" ]; then
    echo "Error: Failed to generate bundle" >&2
    exit 1
fi

# Compress and encode
ENCODED=$(echo "$BUNDLE" | gzip -c | base64 | tr '+/' '-_' | tr -d '=' | tr -d '\n')

echo "${BASE_URL}/?d=${ENCODED}"
