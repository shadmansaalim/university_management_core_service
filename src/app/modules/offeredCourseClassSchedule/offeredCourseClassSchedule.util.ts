import { OfferedCourseClassSchedule } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';
import { hasTimeConflict } from '../../../shared/utils';
import { ITimeSlot } from './offeredCourseClassSchedule.interface';

// Function to check whether room is available or not
const checkRoomAvailable = async (
  data: OfferedCourseClassSchedule
): Promise<void> => {
  // Finding the existing class schedule slots based on passed day and room
  const existingSlots = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: data.dayOfWeek,
      room: {
        id: data.roomId,
      },
    },
    select: {
      startTime: true,
      endTime: true,
      dayOfWeek: true,
    },
  });

  // New slot to create
  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  // Checking new slot has conflict with existing time slots
  if (hasTimeConflict(existingSlots as ITimeSlot[], newSlot)) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Room is already booked for a class. Try scheduling the class in another room.'
    );
  }
};

// Function to check whether faculty is available for class or not
const checkFacultyAvailable = async (
  data: OfferedCourseClassSchedule
): Promise<void> => {
  // Finding the existing class schedule slots based on passed day and faculty
  const existingSlots = await prisma.offeredCourseClassSchedule.findMany({
    where: {
      dayOfWeek: data.dayOfWeek,
      faculty: {
        id: data.facultyId,
      },
    },
    select: {
      startTime: true,
      endTime: true,
      dayOfWeek: true,
    },
  });

  // New slot to create
  const newSlot = {
    startTime: data.startTime,
    endTime: data.endTime,
    dayOfWeek: data.dayOfWeek,
  };

  // Checking new slot has conflict with existing time slots
  if (hasTimeConflict(existingSlots as ITimeSlot[], newSlot)) {
    throw new ApiError(
      httpStatus.CONFLICT,
      'Faculty is busy with another class. Try scheduling some other time.'
    );
  }
};

export const OfferedCourseClassScheduleUtils = {
  checkRoomAvailable,
  checkFacultyAvailable,
};
