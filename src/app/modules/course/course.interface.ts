// Course creation data type
export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  preRequisiteCourses: {
    courseId: string;
    isDeleted?: null;
  }[];
};

// Course Filters Type
export type ICourseFilters = {
  searchTerm?: string | undefined;
};
