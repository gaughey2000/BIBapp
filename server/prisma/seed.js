// prisma/seed.js (ESM)
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function upsertAdmin() {
  const email = "bib@admin.com";
  const password = "bibpassword";
  const hash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: { password_hash: hash, role: "admin" },
    create: { email, password_hash: hash, role: "admin" },
  });

  console.log(`✅ Admin ready: ${email} / ${password}`);
}

async function ensureDefaultServices() {
  const defaults = [
    {
      name: "Anti-wrinkle (1 area)",
      description: "Consultation included",
      price_cents: 12000,
      duration_min: 45,
      buffer_min: 15,
    },
    {
      name: "Anti-wrinkle (2 areas)",
      description: "Consultation included",
      price_cents: 17000,
      duration_min: 60,
      buffer_min: 15,
    },
    {
      name: "Dermal Filler (Lips)",
      description: "0.5–1ml",
      price_cents: 18000,
      duration_min: 45,
      buffer_min: 15,
    },
    {
      name: "Skin Booster",
      description: "Profhilo/Seventy Hyal",
      price_cents: 22000,
      duration_min: 45,
      buffer_min: 15,
    },
  ];

  // Only create missing-by-name (case-sensitive)
  for (const s of defaults) {
    const exists = await prisma.service.findFirst({ where: { name: s.name } });
    if (!exists) {
      await prisma.service.create({ data: s });
      console.log(`➕ Service created: ${s.name}`);
    } else {
      console.log(`✔︎ Service exists: ${s.name}`);
    }
  }
}

async function ensureBusinessHours() {
  // Mon–Sat (1..6), 10:00–18:00
  const wanted = [1, 2, 3, 4, 5, 6].map((weekday) => ({
    weekday,
    open_time: "10:00",
    close_time: "18:00",
  }));

  for (const row of wanted) {
    const exists = await prisma.businessHour.findFirst({
      where: { weekday: row.weekday },
    });
    if (!exists) {
      await prisma.businessHour.create({ data: row });
      console.log(`➕ Hours created for weekday ${row.weekday}`);
    } else {
      console.log(`✔︎ Hours exist for weekday ${row.weekday}`);
    }
  }
}

async function main() {
  await upsertAdmin();
  await ensureDefaultServices();
  await ensureBusinessHours();
  console.log("🌱 Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });