import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const SECRET_KEY =
  process.env.UNSUBSCRIBE_TOKEN_SECRET ||
  process.env.BETTER_AUTH_SECRET ||
  "fallback-secret-change-in-production";

/**
 * Generate a secure HMAC-signed unsubscribe token for an email subscriber
 * @param email - The subscriber's email address
 * @returns A unique, HMAC-signed token
 */
export function generateUnsubscribeToken(email: string): string {
  const randomPart = randomBytes(16).toString("hex");

  const payload = `${randomPart}|${email}`;

  const signature = createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex");

  const token = Buffer.from(`${payload}|${signature}`).toString("base64url");

  return token;
}

/**
 * Verify and extract email from an unsubscribe token
 * @param token - The token to verify
 * @returns The email address if valid, null otherwise
 */
export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split("|");

    if (parts.length !== 3) {
      return null;
    }

    const [randomPart, email, providedSignature] = parts;

    if (!providedSignature) {
      return null;
    }

    const payload = `${randomPart}|${email}`;

    const expectedSignature = createHmac("sha256", SECRET_KEY)
      .update(payload)
      .digest("hex");

    // Constant-time comparison to prevent timing attacks
    if (providedSignature.length !== expectedSignature.length) {
      return null;
    }

    const providedBuffer = Buffer.from(providedSignature, "hex");
    const expectedBuffer = Buffer.from(expectedSignature, "hex");

    if (!timingSafeEqual(providedBuffer, expectedBuffer)) {
      return null;
    }

    if (!email?.includes("@")) {
      return null;
    }

    return email;
  } catch {
    return null;
  }
}

/**
 * Verify if an unsubscribe token is valid (basic format check)
 * @param token - The token to verify
 * @returns True if the token format is valid
 */
export function isValidUnsubscribeToken(token: string): boolean {
  return verifyUnsubscribeToken(token) !== null;
}
