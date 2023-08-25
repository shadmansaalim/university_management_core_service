// Imports
import { AcademicSemester, PrismaClient } from '@prisma/client';

// Prisma Instance
const prisma = new PrismaClient();

// Create Semester Service Function
const insertIntoDB = async (
  data: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({ data });
  return result;
};

export const AcademicSemesterService = {
  insertIntoDB,
};
