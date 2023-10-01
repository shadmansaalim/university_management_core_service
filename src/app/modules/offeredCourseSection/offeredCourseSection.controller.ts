// Imports
import { OfferedCourseSection } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { OfferedCourseSectionConstants } from './offeredCourseSection.constant';
import { OfferedCourseSectionService } from './offeredCourseSection.service';

// Function that works when create offered course section POST API hits
const createOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    const result = await OfferedCourseSectionService.createOfferedCourseSection(
      req.body
    );

    // Sending API Response
    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Section created successfully.',
      data: result,
    });
  }
);

// Function to GET All Offered Course Sections
const getAllOfferedCourseSections = catchAsync(
  async (req: Request, res: Response) => {
    // Making a filter options object
    const filters = pick(
      req.query,
      OfferedCourseSectionConstants.filterableFields
    );

    // Making a pagination options object
    const paginationOptions = pick(req.query, PaginationConstants.fields);

    // Getting all offered course sections based on request
    const result =
      await OfferedCourseSectionService.getAllOfferedCourseSections(
        filters,
        paginationOptions
      );

    // Sending API Response
    sendResponse<OfferedCourseSection[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Sections retrieved successfully.',
      meta: result?.meta,
      data: result?.data,
    });
  }
);

// Function to GET Single Offered Course Section
const getSingleOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    // Getting offered course section id from params
    const id = req.params.id;
    const result =
      await OfferedCourseSectionService.getSingleOfferedCourseSection(id);

    // Sending API Response
    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Single Offered Course Section retrieved successfully.',
      data: result,
    });
  }
);

// Function to update offered course section
const updateSingleOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    // Getting offered course section id from params
    const id = req.params.id;

    const result =
      await OfferedCourseSectionService.updateSingleOfferedCourseSection(
        id,
        req.body
      );

    // Sending API Response
    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Section updated successfully.',
      data: result,
    });
  }
);

// Function to delete offered course section
const deleteSingleOfferedCourseSection = catchAsync(
  async (req: Request, res: Response) => {
    // Getting offered course section id from params
    const id = req.params.id;

    const result =
      await OfferedCourseSectionService.deleteSingleOfferedCourseSection(id);

    // Sending API Response
    sendResponse<OfferedCourseSection>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Offered Course Section deleted successfully.',
      data: result,
    });
  }
);

export const OfferedCourseSectionController = {
  createOfferedCourseSection,
  getAllOfferedCourseSections,
  getSingleOfferedCourseSection,
  updateSingleOfferedCourseSection,
  deleteSingleOfferedCourseSection,
};
