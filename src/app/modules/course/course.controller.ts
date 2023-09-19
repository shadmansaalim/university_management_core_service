// Imports
import { Course, CourseFaculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { CourseConstants } from './course.constant';
import { CourseService } from './course.service';

// Function that works when create course POST API hits
const createCourse = catchAsync(async (req: Request, res: Response) => {
  const result = await CourseService.createCourse(req.body);

  // Sending API Response
  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course created successfully.',
    data: result,
  });
});

// Function to GET All Courses
const getAllCourses = catchAsync(async (req: Request, res: Response) => {
  // Making a filter options object
  const filters = pick(req.query, CourseConstants.filterableFields);

  // Making a pagination options object
  const paginationOptions = pick(req.query, PaginationConstants.fields);

  // Getting all courses based on request
  const result = await CourseService.getAllCourses(filters, paginationOptions);

  // Sending API Response
  sendResponse<Course[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Courses retrieved successfully.',
    meta: result?.meta,
    data: result?.data,
  });
});

// Function to GET Single Course
const getSingleCourse = catchAsync(async (req: Request, res: Response) => {
  // Getting course id from params
  const id = req.params.id;
  const result = await CourseService.getSingleCourse(id);

  // Sending API Response
  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Course retrieved successfully.',
    data: result,
  });
});

// Function to update course
const updateSingleCourse = catchAsync(async (req: Request, res: Response) => {
  // Getting course id from params
  const id = req.params.id;
  // Getting updated data
  const updatedData = req.body;

  const result = await CourseService.updateSingleCourse(id, updatedData);

  // Sending API Response
  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course updated successfully.',
    data: result,
  });
});

// Function to delete course
const deleteSingleCourse = catchAsync(async (req: Request, res: Response) => {
  // Getting course id from params
  const id = req.params.id;

  const result = await CourseService.deleteSingleCourse(id);

  // Sending API Response
  sendResponse<Course>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course deleted successfully.',
    data: result,
  });
});

// Function to assign faculties to a course
const assignFaculties = catchAsync(async (req: Request, res: Response) => {
  // Getting course id from params
  const id = req.params.id;

  // Getting faculties that needs to be assigned
  const faculties = req.body.faculties;

  const result = await CourseService.assignFaculties(id, faculties);

  // Sending API Response
  sendResponse<CourseFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties assigned successfully.',
    data: result,
  });
});

export const CourseController = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateSingleCourse,
  deleteSingleCourse,
  assignFaculties,
};
