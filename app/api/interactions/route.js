import { requireConsultant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { interactionSchema } from "@/lib/validators";

export async function POST(request) {
  const consultant = await requireConsultant();
  const body = await request.json();
  const parsed = interactionSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  const interaction = await prisma.clientInteraction.create({
    data: {
      consultantId: consultant.id,
      clientId: parsed.data.clientId,
      type: parsed.data.type,
      subject: parsed.data.subject,
      notes: parsed.data.notes,
      scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
    },
  });

  await prisma.client.update({
    where: { id: parsed.data.clientId },
    data: {
      lastContactAt: new Date(),
      nextFollowUpAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : undefined,
    },
  });

  return Response.json(interaction);
}
