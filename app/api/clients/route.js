import { requireConsultant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { clientSchema } from "@/lib/validators";

export async function POST(request) {
  const consultant = await requireConsultant();
  const body = await request.json();
  const parsed = clientSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: {
      consultantId: consultant.id,
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      document: parsed.data.document || null,
      status: parsed.data.status,
      notes: parsed.data.notes || null,
      nextFollowUpAt: parsed.data.nextFollowUpAt ? new Date(parsed.data.nextFollowUpAt) : null,
    },
  });

  return Response.json(client);
}
