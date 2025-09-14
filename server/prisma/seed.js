import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

/** Seed an admin user */
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

/** Map a service name to a TreatmentType enum value */
function inferType(name) {
  const n = name.toLowerCase();
  if (n.startsWith("botulinum toxin")) return "BOTULINUM_TOXIN";
  if (n.startsWith("chemical peel")) return "CHEMICAL_PEELS";
  if (n.startsWith("dermal filler")) return "DERMAL_FILLER";
  if (
    n.startsWith("microneedling") ||
    n.startsWith("skin booster") ||
    n.startsWith("dermaplaning") ||
    n.startsWith("microdermabrasion")
  )
    return "SKIN_CARE";
  return "OTHER_SERVICES";
}

/** Upsert the full catalogue of services */
async function ensureDefaultServices() {
  const services = [
    // --- Botulinum Toxin ---
    {
      name:
        "Botulinum Toxin: Additional small area (gummy smile, marionette, bunny lines)",
      description: "Requires full medical consultation prior to treatment.",
      price_cents: 5500,
      duration_min: 20,
      buffer_min: 15,
    },
    {
      name: "Botulinum Toxin: Bruxism (jaw grinding)",
      description:
        "Treatments require a full medical consultation prior to treatment.",
      price_cents: 15000,
      duration_min: 30,
      buffer_min: 15,
    },
    {
      name: "Botulinum Toxin: Neck",
      description: "",
      price_cents: 15000,
      duration_min: 30,
      buffer_min: 15,
    },
    {
      name: "Botulinum Toxin: Underarm hyperhidrosis",
      description: "Requires full medical consultation prior to treatment.",
      price_cents: 35000,
      duration_min: 30,
      buffer_min: 15,
    },
    {
      name: "Botulinum Toxin: Consultation",
      description: "",
      price_cents: 2000,
      duration_min: 30,
      buffer_min: 10,
    },
    {
      name: "Botulinum Toxin: One area",
      description: "Requires full medical consultation prior to treatment.",
      price_cents: 15000,
      duration_min: 30,
      buffer_min: 15,
    },
    {
      name: "Botulinum Toxin: Two areas",
      description: "Requires full medical consultation prior to treatment.",
      price_cents: 20000,
      duration_min: 30,
      buffer_min: 15,
    },
    {
      name: "Botulinum Toxin: Three areas",
      description: "Requires full medical consultation prior to treatment.",
      price_cents: 25000,
      duration_min: 30,
      buffer_min: 15,
    },

    // --- Consultation (general) ---
    {
      name: "Consultation with a view to treatment (same day possible)",
      description:
        "Time to discuss treatments with Rachel; further treatment may be possible same day.",
      price_cents: 2000,
      duration_min: 45,
      buffer_min: 10,
    },

    // --- Chemical Peels ---
    {
      name: "Chemical Peel: Dermaceutic Milk Peel",
      description:
        "Glycolic acid peel to improve tone and texture; penetrates to reveal fresher skin.",
      price_cents: 9500,
      duration_min: 45,
      buffer_min: 10,
    },
    {
      name: "Chemical Peel: Dermaceutic TCA 18% Peel",
      description:
        "Reduces pigmented lesions and photodamage; supports collagen/elastin; improves wrinkles and sagging.",
      price_cents: 15000,
      duration_min: 45,
      buffer_min: 10,
    },
    {
      name: "Chemical Peel: Obagi Blue Peel Radiance",
      description:
        "Medium-depth salicylic peel; ideal for acne, dull skin, and pore-size reduction.",
      price_cents: 10000,
      duration_min: 45,
      buffer_min: 10,
    },

    // --- Dermaplaning / Microdermabrasion ---
    {
      name: "Dermaplaning",
      description:
        "Scalpel exfoliation removing dead skin and vellus hair (‘peach fuzz’).",
      price_cents: 4500,
      duration_min: 45,
      buffer_min: 10,
    },
    {
      name: "Microdermabrasion",
      description:
        "Fine crystals + vacuum to exfoliate facial skin and rejuvenate.",
      price_cents: 4500,
      duration_min: 45,
      buffer_min: 10,
    },

    // --- Microneedling ---
    {
      name: "Microneedling with Exosomes (course of 3)",
      description:
        "Microneedling using exosomes; course of 3 recommended.",
      price_cents: 60000,
      duration_min: 45,
      buffer_min: 15,
    },
    {
      name: "Microneedling (standard)",
      description:
        "Induces new collagen and tissue for smoother, firmer skin; useful for scars, wrinkles, larger pores.",
      price_cents: 18000,
      duration_min: 60,
      buffer_min: 15,
    },

    // --- Skin Booster ---
    {
      name: "Skin Booster: Exosomes (course of 3)",
      description:
        "Anti-ageing, tightening, rejuvenation; helps wrinkles, scars, pigmentation.",
      price_cents: 60000,
      duration_min: 45,
      buffer_min: 15,
    },
    {
      name: "Skin Booster: Single Exosomes Treatment",
      description:
        "Anti-ageing, tightening, rejuvenation; helps wrinkles, scars, pigmentation (course of 3 recommended).",
      price_cents: 25000,
      duration_min: 45,
      buffer_min: 15,
    },
    {
      name: "Skin Booster: Lumi Eye",
      description:
        "Mesotherapy booster for under-eye; brightens dark circles; helps fine lines (course of 3 @ 4-week intervals).",
      price_cents: 15000,
      duration_min: 45,
      buffer_min: 10,
    },
    {
      name: "Skin Booster: Polynucleotides (PHILART) — course of 3",
      description:
        "Amino-acid based stimulators aiding collagen; can be used on eyes, face, neck, hands; also for hair growth.",
      price_cents: 60000,
      duration_min: 45,
      buffer_min: 15,
    },
    {
      name: "Skin Booster: Profhilo (single treatment)",
      description:
        "Skin remodelling; improves tone, texture, hydration, and radiance. Course of 3 usually recommended.",
      price_cents: 25000,
      duration_min: 45,
      buffer_min: 15,
    },
    {
      name: "Skin Booster: Profhilo (course of 3)",
      description:
        "Skin remodelling to improve tone, texture, hydration and radiance.",
      price_cents: 60000,
      duration_min: 45,
      buffer_min: 15,
    },
    {
      name: "Skin Booster: Profhilo Body (course of 3)",
      description: "Body-targeted Profhilo protocol; course of 3.",
      price_cents: 75000,
      duration_min: 45,
      buffer_min: 15,
    },
    {
      name: "Skin Booster: Sculptra (single)",
      description:
        "Biostimulatory injectable; stimulates your own collagen to smooth wrinkles and improve skin tone.",
      price_cents: 37500,
      duration_min: 45,
      buffer_min: 15,
    },
    {
      name: "Skin Booster: Sculptra (course of 3)",
      description:
        "Biostimulatory injectable; stimulates collagen; course of 3.",
      price_cents: 99900,
      duration_min: 45,
      buffer_min: 15,
    },

    // --- Thread Vein Reduction ---
    {
      name: "Thread Vein Reduction: Sclerotherapy (legs)",
      description:
        "Series of small injections to close veins. Compression socks required post-procedure. Typically 3–5 sessions.",
      price_cents: 17500,
      duration_min: 60,
      buffer_min: 15,
    },

    // --- Dermal Filler ---
    { name: "Dermal Filler: 0.5ml", description: "", price_cents: 16500, duration_min: 30, buffer_min: 15 },
    { name: "Dermal Filler: 0.7ml", description: "", price_cents: 19500, duration_min: 30, buffer_min: 15 },
    { name: "Dermal Filler: 1ml",  description: "", price_cents: 22500, duration_min: 30, buffer_min: 15 },
    { name: "Dermal Filler: Cheeks", description: "", price_cents: 25000, duration_min: 30, buffer_min: 15 },
    { name: "Dermal Filler: Chin",   description: "", price_cents: 25000, duration_min: 30, buffer_min: 15 },
    { name: "Dermal Filler: Temples (1ml)", description: "", price_cents: 25000, duration_min: 30, buffer_min: 15 },
    { name: "Dermal Filler: Marionette Lines", description: "", price_cents: 22500, duration_min: 30, buffer_min: 15 },
    { name: "Dermal Filler: Nasolabial Folds", description: "", price_cents: 22500, duration_min: 30, buffer_min: 15 },
    {
      name: "Dermal Filler: Non-surgical Rhinoplasty",
      description:
        "Premium filler to smooth bumps/contours and improve profile symmetry.",
      price_cents: 30000,
      duration_min: 30,
      buffer_min: 15,
    },
    {
      name: "Dermal Filler: Tear Trough",
      description:
        "Premium filler to restore volume and reduce dark under-eye circles.",
      price_cents: 35000,
      duration_min: 30,
      buffer_min: 15,
    },
    {
      name: "Dermal Filler: 3ml premium package",
      description: "Subject to consultation with Rachel.",
      price_cents: 60000,
      duration_min: 45,
      buffer_min: 15,
    },
    {
      name: "Dermal Filler: 4ml premium package",
      description: "Subject to consultation with Rachel.",
      price_cents: 75000,
      duration_min: 45,
      buffer_min: 15,
    },
    {
      name: "Dermal Filler: 5ml premium package",
      description: "Subject to consultation with Rachel.",
      price_cents: 85000,
      duration_min: 60,
      buffer_min: 15,
    },
    {
      name: "Dermal Filler: 6ml premium package",
      description: "Subject to consultation with Rachel.",
      price_cents: 90000,
      duration_min: 60,
      buffer_min: 15,
    },
    {
      name: "Dermal Filler: HArmonyCa",
      description:
        "Hybrid injectable providing immediate volumising and collagen stimulation.",
      price_cents: 30000,
      duration_min: 45,
      buffer_min: 15,
    },

    // --- Review / Vitamins / Dissolving ---
    {
      name: "Review",
      description: "",
      price_cents: 0,
      duration_min: 15,
      buffer_min: 5,
    },
    {
      name: "Vitamin Injection: B12",
      description:
        "Aims to increase energy, improve sleep and general well-being.",
      price_cents: 4500,
      duration_min: 30,
      buffer_min: 10,
    },
    {
      name: "Dermal Filler Dissolving",
      description:
        "Hyaluronidase to dissolve/correct undesired filler. If filler was done elsewhere, cost is £150. Patch test required 48h prior.",
      price_cents: 15000,
      duration_min: 30,
      buffer_min: 15,
    },
  ];

  // Update existing by name, otherwise create (no reliance on PK)
  for (const s of services) {
    const type = s.treatment_type ?? inferType(s.name);

    const upd = await prisma.service.updateMany({
      where: { name: s.name },
      data: {
        name: s.name,
        treatment_type: type,
        description: s.description ?? null,
        price_cents: s.price_cents,
        duration_min: s.duration_min,
        buffer_min: s.buffer_min ?? 0,
        is_active: s.is_active ?? true,
        more_info: s.more_info ?? null,
      },
    });

    if (upd.count > 0) {
      console.log(`♻︎ Service updated: ${s.name}`);
      continue;
    }

    await prisma.service.create({
      data: {
        name: s.name,
        treatment_type: type,
        description: s.description ?? null,
        price_cents: s.price_cents,
        duration_min: s.duration_min,
        buffer_min: s.buffer_min ?? 0,
        is_active: s.is_active ?? true,
        more_info: s.more_info ?? null,
      },
    });
    console.log(`➕ Service created: ${s.name}`);
  }
}

/** Seed Mon–Sat business hours 10:00–18:00 */
async function ensureBusinessHours() {
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

/** Main entry */
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