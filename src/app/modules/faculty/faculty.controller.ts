// Imports
import { CourseFaculty, Faculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { FacultyConstants } from './faculty.constant';
import { FacultyService } from './faculty.service';

// Function that works when create faculty POST API hits
const createFaculty = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyService.createFaculty(req.body);

  // Sending API Response
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty created successfully.',
    data: result,
  });
});

// Function to GET All Faculties
const getAllFaculties = catchAsync(async (req: Request, res: Response) => {
  // Making a filter options object
  const filters = pick(req.query, FacultyConstants.filterableFields);

  // Making a pagination options object
  const paginationOptions = pick(req.query, PaginationConstants.fields);

  // Getting all faculties based on request
  const result = await FacultyService.getAllFaculties(
    filters,
    paginationOptions
  );

  // Sending API Response
  sendResponse<Faculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties retrieved successfully.',
    meta: result?.meta,
    data: result?.data,
  });
});

// Function to GET Single Faculty
const getSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  // Getting faculty id from params
  const id = req.params.id;
  const result = await FacultyService.getSingleFaculty(id);

  // Sending API Response
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Faculty retrieved successfully.',
    data: result,
  });
});

// Function to update faculty
const updateSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  // Getting faculty id from params
  const id = req.params.id;
  // Getting updated data
  const updatedData = req.body;

  const result = await FacultyService.updateSingleFaculty(id, updatedData);

  // Sending API Response
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty updated successfully.',
    data: result,
  });
});

// Function to delete faculty
const deleteSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  // Getting faculty id from params
  const id = req.params.id;

  const result = await FacultyService.deleteSingleFaculty(id);

  // Sending API Response
  sendResponse<Faculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty deleted successfully.',
    data: result,
  });
});

// Function to assign courses to a faculty
const assignCoursesToFaculty = catchAsync(
  async (req: Request, res: Response) => {
    // Getting faculty id from params
    const id = req.params.id;

    // Getting courses that needs to be assigned
    const coursesToAssign = req.body.courses;

    const result = await FacultyService.assignCoursesToFaculty(
      id,
      coursesToAssign
    );

    // Sending API Response
    sendResponse<CourseFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Courses assigned successfully to the Faculty.',
      data: result,
    });
  }
);

// Function to remove courses from a faculty
const removeCoursesFromFaculty = catchAsync(
  async (req: Request, res: Response) => {
    // Getting faculty id from params
    const id = req.params.id;

    // Getting courses that needs to be removed
    const coursesToRemove = req.body.courses;

    const result = await FacultyService.removeCoursesFromFaculty(
      id,
      coursesToRemove
    );

    // Sending API Response
    sendResponse<CourseFaculty[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Courses removed successfully from Faculty.',
      data: result,
    });
  }
);

// GET faculty courses which he/she will take
const getMyCourses = catchAsync(async (req: Request, res: Response) => {
  // Making a filter options object
  const filters = pick(req.query, FacultyConstants.myCoursesFilterableFields);

  // Getting authenticated user from request
  const user = (req as any).user;

  const result = await FacultyService.getMyCourses(user.id, filters);

  // Sending API Response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My courses retrieved successfully.',
    data: result,
  });
});

// Faculty GET his course students
const getMyCourseStudents = catchAsync(async (req: Request, res: Response) => {
  // Making a filter options object
  const filters = pick(req.query, FacultyConstants.myCoursesFilterableFields);

  // Getting authenticated user from request
  const user = (req as any).user;

  // Making a pagination options object
  const paginationOptions = pick(req.query, PaginationConstants.fields);

  const result = await FacultyService.getMyCourseStudents(
    user.id,
    filters,
    paginationOptions
  );

  // Sending API Response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My course students retrieved successfully.',
    data: result,
  });
});

export const FacultyController = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateSingleFaculty,
  deleteSingleFaculty,
  assignCoursesToFaculty,
  removeCoursesFromFaculty,
  getMyCourses,
  getMyCourseStudents,
};
