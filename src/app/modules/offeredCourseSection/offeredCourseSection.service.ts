// Imports
import { OfferedCourseSection } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { PaginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { OfferedCourseSectionConstants } from './offeredCourseSection.constant';
import { IOfferedCourseSectionFilters } from './offeredCourseSection.interface';

// Create Offered Course Section Function
const createOfferedCourseSection = async (
  data: any
): Promise<OfferedCourseSection> => {
  // Finding offered course
  const OfferedCourseExists = await prisma.offeredCourse.findFirst({
    where: {
      id: data.offeredCourseId,
    },
  });

  // Checking whether offered course exists or not
  if (!OfferedCourseExists) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Offered Course does not exist in our system.'
    );
  }

  // Adding the semester registration id to data
  data.semesterRegistrationId = OfferedCourseExists.semesterRegistrationId;

  return await prisma.offeredCourseSection.create({
    data,
  });
};

// GET All Offered Course Sections Function
const getAllOfferedCourseSections = async (
  filters: IOfferedCourseSectionFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<OfferedCourseSection[]>> => {
  // Destructuring ~ Searching and Filtering
  const { searchTerm, ...filterData } = filters;

  // Storing all searching and filtering condition in this array
  const searchFilterConditions = [];

  // Checking if SEARCH is requested in GET API - adding find conditions
  if (searchTerm) {
    searchFilterConditions.push({
      OR: OfferedCourseSectionConstants.searchableFields.map(field => ({
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
        if (OfferedCourseSectionConstants.relationalFields.includes(key)) {
          return {
            [OfferedCourseSectionConstants.relationalFieldsMapper[key]]: {
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

  // Condition for finding courses
  const whereConditions = searchFilterConditions.length
    ? { AND: searchFilterConditions }
    : {};

  // Offered Course Sections
  const result = await prisma.offeredCourseSection.findMany({
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy: sortingCondition,
  });

  // Total Offered Course Sections in Database matching the condition
  const total = await prisma.offeredCourseSection.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// GET Single Offered Course Section Function
const getSingleOfferedCourseSection = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  return await prisma.offeredCourseSection.findUnique({
    where: {
      id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
    },
  });
};

// UPDATE Single Offered Course Section
const updateSingleOfferedCourseSection = async (
  id: string,
  payload: Partial<OfferedCourseSection>
): Promise<OfferedCourseSection> => {
  return await prisma.offeredCourseSection.update({
    where: {
      id,
    },
    data: payload,
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
    },
  });
};

// DELETE Single Offered Course Section
const deleteSingleOfferedCourseSection = async (
  id: string
): Promise<OfferedCourseSection | null> => {
  return await prisma.offeredCourseSection.delete({
    where: {
      id,
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
    },
  });
};

export const OfferedCourseSectionService = {
  createOfferedCourseSection,
  getAllOfferedCourseSections,
  getSingleOfferedCourseSection,
  updateSingleOfferedCourseSection,
  deleteSingleOfferedCourseSection,
};
