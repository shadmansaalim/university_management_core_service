// Imports
import { OfferedCourseClassSchedule } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { OfferedCourseClassScheduleConstants } from './offeredCourseClassSchedule.constant';
import { IOfferedCourseClassScheduleFilters } from './offeredCourseClassSchedule.interface';
import { OfferedCourseClassScheduleUtils } from './offeredCourseClassSchedule.util';

// Create Offered Course Class Schedule Function
const createOfferedCourseClassSchedule = async (
  data: OfferedCourseClassSchedule
): Promise<OfferedCourseClassSchedule> => {
  // Checking whether the requested room and faculty for the slot are available or not
  await OfferedCourseClassScheduleUtils.checkRoomAvailable(data);
  await OfferedCourseClassScheduleUtils.checkFacultyAvailable(data);

  return await prisma.offeredCourseClassSchedule.create({
    data,
    include: {
      semesterRegistration: true,
      offeredCourseSection: true,
      room: true,
      faculty: true,
    },
  });
};

// GET All Offered Course Class Schedules Function
const getAllOfferedCourseClassSchedules = async (
  filters: IOfferedCourseClassScheduleFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseClassSchedule[]>> => {
  // Getting all offered course class schedules
  const { page, limit, total, result } =
    await getAllDocuments<OfferedCourseClassSchedule>(
      filters,
      paginationOptions,
      OfferedCourseClassScheduleConstants.searchableFields,
      prisma.offeredCourseClassSchedule,
      OfferedCourseClassScheduleConstants.fieldsToInclude,
      OfferedCourseClassScheduleConstants.relationalFields,
      OfferedCourseClassScheduleConstants.relationalFieldsMapper
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

// GET Single Offered Course Class Schedule Function
const getSingleOfferedCourseClassSchedule = async (
  id: string
): Promise<OfferedCourseClassSchedule | null> => {
  return await prisma.offeredCourseClassSchedule.findUnique({
    where: {
      id,
    },
    include: {
      offeredCourseSection: true,
      faculty: true,
      room: true,
    },
  });
};

// UPDATE Single Offered Course Class Schedule
const updateSingleOfferedCourseClassSchedule = async (
  id: string,
  payload: Partial<OfferedCourseClassSchedule>
): Promise<OfferedCourseClassSchedule> => {
  return await prisma.offeredCourseClassSchedule.update({
    where: {
      id,
    },
    data: payload,
    include: {
      offeredCourseSection: true,
      faculty: true,
      room: true,
    },
  });
};

// DELETE Single Offered Course Class Schedule
const deleteSingleOfferedCourseClassSchedule = async (
  id: string
): Promise<OfferedCourseClassSchedule | null> => {
  return await prisma.offeredCourseClassSchedule.delete({
    where: {
      id,
    },
    include: {
      offeredCourseSection: true,
      faculty: true,
      room: true,
    },
  });
};

export const OfferedCourseClassScheduleService = {
  createOfferedCourseClassSchedule,
  getAllOfferedCourseClassSchedules,
  getSingleOfferedCourseClassSchedule,
  updateSingleOfferedCourseClassSchedule,
  deleteSingleOfferedCourseClassSchedule,
};
