// Imports
import { Student } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { StudentConstants } from './student.constant';
import { IStudentFilters } from './student.interface';

// Function to create a student in database
const createStudent = async (data: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

// GET All Students Function
const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  // Getting all students
  const { page, limit, total, result } = await getAllDocuments<Student>(
    filters,
    paginationOptions,
    StudentConstants.searchableFields,
    prisma.student,
    StudentConstants.fieldsToInclude,
    StudentConstants.relationalFields,
    StudentConstants.relationalFieldsMapper
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

// GET Single Student Function
const getSingleStudent = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

// Update Single Student Function
const updateSingleStudent = async (
  id: string,
  payload: Partial<Student>
): Promise<Student | null> => {
  // Updating student
  const result = await prisma.student.update({
    where: { id },
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

// Delete Single Student Function
const deleteSingleStudent = async (id: string): Promise<Student | null> => {
  // Deleting student
  const result = await prisma.student.delete({
    where: { id },
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

export const StudentService = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateSingleStudent,
  deleteSingleStudent,
};
