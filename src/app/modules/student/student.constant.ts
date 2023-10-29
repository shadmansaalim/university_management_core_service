// Searchable fields to GET students
const searchableFields = [
  'firstName',
  'lastName',
  'middleName',
  'email',
  'contactNo',
  'studentId',
];

// Searching and Filtering  Fields
const filterableFields = [
  'searchTerm',
  'studentId',
  'email',
  'contactNo',
  'gender',
  'bloodGroup',
  'gender',
  'academicFacultyId',
  'academicDepartmentId',
  'academicSemesterId',
];

// Fields to populate in student data
const fieldsToInclude = [
  'academicSemester',
  'academicDepartment',
  'academicFaculty',
];

const relationalFields: string[] = [
  'academicFacultyId',
  'academicDepartmentId',
  'academicSemesterId',
];
const relationalFieldsMapper: { [key: string]: string } = {
  academicFacultyId: 'academicFaculty',
  academicDepartmentId: 'academicDepartment',
  academicSemesterId: 'academicSemester',
};

const myCoursesFilterableFields: string[] = ['courseId', 'academicSemesterId'];

// Event name of publishing student created data in redis
const event_student_created = 'student.created';

export const StudentConstants = {
  searchableFields,
  filterableFields,
  fieldsToInclude,
  relationalFields,
  relationalFieldsMapper,
  myCoursesFilterableFields,
  event_student_created,
};
