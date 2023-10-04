// Imports
import { OfferedCourseClassSchedule } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseClassScheduleConstants } from './offeredCourseClassSchedule.constant';
import { OfferedCourseClassScheduleService } from './offeredCourseClassSchedule.service';

// Function that works when create offered course class schedule POST API hits
const createOfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await OfferedCourseClassScheduleService.createOfferedCourseClassSchedule(
        req.body
      );

    // Sending API Response
    sendResponse<OfferedCourseClassSchedule>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Class Schedule created successfully.',
      data: result,
    });
  }
);

// Function to GET All Offered Course Class Schedules
const getAllOfferedCourseClassSchedules = catchAsync(
  async (req: Request, res: Response) => {
    // Making a filter options object
    const filters = pick(
      req.query,
      OfferedCourseClassScheduleConstants.filterableFields
    );

    // Making a pagination options object
    const paginationOptions = pick(req.query, PaginationConstants.fields);

    // Getting all offered course class schedules based on request
    const result =
      await OfferedCourseClassScheduleService.getAllOfferedCourseClassSchedules(
        filters,
        paginationOptions
      );

    // Sending API Response
    sendResponse<OfferedCourseClassSchedule[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Class Schedules retrieved successfully.',
      meta: result?.meta,
      data: result?.data,
    });
  }
);

// Function to GET Single Offered Course Class Schedule
const getSingleOfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    // Getting offered course class schedule id from params
    const id = req.params.id;
    const result =
      await OfferedCourseClassScheduleService.getSingleOfferedCourseClassSchedule(
        id
      );

    // Sending API Response
    sendResponse<OfferedCourseClassSchedule>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Offered Course Class Schedule retrieved successfully.',
      data: result,
    });
  }
);

// Function to update offered course class schedule
const updateSingleOfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    // Getting offered course class schedule id from params
    const id = req.params.id;

    const result =
      await OfferedCourseClassScheduleService.updateSingleOfferedCourseClassSchedule(
        id,
        req.body
      );

    // Sending API Response
    sendResponse<OfferedCourseClassSchedule>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Class Schedule updated successfully.',
      data: result,
    });
  }
);

// Function to delete offered course class schedule
const deleteSingleOfferedCourseClassSchedule = catchAsync(
  async (req: Request, res: Response) => {
    // Getting offered course class schedule id from params
    const id = req.params.id;

    const result =
      await OfferedCourseClassScheduleService.deleteSingleOfferedCourseClassSchedule(
        id
      );

    // Sending API Response
    sendResponse<OfferedCourseClassSchedule>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Class Schedule deleted successfully.',
      data: result,
    });
  }
);

export const OfferedCourseClassScheduleController = {
  createOfferedCourseClassSchedule,
  getAllOfferedCourseClassSchedules,
  getSingleOfferedCourseClassSchedule,
  updateSingleOfferedCourseClassSchedule,
  deleteSingleOfferedCourseClassSchedule,
};
