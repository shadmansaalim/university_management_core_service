// Imports
import { Building } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { BuildingConstants } from './building.constant';
import { BuildingService } from './building.service';

// Function that works when create building POST API hits
const createBuilding = catchAsync(async (req: Request, res: Response) => {
  const result = await BuildingService.createBuilding(req.body);

  // Sending API Response
  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building created successfully.',
    data: result,
  });
});

// Function to GET All Buildings
const getAllBuildings = catchAsync(async (req: Request, res: Response) => {
  // Making a filter options object
  const filters = pick(req.query, BuildingConstants.filterableFields);

  // Making a pagination options object
  const paginationOptions = pick(req.query, PaginationConstants.fields);

  // Getting all buildings based on request
  const result = await BuildingService.getAllBuildings(
    filters,
    paginationOptions
  );

  // Sending API Response
  sendResponse<Building[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Buildings retrieved successfully.',
    meta: result?.meta,
    data: result?.data,
  });
});

// Function to GET Single Building
const getSingleBuilding = catchAsync(async (req: Request, res: Response) => {
  // Getting building id from params
  const id = req.params.id;
  const result = await BuildingService.getSingleBuilding(id);

  // Sending API Response
  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Building retrieved successfully.',
    data: result,
  });
});

// Function to update building
const updateSingleBuilding = catchAsync(async (req: Request, res: Response) => {
  // Getting building id from params
  const id = req.params.id;
  // Getting updated data
  const updatedData = req.body;

  const result = await BuildingService.updateSingleBuilding(id, updatedData);

  // Sending API Response
  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building updated successfully.',
    data: result,
  });
});

// Function to delete building
const deleteSingleBuilding = catchAsync(async (req: Request, res: Response) => {
  // Getting building id from params
  const id = req.params.id;

  const result = await BuildingService.deleteSingleBuilding(id);

  // Sending API Response
  sendResponse<Building>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Building deleted successfully.',
    data: result,
  });
});

export const BuildingController = {
  createBuilding,
  getAllBuildings,
  getSingleBuilding,
  updateSingleBuilding,
  deleteSingleBuilding,
};
