// Imports
import { Faculty } from '@prisma/client';
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

export const FacultyController = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
};
