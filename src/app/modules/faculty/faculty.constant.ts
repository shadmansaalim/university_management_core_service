// Searchable fields to GET faculties
const searchableFields = [
  'firstName',
  'lastName',
  'middleName',
  'email',
  'contactNo',
  'facultyId',
  'designation',
];

// Searching and Filtering  Fields
const filterableFields = [
  'searchTerm',
  'facultyId',
  'email',
  'contactNo',
  'gender',
  'bloodGroup',
  'gender',
  'designation',
  'academicFacultyId',
  'academicDepartmentId',
];

// Fields to populate in faculty data
const fieldsToInclude = ['academicDepartment', 'academicFaculty'];

export const FacultyConstants = {
  searchableFields,
  filterableFields,
  fieldsToInclude,
};
