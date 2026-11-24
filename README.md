# FlowVault — Intentionally Vulnerable SaaS Starter Lab

> **Educational Security Workshop Repository ("IERT Tech Workshop")**  
> Developed for hands-on application security training, threat modeling, code auditing, and remediation practice.  
> **Safety Warning**: Strictly for local educational use. All credentials, API keys, and endpoints are safe, simulated fakes.

---

## 🚀 Quick Start (100% Offline Capable)

FlowVault is pre-configured with a zero-network local fallback database (`USE_LOCAL_DB=true`). It requires no live Supabase connection or external internet access to run all exploit demonstrations and audits.

```bash
# 1. Install dependencies
npm install

# 2. Initialize Git history and plant demo secret commits
bash scripts/setup-git-history.sh

# 3. Start local development server
npm run dev
```

The application is now live at: **[http://localhost:3000](http://localhost:3000)**

---

## Repository Build Notes

The Next.js app is located at the repository root. CI uses Node.js 20, `npm ci`, and `npm run build`.
The production build succeeds without `.env.local`; keep local environment files out of Git.

This is an intentionally vulnerable training lab. Keep it local or behind access controls; do not expose it on the public internet.

---

## 👥 Pre-Seeded Test Credentials

| Account | Email | Password | Role | Associated Assets |
|---|---|---|---|---|
| **User A** | `usera@example.com` | `Password123!` | `user` | Orders: `ORD-101`, `ORD-102`<br>Private Note: *"User A project roadmap"* |
| **User B** | `userb@example.com` | `Password123!` | `user` | Orders: `ORD-201`, `ORD-202`<br>Private Note: *"CONFIDENTIAL: User B payout secret PIN 9482"* |
| **Admin** | `admin@example.com` | `Admin123!` | `admin` | Full access to `/admin` directory |

- **One-Time Promo Coupon**: `PRO50` (Adds 500 wallet credits, intended `max_uses = 1`)

---

## 🧪 Failure-First Live Proof-of-Concept Scripts

Executable bash verification scripts are located in `scripts/break/`. To execute them, ensure `npm run dev` is running on port 3000:

| Script | Vulnerability Track | Target Endpoint | Description |
|---|---|---|---|
| `scripts/break/01_idor.sh` | Track A05 / B04 | `GET /api/orders/[id]` | Logs in as User A and fetches User B's confidential order `ORD-201` via IDOR/BOLA. |
| `scripts/break/02_rls_anon_leak.sh` | Track A05 / B04 | `GET /api/mock-supabase/rest/v1/orders` | Dumps the multi-tenant orders table using only the public anonymous key (RLS disabled). |
| `scripts/break/03_gitleaks.sh` | Track A06 | Git Commit History | Runs `gitleaks` to detect committed secrets in historical Git commits. |
| `scripts/break/04_xss_payload.sh` | Track A07 / B05 | `POST /api/comments` | Injects unescaped HTML/JavaScript rendered via `dangerouslySetInnerHTML`. |
| `scripts/break/05_coupon_race.sh` | Track B04 | `POST /api/coupons/redeem` | Dispatches 20 concurrent HTTP requests to exploit a TOCTOU race condition on coupon `PRO50`. |
| `scripts/break/06_ssrf_localhost.sh` | Track B05 | `POST /api/import-url` | Exploits Server-Side Request Forgery (SSRF) to read internal microservice `/api/internal/metrics`. |
| `scripts/break/07_ai_prompt_inject.sh` | Track B01 / B05 | `POST /api/ai/assistant` | Injects prompt override into mock AI assistant, invoking over-permissioned `readAllNotes()` to leak User B's secret PIN. |

---

## 🛡️ Instructor Reference & Hardened Solutions

Reference solutions, remediation files, and audit guides are stored in:
- `FLAWS_MAP.md` — Detailed mapping of all 13 planted vulnerabilities, root causes, CWEs, and CVSS scores.
- `instructor-solutions/`
  - `semgrep/no-unauth-db.yaml` — Custom Semgrep static analysis rule detecting unauthenticated DB calls in routes.
  - `lighthouserc.json` — Lighthouse CI configuration asserting accessibility and Core Web Vitals (LCP/CLS) budgets.
  - `playwright/ui-gate.spec.ts` — Playwright + axe-core accessibility regression test suite.
  - `hardened-ci.yml` — Secure GitHub Actions CI workflow with read-only permissions, SHA pinning, and CycloneDX SBOM step.
  - `supabase-rls-fix.sql` — Hardened PostgreSQL Row Level Security schema (`auth.uid() = user_id`, `security_invoker = true`).
  - `SECURITY.md` — 90-day coordinated vulnerability disclosure policy template.
  - `FINDING_TEMPLATE.md` — Standardized vulnerability finding report template.

---

## 🔬 Special Scenarios

### Demonstrating Next.js CVE-2025-29927 (Middleware Bypass)
To demonstrate the middleware authorization bypass vulnerability:
```bash
bash scripts/create-cve-branch.sh
```
This script creates a local git branch pinned to `next@15.2.2` with instructions on testing the `x-middleware-subrequest` header bypass against `/api/admin/users`.
