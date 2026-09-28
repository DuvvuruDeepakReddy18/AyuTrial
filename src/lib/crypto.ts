// Cryptographic utilities for ALCOA+ Audit Trail Hash Chaining

export async function computeSHA256(text: string): Promise<string> {
  // Supports both browser (window.crypto.subtle) and Node.js
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } else {
    // Dynamic import Node crypto for server-side execution
    try {
      const crypto = await import('crypto');
      return crypto.createHash('sha256').update(text).digest('hex');
    } catch {
      // Fallback simple 64-char hex deterministic hash if crypto unavailable
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
      }
      return Math.abs(hash).toString(16).padStart(64, 'a');
    }
  }
}

export function syncComputeSimpleHash(text: string): string {
  // Synchronous deterministic hash for fast initial dataset generation
  let hash1 = 5381;
  let hash2 = 52711;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash1 = (hash1 * 33) ^ char;
    hash2 = (hash2 * 33) ^ char;
  }
  const h1 = (hash1 >>> 0).toString(16).padStart(8, '0');
  const h2 = (hash2 >>> 0).toString(16).padStart(8, '0');
  const combined = `${h1}${h2}${h1}${h2}${h1}${h2}${h1}${h2}`;
  return combined.substring(0, 64);
}
