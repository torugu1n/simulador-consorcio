import { requireConsultant } from "@/lib/auth";
import { buildClientReport } from "@/lib/simulator";
import { renderReportPdf } from "@/lib/report-pdf";

export async function POST(request) {
  await requireConsultant();
  try {
    const payload = await request.json();
    const report = buildClientReport(payload);
    const pdfBuffer = await renderReportPdf(report);
    const filenameBase = (report.input.clientName || "simulacao-consorcio")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9-_]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();

    return new Response(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filenameBase || "simulacao-consorcio"}.pdf"`,
      },
    });
  } catch (err) {
    console.error("[PDF] Erro ao gerar PDF:", err);
    return Response.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
