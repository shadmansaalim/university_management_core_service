// Imports
import {
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentSemesterRegistration,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { StudentSemesterRegistrationCourseService } from '../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.service';
import { SemesterRegistrationConstants } from './semesterRegistration.constant';
import { ISemesterRegistrationFilters } from './semesterRegistration.interface';

// Create Semester Registration Function
const createSemesterRegistration = async (
  data: SemesterRegistration
): Promise<SemesterRegistration> => {
  // Finding whether any semester registration is upcoming or ongoing
  const isAnySemesterRegUpcomingOrOngoing =
    await prisma.semesterRegistration.findFirst({
      where: {
        OR: [
          {
            status: SemesterRegistrationStatus.UPCOMING,
          },
          {
            status: SemesterRegistrationStatus.ONGOING,
          },
        ],
      },
    });

  // Throwing error if any semester registration is upcoming or ongoing
  if (isAnySemesterRegUpcomingOrOngoing) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `There is already an ${isAnySemesterRegUpcomingOrOngoing.status} semester registration.`
    );
  }

  // Creating Semester Registration
  return await prisma.semesterRegistration.create({ data });
};

// GET All Semester Registrations Function
const getAllSemesterRegistrations = async (
  filters: ISemesterRegistrationFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<SemesterRegistration[]>> => {
  // Getting all semester registrations
  const { page, limit, total, result } =
    await getAllDocuments<SemesterRegistration>(
      filters,
      paginationOptions,
      SemesterRegistrationConstants.searchableFields,
      prisma.semesterRegistration,
      SemesterRegistrationConstants.fieldsToInclude,
      SemesterRegistrationConstants.relationalFields,
      SemesterRegistrationConstants.relationalFieldsMapper
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

// GET Single Semester Registration Function
const getSingleSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  return await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
};

// UPDATE Single Semester Registration
const updateSingleSemesterRegistration = async (
  id: string,
  payload: Partial<SemesterRegistration>
): Promise<SemesterRegistration> => {
  // Finding semester registration
  const exists = await prisma.semesterRegistration.findUnique({
    where: {
      id,
    },
  });

  // Checking whether semester registration exists or not
  if (!exists) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid Semester Registration');
  }

  // Enforcing rules to change semester registration status
  if (
    payload.status &&
    exists.status === SemesterRegistrationStatus.UPCOMING &&
    payload.status !== SemesterRegistrationStatus.ONGOING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You can only change semester registration status from UPCOMING to ONGOING.'
    );
  }

  if (
    payload.status &&
    exists.status === SemesterRegistrationStatus.ONGOING &&
    payload.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You can only change semester registration status from ONGOING to ENDED.'
    );
  }

  if (
    payload.status &&
    exists.status === SemesterRegistrationStatus.ENDED &&
    payload.status !== SemesterRegistrationStatus.ENDED
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You can change the status of a semester registration which is already ENDED.'
    );
  }

  return await prisma.semesterRegistration.update({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
    data: payload,
  });
};

// DELETE Single Semester Registration
const deleteSingleSemesterRegistration = async (
  id: string
): Promise<SemesterRegistration | null> => {
  return await prisma.semesterRegistration.delete({
    where: {
      id,
    },
    include: {
      academicSemester: true,
    },
  });
};

// Function to start student semester registration
const startMyRegistration = async (
  authUserId: string
): Promise<{
  semesterRegistration: SemesterRegistration | null;
  studentSemesterRegistration: StudentSemesterRegistration | null;
}> => {
  // Getting student data
  const studentData = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  // Throwing error if student data is not found
  if (!studentData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student data not found.');
  }

  // Finding ONGOING or UPCOMING Semester Registration
  const semesterRegistrationData = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.ONGOING,
          SemesterRegistrationStatus.UPCOMING,
        ],
      },
    },
  });

  // Throwing error if student tries to register in UPCOMING semester registration
  if (
    semesterRegistrationData?.status === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semester Registration has not started yet.'
    );
  }

  // Finding whether student has already registered semester registration
  let studentRegistration = await prisma.studentSemesterRegistration.findFirst({
    where: {
      student: {
        id: studentData?.id,
      },
      semesterRegistration: {
        id: semesterRegistrationData?.id,
      },
    },
  });

  // Checking whether student has registered previously or not
  if (!studentRegistration) {
    // Creating data in student semester registration to START student semester registration
    studentRegistration = await prisma.studentSemesterRegistration.create({
      data: {
        student: {
          connect: {
            id: studentData?.id,
          },
        },
        semesterRegistration: {
          connect: {
            id: semesterRegistrationData?.id,
          },
        },
      },
      include: {
        student: true,
      },
    });
  }

  return {
    semesterRegistration: semesterRegistrationData,
    studentSemesterRegistration: studentRegistration,
  };
};

// Function to enroll student into course
const enrollIntoCourse = async (
  authUserId: string,
  payload: {
    offeredCourseId: string;
    offeredCourseSectionId: string;
  }
): Promise<{
  message: string;
}> => {
  return await StudentSemesterRegistrationCourseService.enrollIntoCourse(
    authUserId,
    payload
  );
};

// Function to withdraw student from a course
const withdrawFromCourse = async (
  authUserId: string,
  payload: {
    offeredCourseId: string;
    offeredCourseSectionId: string;
  }
): Promise<{
  message: string;
}> => {
  return await StudentSemesterRegistrationCourseService.withdrawFromCourse(
    authUserId,
    payload
  );
};

// Function to confirm student registration
const confirmMyRegistration = async (
  authUserId: string
): Promise<{
  message: string;
}> => {
  // Finding ONGOING Semester Registration
  const semesterRegistrationData = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  // Throwing error if no ONGOING Semester
  if (!semesterRegistrationData) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no ONGOING Semester Registration that you can CONFIRM.'
    );
  }

  // Finding student semester registration data
  const studentSemesterRegistrationData =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistrationData?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
    });

  // Throwing error if student semester registration data is not found
  if (!studentSemesterRegistrationData) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not recognized by the system for this semester.'
    );
  }

  // Throwing error if student has not taken any course this semester
  if (studentSemesterRegistrationData.totalCreditsTaken === 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You are not enrolled in any course for this semester registration so nothing to confirm.'
    );
  }

  // Throwing error if student tries to take less/more credits than requirement
  if (
    studentSemesterRegistrationData.totalCreditsTaken &&
    semesterRegistrationData?.minCredit &&
    semesterRegistrationData?.maxCredit &&
    (studentSemesterRegistrationData.totalCreditsTaken <
      semesterRegistrationData?.minCredit ||
      studentSemesterRegistrationData.totalCreditsTaken >
        semesterRegistrationData?.maxCredit)
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `You can take only ${semesterRegistrationData.minCredit} to ${semesterRegistrationData.maxCredit} credits. You cannot neither reduce your study load nor overload it.`
    );
  }

  // Confirming student semester registration
  await prisma.studentSemesterRegistration.update({
    where: {
      id: studentSemesterRegistrationData.id,
    },
    data: {
      isConfirmed: true,
    },
  });

  return {
    message:
      'Your registration has been confirmed. Best of luck for your semester.',
  };
};

// Function to get student registration data
const getMyRegistration = async (
  authUserId: string
): Promise<{
  semesterRegistrationData: SemesterRegistration | null;
  studentSemesterRegistrationData: StudentSemesterRegistration | null;
}> => {
  // Finding ONGOING Semester Registration
  const semesterRegistrationData = await prisma.semesterRegistration.findFirst({
    where: {
      status: SemesterRegistrationStatus.ONGOING,
    },
    include: {
      academicSemester: true,
    },
  });

  // Finding student semester registration data
  const studentSemesterRegistrationData =
    await prisma.studentSemesterRegistration.findFirst({
      where: {
        semesterRegistration: {
          id: semesterRegistrationData?.id,
        },
        student: {
          studentId: authUserId,
        },
      },
      include: {
        student: true,
      },
    });

  return { semesterRegistrationData, studentSemesterRegistrationData };
};

export const SemesterRegistrationService = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSingleSemesterRegistration,
  deleteSingleSemesterRegistration,
  startMyRegistration,
  enrollIntoCourse,
  withdrawFromCourse,
  confirmMyRegistration,
  getMyRegistration,
};
