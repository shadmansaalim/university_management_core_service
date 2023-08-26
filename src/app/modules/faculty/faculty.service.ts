// Imports
import { Faculty } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { FacultyConstants } from './faculty.constant';
import { IFacultyFilters } from './faculty.interface';

// Function to create a faculty in database
const createFaculty = async (data: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data,
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

// GET All Faculties Function
const getAllFaculties = async (
  filters: IFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
  // Getting all faculties
  const { page, limit, total, result } = await getAllDocuments<Faculty>(
    filters,
    paginationOptions,
    FacultyConstants.searchableFields,
    prisma.faculty,
    FacultyConstants.fieldsToInclude
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

// GET Single Faculty Function
const getSingleFaculty = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

export const FacultyService = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
};
