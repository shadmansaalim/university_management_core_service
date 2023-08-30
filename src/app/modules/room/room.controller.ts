// Imports
import { Room } from '@prisma/client';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { PaginationConstants } from '../../../constants/pagination';
import catchAsync from '../../../shared/catchAsync';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { RoomConstants } from './room.constant';
import { RoomService } from './room.service';

// Function that works when create room POST API hits
const createRoom = catchAsync(async (req: Request, res: Response) => {
  const result = await RoomService.createRoom(req.body);

  // Sending API Response
  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room created successfully.',
    data: result,
  });
});

// Function to GET All Rooms
const getAllRooms = catchAsync(async (req: Request, res: Response) => {
  // Making a filter options object
  const filters = pick(req.query, RoomConstants.filterableFields);

  // Making a pagination options object
  const paginationOptions = pick(req.query, PaginationConstants.fields);

  // Getting all rooms based on request
  const result = await RoomService.getAllRooms(filters, paginationOptions);

  // Sending API Response
  sendResponse<Room[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rooms retrieved successfully.',
    meta: result?.meta,
    data: result?.data,
  });
});

// Function to GET Single Room
const getSingleRoom = catchAsync(async (req: Request, res: Response) => {
  // Getting room id from params
  const id = req.params.id;
  const result = await RoomService.getSingleRoom(id);

  // Sending API Response
  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Room retrieved successfully.',
    data: result,
  });
});

// Function to update room
const updateSingleRoom = catchAsync(async (req: Request, res: Response) => {
  // Getting room id from params
  const id = req.params.id;
  // Getting updated data
  const updatedData = req.body;

  const result = await RoomService.updateSingleRoom(id, updatedData);

  // Sending API Response
  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room updated successfully.',
    data: result,
  });
});

// Function to delete room
const deleteSingleRoom = catchAsync(async (req: Request, res: Response) => {
  // Getting room id from params
  const id = req.params.id;

  const result = await RoomService.deleteSingleRoom(id);

  // Sending API Response
  sendResponse<Room>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Room deleted successfully.',
    data: result,
  });
});

export const RoomController = {
  createRoom,
  getAllRooms,
  getSingleRoom,
  updateSingleRoom,
  deleteSingleRoom,
};
