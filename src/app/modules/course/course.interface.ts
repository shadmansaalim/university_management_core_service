// Prerequisite course type
export type IPrerequisiteCourse = {
  courseId: string;
  isDeleted?: null;
};

// Course creation data type
export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: IPrerequisiteCourse[];
};

// Course Filters Type
export type ICourseFilters = {
  searchTerm?: string | undefined;
};
