# Security & Coordinated Vulnerability Disclosure Policy

## Reporting Security Issues

We take the security of FlowVault and our user community seriously. If you have discovered a vulnerability, security flaw, or potential exposure in this project, we appreciate your cooperation in disclosing it to us in a responsible and coordinated manner.

### Contact Information
- **Security Team Email**: `security@flowvault.example.com`
- **PGP Key Fingerprint**: `9482 1100 AABB CCDD EEFF 1234 5678 90AB CDEF 1122`

Please do **not** open public GitHub issues or public pull requests for security vulnerabilities.

---

## 90-Day Coordinated Vulnerability Disclosure Window

We commit to the standard 90-day coordinated vulnerability disclosure policy:

1. **Initial Acknowledgment**: Within 48 hours of receipt, our security team will acknowledge your report.
2. **Triage & Validation**: Within 5 business days, we will complete technical triage and confirm the scope and severity using CVSS v3.1 metrics.
3. **Remediation & Patch Development**: A fix will be developed and scheduled for release.
4. **Coordinated Disclosure**: We request that finders maintain confidentiality for up to **90 calendar days** from initial reporting or until an official advisory and patch are published (whichever comes first), allowing downstream users sufficient time to patch.

---

## Scope & Exclusions

### In-Scope
- Authentication bypass, session fixation, and privilege escalation vulnerabilities.
- Data isolation failures (IDOR / BOLA, missing RLS policies).
- Server-Side Request Forgery (SSRF) and Remote Code Execution (RCE).
- Stored and reflected Cross-Site Scripting (XSS).
- Supply-chain, CI/CD pipeline, and dependency-squatting risks.

### Out-of-Scope
- Denial of Service (DoS/DDoS) attacks against production infrastructure.
- Social engineering, phishing, or physical attacks against employees.
- Submissions from automated scanning tools without reproducible proof-of-concept steps.
