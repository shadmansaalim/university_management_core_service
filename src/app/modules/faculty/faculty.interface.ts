// Faculty Filters Type
export type IFacultyFilters = {
  searchTerm?: string | undefined;
  academicFacultyId?: string | undefined;
  academicDepartmentId?: string | undefined;
  studentId?: string | undefined;
  email?: string | undefined;
  contactNo?: string | undefined;
  gender?: string | undefined;
  bloodGroup?: string | undefined;
};

export type IFacultyMyCourseStudentsFilters = {
  academicSemesterId?: string | undefined;
  courseId?: string | undefined;
  offeredCourseSectionId?: string | undefined;
};
