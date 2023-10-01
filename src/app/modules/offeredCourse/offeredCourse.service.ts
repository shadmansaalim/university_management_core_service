// Imports
import { OfferedCourse } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { OfferedCourseConstants } from './offeredCourse.constant';
import { IOfferedCourseFilters } from './offeredCourse.interface';

// Create Offered Course Function
const createOfferedCourse = async (data: {
  academicDepartmentId: string;
  semesterRegistrationId: string;
  courseIds: string[];
}): Promise<OfferedCourse[]> => {
  // Destructuring
  const { academicDepartmentId, semesterRegistrationId, courseIds } = data;
  const result: OfferedCourse[] = [];

  await asyncForEach(courseIds, async (courseId: string) => {
    // Finding whether offered course is already there
    const alreadyExist = await prisma.offeredCourse.findFirst({
      where: {
        academicDepartmentId,
        semesterRegistrationId,
        courseId,
      },
    });

    // Checking whether offered course already exists or not
    if (!alreadyExist) {
      const insertOfferedCourse = await prisma.offeredCourse.create({
        data: {
          academicDepartmentId,
          semesterRegistrationId,
          courseId,
        },
        include: {
          course: true,
          semesterRegistration: true,
          academicDepartment: true,
        },
      });

      result.push(insertOfferedCourse);
    }
  });

  return result;
};

// GET All Offered Course Function
const getAllOfferedCourses = async (
  filters: IOfferedCourseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<OfferedCourse[]>> => {
  // Getting all offered courses
  const { page, limit, total, result } = await getAllDocuments<OfferedCourse>(
    filters,
    paginationOptions,
    OfferedCourseConstants.searchableFields,
    prisma.offeredCourse,
    OfferedCourseConstants.fieldsToInclude,
    OfferedCourseConstants.relationalFields,
    OfferedCourseConstants.relationalFieldsMapper
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

// GET Single Offered Course Function
const getSingleOfferedCourse = async (
  id: string
): Promise<OfferedCourse | null> => {
  return await prisma.offeredCourse.findUnique({
    where: {
      id,
    },
    include: {
      semesterRegistration: true,
      course: true,
      academicDepartment: true,
    },
  });
};

// UPDATE Single Offered Course
const updateSingleOfferedCourse = async (
  id: string,
  payload: Partial<OfferedCourse>
): Promise<OfferedCourse> => {
  return await prisma.offeredCourse.update({
    where: {
      id,
    },
    data: payload,
    include: {
      semesterRegistration: true,
      course: true,
      academicDepartment: true,
    },
  });
};

// DELETE Single Offered Course
const deleteSingleOfferedCourse = async (
  id: string
): Promise<OfferedCourse | null> => {
  return await prisma.offeredCourse.delete({
    where: {
      id,
    },
    include: {
      semesterRegistration: true,
      course: true,
      academicDepartment: true,
    },
  });
};

export const OfferedCourseService = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateSingleOfferedCourse,
  deleteSingleOfferedCourse,
};
