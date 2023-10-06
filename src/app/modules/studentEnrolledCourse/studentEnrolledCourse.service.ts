// Imports
import {
  StudentEnrolledCourse,
  StudentEnrolledCourseStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { StudentEnrolledCourseConstants } from './studentEnrolledCourse.constant';
import { IStudentEnrolledCourseFilters } from './studentEnrolledCourse.interface';

// Function to create student enrolled course data
const createStudentEnrolledCourse = async (
  data: StudentEnrolledCourse
): Promise<StudentEnrolledCourse> => {
  // Use Prisma to find the first record in the 'studentEnrolledCourse' table that matches certain conditions.
  const isCourseOngoingOrCompleted =
    await prisma.studentEnrolledCourse.findFirst({
      where: {
        OR: [
          // Check if the 'status' property of the record is equal to 'ONGOING'.
          {
            status: StudentEnrolledCourseStatus.ONGOING,
          },
          // Check if the 'status' property of the record is equal to 'COMPLETED'.
          {
            status: StudentEnrolledCourseStatus.COMPLETED,
          },
        ],
      },
    });

  // If there is a course that is ongoing or completed, throw an error with a specific message.
  if (isCourseOngoingOrCompleted) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isCourseOngoingOrCompleted.status?.toLowerCase()} registration`
    );
  }

  // Use Prisma to create a new record in the 'studentEnrolledCourse' table with the provided 'data'.
  // Include related data from the 'academicSemester', 'student', and 'course' tables in the result.
  return await prisma.studentEnrolledCourse.create({
    data,
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
  });
};

// GET All Student Enrolled Courses
const getAllStudentEnrolledCourses = async (
  filters: IStudentEnrolledCourseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourse[]>> => {
  // Getting all Student Enrolled Courses
  const { page, limit, total, result } =
    await getAllDocuments<StudentEnrolledCourse>(
      filters,
      paginationOptions,
      StudentEnrolledCourseConstants.searchableFields,
      prisma.studentEnrolledCourse,
      StudentEnrolledCourseConstants.fieldsToInclude,
      StudentEnrolledCourseConstants.relationalFields,
      StudentEnrolledCourseConstants.relationalFieldsMapper
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

// GET Single Student Enrolled Course
const getSingleStudentEnrolledCourse = async (
  id: string
): Promise<StudentEnrolledCourse | null> => {
  return await prisma.studentEnrolledCourse.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
  });
};

// Function to UPDATE student enrolled course by id
const updateSingleStudentEnrolledCourse = async (
  id: string,
  payload: Partial<StudentEnrolledCourse>
): Promise<StudentEnrolledCourse | null> => {
  return await prisma.studentEnrolledCourse.update({
    where: {
      id,
    },
    data: payload,
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
  });
};

// Function to DELETE student enrolled course by id
const deleteSingleStudentEnrolledCourse = async (
  id: string
): Promise<StudentEnrolledCourse | null> => {
  return await prisma.studentEnrolledCourse.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
      student: true,
      course: true,
    },
  });
};

export const StudentEnrolledCourseService = {
  createStudentEnrolledCourse,
  getAllStudentEnrolledCourses,
  getSingleStudentEnrolledCourse,
  updateSingleStudentEnrolledCourse,
  deleteSingleStudentEnrolledCourse,
};
