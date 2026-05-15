import { prisma } from "@/lib/db";
import { createSessionCookie, hashPassword } from "@/lib/auth";
import { setupSchema } from "@/lib/validators";

export async function POST(request) {
  const consultantCount = await prisma.consultant.count();
  if (consultantCount > 0) {
    return Response.json({ error: "A configuracao inicial ja foi concluida." }, { status: 409 });
  }

  const body = await request.json();
  const parsed = setupSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  const consultant = await prisma.consultant.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      passwordHash: await hashPassword(parsed.data.password),
      role: "admin",
    },
  });

  await createSessionCookie(consultant);

  return Response.json({ ok: true });
}
