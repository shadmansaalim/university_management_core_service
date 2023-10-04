/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ITimeSlot } from '../app/modules/offeredCourseClassSchedule/offeredCourseClassSchedule.interface';

// Helper function to iterate over an array and call a callback function passing array's item.
export const asyncForEach = async (
  array: any[],
  callback: any
): Promise<void> => {
  if (!Array.isArray(array)) {
    throw new Error('Expected an array.');
  }
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

// Function to check whether two time slots have conflicts or not
export const hasTimeConflict = (
  existingSlots: ITimeSlot[],
  newSlot: ITimeSlot
) => {
  for (const slot of existingSlots) {
    const existingStart = new Date(`1970-01-01T${slot.startTime}:00`);
    const existingEnd = new Date(`1970-01-01T${slot.endTime}:00`);
    const newStart = new Date(`1970-01-01T${newSlot.startTime}:00`);
    const newEnd = new Date(`1970-01-01T${newSlot.endTime}:00`);

    if (newStart < existingEnd && newEnd > existingStart) {
      return true;
    }
  }
  return false;
};
