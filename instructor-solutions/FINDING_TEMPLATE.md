# Security Vulnerability Finding Report Template

---

### Finding Metadata

- **Finding ID**: `VULN-2026-001`
- **Title**: [Concise, descriptive title, e.g. Insecure Direct Object Reference (IDOR) in Order Retrieval API]
- **Severity**: Critical / High / Medium / Low
- **CVSS v3.1 Vector & Score**: `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N` (Score: 6.5)
- **CWE ID**: [e.g. CWE-639: Authorization Bypass Through User-Controlled Key, CWE-284, CWE-862]
- **OWASP Category**: [e.g. A01:2021 – Broken Access Control]
- **Affected Component / Endpoint**: [e.g. `GET /api/orders/[id]` or `src/app/api/orders/[id]/route.ts`]

---

### 1. Vulnerability Summary
[Provide a clear 2-3 sentence overview describing what the vulnerability is, why it occurs in the code, and which security boundary is compromised.]

---

### 2. Steps to Reproduce
1. Log in as low-privileged tenant User A (`usera@example.com`).
2. Capture the active session cookie (`flowvault_session`).
3. Send a GET request to `/api/orders/ORD-201` (an order belonging exclusively to User B).
   ```bash
   curl -i -H "Cookie: flowvault_session=<TOKEN>" http://localhost:3000/api/orders/ORD-201
   ```
4. Observe the response returns HTTP 200 containing User B's order details, pricing, and email address.

---

### 3. Impact Assessment
- **Confidentiality**: High — Complete horizontal exposure of tenant order history and personally identifiable information (PII).
- **Integrity**: None.
- **Availability**: None.
- **Business Impact**: Violation of multi-tenant isolation, GDPR/regulatory non-compliance, and data leakage across competing enterprise customers.

---

### 4. Remediation & Fix Recommendation
- **Short-Term Fix**: Validate that `order.user_id === currentUser.id` or that `currentUser.role === 'admin'` before returning the order entity.
- **Long-Term Architectural Defense**: Enforce tenant boundaries at the database layer using strict PostgreSQL Row Level Security (RLS) policies or an ORM tenant isolation hook.

```typescript
// Remediated code pattern:
const order = db.getOrderById(id);
if (!order || (order.user_id !== currentUser.id && currentUser.role !== "admin")) {
  return NextResponse.json({ error: "Order not found" }, { status: 404 });
}
```

---

### 5. Proof of Concept (Evidence)
- **Terminal Output / Screenshot**:
  ```json
  HTTP/1.1 200 OK
  Content-Type: application/json

  {
    "order": {
      "id": "ORD-201",
      "user_id": "user-b-2222",
      "user_email": "userb@example.com",
      "item": "Automated Payroll Engine",
      "amount": 850.00,
      "status": "completed"
    },
    "accessed_by": "usera@example.com"
  }
  ```
