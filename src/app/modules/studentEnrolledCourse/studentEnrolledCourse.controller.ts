// Imports
import { StudentEnrolledCourse } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { StudentEnrolledCourseConstants } from './studentEnrolledCourse.constant';
import { StudentEnrolledCourseService } from './studentEnrolledCourse.service';

// Function that works when create student enrolled course POST API hits
const createStudentEnrolledCourse = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await StudentEnrolledCourseService.createStudentEnrolledCourse(req.body);

    // Sending API Response
    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Enrolled Course data created successfully.',
      data: result,
    });
  }
);

// Function to GET All Student Enrolled Courses
const getAllStudentEnrolledCourses = catchAsync(
  async (req: Request, res: Response) => {
    // Making a filter options object
    const filters = pick(
      req.query,
      StudentEnrolledCourseConstants.filterableFields
    );

    // Making a pagination options object
    const paginationOptions = pick(req.query, PaginationConstants.fields);

    // Getting all Student Enrolled Courses based on request
    const result =
      await StudentEnrolledCourseService.getAllStudentEnrolledCourses(
        filters,
        paginationOptions
      );

    // Sending API Response
    sendResponse<StudentEnrolledCourse[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Enrolled Courses data retrieved successfully.',
      meta: result?.meta,
      data: result?.data,
    });
  }
);

// Function to GET Single Student Enrolled Course
const getSingleStudentEnrolledCourse = catchAsync(
  async (req: Request, res: Response) => {
    // Getting Student Enrolled Course id from params
    const id = req.params.id;
    const result =
      await StudentEnrolledCourseService.getSingleStudentEnrolledCourse(id);

    // Sending API Response
    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Student Enrolled Course data retrieved successfully.',
      data: result,
    });
  }
);

// Function to update Student Enrolled Course data
const updateSingleStudentEnrolledCourse = catchAsync(
  async (req: Request, res: Response) => {
    // Getting Student Enrolled Course id from params
    const id = req.params.id;
    // Getting updated data
    const updatedData = req.body;

    const result =
      await StudentEnrolledCourseService.updateSingleStudentEnrolledCourse(
        id,
        updatedData
      );

    // Sending API Response
    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Enrolled Course data updated successfully.',
      data: result,
    });
  }
);

// Function to delete Student Enrolled Course data
const deleteSingleStudentEnrolledCourse = catchAsync(
  async (req: Request, res: Response) => {
    // Getting Student Enrolled Course id from params
    const id = req.params.id;

    const result =
      await StudentEnrolledCourseService.deleteSingleStudentEnrolledCourse(id);

    // Sending API Response
    sendResponse<StudentEnrolledCourse>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student Enrolled Course data deleted successfully.',
      data: result,
    });
  }
);

export const StudentEnrolledCourseController = {
  createStudentEnrolledCourse,
  getAllStudentEnrolledCourses,
  getSingleStudentEnrolledCourse,
  updateSingleStudentEnrolledCourse,
  deleteSingleStudentEnrolledCourse,
};
