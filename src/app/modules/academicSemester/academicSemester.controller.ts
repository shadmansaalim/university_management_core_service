// Imports
import { AcademicSemester } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
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

export const AcademicSemesterController = {
  insertIntoDB,
};
