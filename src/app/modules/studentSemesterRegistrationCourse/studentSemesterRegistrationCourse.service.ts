// Imports
import {
  Course,
  OfferedCourse,
  SemesterRegistrationStatus,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import prisma from '../../../shared/prisma';

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

  // Finding whether student has already enrolled into the course
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

  // Finding whether student has enrolled into the course
  const isStudentEnrolled =
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

  // Throwing error if student is not enrolled
  if (!isStudentEnrolled) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student has not enrolled into the course so withdrawing is not possible.'
    );
  }

  // Using transaction for efficiency as multiple database operations going on
  await prisma.$transaction(async transactionClient => {
    // Withdrawing the student from course
    await transactionClient.studentSemesterRegistrationCourse.delete({
      where: {
        semesterRegistrationId_studentId_offeredCourseId: {
          semesterRegistrationId: semesterRegistrationData?.id,
          studentId: studentData?.id,
          offeredCourseId: payload.offeredCourseId,
        },
      },
    });

    // Decrementing enrolled students count in offered course section table as we have withdrawn a student from the course
    await prisma.offeredCourseSection.update({
      where: {
        id: payload.offeredCourseSectionId,
      },
      data: {
        currentlyEnrolledStudent: {
          decrement: 1,
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
          decrement: (
            offeredCourse as OfferedCourse & {
              course: Course;
            }
          ).course.credits,
        },
      },
    });
  });

  return {
    message: 'Successfully withdrawn from course.',
  };
};

export const StudentSemesterRegistrationCourseService = {
  enrollIntoCourse,
  withdrawFromCourse,
};
