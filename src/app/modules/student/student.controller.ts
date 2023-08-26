// Imports
import { Student } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { StudentConstants } from './student.constant';
import { StudentService } from './student.service';

// Function that works when create student POST API hits
const createStudent = catchAsync(async (req: Request, res: Response) => {
  const result = await StudentService.createStudent(req.body);

  // Sending API Response
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student created successfully.',
    data: result,
  });
});

// Function to GET All Students
const getAllStudents = catchAsync(async (req: Request, res: Response) => {
  // Making a filter options object
  const filters = pick(req.query, StudentConstants.filterableFields);

  // Making a pagination options object
  const paginationOptions = pick(req.query, PaginationConstants.fields);

  // Getting all students based on request
  const result = await StudentService.getAllStudents(
    filters,
    paginationOptions
  );

  // Sending API Response
  sendResponse<Student[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students retrieved successfully.',
    meta: result?.meta,
    data: result?.data,
  });
});

// Function to GET Single Student
const getSingleStudent = catchAsync(async (req: Request, res: Response) => {
  // Getting student id from params
  const id = req.params.id;
  const result = await StudentService.getSingleStudent(id);

  // Sending API Response
  sendResponse<Student>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Student retrieved successfully.',
    data: result,
  });
});

export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
