// Imports
import { Model, SortOrder } from 'mongoose';
import { PaginationHelpers } from '../helpers/paginationHelper';
import { IDocumentFilters } from '../interfaces/common';
import { IPaginationOptions } from '../interfaces/pagination';

const getAllDocuments = async (
  filters: IDocumentFilters,
  paginationOptions: IPaginationOptions,
  searchableFields: string[],
  model: Model<any>,
  fieldsToPopulate?: string[]
) => {
  // Destructuring ~ Searching and Filtering
  const { searchTerm, ...filterData } = filters;

  // Storing all searching and filtering condition in this array
  const searchFilterConditions = [];

  // Checking if SEARCH is requested in GET API - adding find conditions
  if (searchTerm) {
    searchFilterConditions.push({
      $or: searchableFields.map(field => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    });
  }

  // Checking if FILTER is requested in GET API - adding find conditions
  if (Object.keys(filterData).length) {
    searchFilterConditions.push({
      $and: Object.entries(filterData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  // Destructuring ~ Pagination and Sorting
  const { page, limit, sortBy, sortOrder, skip } =
    PaginationHelpers.calculatePagination(paginationOptions);

  // Default Sorting Condition
  const sortingCondition: { [key: string]: SortOrder } = {};

  // Adding sort condition if requested
  if (sortBy && sortOrder) {
    sortingCondition[sortBy] = sortOrder;
  }

  // Condition for finding documents
  const findConditions = searchFilterConditions.length
    ? { $and: searchFilterConditions }
    : {};

  // Documents
  let result = await model
    .find(findConditions)
    .sort(sortingCondition)
    .skip(skip)
    .limit(limit);

  // Checking if fields needs to be populated
  if (fieldsToPopulate && fieldsToPopulate.length) {
    const query = model
      .find(findConditions)
      .sort(sortingCondition)
      .skip(skip)
      .limit(limit);

    // Populate the specified fields
    fieldsToPopulate.forEach(field => {
      query.populate(field);
    });

    result = await query.exec();
  }

  // Total Documents in Database matching the condition
  const total = await model.countDocuments(findConditions);

  return {
    page,
    limit,
    total,
    result,
  };
};

export default getAllDocuments;
