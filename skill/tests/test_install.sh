#!/bin/bash
# Tests for install.sh Python version detection logic
# Run with: ./test_install.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_SCRIPT="$SCRIPT_DIR/../install.sh"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

TESTS_PASSED=0
TESTS_FAILED=0

pass() {
    echo -e "${GREEN}✓ $1${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
}

fail() {
    echo -e "${RED}✗ $1${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
}

echo "=== install.sh Tests ==="
echo ""

# Test 1: Check that the script requires Python 3.8+
echo "Testing Python version requirements..."

# Extract the version check from install.sh
if grep -q 'sys.version_info >= (3, 8)' "$INSTALL_SCRIPT"; then
    pass "Script checks for Python 3.8+"
else
    fail "Script should check for Python 3.8+"
fi

# Test 2: Check that versioned python commands include 3.8-3.14
echo "Testing versioned Python command fallbacks..."

for minor in 8 9 10 11 12 13 14; do
    if grep -q "python3\.$minor" "$INSTALL_SCRIPT"; then
        pass "Script includes python3.$minor fallback"
    else
        fail "Script missing python3.$minor fallback"
    fi
done

# Test 3: Check error message mentions correct version
if grep -q 'Python 3.8+' "$INSTALL_SCRIPT"; then
    pass "Error message mentions Python 3.8+"
else
    fail "Error message should mention Python 3.8+"
fi

# Test 4: Verify the current Python meets requirements
echo ""
echo "Testing current Python version..."

PYTHON_VERSION=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
MAJOR=$(echo "$PYTHON_VERSION" | cut -d. -f1)
MINOR=$(echo "$PYTHON_VERSION" | cut -d. -f2)

if [ "$MAJOR" -eq 3 ] && [ "$MINOR" -ge 8 ]; then
    pass "Current Python $PYTHON_VERSION meets 3.8+ requirement"
else
    fail "Current Python $PYTHON_VERSION does not meet 3.8+ requirement"
fi

# Test 5: Test the version check command directly
echo ""
echo "Testing version check logic..."

if python3 -c 'import sys; exit(0 if sys.version_info >= (3, 8) else 1)' 2>/dev/null; then
    pass "Version check command works correctly"
else
    fail "Version check command failed"
fi

# Summary
echo ""
echo "=== Summary ==="
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"

if [ "$TESTS_FAILED" -gt 0 ]; then
    exit 1
fi

echo ""
echo "All tests passed!"
