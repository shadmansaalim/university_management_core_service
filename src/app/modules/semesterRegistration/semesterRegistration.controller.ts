// Imports
import { SemesterRegistration } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { SemesterRegistrationConstants } from './semesterRegistration.constant';
import { SemesterRegistrationService } from './semesterRegistration.service';

// Function that works when create semester registration POST API hits
const createSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterRegistrationService.createSemesterRegistration(
      req.body
    );

    // Sending API Response
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration created successfully.',
      data: result,
    });
  }
);

// Function to GET All Semester Registrations
const getAllSemesterRegistrations = catchAsync(
  async (req: Request, res: Response) => {
    // Making a filter options object
    const filters = pick(
      req.query,
      SemesterRegistrationConstants.filterableFields
    );

    // Making a pagination options object
    const paginationOptions = pick(req.query, PaginationConstants.fields);

    // Getting all semester registrations based on request
    const result =
      await SemesterRegistrationService.getAllSemesterRegistrations(
        filters,
        paginationOptions
      );

    // Sending API Response
    sendResponse<SemesterRegistration[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registrations retrieved successfully.',
      meta: result?.meta,
      data: result?.data,
    });
  }
);

// Function to GET Single Semester Registration
const getSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    // Getting semester registration id from params
    const id = req.params.id;
    const result =
      await SemesterRegistrationService.getSingleSemesterRegistration(id);

    // Sending API Response
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Semester Registration retrieved successfully.',
      data: result,
    });
  }
);

// Function to delete semester registration
const deleteSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    // Getting semester registration id from params
    const id = req.params.id;

    const result =
      await SemesterRegistrationService.deleteSingleSemesterRegistration(id);

    // Sending API Response
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration deleted successfully.',
      data: result,
    });
  }
);

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  deleteSingleSemesterRegistration,
};
