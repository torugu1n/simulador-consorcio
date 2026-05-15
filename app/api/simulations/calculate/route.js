import { calculateSimulation } from "@/lib/simulator";

export async function POST(request) {
  const payload = await request.json();
  const simulation = calculateSimulation(payload);

  return Response.json(simulation);
}
