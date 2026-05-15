import { prisma } from "@/lib/db";

export async function getDashboardData(consultantId) {
  const [clientCount, simulationCount, pendingFollowUps, recentClients, recentSimulations] =
    await Promise.all([
      prisma.client.count({ where: { consultantId } }),
      prisma.simulation.count({ where: { consultantId } }),
      prisma.client.count({
        where: {
          consultantId,
          nextFollowUpAt: { not: null },
        },
      }),
      prisma.client.findMany({
        where: { consultantId },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.simulation.findMany({
        where: { consultantId },
        include: { client: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return {
    clientCount,
    simulationCount,
    pendingFollowUps,
    recentClients,
    recentSimulations,
  };
}
