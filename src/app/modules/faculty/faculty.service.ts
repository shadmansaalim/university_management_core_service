// Imports
import { CourseFaculty, Faculty } from '@prisma/client';
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

// Update Single Faculty Function
const updateSingleFaculty = async (
  id: string,
  payload: Partial<Faculty>
): Promise<Faculty | null> => {
  // Updating faculty
  const result = await prisma.faculty.update({
    where: { id },
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

// Delete Single Faculty Function
const deleteSingleFaculty = async (id: string): Promise<Faculty | null> => {
  // Deleting Faculty
  const result = await prisma.faculty.delete({
    where: { id },
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

// Assign courses to a faculty function
const assignCoursesToFaculty = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(courseId => ({
      facultyId: id,
      courseId,
    })),
  });

  return await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });
};

// Remove courses from a faculty function
const removeCoursesFromFaculty = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[] | null> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: id,
      courseId: {
        in: payload,
      },
    },
  });

  return await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });
};

export const FacultyService = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateSingleFaculty,
  deleteSingleFaculty,
  assignCoursesToFaculty,
  removeCoursesFromFaculty,
};
