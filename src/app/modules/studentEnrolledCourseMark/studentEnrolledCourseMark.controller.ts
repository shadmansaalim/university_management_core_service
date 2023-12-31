// Imports
import {
  Course,
  StudentEnrolledCourse,
  StudentEnrolledCourseMark,
} from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { StudentEnrolledCourseMarkConstants } from './studentEnrolledCourseMark.constant';
import { StudentEnrolledCourseMarkService } from './studentEnrolledCourseMark.service';

// Function to get all student enrolled course marks
const getAllStudentEnrolledCourseMarks = catchAsync(
  async (req: Request, res: Response) => {
    // Making a filter options object
    const filters = pick(
      req.query,
      StudentEnrolledCourseMarkConstants.filterableFields
    );

    // Making a pagination options object
    const paginationOptions = pick(req.query, PaginationConstants.fields);

    // Getting all student enrolled course marks based on request
    const result =
      await StudentEnrolledCourseMarkService.getAllStudentEnrolledCourseMarks(
        filters,
        paginationOptions
      );

    // Sending API Response
    sendResponse<StudentEnrolledCourseMark[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student enrolled course marks retrieved successfully.',
      meta: result?.meta,
      data: result?.data,
    });
  }
);

// Function to update student marks
const updateStudentMarks = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentEnrolledCourseMarkService.updateStudentMarks(
    req.body
  );

  // Sending API Response
  sendResponse<StudentEnrolledCourseMark>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student enrolled course marks updated successfully.',
    data: result,
  });
});

// Function to evaluate student final gpa
const evaluateStudentFinalGpa = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentEnrolledCourseMarkService.evaluateStudentFinalGpa(req.body);

    // Sending API Response
    sendResponse<(StudentEnrolledCourse & { course: Course })[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Final GPA evaluated successfully.',
      data: result,
    });
  }
);

// Function to my course marks as a student
const getMyCourseMarks = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  // Making a filter options object
  const filters = pick(
    req.query,
    StudentEnrolledCourseMarkConstants.filterableFields
  );

  // Making a pagination options object
  const paginationOptions = pick(req.query, PaginationConstants.fields);

  // Getting all student enrolled course marks based on request
  const result = await StudentEnrolledCourseMarkService.getMyCourseMarks(
    user.id,
    filters,
    paginationOptions
  );

  // Sending API Response
  sendResponse<StudentEnrolledCourseMark[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My course marks retrieved successfully.',
    meta: result?.meta,
    data: result?.data,
  });
});

export const StudentEnrolledCourseMarkController = {
  getAllStudentEnrolledCourseMarks,
  updateStudentMarks,
  evaluateStudentFinalGpa,
  getMyCourseMarks,
};
