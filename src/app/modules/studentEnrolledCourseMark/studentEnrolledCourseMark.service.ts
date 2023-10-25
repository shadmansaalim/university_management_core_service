// Imports
import {
  Course,
  ExamType,
  PrismaClient,
  StudentEnrolledCourse,
  StudentEnrolledCourseMark,
  StudentEnrolledCourseStatus,
} from '@prisma/client';
import {
  DefaultArgs,
  PrismaClientOptions,
} from '@prisma/client/runtime/library';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { PaginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { StudentEnrolledCourseMarkConstants } from './studentEnrolledCourseMark.constant';
import { IStudentEnrolledCourseMarkFilters } from './studentEnrolledCourseMark.interface';
import { StudentEnrolledCourseMarkUtils } from './studentEnrolledCourseMark.util';

// Giving student a default mark for enrolled course
const createStudentEnrolledCourseDefaultMark = async (
  prismaClient: Omit<
    PrismaClient<PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
  payload: {
    studentId: string;
    studentEnrolledCourseId: string;
    academicSemesterId: string;
  }
): Promise<void> => {
  // Finding MIDTERM exam data
  const isExitMidtermData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.MIDTERM,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });

  // Checking id MIDTERM exam data for this student exists or not
  if (!isExitMidtermData) {
    // Creating a data for MIDTERM
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload.studentEnrolledCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload.academicSemesterId,
          },
        },
        examType: ExamType.MIDTERM,
      },
    });
  }

  // Finding FINAL exam data
  const isExistFinalData =
    await prismaClient.studentEnrolledCourseMark.findFirst({
      where: {
        examType: ExamType.FINAL,
        student: {
          id: payload.studentId,
        },
        studentEnrolledCourse: {
          id: payload.studentEnrolledCourseId,
        },
        academicSemester: {
          id: payload.academicSemesterId,
        },
      },
    });

  // Checking id FINAL exam data for this student exists or not
  if (!isExistFinalData) {
    // Creating a data for FINAL
    await prismaClient.studentEnrolledCourseMark.create({
      data: {
        student: {
          connect: {
            id: payload.studentId,
          },
        },
        studentEnrolledCourse: {
          connect: {
            id: payload.studentEnrolledCourseId,
          },
        },
        academicSemester: {
          connect: {
            id: payload.academicSemesterId,
          },
        },
        examType: ExamType.FINAL,
      },
    });
  }
};

// Function to get all student enrolled course marks
const getAllStudentEnrolledCourseMarks = async (
  filters: IStudentEnrolledCourseMarkFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
  const { limit, page } =
    PaginationHelpers.calculatePagination(paginationOptions);

  // Getting all student enrolled course marks
  const marks = await prisma.studentEnrolledCourseMark.findMany({
    where: {
      student: {
        id: filters.studentId,
      },
      academicSemester: {
        id: filters.academicSemesterId,
      },
      studentEnrolledCourse: {
        course: {
          id: filters.courseId,
        },
      },
    },
    include: {
      studentEnrolledCourse: {
        include: {
          course: true,
        },
      },
      student: true,
    },
  });

  return {
    meta: {
      total: marks.length,
      page,
      limit,
    },
    data: marks,
  };
};

// Function to update student marks
const updateStudentMarks = async (payload: {
  studentId: string;
  academicSemesterId: string;
  courseId: string;
  examType: ExamType;
  marks: number;
}): Promise<StudentEnrolledCourseMark | null> => {
  const { studentId, academicSemesterId, courseId, examType, marks } = payload;

  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findFirst({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
        examType,
      },
    });

  // Throwing error if student enrolled course marks data does not exists
  if (!studentEnrolledCourseMarks) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student enrolled course mark does not exists.'
    );
  }
  const result = StudentEnrolledCourseMarkUtils.getGradeFromMarks(marks);

  return await prisma.studentEnrolledCourseMark.update({
    where: {
      id: studentEnrolledCourseMarks.id,
    },
    data: {
      marks,
      grade: result.grade,
    },
  });
};

// Function to evaluate student final gpa
const evaluateStudentFinalGpa = async (payload: {
  studentId: string;
  academicSemesterId: string;
  courseId: string;
}): Promise<(StudentEnrolledCourse & { course: Course })[] | null> => {
  const { studentId, academicSemesterId, courseId } = payload;

  const studentEnrolledCourse = await prisma.studentEnrolledCourse.findFirst({
    where: {
      student: {
        id: studentId,
      },
      academicSemester: {
        id: academicSemesterId,
      },
      course: {
        id: courseId,
      },
    },
  });

  // Throwing error if student enrolled course data does not exists
  if (!studentEnrolledCourse) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student enrolled course data not does not exists.'
    );
  }

  const studentEnrolledCourseMarks =
    await prisma.studentEnrolledCourseMark.findMany({
      where: {
        student: {
          id: studentId,
        },
        academicSemester: {
          id: academicSemesterId,
        },
        studentEnrolledCourse: {
          course: {
            id: courseId,
          },
        },
      },
    });

  // Throwing error if student enrolled course marks data does not exists
  if (!studentEnrolledCourseMarks.length) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Student enrolled course marks does not exists.'
    );
  }

  // Storing MIDTERM and FINAL marks
  const midTermMarks =
    studentEnrolledCourseMarks.find(item => item.examType === ExamType.MIDTERM)
      ?.marks || 0;
  const finalTermMarks =
    studentEnrolledCourseMarks.find(item => item.examType === ExamType.FINAL)
      ?.marks || 0;

  // Calculating final marks based on midterm and final marks weighting
  const totalFinalMarks =
    Math.ceil(
      midTermMarks * StudentEnrolledCourseMarkConstants.MarksWeight.midterm
    ) +
    Math.ceil(
      finalTermMarks * StudentEnrolledCourseMarkConstants.MarksWeight.final
    );

  // Getting grade with final marks
  const result =
    StudentEnrolledCourseMarkUtils.getGradeFromMarks(totalFinalMarks);

  // Updating student data for this semester with grade, point and marks
  await prisma.studentEnrolledCourse.updateMany({
    where: {
      student: {
        id: studentId,
      },
      academicSemester: {
        id: academicSemesterId,
      },
      course: {
        id: courseId,
      },
    },
    data: {
      grade: result.grade,
      point: result.point,
      totalMarks: totalFinalMarks,
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
  });

  // Getting student grades of those courses that he/she COMPLETED
  const grades = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        id: studentId,
      },
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
    include: {
      course: true,
    },
  });

  // Evaluating student GPA
  const academicResult = StudentEnrolledCourseMarkUtils.calcGPAAndGrade(
    grades as (StudentEnrolledCourse & { course: Course })[]
  );

  // Getting student academic info
  const studentAcademicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      student: {
        id: studentId,
      },
    },
  });

  // Checking if student academic info exists or not if not then creating otherwise updating
  if (studentAcademicInfo) {
    await prisma.studentAcademicInfo.update({
      where: {
        id: studentAcademicInfo.id,
      },
      data: {
        totalCompletedCredit: academicResult.totalCompletedCredit,
        gpa: academicResult.gpa,
      },
    });
  } else {
    await prisma.studentAcademicInfo.create({
      data: {
        student: {
          connect: {
            id: studentId,
          },
        },
        totalCompletedCredit: academicResult.totalCompletedCredit,
        gpa: academicResult.gpa,
      },
    });
  }

  return grades as (StudentEnrolledCourse & { course: Course })[];
};

// Function to my course marks
const getMyCourseMarks = async (
  authUserId: string,
  filters: IStudentEnrolledCourseMarkFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<StudentEnrolledCourseMark[]>> => {
  const { limit, page } =
    PaginationHelpers.calculatePagination(paginationOptions);

  const student = await prisma.student.findFirst({
    where: {
      studentId: authUserId,
    },
  });

  // Throwing error if student not found
  if (!student) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Student not found in our system.'
    );
  }

  // Getting all course marks for this student
  const marks = await prisma.studentEnrolledCourseMark.findMany({
    where: {
      student: {
        id: student.id,
      },
      academicSemester: {
        id: filters.academicSemesterId,
      },
      studentEnrolledCourse: {
        course: {
          id: filters.courseId,
        },
      },
    },
    include: {
      studentEnrolledCourse: {
        include: {
          course: true,
        },
      },
    },
  });

  return {
    meta: {
      total: marks.length,
      page,
      limit,
    },
    data: marks,
  };
};

export const StudentEnrolledCourseMarkService = {
  createStudentEnrolledCourseDefaultMark,
  getAllStudentEnrolledCourseMarks,
  updateStudentMarks,
  evaluateStudentFinalGpa,
  getMyCourseMarks,
};
