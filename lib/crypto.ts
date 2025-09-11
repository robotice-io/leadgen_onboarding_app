import crypto from "node:crypto";

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
}

export function hmacSha256Hex(message: string, key: string): string {
  return crypto.createHmac("sha256", key).update(message, "utf8").digest("hex");
}

export function randomId(length = 16): string {
  return crypto.randomBytes(length).toString("hex");
}


