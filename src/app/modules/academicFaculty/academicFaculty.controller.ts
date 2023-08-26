// Imports
import { AcademicFaculty } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AcademicFacultyConstants } from './academicFaculty.constant';
import { AcademicFacultyService } from './academicFaculty.service';

// Function that works when create academic faculty POST API hits
const createFaculty = catchAsync(async (req: Request, res: Response) => {
  // Destructuring Academic Faculty data from request body
  const { ...academicFacultyData } = req.body;
  const result = await AcademicFacultyService.createFaculty(
    academicFacultyData
  );

  // Sending API Response
  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty created successfully.',
    data: result,
  });
});

// Function to GET All Academic Faculties
const getAllFaculties = catchAsync(async (req: Request, res: Response) => {
  // Making a filter options object
  const filters = pick(req.query, AcademicFacultyConstants.filterableFields);

  // Making a pagination options object
  const paginationOptions = pick(req.query, PaginationConstants.fields);

  // Getting all faculties based on request
  const result = await AcademicFacultyService.getAllFaculties(
    filters,
    paginationOptions
  );

  // Sending API Response
  sendResponse<AcademicFaculty[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculties retrieved successfully.',
    meta: result?.meta,
    data: result?.data,
  });
});

// Function to GET Single Academic Faculty
const getSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  // Destructuring id from params
  const { id } = req.params;
  const result = await AcademicFacultyService.getSingleFaculty(id);

  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty retrieved successfully',
    data: result,
  });
});

// Function to update faculty
const updateSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  // Getting semester id from params
  const id = req.params.id;
  // Getting updated data
  const updatedData = req.body;

  const result = await AcademicFacultyService.updateSingleFaculty(
    id,
    updatedData
  );

  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty updated successfully',
    data: result,
  });
});

// Function to delete faculty
const deleteSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  // Getting faculty id from params
  const id = req.params.id;

  const result = await AcademicFacultyService.deleteSingleFaculty(id);

  // Sending API Response
  sendResponse<AcademicFaculty>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Faculty deleted successfully.',
    data: result,
  });
});

export const AcademicFacultyController = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateSingleFaculty,
  deleteSingleFaculty,
};
