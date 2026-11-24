#!/usr/bin/env bash
set -e

# ==============================================================================
# Break Script 03: Git History Secret Leak Scan
# ==============================================================================
# Target: Repository Git Commit History
# Detects: Committed and deleted secrets in git commit history
# ==============================================================================

echo "[*] Checking for secrets in Git history using gitleaks..."

if command -v gitleaks >/dev/null 2>&1; then
  echo "[+] gitleaks binary found. Running scan..."
  gitleaks detect --source . -v || true
else
  echo "[!] gitleaks is not installed on this host."
  echo "[*] Inspecting git commit history manually for committed credentials:"
  git log -p -S "SUPABASE_SERVICE_ROLE_KEY" --oneline || git log -p -n 3
  echo ""
  echo "[*] To install gitleaks:"
  echo "    macOS: brew install gitleaks"
  echo "    Linux: sudo apt install gitleaks (or download release binary)"
fi
