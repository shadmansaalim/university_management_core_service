// Searchable fields to GET semester registrations
const searchableFields: string[] = [];

// Searching and Filtering Fields
const filterableFields = ['searchTerm', 'id', 'academicSemesterId'];

// Fields to populate in semester registration data
const fieldsToInclude = ['academicSemester'];

const semesterRegistrationRelationalFields: string[] = ['academicSemesterId'];
const semesterRegistrationRelationalFieldsMapper: {
  [key: string]: string;
} = {
  academicSemesterId: 'academicSemester',
};

export const SemesterRegistrationConstants = {
  searchableFields,
  filterableFields,
  fieldsToInclude,
  semesterRegistrationRelationalFields,
  semesterRegistrationRelationalFieldsMapper,
};
