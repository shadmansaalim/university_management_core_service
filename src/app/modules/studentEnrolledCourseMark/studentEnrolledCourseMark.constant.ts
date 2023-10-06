// Searchable fields to GET student enrolled course marks
const searchableFields: string[] = ['examType', 'grade'];

// Searching and Filtering Fields
const filterableFields = [
  'academicSemesterId',
  'studentId',
  'studentEnrolledCourseId',
  'examType',
  'courseId',
];

const relationalFields: string[] = [
  'academicSemesterId',
  'studentId',
  'studentEnrolledCourseId',
];
const relationalFieldsMapper: {
  [key: string]: string;
} = {
  academicSemesterId: 'academicSemester',
  studentId: 'student',
  studentEnrolledCourseId: 'studentEnrolledCourse',
};

export const StudentEnrolledCourseMarkConstants = {
  searchableFields,
  filterableFields,
  relationalFields,
  relationalFieldsMapper,
};
