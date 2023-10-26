// Imports
import { AcademicSemester } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { RedisClient } from '../../../shared/redis';
import { AcademicSemesterConstants } from './academicSemester.constant';
import { IAcademicSemesterFilters } from './academicSemester.interface';

// Create Semester Function
const createSemester = async (
  data: AcademicSemester
): Promise<AcademicSemester> => {
  // Checking whether the format of data is following the relation consistency of Title and Code
  if (data?.code !== AcademicSemesterConstants.titleCodeMapper[data?.title]) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Invalid Semester Code Provided'
    );
  }
  const result = await prisma.academicSemester.create({ data });

  // Publishing data in redis
  if (result) {
    await RedisClient.publish(
      AcademicSemesterConstants.event_academic_semester_created,
      JSON.stringify(result)
    );
  }

  return result;
};

// GET All Semesters Function
const getAllSemesters = async (
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

// GET Single Semester Function
const getSingleSemester = async (
  id: string
): Promise<AcademicSemester | null> => {
  const result = await prisma.academicSemester.findUnique({ where: { id } });
  return result;
};

// Update Single Semester Function
const updateSingleSemester = async (
  id: string,
  payload: Partial<AcademicSemester>
): Promise<AcademicSemester | null> => {
  // Checking whether the format of payload is following the relation consistency of Title and Code
  if (
    payload?.title &&
    payload?.code &&
    payload?.code !== AcademicSemesterConstants.titleCodeMapper[payload?.title]
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Invalid Semester Code Provided'
    );
  }

  // Updating semester
  const result = await prisma.academicSemester.update({
    where: { id },
    data: payload,
  });
  return result;
};

// DELETE Single Semester
const deleteSingleSemester = async (
  id: string
): Promise<AcademicSemester | null> => {
  // Deleting semester
  const result = await prisma.academicSemester.delete({
    where: { id },
  });
  return result;
};

export const AcademicSemesterService = {
  createSemester,
  getAllSemesters,
  getSingleSemester,
  updateSingleSemester,
  deleteSingleSemester,
};
