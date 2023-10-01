// Searchable fields to GET rooms
const searchableFields = ['title'];

// Searching and Filtering Fields
const filterableFields = ['searchTerm'];

// Fields to populate in room data
const fieldsToInclude = ['building'];

const relationalFields: string[] = ['buildingId'];

const relationalFieldsMapper: { [key: string]: string } = {
  buildingId: 'building',
};

export const RoomConstants = {
  searchableFields,
  filterableFields,
  fieldsToInclude,
  relationalFields,
  relationalFieldsMapper,
};
