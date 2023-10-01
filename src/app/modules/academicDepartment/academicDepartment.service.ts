// Imports
import { AcademicDepartment } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { AcademicDepartmentConstants } from './academicDepartment.constant';
import { IAcademicDepartmentFilters } from './academicDepartment.interface';

// Create Department Function
const createDepartment = async (
  payload: AcademicDepartment
): Promise<AcademicDepartment> => {
  const result = await prisma.academicDepartment.create({
    data: payload,
    include: {
      academicFaculty: true,
    },
  });
  return result;
};

// GET All Departments Function
const getAllDepartments = async (
  filters: IAcademicDepartmentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicDepartment[]>> => {
  // Getting all departments
  const { page, limit, total, result } =
    await getAllDocuments<AcademicDepartment>(
      filters,
      paginationOptions,
      AcademicDepartmentConstants.searchableFields,
      prisma.academicDepartment,
      AcademicDepartmentConstants.fieldsToInclude,
      AcademicDepartmentConstants.relationalFields,
      AcademicDepartmentConstants.relationalFieldsMapper
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

// GET Single Department Function
const getSingleDepartment = async (
  id: string
): Promise<AcademicDepartment | null> => {
  const result = await prisma.academicDepartment.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
    },
  });
  return result;
};

// Update Single Department Function
const updateSingleDepartment = async (
  id: string,
  payload: Partial<AcademicDepartment>
): Promise<AcademicDepartment | null> => {
  // Updating department
  const result = await prisma.academicDepartment.update({
    where: { id },
    data: payload,
    include: {
      academicFaculty: true,
    },
  });

  return result;
};

// DELETE Single Department
const deleteSingleDepartment = async (
  id: string
): Promise<AcademicDepartment | null> => {
  // Deleting department
  const result = await prisma.academicDepartment.delete({
    where: { id },
    include: {
      academicFaculty: true,
    },
  });
  return result;
};

export const AcademicDepartmentService = {
  createDepartment,
  getAllDepartments,
  getSingleDepartment,
  updateSingleDepartment,
  deleteSingleDepartment,
};
