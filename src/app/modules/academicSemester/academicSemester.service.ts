// Imports
import { AcademicSemester } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { AcademicSemesterConstants } from './academicSemester.constant';
import { IAcademicSemesterFilters } from './academicSemester.interface';

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
  // Getting all semesters
  const { page, limit, total, result } =
    await getAllDocuments<AcademicSemester>(
      filters,
      paginationOptions,
      AcademicSemesterConstants.searchableFields,
      prisma.academicSemester
    );

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
