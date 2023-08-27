// Imports
import { Building } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { BuildingConstants } from './building.constant';
import { IBuildingFilters } from './building.interface';

// Create Building Function
const createBuilding = async (data: Building): Promise<Building> => {
  const result = await prisma.building.create({ data });
  return result;
};

// GET All Buildings Function
const getAllBuildings = async (
  filters: IBuildingFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Building[]>> => {
  // Getting all buildings
  const { page, limit, total, result } = await getAllDocuments<Building>(
    filters,
    paginationOptions,
    BuildingConstants.searchableFields,
    prisma.building
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

// GET Single Building Function
const getSingleBuilding = async (id: string): Promise<Building | null> => {
  const result = await prisma.building.findUnique({ where: { id } });
  return result;
};

// Update Single Building Function
const updateSingleBuilding = async (
  id: string,
  payload: Partial<Building>
): Promise<Building | null> => {
  const result = await prisma.building.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

// DELETE Single Building
const deleteSingleBuilding = async (id: string): Promise<Building | null> => {
  // Deleting building
  const result = await prisma.building.delete({
    where: { id },
  });
  return result;
};

export const BuildingService = {
  createBuilding,
  getAllBuildings,
  getSingleBuilding,
  updateSingleBuilding,
  deleteSingleBuilding,
};
