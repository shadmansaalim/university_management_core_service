// Imports
import { Room } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { RoomConstants } from './room.constant';
import { IRoomFilters } from './room.interface';

// Create Room Function
const createRoom = async (data: Room): Promise<Room> => {
  const result = await prisma.room.create({
    data,
    include: {
      building: true,
    },
  });
  return result;
};

// GET All Rooms Function
const getAllRooms = async (
  filters: IRoomFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Room[]>> => {
  // Getting all rooms
  const { page, limit, total, result } = await getAllDocuments<Room>(
    filters,
    paginationOptions,
    RoomConstants.searchableFields,
    prisma.room,
    RoomConstants.fieldsToInclude,
    RoomConstants.relationalFields,
    RoomConstants.relationalFieldsMapper
  );

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// GET Single Room Function
const getSingleRoom = async (id: string): Promise<Room | null> => {
  const result = await prisma.room.findUnique({
    where: { id },
    include: {
      building: true,
    },
  });
  return result;
};

// Update Single Room Function
const updateSingleRoom = async (
  id: string,
  payload: Partial<Room>
): Promise<Room | null> => {
  const result = await prisma.room.update({
    where: {
      id,
    },
    data: payload,
    include: {
      building: true,
    },
  });
  return result;
};

// DELETE Single Room
const deleteSingleRoom = async (id: string): Promise<Room | null> => {
  // Deleting room
  const result = await prisma.room.delete({
    where: { id },
    include: {
      building: true,
    },
  });
  return result;
};

export const RoomService = {
  createRoom,
  getAllRooms,
  getSingleRoom,
  updateSingleRoom,
  deleteSingleRoom,
};
