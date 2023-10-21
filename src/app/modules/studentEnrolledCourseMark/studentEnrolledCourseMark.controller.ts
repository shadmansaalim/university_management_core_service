// Imports
import { StudentEnrolledCourseMark } from '@prisma/client';
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

export const StudentEnrolledCourseMarkController = {
  getAllStudentEnrolledCourseMarks,
  updateStudentMarks,
};
