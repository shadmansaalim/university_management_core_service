// Imports
import { Course } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { ICourseCreateData } from './course.interface';

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

export const CourseService = {
  createCourse,
};
