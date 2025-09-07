import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const services = await prisma.service.findMany({
  select: { service_id: true, name: true }
});

console.log("Services:");
for (const s of services) {
  console.log(`- [${s.service_id}] ${s.name}`);
}

await prisma.$disconnect();
