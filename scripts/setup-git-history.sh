#!/usr/bin/env bash
set -e

# ==============================================================================
# Setup Git History for FlowVault Educational Lab
# ==============================================================================
# This script:
# 1. Initializes a git repository (if not already initialized).
# 2. Configures local git user.
# 3. Commits the baseline application code.
# 4. Plants a dummy leaked secret in .env.leaked and commits it ("accidental commit").
# 5. Deletes .env.leaked in the next commit ("insufficient fix - secret still in history").
# 6. Creates git tag 'task-01-start' for workshop participants.
# ==============================================================================

echo "[*] Initializing Git repository and history..."

if [ ! -d ".git" ]; then
  git init -b main
fi

git config user.name "Workshop Instructor"
git config user.email "instructor@flowvault.local"

# Stage and commit baseline files
git add .
git commit -m "feat: initial FlowVault application baseline" || true

# Commit leaked secret (Flaw 7)
echo "[*] Simulating accidental secret commit in git history..."
cat << 'EOF' > .env.leaked
# ACCIDENTAL LEAK SIMULATION - EDUCATIONAL TEST ONLY
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.FAKE_LEAKED_SECRET_IN_GIT_HISTORY_998877.DEMO_SIGNATURE
STRIPE_SECRET_KEY=sk_test_fake_educational_key_00998877665544332211
EOF

git add .env.leaked
git commit -m "chore: add production environment credentials"

# Delete the leaked file in subsequent commit
echo "[*] Simulating improper deletion commit..."
rm -f .env.leaked
git add .env.leaked
git commit -m "chore: remove leaked env file from repo root"

# Tag the starting point
git tag -f task-01-start

echo ""
echo "=============================================================================="
echo " Git history initialized successfully!"
echo " Tag 'task-01-start' created."
echo " To test secret detection with gitleaks:"
echo "   gitleaks detect --source . -v"
echo "=============================================================================="
