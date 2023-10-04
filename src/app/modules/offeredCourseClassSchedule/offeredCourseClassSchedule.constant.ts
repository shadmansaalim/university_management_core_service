// Searchable fields to GET offered course class schedules
const searchableFields: string[] = ['dayOfWeek'];

// Searching and Filtering Fields
const filterableFields = [
  'searchTerm',
  'dayOfWeek',
  'offeredCourseSectionId',
  'semesterRegistrationId',
  'roomId',
  'facultyId',
];

// Fields to populate in offered course class schedules data
const fieldsToInclude = [
  'offeredCourseSection',
  'semesterRegistration',
  'faculty',
  'room',
];

const relationalFields: string[] = [
  'offeredCourseSectionId',
  'semesterRegistrationId',
  'facultyId',
  'roomId',
];
const relationalFieldsMapper: { [key: string]: string } = {
  offeredCourseSectionId: 'offeredCourseSection',
  facultyId: 'faculty',
  roomId: 'room',
  semesterRegistrationId: 'semesterRegistration',
};

export const OfferedCourseClassScheduleConstants = {
  searchableFields,
  filterableFields,
  fieldsToInclude,
  relationalFields,
  relationalFieldsMapper,
};
