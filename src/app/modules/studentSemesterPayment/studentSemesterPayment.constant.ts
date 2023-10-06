// Per credit fee
const perCreditFee = 5000;

// Based on our system we will be accepting half (50%) partial semester payment
const partialPaymentPercentage = 0.5;

// Searchable fields to GET student semester payments
const searchableFields: string[] = [];

// Searching and Filtering Fields
const filterableFields = ['academicSemesterId', 'studentId'];

// Fields to populate in student semester payment data
const fieldsToInclude = ['academicSemester'];

const relationalFields: string[] = ['academicSemesterId', 'studentId'];
const relationalFieldsMapper: {
  [key: string]: string;
} = {
  academicSemesterId: 'academicSemester',
  studentId: 'student',
};

export const StudentSemesterPaymentConstants = {
  perCreditFee,
  partialPaymentPercentage,
  searchableFields,
  filterableFields,
  fieldsToInclude,
  relationalFields,
  relationalFieldsMapper,
};
