import { buildClientReport } from "@/lib/simulator";

export async function POST(request) {
  const payload = await request.json();
  const report = buildClientReport(payload);

  return Response.json(report);
}
