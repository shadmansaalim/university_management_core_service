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

const relationalFields: string[] = [
  'semesterRegistrationId',
  'courseId',
  'academicDepartmentId',
];
const relationalFieldsMapper: { [key: string]: string } = {
  semesterRegistrationId: 'semesterRegistration',
  courseId: 'course',
  academicDepartmentId: 'academicDepartment',
};

export const OfferedCourseConstants = {
  searchableFields,
  filterableFields,
  fieldsToInclude,
  relationalFields,
  relationalFieldsMapper,
};
