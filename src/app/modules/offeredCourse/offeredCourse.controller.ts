// Imports
import { OfferedCourse } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseConstants } from './offeredCourse.constant';
import { OfferedCourseService } from './offeredCourse.service';

// Function that works when create offered course POST API hits
const createOfferedCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await OfferedCourseService.createOfferedCourse(req.body);

  // Sending API Response
  sendResponse<OfferedCourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course created successfully.',
    data: result,
  });
});

// Function to GET All Offered Courses
const getAllOfferedCourses = catchAsync(async (req: Request, res: Response) => {
  // Making a filter options object
  const filters = pick(req.query, OfferedCourseConstants.filterableFields);

  // Making a pagination options object
  const paginationOptions = pick(req.query, PaginationConstants.fields);

  // Getting all offered courses based on request
  const result = await OfferedCourseService.getAllOfferedCourses(
    filters,
    paginationOptions
  );

  // Sending API Response
  sendResponse<OfferedCourse[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Courses retrieved successfully.',
    meta: result?.meta,
    data: result?.data,
  });
});

// Function to GET Single Offered Course
const getSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    // Getting offered course id from params
    const id = req.params.id;
    const result = await OfferedCourseService.getSingleOfferedCourse(id);

    // Sending API Response
    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Offered Course retrieved successfully.',
      data: result,
    });
  }
);

// Function to update offered course
const updateSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    // Getting offered course id from params
    const id = req.params.id;

    const result = await OfferedCourseService.updateSingleOfferedCourse(
      id,
      req.body
    );

    // Sending API Response
    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course updated successfully.',
      data: result,
    });
  }
);

// Function to delete offered course
const deleteSingleOfferedCourse = catchAsync(
  async (req: Request, res: Response) => {
    // Getting offered course id from params
    const id = req.params.id;

    const result = await OfferedCourseService.deleteSingleOfferedCourse(id);

    // Sending API Response
    sendResponse<OfferedCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course deleted successfully.',
      data: result,
    });
  }
);

export const OfferedCourseController = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateSingleOfferedCourse,
  deleteSingleOfferedCourse,
};
