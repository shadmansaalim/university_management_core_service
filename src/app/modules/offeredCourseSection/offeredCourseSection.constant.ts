// Searchable fields to GET offered course sections
const searchableFields: string[] = [];

// Searching and Filtering Fields
const filterableFields = [
  'searchTerm',
  'id',
  'offeredCourseId',
  'semesterRegistrationId',
];

// Fields to populate in offered course sections data
const fieldsToInclude = [
  'course',
  'academicDepartment',
  'semesterRegistration',
];

const relationalFields: string[] = [
  'offeredCourseId',
  'semesterRegistrationId',
];
const relationalFieldsMapper: {
  [key: string]: string;
} = {
  offeredCourseId: 'offeredCourse',
  semesterRegistrationId: 'semesterRegistration',
};

const daysInWeek = [
  'SATURDAY',
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
];

export const OfferedCourseSectionConstants = {
  searchableFields,
  filterableFields,
  fieldsToInclude,
  relationalFields,
  relationalFieldsMapper,
  daysInWeek,
};
