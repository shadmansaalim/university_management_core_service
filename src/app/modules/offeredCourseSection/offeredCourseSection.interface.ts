import { WeekDays } from '@prisma/client';

// Offered Course Section Filters Type
export type IOfferedCourseSectionFilters = {
  searchTerm?: string | undefined;
  offeredCourseId?: string | undefined;
};

export type IClassSchedule = {
  startTime: string;
  endTime: string;
  dayOfWeek: WeekDays;
  roomId: string;
  facultyId: string;
};
