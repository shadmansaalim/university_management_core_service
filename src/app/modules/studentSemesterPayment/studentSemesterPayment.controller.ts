// Imports
import { StudentSemesterPayment } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { StudentSemesterPaymentConstants } from './studentSemesterPayment.constant';
import { StudentSemesterPaymentService } from './studentSemesterPayment.service';

// Function to get all student semester payments
const getAllStudentSemesterPayments = catchAsync(
  async (req: Request, res: Response) => {
    // Making a filter options object
    const filters = pick(
      req.query,
      StudentSemesterPaymentConstants.filterableFields
    );

    // Making a pagination options object
    const paginationOptions = pick(req.query, PaginationConstants.fields);

    // Getting all student semester payments based on request
    const result =
      await StudentSemesterPaymentService.getAllStudentSemesterPayments(
        filters,
        paginationOptions
      );

    // Sending API Response
    sendResponse<StudentSemesterPayment[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student semester payments data retrieved successfully.',
      meta: result?.meta,
      data: result?.data,
    });
  }
);

export const StudentSemesterPaymentController = {
  getAllStudentSemesterPayments,
};
