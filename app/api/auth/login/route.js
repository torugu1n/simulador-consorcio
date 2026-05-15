import { prisma } from "@/lib/db";
import { createSessionCookie, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  const consultant = await prisma.consultant.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (!consultant) {
    return Response.json({ error: "Email ou senha invalidos." }, { status: 401 });
  }

  const valid = await verifyPassword(parsed.data.password, consultant.passwordHash);
  if (!valid) {
    return Response.json({ error: "Email ou senha invalidos." }, { status: 401 });
  }

  await createSessionCookie(consultant);

  return Response.json({ ok: true });
}
