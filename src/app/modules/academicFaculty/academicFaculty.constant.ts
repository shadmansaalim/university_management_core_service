// Searching and Filtering  Fields
const filterableFields = ['searchTerm', 'title'];

// Searchable fields to GET academic faculties
const searchableFields = ['title'];

// Event name of publishing academic faculty created data in redis
const event_academic_faculty_created = 'academic-faculty.created';

// Event name of publishing academic faculty updated data in redis
const event_academic_faculty_updated = 'academic-faculty.updated';

// Event name of publishing academic faculty deleted data in redis
const event_academic_faculty_deleted = 'academic-faculty.deleted';

export const AcademicFacultyConstants = {
  filterableFields,
  searchableFields,
  event_academic_faculty_created,
  event_academic_faculty_updated,
  event_academic_faculty_deleted,
};
