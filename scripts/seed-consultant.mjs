import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CONSULTANT_NAME = process.env.CONSULTANT_NAME?.trim();
const CONSULTANT_EMAIL = process.env.CONSULTANT_EMAIL?.trim().toLowerCase();
const CONSULTANT_PASSWORD = process.env.CONSULTANT_PASSWORD?.trim();
const CONSULTANT_ROLE = process.env.CONSULTANT_ROLE?.trim() || "consultant";

async function main() {
  if (!CONSULTANT_NAME || !CONSULTANT_EMAIL || !CONSULTANT_PASSWORD) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          skipped: true,
          reason: "CONSULTANT_NAME, CONSULTANT_EMAIL and CONSULTANT_PASSWORD are required.",
        },
        null,
        2,
      ),
    );
    return;
  }

  const passwordHash = await bcrypt.hash(CONSULTANT_PASSWORD, 10);

  const consultant = await prisma.consultant.upsert({
    where: { email: CONSULTANT_EMAIL },
    update: {
      name: CONSULTANT_NAME,
      passwordHash,
      role: CONSULTANT_ROLE,
    },
    create: {
      name: CONSULTANT_NAME,
      email: CONSULTANT_EMAIL,
      passwordHash,
      role: CONSULTANT_ROLE,
    },
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        id: consultant.id,
        email: consultant.email,
        role: consultant.role,
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
