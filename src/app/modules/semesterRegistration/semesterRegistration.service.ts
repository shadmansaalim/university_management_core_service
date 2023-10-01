// Imports
import {
  SemesterRegistration,
  SemesterRegistrationStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { SemesterRegistrationConstants } from './semesterRegistration.constant';
import { ISemesterRegistrationFilters } from './semesterRegistration.interface';

// Create Semester Registration Function
const createSemesterRegistration = async (
  data: SemesterRegistration
): Promise<SemesterRegistration> => {
  // Finding whether any semester registration is upcoming or ongoing
  const isAnySemesterRegUpcomingOrOngoing =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });

  // Throwing error if any semester registration is upcoming or ongoing
  if (isAnySemesterRegUpcomingOrOngoing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isAnySemesterRegUpcomingOrOngoing.status} semester registration.`
    );
  }

  // Creating Semester Registration
  return await prisma.semesterRegistration.create({ data });
};

// GET All Semester Registrations Function
const getAllSemesterRegistrations = async (
  filters: ISemesterRegistrationFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  // Getting all semester registrations
  const { page, limit, total, result } =
    await getAllDocuments<SemesterRegistration>(
      filters,
      paginationOptions,
      SemesterRegistrationConstants.searchableFields,
      prisma.semesterRegistration,
      SemesterRegistrationConstants.fieldsToInclude,
      SemesterRegistrationConstants.relationalFields,
      SemesterRegistrationConstants.relationalFieldsMapper
    );

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// GET Single Semester Registration Function
const getSingleSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  return await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
};

// UPDATE Single Semester Registration
const updateSingleSemesterRegistration = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {
  // Finding semester registration
  const exists = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  // Checking whether semester registration exists or not
  if (!exists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester Registration');
  }

  // Enforcing rules to change semester registration status
  if (
    payload.status &&
    exists.status === SemesterRegistrationStatus.UPCOMING &&
    payload.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You can only change semester registration status from UPCOMING to ONGOING.'
    );
  }

  if (
    payload.status &&
    exists.status === SemesterRegistrationStatus.ONGOING &&
    payload.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You can only change semester registration status from ONGOING to ENDED.'
    );
  }

  if (
    payload.status &&
    exists.status === SemesterRegistrationStatus.ENDED &&
    payload.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You can change the status of a semester registration which is already ENDED.'
    );
  }

  return await prisma.semesterRegistration.update({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
    data: payload,
  });
};

// DELETE Single Semester Registration
const deleteSingleSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  return await prisma.semesterRegistration.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
};

export const SemesterRegistrationService = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSingleSemesterRegistration,
  deleteSingleSemesterRegistration,
};
