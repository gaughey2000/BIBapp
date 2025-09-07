import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const count = await prisma.service.count();
console.log('Service count:', count);

await prisma.$disconnect();
