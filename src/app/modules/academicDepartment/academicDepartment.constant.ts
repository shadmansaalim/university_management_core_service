// Searching and Filtering  Fields
const filterableFields = ['searchTerm', 'title'];

// Searchable fields to GET academic departments
const searchableFields = ['title'];

// Fields to populate in academic department data
const fieldsToInclude = ['academicFaculty'];

const relationalFields: string[] = ['academicFacultyId'];

const relationalFieldsMapper: {
  [key: string]: string;
} = {
  academicFacultyId: 'academicFaculty',
};

export const AcademicDepartmentConstants = {
  filterableFields,
  searchableFields,
  fieldsToInclude,
  relationalFields,
  relationalFieldsMapper,
};
