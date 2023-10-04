// Offered Course Class Schedule Filters Type
import { WeekDays } from '@prisma/client';
export type IOfferedCourseClassScheduleFilters = {
  searchTerm?: string | null;
  offeredCourseSectionId?: string | null;
  roomId?: string | null;
  facultyId?: string | null;
};

// Time Slot Type
export type ITimeSlot = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
};
