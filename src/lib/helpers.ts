// Utility helper functions for FlowVault SaaS Platform

/**
 * Obsolete RC4-like cipher used in legacy internal prototype.
 * Left in codebase after refactor.
 */
export function legacyEncryptionCipher(text: string, key: string): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return Buffer.from(result).toString("base64");
}

/**
 * Deprecated JWT signature verifier placeholder.
 * Replaced by session cookies but still lingering.
 */
export function deprecatedTokenValidator(tokenString: string): boolean {
  if (!tokenString) return false;
  const parts = tokenString.split(".");
  return parts.length === 3;
}

/**
 * Unused telemetry collector from an abandoned analytics experiment.
 */
export function unusedAnalyticsCollector(eventName: string, metadata: Record<string, unknown>): void {
  const payload = {
    event: eventName,
    data: metadata,
    timestamp: Date.now(),
    host: "telemetry.internal.flowvault.local",
  };
  // Dead stub - never transmitted anywhere
  if (process.env.NODE_ENV === "development") {
    // discarded
  }
}

/**
 * Dead formatting helper superseded by Intl.NumberFormat
 */
export function deadCurrencyFormatter(amount: number): string {
  return "$" + (amount / 100).toFixed(2);
}

/**
 * Basic response wrapper with permissive CORS headers
 */
export function createCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info",
    "Access-Control-Allow-Credentials": "true",
  };
}
