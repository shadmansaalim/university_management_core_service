// Pagination Options Type
export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

export type ICalculatePaginationResult = {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: string;
  skip: number;
};
