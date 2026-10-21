import "server-only";
import { createHash, createHmac, timingSafeEqual } from "crypto";
import { cookies, headers } from "next/headers";

const COOKIE = "nagpal_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

function secret() {
  return process.env.ADMIN_SECRET || `nagpal:${process.env.ADMIN_PASSWORD}`;
}

function sign(exp: string) {
  return createHmac("sha256", secret()).update(`admin.${exp}`).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(password: string) {
  return adminConfigured() && safeEqual(password, process.env.ADMIN_PASSWORD as string);
}

export async function createSession() {
  const exp = String(Date.now() + MAX_AGE * 1000);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function clearSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

// For API routes that change data: a valid session and a same-site request.
export async function requireAdmin() {
  const h = await headers();
  const origin = h.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== h.get("host")) return false;
    } catch {
      return false;
    }
  }
  return isAdmin();
}
