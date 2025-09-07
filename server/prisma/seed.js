// prisma/seed.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed services if none exist
  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({
      data: [
        { name: "Anti-wrinkle (1 area)", description: "Consultation included", price_cents: 12000, duration_min: 45, buffer_min: 15 },
        { name: "Anti-wrinkle (2 areas)", description: "Consultation included", price_cents: 17000, duration_min: 60, buffer_min: 15 },
        { name: "Dermal Filler (Lips)", description: "0.5–1ml", price_cents: 18000, duration_min: 45, buffer_min: 15 },
        { name: "Skin Booster", description: "Profhilo/Seventy Hyal", price_cents: 22000, duration_min: 45, buffer_min: 15 }
      ]
    });
  }

  // Mon–Sat 10:00–18:00
  if ((await prisma.businessHour.count()) === 0) {
    await prisma.businessHour.createMany({
      data: [1, 2, 3, 4, 5, 6].map(weekday => ({
        weekday,
        open_time: "10:00",
        close_time: "18:00"
      }))
    });
  }

  // Admin user (password = changeme123, bcrypt hash cost 10)
  const adminEmail = "admin@clinic.local";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existing) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        // bcrypt hash of "changeme123"
        password_hash: "$2b$10$8Sbfy4y5d1r7o2mB2m1k/.7m5I5y3b8z2iX5X2l1m7bGvYzYwYH6q"
      }
    });
  }

  console.log("✅ Seed complete.");
}

main()
  .catch(e => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });