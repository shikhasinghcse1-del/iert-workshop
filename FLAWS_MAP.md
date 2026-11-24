# FlowVault Planted Vulnerabilities Map (Instructor & Audit Reference)

> **CONFIDENTIAL INSTRUCTOR REFERENCE**  
> Do not distribute this document directly to students before the audit exercise in Task A01. All `// [FLAW #N]` indicators have been omitted from the application source code to provide a realistic security auditing environment.

---

## Complete Matrix of the 13 Planted Flaws

| Flaw # | Track | Vulnerability Name | Affected Component(s) | CWE | Severity (CVSS) |
|---|---|---|---|---|---|
| **FLAW 1** | Track A02 | Dependency Hygiene & Slopsquatting Simulation | `package.json`, `local-stubs/next-auth-helpr` | CWE-1104, CWE-1357 | Medium (5.3) |
| **FLAW 2** | Track A02 | Dead Code, Credential Logging & Missing Validation | `src/lib/helpers.ts`, `src/app/api/auth/login/route.ts`, `src/app/api/orders/[id]/route.ts` | CWE-532, CWE-20, CWE-1164 | High (7.5) |
| **FLAW 3** | Track A03, A04, B03 | "Default AI Slop" UI, A11y & Performance Deficiencies | `src/app/page.tsx`, `src/app/signup/page.tsx`, `src/app/globals.css`, `src/app/dashboard/page.tsx` | CWE-1384, WCAG 2.4.7, 4.5:1 | Low / UX (3.8) |
| **FLAW 4** | Track A05, B04 | Middleware-Only Authorization (CVE-2025-29927 Pattern) | `src/middleware.ts`, `src/app/admin/page.tsx`, `src/app/api/admin/users/route.ts` | CWE-862, CWE-284 | High (8.1) |
| **FLAW 5** | Track A05, B04 | Insecure Direct Object Reference (IDOR/BOLA) & Mass Assignment | `src/app/api/orders/[id]/route.ts`, `src/app/api/profile/route.ts` | CWE-639, CWE-915 | High (8.5) |
| **FLAW 6** | Track A05, B04 | Broken Row Level Security (RLS) & Unauthenticated Anon Leak | `supabase/schema.sql`, `src/app/api/mock-supabase/rest/v1/orders/route.ts` | CWE-284, CWE-200 | High (7.5) |
| **FLAW 7** | Track A06 | Exposed Service Role Secret & Git History Secret Leak | `.env.local`, `src/components/DebugFooter.tsx`, Git History (`.env.leaked`) | CWE-798, CWE-522 | Critical (9.1) |
| **FLAW 8** | Track A06 | Missing Hardening Security Headers & Wildcard CORS | `next.config.ts`, `src/lib/helpers.ts` (`createCorsHeaders`) | CWE-942, CWE-693 | Medium (5.4) |
| **FLAW 9** | Track A07, B05 | Stored Cross-Site Scripting (XSS) via `dangerouslySetInnerHTML` | `src/app/api/comments/route.ts`, `src/app/dashboard/page.tsx` | CWE-79 | High (7.2) |
| **FLAW 10** | Track B04 | Race Condition on Coupon Redemption (TOCTOU) | `src/app/api/coupons/redeem/route.ts`, `src/lib/db.ts` | CWE-362, CWE-367 | Medium (6.5) |
| **FLAW 11** | Track B05 | Unrestricted File Upload & Server-Side Request Forgery (SSRF) | `src/app/api/upload/route.ts`, `src/app/api/import-url/route.ts`, `src/app/api/internal/metrics/route.ts` | CWE-434, CWE-918 | High (8.6) |
| **FLAW 12** | Track B01, B05 | OWASP LLM01 Prompt Injection & Over-Permissioned Tool Abuse | `src/app/api/ai/assistant/route.ts`, `src/lib/db.ts` (`getAllNotes`) | CWE-1426, CWE-250 | High (7.7) |
| **FLAW 13** | Track B06 | Insecure GitHub Actions Supply Chain & PR Target Privilege Leak | `.github/workflows/ci.yml` | CWE-829, CWE-250 | High (8.8) |

---

## Detailed Vulnerability Analysis & Proof of Concept

### [FLAW 1] Dependency Hygiene & Slopsquatting Simulation
- **Files**: `package.json`, `local-stubs/next-auth-helpr/`
- **Root Cause**:
  1. Utility packages `is-odd` and `is-number` are pinned to unconstrained wildcards (`"*"`), allowing unexpected upstream breaks or malicious takeovers to slip into automated builds.
  2. Abandoned deprecated dependency `left-pad` (`^1.3.0`) is included in runtime dependencies.
  3. Hallucinated package simulation: `"next-auth-helpr": "file:./local-stubs/next-auth-helpr"` simulates a vibe-coded typo of legitimate authentication libraries (`next-auth`, `@auth/nextjs`).
- **Remediation**: Pin exact semantic versions or hash lockfiles (`package-lock.json`), prune dead dependencies, and audit dependency manifests against trusted registries using CycloneDX SBOMs.

---

### [FLAW 2] Dead Code, Token Logging & Missing Input Validation
- **Files**: `src/lib/helpers.ts`, `src/app/api/auth/login/route.ts`, `src/app/api/orders/[id]/route.ts`
- **Root Cause**:
  1. Dead functions `legacyEncryptionCipher()`, `deprecatedTokenValidator()`, and `unusedAnalyticsCollector()` linger in the codebase.
  2. Server logs print sensitive authentication credentials: `console.log("DEBUG SESSION TOKEN:", token)`.
  3. API handlers accept unchecked `await req.json()` with zero schema validation (no Zod/Valibot) and swallow exceptions via `catch { return NextResponse.json({ ok: true }); }`.
- **Remediation**: Remove dead code, eliminate sensitive token output from server logs, introduce strict Zod validation schemas on incoming requests, and log errors securely without swallowing them.

---

### [FLAW 3] "Default AI Slop" UI, Accessibility & Performance Deficiencies
- **Files**: `src/app/page.tsx`, `src/app/signup/page.tsx`, `src/app/globals.css`, `src/app/dashboard/page.tsx`
- **Root Cause**:
  1. Garish purple-to-pink gradient, emojis used as feature icons, 3 identical generic cards with filler buzzwords.
  2. Poor contrast: `.low-contrast-slop` text `#52525b` on `#09090b` fails WCAG 2.1 AA 4.5:1 ratio (measured at 2.2:1).
  3. `*:focus { outline: none !important; }` in `globals.css` destroys keyboard navigation focus rings (WCAG 2.4.7 violation).
  4. Signup form has unlabeled inputs (placeholder-only) and tiny clickable targets (<16px) violating WCAG 2.5.5 / 2.5.8.
  5. Oversized inline SVG with missing dimension constraints causing cumulative layout shift (CLS) and degraded Largest Contentful Paint (LCP).
  6. Dashboard lacks empty, loading skeletons, and error handling states.
- **Remediation**: Implement semantic HTML `<label>` elements, 44x44px minimum touch targets, visible focus outlines (`focus-visible:ring-2`), WCAG AA compliant color contrasts, and responsive layout skeletons.

---

### [FLAW 4] Middleware-Only Authorization (CVE-2025-29927 Pattern)
- **Files**: `src/middleware.ts`, `src/app/admin/page.tsx`, `src/app/api/admin/users/route.ts`, `scripts/create-cve-branch.sh`
- **Root Cause**: Access control to `/admin` and `/api/admin/users` is applied exclusively in `middleware.ts`. The actual route handler and page component contain zero authentication or role verification. In vulnerable Next.js versions (e.g. Next.js 15.2.2, reproducible via `scripts/create-cve-branch.sh`), supplying the internal header `x-middleware-subrequest: 1` bypasses middleware entirely.
- **Remediation**: Implement Defense in Depth: authenticate and authorize caller identity directly inside the route handler or server component using a reusable `requireAdmin()` guard.

---

### [FLAW 5] IDOR / BOLA & Mass Assignment
- **Files**: `src/app/api/orders/[id]/route.ts`, `src/app/api/profile/route.ts`
- **Root Cause**:
  1. `GET /api/orders/[id]` queries an order purely by `id` without verifying `order.user_id === currentUser.id`. User A can fetch User B's orders (`ORD-201`, `ORD-202`).
  2. `PATCH /api/profile` directly spreads untrusted `req.json()` into the user entity in the database: `db.updateUser(currentUser.id, body)`, allowing any user to elevate their role to `"admin"` by submitting `{"role": "admin"}`.
- **Verification Script**: `bash scripts/break/01_idor.sh`
- **Remediation**: Check authorization (`order.user_id === currentUser.id || currentUser.role === 'admin'`) and whitelist updatable profile fields.

---

### [FLAW 6] Broken Supabase RLS (CVE-2025-48757 Pattern)
- **Files**: `supabase/schema.sql`, `src/app/api/mock-supabase/rest/v1/orders/route.ts`
- **Root Cause**:
  1. `orders` table has Row Level Security explicitly disabled: `ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;`.
  2. `notes` table has an over-permissive policy: `CREATE POLICY "allow_all" ON public.notes FOR ALL USING (true);`.
  3. `public_order_summary` SQL view is created without `WITH (security_invoker = true)`, allowing callers to bypass underlying table security.
  4. Local mock endpoint `/api/mock-supabase/rest/v1/orders` mirrors this behavior offline, dumping all tenant orders to any caller with the anon key.
- **Verification Script**: `bash scripts/break/02_rls_anon_leak.sh`
- **Remediation**: Apply `instructor-solutions/supabase-rls-fix.sql`.

---

### [FLAW 7] Exposed Service Role Secret & Git History Secret Leak
- **Files**: `.env.local`, `src/components/DebugFooter.tsx`, Git History
- **Root Cause**:
  1. `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` is referenced in client component `src/components/DebugFooter.tsx`, causing Next.js Webpack bundler to bake the secret directly into client-side JavaScript bundles.
  2. `scripts/setup-git-history.sh` commits `.env.leaked` with sensitive API tokens and deletes it in the subsequent commit, leaving the secret retrievable in `.git` commit history.
- **Verification Script**: `bash scripts/break/03_gitleaks.sh`
- **Remediation**: Remove `NEXT_PUBLIC_` prefix from backend secrets, never import server secrets in client components, add `.env*` to `.gitignore`, and use `git filter-repo` / BFG Repo-Cleaner to purge leaked secrets from history.

---

### [FLAW 8] Missing Hardening Security Headers & Wildcard CORS
- **Files**: `next.config.ts`, `src/lib/helpers.ts`
- **Root Cause**:
  1. `next.config.ts` omits all security headers: Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Content-Type-Options, X-Frame-Options, and Referrer-Policy.
  2. API helper `createCorsHeaders()` configures `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true`, permitting cross-origin credential harvesting.
- **Remediation**: Configure standard security headers in `next.config.ts` and restrict CORS origins to trusted domains.

---

### [FLAW 9] Stored Cross-Site Scripting (XSS)
- **Files**: `src/app/api/comments/route.ts`, `src/app/dashboard/page.tsx`
- **Root Cause**: `POST /api/comments` saves raw user input without HTML sanitization, and `src/app/dashboard/page.tsx` renders comments directly using `<div dangerouslySetInnerHTML={{ __html: comment.body }} />`.
- **Verification Script**: `bash scripts/break/04_xss_payload.sh`
- **Remediation**: Sanitize HTML before rendering using DOMPurify / sanitize-html, or render text content as safe React children (`<div>{comment.body}</div>`).

---

### [FLAW 10] Race Condition on Coupon Redemption (TOCTOU)
- **Files**: `src/app/api/coupons/redeem/route.ts`, `src/lib/db.ts`
- **Root Cause**:
  The redemption endpoint performs check-then-act across two non-atomic operations:
  1. Check: `if (coupon.used_count >= coupon.max_uses)`
  2. Delay window: `await new Promise(r => setTimeout(r, 80))`
  3. Act: `coupon.used_count += 1; user.credits += 500;`
  Simultaneous parallel requests all pass the check phase before any single request increments `used_count`.
- **Verification Script**: `bash scripts/break/05_coupon_race.sh`
- **Remediation**: Implement atomic database updates (`UPDATE coupons SET used_count = used_count + 1 WHERE code = $1 AND used_count < max_uses RETURNING id;`) or distributed mutex locks.

---

### [FLAW 11] Unrestricted File Upload & SSRF
- **Files**: `src/app/api/upload/route.ts`, `src/app/api/import-url/route.ts`, `src/app/api/internal/metrics/route.ts`
- **Root Cause**:
  1. `/api/upload` accepts arbitrary file extensions and MIME types with no magic-byte verification.
  2. `/api/import-url` accepts arbitrary URLs and executes `fetch(url)` on the server with redirects enabled and zero validation against loopback (`127.0.0.1`, `localhost`) or private IP ranges (RFC 1918 `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, AWS IMDS `169.254.169.254`).
- **Verification Script**: `bash scripts/break/06_ssrf_localhost.sh`
- **Remediation**: Resolve hostnames, reject private and link-local IP addresses, restrict schemes to HTTP/HTTPS, disable automated redirect following, and validate uploaded file magic bytes.

---

### [FLAW 12] OWASP LLM01 Prompt Injection & Over-Permissioned Tools
- **Files**: `src/app/api/ai/assistant/route.ts`, `src/lib/db.ts`
- **Root Cause**:
  1. Untrusted user input is directly concatenated into the LLM system prompt instructions.
  2. The assistant agent is equipped with tool `readAllNotes()`, which lacks tenant scoping and reads across all users in the database.
  3. Prompt injection overrides the system directive and invokes `readAllNotes()`, exfiltrating User B's secret PIN (`9482`) to User A.
  4. Lacks rate-limiting and token spend caps.
- **Verification Script**: `bash scripts/break/07_ai_prompt_inject.sh`
- **Remediation**: Enforce strict tool-level authorization (pass authenticated `userId` to all tool execution handlers), structure prompts using typed message objects, and implement spend/rate limits.

---

### [FLAW 13] Insecure GitHub Actions CI Workflow
- **Files**: `.github/workflows/ci.yml`
- **Root Cause**:
  1. Workflow grants `permissions: write-all`.
  2. Uses trigger `on: pull_request_target` while checking out untrusted PR head commit `${{ github.event.pull_request.head.sha }}`.
  3. Third-party actions are referenced by mutable version tags (`actions/checkout@v4`, `tj-actions/changed-files@v45`) instead of immutable 40-character commit SHAs.
- **Remediation**: Use `instructor-solutions/hardened-ci.yml`.
