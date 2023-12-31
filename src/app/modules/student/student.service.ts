// Imports
import {
  Student,
  StudentEnrolledCourse,
  StudentEnrolledCourseStatus,
  StudentSemesterRegistrationCourse,
} from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { StudentConstants } from './student.constant';
import { IStudentFilters } from './student.interface';
import { StudentUtils } from './student.util';

// Function to create a student in database
const createStudent = async (data: Student): Promise<Student> => {
  const result = await prisma.student.create({
    data,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

// GET All Students Function
const getAllStudents = async (
  filters: IStudentFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Student[]>> => {
  // Getting all students
  const { page, limit, total, result } = await getAllDocuments<Student>(
    filters,
    paginationOptions,
    StudentConstants.searchableFields,
    prisma.student,
    StudentConstants.fieldsToInclude,
    StudentConstants.relationalFields,
    StudentConstants.relationalFieldsMapper
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

// GET Single Student Function
const getSingleStudent = async (id: string): Promise<Student | null> => {
  const result = await prisma.student.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

// Update Single Student Function
const updateSingleStudent = async (
  id: string,
  payload: Partial<Student>
): Promise<Student | null> => {
  // Updating student
  const result = await prisma.student.update({
    where: { id },
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

// Delete Single Student Function
const deleteSingleStudent = async (id: string): Promise<Student | null> => {
  // Deleting student
  const result = await prisma.student.delete({
    where: { id },
    include: {
      academicFaculty: true,
      academicDepartment: true,
      academicSemester: true,
    },
  });
  return result;
};

// GET student courses which he/she will take
const getMyCourses = async (
  authUserId: string,
  filter: {
    courseId?: string | undefined;
    academicSemesterId?: string | undefined;
  }
): Promise<StudentEnrolledCourse[]> => {
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    filter.academicSemesterId = currentSemester?.id;
  }

  return await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      ...filter,
    },
    include: {
      course: true,
    },
  });
};

// GET student course schedules
const getMyCourseSchedules = async (
  authUserId: string,
  filter: {
    courseId?: string | undefined;
    academicSemesterId?: string | undefined;
  }
): Promise<StudentSemesterRegistrationCourse[]> => {
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });
    filter.academicSemesterId = currentSemester?.id;
  }

  const studentEnrolledCourses = await getMyCourses(authUserId, filter);

  const studentEnrolledCourseIds = studentEnrolledCourses.map(
    item => item.courseId
  );

  const result = await prisma.studentSemesterRegistrationCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      semesterRegistration: {
        academicSemester: {
          id: filter.academicSemesterId,
        },
      },
      offeredCourse: {
        course: {
          id: {
            in: studentEnrolledCourseIds,
          },
        },
      },
    },
    include: {
      offeredCourse: {
        include: {
          course: true,
        },
      },
      offeredCourseSection: {
        include: {
          offeredCourseClassSchedules: {
            include: {
              room: {
                include: {
                  building: true,
                },
              },
              faculty: true,
            },
          },
        },
      },
    },
  });
  return result;
};

// GET student academic info
const getMyAcademicInfo = async (authUserId: string): Promise<any> => {
  const academicInfo = await prisma.studentAcademicInfo.findFirst({
    where: {
      student: {
        studentId: authUserId,
      },
    },
  });

  const enrolledCourses = await prisma.studentEnrolledCourse.findMany({
    where: {
      student: {
        studentId: authUserId,
      },
      status: StudentEnrolledCourseStatus.COMPLETED,
    },
    include: {
      course: true,
      academicSemester: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const groupByAcademicSemesterData =
    StudentUtils.groupByAcademicSemester(enrolledCourses);

  return {
    academicInfo,
    courses: groupByAcademicSemesterData,
  };
};

const createStudentFromEvent = async (event: any): Promise<void> => {
  const studentData: Partial<Student> = {
    studentId: event.id,
    firstName: event.name.firstName,
    lastName: event.name.lastName,
    middleName: event.name.middleName,
    email: event.email,
    contactNo: event.contactNo,
    gender: event.gender,
    bloodGroup: event.bloodGroup,
    academicSemesterId: event.academicSemester.syncId,
    academicDepartmentId: event.academicDepartment.syncId,
    academicFacultyId: event.academicFaculty.syncId,
  };

  await createStudent(studentData as Student);
};

const updateStudentFromEvent = async (e: any): Promise<void> => {
  const isExist = await prisma.student.findFirst({
    where: {
      studentId: e.id,
    },
  });

  if (!isExist) {
    await createStudentFromEvent(e);
    return;
  } else {
    const student: Partial<Student> = {
      studentId: e.id,
      firstName: e.name.firstName,
      lastName: e.name.lastName,
      middleName: e.name.middleName,
      profileImage: e.profileImage,
      email: e.email,
      contactNo: e.contactNo,
      gender: e.gender,
      bloodGroup: e.bloodGroup,
      academicDepartmentId: e.academicDepartment.syncId,
      academicFacultyId: e.academicFaculty.syncId,
      academicSemesterId: e.academicSemester.syncId,
    };
    await prisma.student.updateMany({
      where: {
        studentId: e.id,
      },
      data: student as Student,
    });
  }
};

export const StudentService = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  updateSingleStudent,
  deleteSingleStudent,
  getMyCourses,
  getMyCourseSchedules,
  getMyAcademicInfo,
  createStudentFromEvent,
  updateStudentFromEvent,
};
