// Title type
export type IAcademicSemesterTitles = 'Autumn' | 'Summer' | 'Fall';

// Code type
export type IAcademicSemesterCodes = '01' | '02' | '03';

// Month type
export type IAcademicSemesterMonths =
  | 'January'
  | 'February'
  | 'March'
  | 'April'
  | 'May'
  | 'June'
  | 'July'
  | 'August'
  | 'September'
  | 'October'
  | 'November'
  | 'December';

// Academic Semester Filters Type
export type IAcademicSemesterFilters = {
  searchTerm?: string;
};
