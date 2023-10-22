// Imports
import { CourseFaculty, Faculty } from '@prisma/client';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import getAllDocuments from '../../../shared/getAllDocuments';
import prisma from '../../../shared/prisma';
import { FacultyConstants } from './faculty.constant';
import { IFacultyFilters } from './faculty.interface';

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
  authUser: {
    id: string;
    role: string;
  },
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
            facultyId: authUser.id,
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

export const FacultyService = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateSingleFaculty,
  deleteSingleFaculty,
  assignCoursesToFaculty,
  removeCoursesFromFaculty,
  getMyCourses,
};
