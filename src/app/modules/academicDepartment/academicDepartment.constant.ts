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

// Event name of publishing academic department created data in redis
const event_academic_department_created = 'academic-department.created';

// Event name of publishing academic department updated data in redis
const event_academic_department_updated = 'academic-department.updated';

// Event name of publishing academic department deleted data in redis
const event_academic_department_deleted = 'academic-department.deleted';

export const AcademicDepartmentConstants = {
  filterableFields,
  searchableFields,
  fieldsToInclude,
  relationalFields,
  relationalFieldsMapper,
  event_academic_department_created,
  event_academic_department_updated,
  event_academic_department_deleted,
};
