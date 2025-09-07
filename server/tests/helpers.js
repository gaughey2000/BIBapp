import request from "supertest";
import { app, prisma } from "../src/app.js";
import bcrypt from "bcrypt";

export const api = request(app);

export async function seedAdmin(
  email = "admin@bib.com",
  password = "MySecurePassword"
) {
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.upsert({
    where: { email },
    create: { email, password_hash: hash, role: "admin" },
    update: { password_hash: hash, role: "admin" },
  });
  return { email, password };
}

// optional: clean DB between tests if you add write tests later
export async function cleanup() {
  // e.g. await prisma.booking.deleteMany({});
}