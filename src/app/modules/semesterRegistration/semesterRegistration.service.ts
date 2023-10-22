// Imports
import {
  AcademicSemester,
  Course,
  OfferedCourse,
  SemesterRegistration,
  SemesterRegistrationStatus,
  StudentEnrolledCourseStatus,
  StudentSemesterRegistration,
  StudentSemesterRegistrationCourse,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { asyncForEach } from '../../../shared/utils';
import { StudentEnrolledCourseMarkService } from '../studentEnrolledCourseMark/studentEnrolledCourseMark.service';
import { StudentSemesterPaymentConstants } from '../studentSemesterPayment/studentSemesterPayment.constant';
import { StudentSemesterPaymentService } from '../studentSemesterPayment/studentSemesterPayment.service';
import { StudentSemesterRegistrationCourseService } from '../studentSemesterRegistrationCourse/studentSemesterRegistrationCourse.service';
import { SemesterRegistrationConstants } from './semesterRegistration.constant';
import { ISemesterRegistrationFilters } from './semesterRegistration.interface';
import { SemesterRegistrationUtils } from './semesterRegistration.util';

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

// Starting a semester
const startNewSemester = async (
  id: string
): Promise<{
  message: string;
}> => {
  // Getting semester registration data
  const semesterRegistrationData = await prisma.semesterRegistration.findUnique(
    {
      where: {
        id,
      },
      include: {
        academicSemester: true,
      },
    }
  );

  // Throwing error if semester registration data not found
  if (!semesterRegistrationData) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semester Registration not found in our system.'
    );
  }

  // Throwing error if admin tries to start a semester which registration has not ended yet
  if (semesterRegistrationData.status !== SemesterRegistrationStatus.ENDED) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Semester Registration has not ENDED yet.'
    );
  }

  // Throwing error if semester has already started
  if (
    (
      semesterRegistrationData as SemesterRegistration & {
        academicSemester: AcademicSemester;
      }
    ).academicSemester.isCurrent
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'The semester you are trying to start has already started.'
    );
  }

  // Using transaction for efficiency as multiple database operations going on
  await prisma.$transaction(async prismaTransactionClient => {
    // Ending all the semesters that are running now by marking field isCurrent field as false
    await prismaTransactionClient.academicSemester.updateMany({
      where: {
        isCurrent: true,
      },
      data: {
        isCurrent: false,
      },
    });

    // Starting the semester by marking its isCurrent field as true
    await prismaTransactionClient.academicSemester.update({
      where: {
        id: semesterRegistrationData.academicSemesterId,
      },
      data: {
        isCurrent: true,
      },
    });

    // Finding student semester registrations data
    const studentSemesterRegistrationsData =
      await prisma.studentSemesterRegistration.findMany({
        where: {
          semesterRegistration: {
            id,
          },
          isConfirmed: true,
        },
      });

    // Iterating over student semester registrations
    await asyncForEach(
      studentSemesterRegistrationsData,
      async (studentSemReg: StudentSemesterRegistration) => {
        if (studentSemReg.totalCreditsTaken) {
          // Total amount student need to pay this semester
          const totalSemesterPaymentAmount =
            studentSemReg.totalCreditsTaken *
            StudentSemesterPaymentConstants.perCreditFee;

          // Creating semester payment for the student
          await StudentSemesterPaymentService.createSemesterPayment(
            prismaTransactionClient,
            {
              studentId: studentSemReg.studentId,
              academicSemesterId: semesterRegistrationData.academicSemesterId,
              totalPaymentAmount: totalSemesterPaymentAmount,
            }
          );
        }
        // Finding the courses that this student took
        const studentSemesterRegistrationCourses =
          await prismaTransactionClient.studentSemesterRegistrationCourse.findMany(
            {
              where: {
                semesterRegistration: {
                  id,
                },
                student: {
                  id: studentSemReg.studentId,
                },
              },
              include: {
                offeredCourse: {
                  include: {
                    course: true,
                  },
                },
              },
            }
          );

        // Iterating over student semester registration courses
        await asyncForEach(
          studentSemesterRegistrationCourses,
          async (
            item: StudentSemesterRegistrationCourse & {
              offeredCourse: OfferedCourse & { course: Course };
            }
          ) => {
            // Finding enrolled data for this course and student id
            const isExistEnrolledData =
              await prismaTransactionClient.studentEnrolledCourse.findFirst({
                where: {
                  student: { id: item.studentId },
                  course: { id: item.offeredCourse.courseId },
                  academicSemester: {
                    id: semesterRegistrationData.academicSemesterId,
                  },
                },
              });

            // Checking whether student's enrolled data for this course is already inserted or not
            if (!isExistEnrolledData) {
              // Enrolled Course Data for the student
              const enrolledCourseData = {
                studentId: item.studentId,
                courseId: item.offeredCourse.courseId,
                academicSemesterId: semesterRegistrationData.academicSemesterId,
              };

              // Storing student's enrolled course data in table
              const studentEnrolledCourseData =
                await prismaTransactionClient.studentEnrolledCourse.create({
                  data: enrolledCourseData,
                });

              // Creating default mark for this student in this course
              await StudentEnrolledCourseMarkService.createStudentEnrolledCourseDefaultMark(
                prismaTransactionClient,
                {
                  studentId: item.studentId,
                  studentEnrolledCourseId: studentEnrolledCourseData.id,
                  academicSemesterId:
                    semesterRegistrationData.academicSemesterId,
                }
              );
            }
          }
        );
      }
    );
  });

  return {
    message: 'Semester started successfully.',
  };
};

// Function to get student semester registration courses that he is eligible to take
const getMySemesterRegCourses = async (authUserId: string): Promise<void> => {
  const studentData = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  // Throwing error if student data not found
  if (!studentData) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Student does not exists in our system.'
    );
  }

  const semesterRegistrationData = await prisma.semesterRegistration.findFirst({
    where: {
      status: {
        in: [
          SemesterRegistrationStatus.UPCOMING,
          SemesterRegistrationStatus.ONGOING,
        ],
      },
    },
    include: {
      academicSemester: true,
    },
  });

  // Throwing error if semester registration data not found
  if (!semesterRegistrationData) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no UPCOMING or ONGOING semester registration at the moment.'
    );
  }

  // Finding the courses that student completed
  const studentCompletedCourses = await prisma.studentEnrolledCourse.findMany({
    where: {
      status: StudentEnrolledCourseStatus.COMPLETED,
      student: {
        id: studentData?.id,
      },
    },
    include: {
      course: true,
    },
  });

  const studentCurrentSemesterTakenCourses =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        student: {
          id: studentData?.id,
        },
        semesterRegistration: {
          id: semesterRegistrationData?.id,
        },
      },
      include: {
        offeredCourse: true,
        offeredCourseSection: true,
      },
    });

  const offeredCourses = await prisma.offeredCourse.findMany({
    where: {
      semesterRegistration: {
        id: semesterRegistrationData.id,
      },
      academicDepartment: {
        id: studentData?.academicDepartmentId,
      },
    },
    include: {
      course: {
        include: {
          preRequisite: {
            include: {
              preRequisite: true,
            },
          },
        },
      },
      offeredCourseSections: {
        include: {
          offeredCourseClassSchedules: {
            include: {
              room: {
                include: {
                  building: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const availableCourses = SemesterRegistrationUtils.getAvailableCourses(
    offeredCourses,
    studentCompletedCourses,
    studentCurrentSemesterTakenCourses
  );
  return availableCourses;
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
  startNewSemester,
  getMySemesterRegCourses,
};
