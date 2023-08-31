// Imports
import { Course } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { PaginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { CourseConstants } from './course.constant';
import { ICourseCreateData, ICourseFilters } from './course.interface';

// Create Course Function
const createCourse = async (
  data: ICourseCreateData
): Promise<Course | null> => {
  // Destructuring
  const { preRequisiteCourses, ...courseData } = data;

  // Implementing transaction and rollback to make the operation efficient
  const newCourse = await prisma.$transaction(async transactionClient => {
    // Creating the course
    const result = await transactionClient.course.create({ data: courseData });

    // Throwing error if fails to create course
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create course.');
    }

    // Checking if there are any pre-requisites for this new course
    if (preRequisiteCourses && preRequisiteCourses.length) {
      // Adding each pre requisite course to the CourseToPrerequisite Table
      for (let index = 0; index < preRequisiteCourses.length; index++) {
        await transactionClient.courseToPrerequisite.create({
          data: {
            courseId: result.id,
            preRequisiteId: preRequisiteCourses[index].courseId,
          },
        });
      }
    }

    // Returning the new course created
    return result;
  });

  // Checking if the new course is created successfully
  if (newCourse) {
    /*
    This part of the code is added just to include the preRequisite and preRequisiteFor field with the new course created in the API response.
    */
    return await prisma.course.findUnique({
      where: {
        id: newCourse.id,
      },
      include: {
        preRequisite: {
          include: {
            preRequisite: true,
          },
        },
        preRequisiteFor: {
          include: {
            course: true,
          },
        },
      },
    });
  }

  // Throwing error if everything above fails
  throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create course.');
};

// GET All Courses Function
const getAllCourses = async (
  filters: ICourseFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Course[]>> => {
  // Destructuring ~ Searching and Filtering
  const { searchTerm, ...filterData } = filters;

  // Storing all searching and filtering condition in this array
  const searchFilterConditions = [];

  // Checking if SEARCH is requested in GET API - adding find conditions
  if (searchTerm) {
    searchFilterConditions.push({
      OR: CourseConstants.searchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // Checking if FILTER is requested in GET API - adding find conditions
  if (Object.keys(filterData).length) {
    searchFilterConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // Destructuring ~ Pagination and Sorting
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelpers.calculatePagination(paginationOptions);

  // Default Sorting Condition
  const sortingCondition: { [key: string]: any } = {};

  // Adding sort condition if requested
  if (sortBy && sortOrder) {
    sortingCondition[sortBy] = sortOrder;
  }

  // Condition for finding courses
  const whereConditions = searchFilterConditions.length
    ? { AND: searchFilterConditions }
    : {};

  // Courses
  const result = await prisma.course.findMany({
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortingCondition,
  });

  // Total Courses in Database matching the condition
  const total = await prisma.course.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// GET Single Course Function
const getSingleCourse = async (id: string): Promise<Course | null> => {
  const result = await prisma.course.findUnique({
    where: { id },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });
  return result;
};

// Update Single Course Function
const updateSingleCourse = async (
  id: string,
  payload: Partial<ICourseCreateData>
): Promise<Course | null> => {
  // Destructuring
  const { preRequisiteCourses, ...courseData } = payload;

  // Transaction and Rollback
  await prisma.$transaction(async transactionClient => {
    // Updating Course
    const result = await transactionClient.course.update({
      where: {
        id,
      },
      data: courseData,
    });

    // Throwing error if fails to update course
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to update course.');
    }

    // Checking if there are any pre-requisites for this course
    if (preRequisiteCourses && preRequisiteCourses.length) {
      // Storing the pre-requisite courses that needs to be deleted
      const prerequisitesToDelete = preRequisiteCourses.filter(
        preRequisiteCourse =>
          preRequisiteCourse.courseId && preRequisiteCourse.isDeleted
      );

      // Storing new prerequisites
      const newPrerequisites = preRequisiteCourses.filter(
        preRequisiteCourse =>
          preRequisiteCourse.courseId && !preRequisiteCourse.isDeleted
      );

      // Iterating and deleting prerequisites that needs to be removed
      for (let index = 0; index < prerequisitesToDelete.length; index++) {
        await transactionClient.courseToPrerequisite.deleteMany({
          where: {
            AND: [
              {
                courseId: id,
              },
              {
                preRequisiteId: prerequisitesToDelete[index].courseId,
              },
            ],
          },
        });
      }

      // Iterating and adding new prerequisites that needs to be added
      for (let index = 0; index < newPrerequisites.length; index++) {
        await transactionClient.courseToPrerequisite.create({
          data: {
            courseId: id,
            preRequisiteId: newPrerequisites[index].courseId,
          },
        });
      }
    }

    return result;
  });

  /*
    This part of the code is added just to include the preRequisite and preRequisiteFor field with the updated course in the API response.
  */
  return await prisma.course.findUnique({
    where: {
      id,
    },
    include: {
      preRequisite: {
        include: {
          preRequisite: true,
        },
      },
      preRequisiteFor: {
        include: {
          course: true,
        },
      },
    },
  });
};

// DELETE Single Course
const deleteSingleCourse = async (id: string): Promise<Course | null> => {
  return await prisma.$transaction(async transactionClient => {
    // Deleting course from pre-requisites
    const deletePrerequisites =
      await transactionClient.courseToPrerequisite.deleteMany({
        where: {
          OR: [
            {
              courseId: id,
            },
            {
              preRequisiteId: id,
            },
          ],
        },
      });

    // Throwing error if fails to delete pre-requisites
    if (!deletePrerequisites) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete course.');
    }

    // Deleting the course
    const result = transactionClient.course.delete({
      where: {
        id,
      },
    });

    // Throwing error if fails to delete course
    if (!result) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to delete course.');
    }

    // Returning the result
    return result;
  });
};

export const CourseService = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateSingleCourse,
  deleteSingleCourse,
};
