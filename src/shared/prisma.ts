// Imports
import { PrismaClient } from '@prisma/client';

// Prisma Instance
const prisma = new PrismaClient({
  errorFormat: 'minimal',
});

export default prisma;
