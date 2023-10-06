// Searchable fields to GET student enrolled courses
const searchableFields: string[] = [];

// Searching and Filtering Fields
const filterableFields = [
  'academicSemesterId',
  'studentId',
  'courseId',
  'status',
  'grade',
];

// Fields to populate in student enrolled course data
const fieldsToInclude = ['academicSemester', 'student', 'course'];

const relationalFields: string[] = [
  'academicSemesterId',
  'studentId',
  'courseId',
];
const relationalFieldsMapper: {
  [key: string]: string;
} = {
  academicSemesterId: 'academicSemester',
  studentId: 'student',
  courseId: 'course',
};

export const StudentEnrolledCourseConstants = {
  searchableFields,
  filterableFields,
  fieldsToInclude,
  relationalFields,
  relationalFieldsMapper,
};
