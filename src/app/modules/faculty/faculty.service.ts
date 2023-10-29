// Imports
import {
  CourseFaculty,
  Faculty,
  OfferedCourseSection,
  Student,
} from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { PaginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { FacultyConstants } from './faculty.constant';
import {
  FacultyCreatedEvent,
  IFacultyFilters,
  IFacultyMyCourseStudentsFilters,
} from './faculty.interface';

// Function to create a faculty in database
const createFaculty = async (data: Faculty): Promise<Faculty> => {
  const result = await prisma.faculty.create({
    data,
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

// GET All Faculties Function
const getAllFaculties = async (
  filters: IFacultyFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<Faculty[]>> => {
  // Getting all faculties
  const { page, limit, total, result } = await getAllDocuments<Faculty>(
    filters,
    paginationOptions,
    FacultyConstants.searchableFields,
    prisma.faculty,
    FacultyConstants.fieldsToInclude,
    FacultyConstants.relationalFields,
    FacultyConstants.relationalFieldsMapper
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

// GET Single Faculty Function
const getSingleFaculty = async (id: string): Promise<Faculty | null> => {
  const result = await prisma.faculty.findUnique({
    where: {
      id,
    },
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

// Update Single Faculty Function
const updateSingleFaculty = async (
  id: string,
  payload: Partial<Faculty>
): Promise<Faculty | null> => {
  // Updating faculty
  const result = await prisma.faculty.update({
    where: { id },
    data: payload,
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

// Delete Single Faculty Function
const deleteSingleFaculty = async (id: string): Promise<Faculty | null> => {
  // Deleting Faculty
  const result = await prisma.faculty.delete({
    where: { id },
    include: {
      academicFaculty: true,
      academicDepartment: true,
    },
  });
  return result;
};

// Assign courses to a faculty function
const assignCoursesToFaculty = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[]> => {
  await prisma.courseFaculty.createMany({
    data: payload.map(courseId => ({
      facultyId: id,
      courseId,
    })),
  });

  return await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });
};

// Remove courses from a faculty function
const removeCoursesFromFaculty = async (
  id: string,
  payload: string[]
): Promise<CourseFaculty[] | null> => {
  await prisma.courseFaculty.deleteMany({
    where: {
      facultyId: id,
      courseId: {
        in: payload,
      },
    },
  });

  return await prisma.courseFaculty.findMany({
    where: {
      facultyId: id,
    },
    include: {
      course: true,
    },
  });
};

// GET faculty courses which he/she will take
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getMyCourses = async (
  authUserId: string,
  filter: {
    academicSemesterId?: string | null | undefined;
    courseId?: string | null | undefined;
  }
) => {
  if (!filter.academicSemesterId) {
    const currentSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    filter.academicSemesterId = currentSemester?.id;
  }

  // Getting offered course sections
  const offeredCourseSections = await prisma.offeredCourseSection.findMany({
    where: {
      offeredCourseClassSchedules: {
        some: {
          faculty: {
            facultyId: authUserId,
          },
        },
      },
      offeredCourse: {
        semesterRegistration: {
          academicSemester: {
            id: filter.academicSemesterId,
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
  });

  const courseAndSchedule = offeredCourseSections.reduce(
    (acc: any, obj: any) => {
      const course = obj.offeredCourse.course;
      const classSchedules = obj.offeredCourseClassSchedules;

      const existingCourse = acc.find(
        (item: any) => item.course?.id === course?.id
      );
      if (existingCourse) {
        existingCourse.sections.push({
          section: obj,
          classSchedules,
        });
      } else {
        acc.push({
          course,
          sections: [
            {
              section: obj,
              classSchedules,
            },
          ],
        });
      }
      return acc;
    },
    []
  );

  return courseAndSchedule;
};

// Faculty GET his course students
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const getMyCourseStudents = async (
  authUserId: string,
  filter: IFacultyMyCourseStudentsFilters,
  paginationOptions: IPaginationOptions
) => {
  // Finding the faculty that requested
  const faculty = await prisma.faculty.findFirst({
    where: {
      facultyId: authUserId,
    },
  });

  // Throwing error if faculty does not exists.
  if (!faculty) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Faculty requested does not exist in our system.'
    );
  }

  const { limit, page, skip } =
    PaginationHelpers.calculatePagination(paginationOptions);

  if (!filter.academicSemesterId) {
    const currentAcademicSemester = await prisma.academicSemester.findFirst({
      where: {
        isCurrent: true,
      },
    });

    if (currentAcademicSemester) {
      filter.academicSemesterId = currentAcademicSemester.id;
    }
  }

  const offeredCourseSections =
    await prisma.studentSemesterRegistrationCourse.findMany({
      where: {
        offeredCourse: {
          course: {
            id: filter.courseId,
            faculties: {
              some: {
                facultyId: faculty.id,
              },
            },
          },
        },
        offeredCourseSection: {
          offeredCourse: {
            semesterRegistration: {
              academicSemester: {
                id: filter.academicSemesterId,
              },
            },
          },
          id: filter.offeredCourseSectionId,
        },
      },
      include: {
        student: true,
      },
      take: limit,
      skip,
    });

  const students = (
    offeredCourseSections as unknown as (OfferedCourseSection & {
      student: Student;
    })[]
  ).map(offeredCourseSection => offeredCourseSection.student);

  return {
    meta: {
      total: offeredCourseSections.length,
      page,
      limit,
    },
    data: students,
  };
};

const createFacultyFromEvent = async (
  e: FacultyCreatedEvent
): Promise<void> => {
  const faculty: Partial<Faculty> = {
    facultyId: e.id,
    firstName: e.name.firstName,
    lastName: e.name.lastName,
    middleName: e.name.middleName,
    profileImage: e.profileImage,
    email: e.email,
    contactNo: e.contactNo,
    gender: e.gender,
    bloodGroup: e.bloodGroup,
    designation: e.designation,
    academicDepartmentId: e.academicDepartment.syncId,
    academicFacultyId: e.academicFaculty.syncId,
  };

  await createFaculty(faculty as Faculty);
};

export const FacultyService = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateSingleFaculty,
  deleteSingleFaculty,
  assignCoursesToFaculty,
  removeCoursesFromFaculty,
  getMyCourses,
  getMyCourseStudents,
  createFacultyFromEvent,
};
