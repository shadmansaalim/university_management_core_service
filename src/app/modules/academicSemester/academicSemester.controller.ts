// Imports
import { AcademicSemester } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AcademicSemesterConstants } from './academicSemester.constant';
import { AcademicSemesterService } from './academicSemester.service';

// Create Semester Controller Function
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  // Destructuring Academic Semester data from request body
  const { ...academicSemesterData } = req.body;
  const result = await AcademicSemesterService.insertIntoDB(
    academicSemesterData
  );

  // Sending API Response
  sendResponse<AcademicSemester>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semester created successfully.',
    data: result,
  });
});

// Function to GET All Academic Semesters
const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
  // Making a filter options object
  const filters = pick(req.query, AcademicSemesterConstants.filterableFields);

  // Making a pagination options object
  const paginationOptions = pick(req.query, PaginationConstants.fields);

  // Getting all semesters based on request
  const result = await AcademicSemesterService.getAllFromDB(
    filters,
    paginationOptions
  );

  // Sending API Response
  sendResponse<AcademicSemester[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Semesters retrieved successfully.',
    meta: result?.meta,
    data: result?.data,
  });
});

export const AcademicSemesterController = {
  insertIntoDB,
  getAllFromDB,
};
