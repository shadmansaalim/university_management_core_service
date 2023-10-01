// Searchable fields to GET semester registrations
const searchableFields: string[] = [];

// Searching and Filtering Fields
const filterableFields = ['searchTerm', 'id', 'academicSemesterId'];

// Fields to populate in semester registration data
const fieldsToInclude = ['academicSemester'];

const relationalFields: string[] = ['academicSemesterId'];
const relationalFieldsMapper: {
  [key: string]: string;
} = {
  academicSemesterId: 'academicSemester',
};

export const SemesterRegistrationConstants = {
  searchableFields,
  filterableFields,
  fieldsToInclude,
  relationalFields,
  relationalFieldsMapper,
};
