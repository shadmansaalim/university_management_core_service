// Imports
import { AcademicSemester, PrismaClient } from '@prisma/client';
import { PaginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import { IAcademicSemesterFilters } from './academicSemester.interface';

// Prisma Instance
const prisma = new PrismaClient();

// Create Semester Service Function
const insertIntoDB = async (
  data: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({ data });
  return result;
};

// Function to get All Semester from DB
const getAllFromDB = async (
  filters: IAcademicSemesterFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  const { page, limit, skip } =
    PaginationHelpers.calculatePagination(paginationOptions);

  const result = await prisma.academicSemester.findMany({
    skip,
    take: limit,
  });

  const total = await prisma.academicSemester.count();

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const AcademicSemesterService = {
  insertIntoDB,
  getAllFromDB,
};
