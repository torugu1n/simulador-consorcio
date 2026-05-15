import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

const SESSION_COOKIE = "consorcio_session";
const encoder = new TextEncoder();

function getJwtSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }
  return encoder.encode(secret);
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(token) {
  const { payload } = await jwtVerify(token, getJwtSecret());
  return payload;
}

export async function createSessionCookie(consultant) {
  const token = await createSessionToken({
    sub: consultant.id,
    email: consultant.email,
    role: consultant.role,
    name: consultant.name,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) {
      return null;
    }
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session?.sub) {
    redirect("/login");
  }
  return session;
}

export async function getCurrentConsultant() {
  const session = await getSession();
  if (!session?.sub) {
    return null;
  }
  return prisma.consultant.findUnique({
    where: { id: session.sub },
  });
}

export async function requireConsultant() {
  const consultant = await getCurrentConsultant();
  if (!consultant) {
    redirect("/login");
  }
  return consultant;
}
