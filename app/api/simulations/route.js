import { requireConsultant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { simulationSchema } from "@/lib/validators";

export async function POST(request) {
  const consultant = await requireConsultant();
  const body = await request.json();
  const parsed = simulationSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Dados invalidos." }, { status: 400 });
  }

  const payload = {
    ...parsed.data,
    consultantName: parsed.data.consultantName || consultant.name,
  };

  const simulation = await prisma.simulation.create({
    data: {
      consultantId: consultant.id,
      clientId: parsed.data.clientId || null,
      title: parsed.data.title,
      notes: parsed.data.notes || null,
      payload,
    },
  });

  return Response.json(simulation);
}
