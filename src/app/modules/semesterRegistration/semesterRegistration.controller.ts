// Imports
import {
  SemesterRegistration,
  StudentSemesterRegistration,
} from '@prisma/client';
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

// Function to update semester registration
const updateSingleSemesterRegistration = catchAsync(
  async (req: Request, res: Response) => {
    // Getting semester registration id from params
    const id = req.params.id;

    const result =
      await SemesterRegistrationService.updateSingleSemesterRegistration(
        id,
        req.body
      );

    // Sending API Response
    sendResponse<SemesterRegistration>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration updated successfully.',
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

// Function to start student semester registration
const startMyRegistration = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const result = await SemesterRegistrationService.startMyRegistration(user.id);

  // Sending API Response
  sendResponse<{
    semesterRegistration: SemesterRegistration | null;
    studentSemesterRegistration: StudentSemesterRegistration | null;
  }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Student (${user.id}) semester registration started successfully.`,
    data: result,
  });
});

// Function to enroll student into course
const enrollIntoCourse = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const result = await SemesterRegistrationService.enrollIntoCourse(
    user.id,
    req.body
  );

  // Sending API Response
  sendResponse<{
    message: string;
  }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Student (${user.id}) enrolled into course successfully.`,
    data: result,
  });
});

// Function to enroll student into course
const withdrawFromCourse = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const result = await SemesterRegistrationService.withdrawFromCourse(
    user.id,
    req.body
  );

  // Sending API Response
  sendResponse<{
    message: string;
  }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Student (${user.id}) has been withdrawn from course successfully.`,
    data: result,
  });
});

// Function to confirm student registration
const confirmMyRegistration = catchAsync(
  async (req: Request, res: Response) => {
    // Getting authenticated user from request
    const user = (req as any).user;

    const result = await SemesterRegistrationService.confirmMyRegistration(
      user.id
    );

    // Sending API Response
    sendResponse<{
      message: string;
    }>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Student (${user.id}) semester registration has been confirmed successfully.`,
      data: result,
    });
  }
);

// Function to get student registration data
const getMyRegistration = catchAsync(async (req: Request, res: Response) => {
  // Getting authenticated user from request
  const user = (req as any).user;

  const result = await SemesterRegistrationService.getMyRegistration(user.id);

  // Sending API Response
  sendResponse<{
    semesterRegistrationData: SemesterRegistration | null;
    studentSemesterRegistrationData: StudentSemesterRegistration | null;
  }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Student (${user.id}) semester registration data has been retrieved successfully.`,
    data: result,
  });
});

// Function to start a semester
const startNewSemester = catchAsync(async (req: Request, res: Response) => {
  const result = await SemesterRegistrationService.startNewSemester(
    req.params.id
  );

  // Sending API Response
  sendResponse<{
    message: string;
  }>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Semester started successfully.`,
    data: result,
  });
});

// Function to get student semester registration courses
const getMySemesterRegCourses = catchAsync(
  async (req: Request, res: Response) => {
    // Getting authenticated user from request
    const user = (req as any).user;

    const result = await SemesterRegistrationService.getMySemesterRegCourses(
      user.id
    );

    // Sending API Response
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Student (${user.id}) available semester courses that can be enrolled has been retrieved successfully.`,
      data: result,
    });
  }
);

export const SemesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSingleSemesterRegistration,
  deleteSingleSemesterRegistration,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
  startNewSemester,
  getMySemesterRegCourses,
};
