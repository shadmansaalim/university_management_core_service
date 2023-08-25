//Imports
import {
  IAcademicSemesterCodes,
  IAcademicSemesterMonths,
  IAcademicSemesterTitles,
} from './academicSemester.interface';

/* Constants for Academic Semester Module */

// Titles
const titles: IAcademicSemesterTitles[] = ['Autumn', 'Summer', 'Fall'];

// Codes
const codes: IAcademicSemesterCodes[] = ['01', '02', '03'];

// Months
const months: IAcademicSemesterMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Mapping title and code to create a relation
const titleCodeMapper: { [key: string]: string } = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};

// Searching and Filtering  Fields
const filterableFields = ['searchTerm', 'title', 'year', 'code'];

// Searchable fields to GET academic semesters
const searchableFields = ['title', 'year', 'code'];

export const AcademicSemesterConstants = {
  titles,
  codes,
  months,
  titleCodeMapper,
  filterableFields,
  searchableFields,
};
