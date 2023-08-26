// Imports
import { AcademicDepartment } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { AcademicDepartmentConstants } from './academicDepartment.constant';
import { AcademicDepartmentService } from './academicDepartment.service';

// Function that works when create academic department POST API hits
const createDepartment = catchAsync(async (req: Request, res: Response) => {
  // Destructuring Academic Department data from request body
  const { ...academicDepartmentData } = req.body;
  const result = await AcademicDepartmentService.createDepartment(
    academicDepartmentData
  );

  // Sending API Response
  sendResponse<AcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department created successfully',
    data: result,
  });
});

// Function to GET All Academic Departments
const getAllDepartments = catchAsync(async (req: Request, res: Response) => {
  // Making a filter options object
  const filters = pick(req.query, AcademicDepartmentConstants.filterableFields);

  // Making a pagination options object
  const paginationOptions = pick(req.query, PaginationConstants.fields);

  // Getting all departments based on request
  const result = await AcademicDepartmentService.getAllDepartments(
    filters,
    paginationOptions
  );

  sendResponse<AcademicDepartment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Departments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// Function to GET Single Academic Department
const getSingleDepartment = catchAsync(async (req: Request, res: Response) => {
  // Destructuring id from params
  const { id } = req.params;
  const result = await AcademicDepartmentService.getSingleDepartment(id);

  sendResponse<AcademicDepartment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department retrieved successfully',
    data: result,
  });
});

// Function to update department
const updateSingleDepartment = catchAsync(
  async (req: Request, res: Response) => {
    // Getting academic department id from params
    const id = req.params.id;
    // Getting updated data
    const updatedData = req.body;

    const result = await AcademicDepartmentService.updateSingleDepartment(
      id,
      updatedData
    );

    sendResponse<AcademicDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Department updated successfully',
      data: result,
    });
  }
);

// Function to delete department
const deleteSingleDepartment = catchAsync(
  async (req: Request, res: Response) => {
    // Getting department id from params
    const id = req.params.id;

    const result = await AcademicDepartmentService.deleteSingleDepartment(id);

    // Sending API Response
    sendResponse<AcademicDepartment>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Academic Department deleted successfully.',
      data: result,
    });
  }
);

export const AcademicDepartmentController = {
  createDepartment,
  getAllDepartments,
  getSingleDepartment,
  updateSingleDepartment,
  deleteSingleDepartment,
};
