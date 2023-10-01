/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */

// Imports
import { PaginationHelpers } from '../helpers/paginationHelper';
import { IPaginationOptions } from '../interfaces/pagination';

// Define a type for the Prisma model
type PrismaModel<T> = {
  findMany: (params: any) => Promise<T[]>;
  count: (params: any) => Promise<number>;
};

const getAllDocuments = async <T>(
  filters: { [key: string]: any },
  paginationOptions: IPaginationOptions,
  searchableFields: string[],
  model: PrismaModel<T>,
  fieldsToInclude?: string[],
  relationalFields?: string[],
  relationalFieldsMapper?: {
    [key: string]: string;
  }
): Promise<{
  page: number;
  limit: number;
  total: number;
  result: T[];
}> => {
  // Destructuring ~ Searching and Filtering
  const { searchTerm, ...filterData } = filters;

  // Storing all searching and filtering condition in this array
  const searchFilterConditions = [];

  // Checking if SEARCH is requested in GET API - adding find conditions
  if (searchTerm) {
    searchFilterConditions.push({
      OR: searchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  // Checking if FILTER is requested in GET API - adding find conditions
  if (Object.keys(filterData).length) {
    searchFilterConditions.push({
      AND: Object.keys(filterData).map(key => {
        if (relationalFields?.includes(key)) {
          return {
            [(
              relationalFieldsMapper as {
                [key: string]: string;
              }
            )[key]]: {
              id: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  // Destructuring ~ Pagination and Sorting
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelpers.calculatePagination(paginationOptions);

  // Default Sorting Condition
  const sortingCondition: { [key: string]: any } = {};

  // Adding sort condition if requested
  if (sortBy && sortOrder) {
    sortingCondition[sortBy] = sortOrder;
  }

  // Condition for finding documents
  const whereConditions = searchFilterConditions.length
    ? { AND: searchFilterConditions }
    : {};

  // Base Query object that stores the query
  const baseQuery: any = {
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortingCondition,
  };

  // Checking if fields needs to be populated
  if (fieldsToInclude && fieldsToInclude.length) {
    // Object that stores the fields that needs to be included
    const include: { [key: string]: boolean } = {};

    // Adding fields in the include object that needs to be added
    fieldsToInclude.forEach(field => {
      include[field] = true;
    });

    // Adding the include property to the base query
    baseQuery.include = include;
  }

  // Documents
  const result = await model.findMany(baseQuery);

  // Total Documents in Database matching the condition
  const total = await model.count({ where: whereConditions });

  return {
    page,
    limit,
    total,
    result,
  };
};

export default getAllDocuments;
