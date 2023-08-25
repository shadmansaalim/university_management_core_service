// Imports
import { AcademicSemester, Prisma } from '@prisma/client';
import { PaginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { AcademicSemesterConstants } from './academicSemester.constant';
import { IAcademicSemesterFilters } from './academicSemester.interface';

// Create Semester Service Function
const insertIntoDB = async (
  data: AcademicSemester
): Promise<AcademicSemester> => {
  const result = await prisma.academicSemester.create({ data });
  return result;
};

// Function to get All Semester from DB
const getAllFromDB = async (
  filters: IAcademicSemesterFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<AcademicSemester[]>> => {
  // Destructuring ~ Searching and Filtering
  const { searchTerm, ...filterData } = filters;

  // Storing all searching and filtering condition in this array
  const searchFilterConditions = [];

  // Checking if SEARCH is requested in GET API - adding find conditions
  if (searchTerm) {
    searchFilterConditions.push({
      OR: AcademicSemesterConstants.searchableFields.map(field => ({
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
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
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

  // Condition for finding academic semesters
  const whereConditions: Prisma.AcademicSemesterWhereInput =
    searchFilterConditions.length ? { AND: searchFilterConditions } : {};

  // Academic Semesters
  const result = await prisma.academicSemester.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortingCondition,
  });

  // Total Academic Semesters in Database matching the condition
  const total = await prisma.academicSemester.count({ where: whereConditions });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const AcademicSemesterService = {
  insertIntoDB,
  getAllFromDB,
};
