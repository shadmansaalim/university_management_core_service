// Searchable fields to GET offered courses
const searchableFields: string[] = [];

// Searching and Filtering Fields
const filterableFields = [
  'searchTerm',
  'id',
  'semesterRegistrationId',
  'courseId',
  'academicDepartmentId',
];

// Fields to populate in offered course data
const fieldsToInclude = [
  'course',
  'academicDepartment',
  'semesterRegistration',
];

export const offeredCourseRelationalFields: string[] = [
  'semesterRegistrationId',
  'courseId',
  'academicDepartmentId',
];
export const offeredCourseRelationalFieldsMapper: { [key: string]: string } = {
  semesterRegistrationId: 'semesterRegistration',
  courseId: 'course',
  academicDepartmentId: 'academicDepartment',
};

export const OfferedCourseConstants = {
  searchableFields,
  filterableFields,
  fieldsToInclude,
  offeredCourseRelationalFields,
  offeredCourseRelationalFieldsMapper,
};
