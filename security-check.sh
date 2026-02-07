#!/bin/bash

# Security Header Verification Script for KI_AGENTS_LIST
# Usage: ./security-check.sh [URL]
# Default URL: https://ki-agents-list.vercel.app

URL="${1:-https://ki-agents-list.vercel.app}"

echo "======================================"
echo "Security Header Check"
echo "URL: $URL"
echo "======================================"
echo ""

# Fetch headers
echo "Fetching headers..."
HEADERS=$(curl -sI "$URL")

# Check for required security headers
echo "Checking security headers..."
echo ""

# Function to check header
check_header() {
    local header_name="$1"
    local expected_pattern="$2"

    if echo "$HEADERS" | grep -qi "^$header_name:"; then
        value=$(echo "$HEADERS" | grep -i "^$header_name:" | cut -d' ' -f2-)
        echo "✅ $header_name"
        echo "   Value: $value"

        if [ -n "$expected_pattern" ]; then
            if echo "$value" | grep -qi "$expected_pattern"; then
                echo "   Pattern match: OK"
            else
                echo "   ⚠️  Pattern mismatch (expected: $expected_pattern)"
            fi
        fi
    else
        echo "❌ $header_name - MISSING"
    fi
    echo ""
}

# Check all security headers
check_header "Content-Security-Policy" "default-src 'self'"
check_header "Strict-Transport-Security" "max-age"
check_header "X-Content-Type-Options" "nosniff"
check_header "X-Frame-Options" "DENY"
check_header "Referrer-Policy" "strict-origin"
check_header "Permissions-Policy"
check_header "X-DNS-Prefetch-Control"
check_header "X-Download-Options" "noopen"
check_header "X-Permitted-Cross-Domain-Policies" "none"

echo "======================================"
echo "File Checks"
echo "======================================"
echo ""

# Check for security.txt
echo "Checking security.txt..."
if curl -sI "$URL/.well-known/security.txt" | grep -q "200"; then
    echo "✅ /.well-known/security.txt exists"
else
    echo "❌ /.well-known/security.txt not found"
fi
echo ""

# Check for robots.txt
echo "Checking robots.txt..."
if curl -sI "$URL/robots.txt" | grep -q "200"; then
    echo "✅ /robots.txt exists"
else
    echo "❌ /robots.txt not found"
fi
echo ""

echo "======================================"
echo "CSP Validation"
echo "======================================"
echo ""

CSP=$(echo "$HEADERS" | grep -i "^content-security-policy:" | cut -d' ' -f2-)

if echo "$CSP" | grep -q "unsafe-inline"; then
    echo "⚠️  WARNING: CSP contains 'unsafe-inline'"
else
    echo "✅ CSP does not contain 'unsafe-inline'"
fi

if echo "$CSP" | grep -q "sha256-"; then
    echo "✅ CSP uses hash-based script whitelisting"
else
    echo "⚠️  WARNING: No hash-based script whitelisting detected"
fi

if echo "$CSP" | grep -q "upgrade-insecure-requests"; then
    echo "✅ CSP enforces HTTPS upgrade"
else
    echo "❌ Missing upgrade-insecure-requests directive"
fi

echo ""
echo "======================================"
echo "Security Score Estimate"
echo "======================================"
echo ""

SCORE=0
MAX_SCORE=10

# Count headers
[ ! -z "$(echo "$HEADERS" | grep -i "^content-security-policy:")" ] && ((SCORE++))
[ ! -z "$(echo "$HEADERS" | grep -i "^strict-transport-security:")" ] && ((SCORE++))
[ ! -z "$(echo "$HEADERS" | grep -i "^x-content-type-options:")" ] && ((SCORE++))
[ ! -z "$(echo "$HEADERS" | grep -i "^x-frame-options:")" ] && ((SCORE++))
[ ! -z "$(echo "$HEADERS" | grep -i "^referrer-policy:")" ] && ((SCORE++))
[ ! -z "$(echo "$HEADERS" | grep -i "^permissions-policy:")" ] && ((SCORE++))

# Check files
curl -sI "$URL/.well-known/security.txt" | grep -q "200" && ((SCORE++))
curl -sI "$URL/robots.txt" | grep -q "200" && ((SCORE++))

# Check CSP quality
! echo "$CSP" | grep -q "unsafe-inline" && ((SCORE++))
echo "$CSP" | grep -q "sha256-" && ((SCORE++))

echo "Security Score: $SCORE / $MAX_SCORE"

if [ $SCORE -ge 9 ]; then
    echo "Rating: 🟢 Excellent"
elif [ $SCORE -ge 7 ]; then
    echo "Rating: 🟡 Good"
elif [ $SCORE -ge 5 ]; then
    echo "Rating: 🟠 Fair"
else
    echo "Rating: 🔴 Needs Improvement"
fi

echo ""
echo "======================================"
echo "Recommendations"
echo "======================================"
echo ""

if [ $SCORE -lt 10 ]; then
    echo "For a perfect score:"
    [ -z "$(echo "$HEADERS" | grep -i "^content-security-policy:")" ] && echo "  - Add Content-Security-Policy header"
    [ -z "$(echo "$HEADERS" | grep -i "^strict-transport-security:")" ] && echo "  - Add Strict-Transport-Security header"
    [ -z "$(echo "$HEADERS" | grep -i "^permissions-policy:")" ] && echo "  - Add Permissions-Policy header"
    echo "$CSP" | grep -q "unsafe-inline" && echo "  - Remove 'unsafe-inline' from CSP"
    ! echo "$CSP" | grep -q "sha256-" && echo "  - Use hash-based script whitelisting in CSP"
    ! curl -sI "$URL/.well-known/security.txt" | grep -q "200" && echo "  - Add security.txt file"
    ! curl -sI "$URL/robots.txt" | grep -q "200" && echo "  - Add robots.txt file"
else
    echo "✅ All security measures in place!"
fi

echo ""
echo "For detailed analysis, visit:"
echo "  - https://securityheaders.com/?q=$URL"
echo "  - https://observatory.mozilla.org/analyze/$URL"
echo ""
