// Imports
import { PrismaClient, StudentSemesterPayment } from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { StudentSemesterPaymentConstants } from './studentSemesterPayment.constant';
import { IStudentSemesterPaymentFilters } from './studentSemesterPayment.interface';

// Function to enroll student into course
const createSemesterPayment = async (
  prismaClient: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: {
    studentId: string;
    academicSemesterId: string;
    totalPaymentAmount: number;
  }
): Promise<void> => {
  // Finding whether student semester payment data
  const isExist = await prismaClient.studentSemesterPayment.findFirst({
    where: {
      student: {
        id: payload.studentId,
      },
      academicSemester: {
        id: payload.academicSemesterId,
      },
    },
  });

  // Checking whether student semester payment data already exists or not
  if (!isExist) {
    // Student semester payment data
    const dataToInsert = {
      studentId: payload.studentId,
      academicSemesterId: payload.academicSemesterId,
      fullPaymentAmount: payload.totalPaymentAmount,
      partialPaymentAmount:
        payload.totalPaymentAmount *
        StudentSemesterPaymentConstants.partialPaymentPercentage,
      totalDueAmount: payload.totalPaymentAmount,
      totalPaidAmount: 0,
    };

    await prismaClient.studentSemesterPayment.create({
      data: dataToInsert,
    });
  }
};

// Function to get all student semester payments
const getAllStudentSemesterPayments = async (
  filters: IStudentSemesterPaymentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<StudentSemesterPayment[]>> => {
  // Getting all student semester payments
  const { page, limit, total, result } =
    await getAllDocuments<StudentSemesterPayment>(
      filters,
      paginationOptions,
      StudentSemesterPaymentConstants.searchableFields,
      prisma.studentSemesterPayment,
      StudentSemesterPaymentConstants.fieldsToInclude,
      StudentSemesterPaymentConstants.relationalFields,
      StudentSemesterPaymentConstants.relationalFieldsMapper
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

export const StudentSemesterPaymentService = {
  createSemesterPayment,
  getAllStudentSemesterPayments,
};
