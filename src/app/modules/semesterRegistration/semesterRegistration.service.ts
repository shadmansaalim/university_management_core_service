// Imports
import {
  Course,
  OfferedCourse,
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
      status: SemesterRegistrationStatus.ONGOING,
    },
  });

  // Throwing error if no ONGOING Semester
  if (!semesterRegistrationData) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no ONGOING Semester Registration.'
    );
  }

  // Finding the offered course
  const offeredCourse = await prisma.offeredCourse.findFirst({
    where: {
      id: payload.offeredCourseId,
    },
    include: {
      course: true,
    },
  });

  // Throwing error if offered course doesn't exists
  if (!offeredCourse) {
    throw new ApiError(httpStatus.NOT_FOUND, "Offered course doesn't exist.");
  }

  // Finding the offered course section
  const offeredCourseSection = await prisma.offeredCourseSection.findFirst({
    where: {
      id: payload.offeredCourseSectionId,
    },
  });

  // Throwing error if offered course section doesn't exists
  if (!offeredCourseSection) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Offered course section doesn't exist."
    );
  }

  // Throwing error if max capacity of the offered course section is fulfilled
  if (
    offeredCourseSection.maxCapacity &&
    offeredCourseSection.currentlyEnrolledStudent &&
    offeredCourseSection.currentlyEnrolledStudent >=
      offeredCourseSection.maxCapacity
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Sorry, we couldn't enroll you into the course as the offered course section capacity is full already."
    );
  }

  // Finding whether student has already registered semester registration
  const isStudentAlreadyEnrolled =
    await prisma.studentSemesterRegistrationCourse.findFirst({
      where: {
        student: {
          id: studentData?.id,
        },
        semesterRegistration: {
          id: semesterRegistrationData?.id,
        },
        offeredCourse: {
          id: payload.offeredCourseId,
        },
        offeredCourseSection: {
          id: payload.offeredCourseSectionId,
        },
      },
    });

  // Throwing error if student is already enrolled
  if (isStudentAlreadyEnrolled) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student has already enrolled into this course.'
    );
  }

  // Using transaction for efficiency as multiple database operations going on
  await prisma.$transaction(async transactionClient => {
    // Enrolling the student into course
    await transactionClient.studentSemesterRegistrationCourse.create({
      data: {
        studentId: studentData?.id,
        semesterRegistrationId: semesterRegistrationData?.id,
        offeredCourseId: payload.offeredCourseId,
        offeredCourseSectionId: payload.offeredCourseSectionId,
      },
    });

    // Incrementing enrolled students count in offered course section table as we enrolled new student into a course
    await prisma.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          increment: 1,
        },
      },
    });

    // Updating student's total credits taken number in student semester registration table
    await prisma.studentSemesterRegistration.updateMany({
      where: {
        student: {
          id: studentData.id,
        },
        semesterRegistration: {
          id: semesterRegistrationData.id,
        },
      },
      data: {
        totalCreditsTaken: {
          increment: (
            offeredCourse as OfferedCourse & {
              course: Course;
            }
          ).course.credits,
        },
      },
    });
  });

  return {
    message: 'Successfully enrolled into course.',
  };
};

export const SemesterRegistrationService = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSingleSemesterRegistration,
  deleteSingleSemesterRegistration,
  startMyRegistration,
  enrollIntoCourse,
};
