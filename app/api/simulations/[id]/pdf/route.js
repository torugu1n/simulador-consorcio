import { requireConsultant } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { buildClientReport } from "@/lib/simulator";
import { renderReportPdf } from "@/lib/report-pdf";

export async function GET(_request, { params }) {
  const consultant = await requireConsultant();
  const simulation = await prisma.simulation.findFirst({
    where: {
      id: params.id,
      consultantId: consultant.id,
    },
  });

  if (!simulation) {
    return Response.json({ error: "Simulacao nao encontrada." }, { status: 404 });
  }

  const report = buildClientReport(simulation.payload);
  const pdfBuffer = await renderReportPdf(report);
  const filenameBase = (report.input.clientName || simulation.title)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return new Response(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filenameBase || "simulacao"}.pdf"`,
    },
  });
}
