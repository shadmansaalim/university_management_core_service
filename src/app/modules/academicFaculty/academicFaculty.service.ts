// Imports
import { AcademicFaculty } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { AcademicFacultyConstants } from './academicFaculty.constant';
import { IAcademicFacultyFilters } from './academicFaculty.interface';

// Create Faculty Function
const createFaculty = async (
  payload: AcademicFaculty
): Promise<AcademicFaculty> => {
  const result = await prisma.academicFaculty.create({
    data: payload,
  });
  return result;
};

// GET All Faculties Function
const getAllFaculties = async (
  filters: IAcademicFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicFaculty[]>> => {
  // Getting all faculties
  const { page, limit, total, result } = await getAllDocuments<AcademicFaculty>(
    filters,
    paginationOptions,
    AcademicFacultyConstants.searchableFields,
    prisma.academicFaculty
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
const getSingleFaculty = async (
  id: string
): Promise<AcademicFaculty | null> => {
  const result = await prisma.academicFaculty.findUnique({
    where: {
      id,
    },
  });
  return result;
};

// Update Single Faculty Function
const updateSingleFaculty = async (
  id: string,
  payload: Partial<AcademicFaculty>
): Promise<AcademicFaculty | null> => {
  // Updating semester
  const result = await prisma.academicFaculty.update({
    where: { id },
    data: payload,
  });
  return result;
};

// DELETE Single Faculty
const deleteSingleFaculty = async (
  id: string
): Promise<AcademicFaculty | null> => {
  // Deleting faculty
  const result = await prisma.academicFaculty.delete({
    where: { id },
  });
  return result;
};

export const AcademicFacultyService = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateSingleFaculty,
  deleteSingleFaculty,
};
