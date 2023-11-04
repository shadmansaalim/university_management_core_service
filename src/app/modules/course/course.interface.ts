// Course Prerequisite type
export type ICoursePrerequisite = {
  courseId: string;
  isDeleted?: null;
};

// Course creation data type
export type ICourseCreateData = {
  title: string;
  code: string;
  credits: number;
  coursePreRequisites: ICoursePrerequisite[];
};

// Course Filters Type
export type ICourseFilters = {
  searchTerm?: string | undefined;
};
