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

export const StudentConstants = {
  searchableFields,
  filterableFields,
  fieldsToInclude,
};
