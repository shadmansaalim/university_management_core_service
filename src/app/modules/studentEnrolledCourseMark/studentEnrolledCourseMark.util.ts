// Imports
import { Course, StudentEnrolledCourse } from '@prisma/client';

// Function to get grade from marks
const getGradeFromMarks = (
  marks: number
): {
  grade: string;
  point: number;
} => {
  let result = {
    grade: '',
    point: 0,
  };
  if (marks >= 0 && marks < 50) {
    result = {
      grade: 'F',
      point: 0,
    };
  } else if (marks >= 50 && marks < 60) {
    result = {
      grade: 'PA',
      point: 1.0,
    };
  } else if (marks >= 60 && marks < 70) {
    result = {
      grade: 'CR',
      point: 2.0,
    };
  } else if (marks >= 70 && marks < 80) {
    result = {
      grade: 'D',
      point: 3.0,
    };
  } else if (marks >= 80 && marks <= 100) {
    result = {
      grade: 'HD',
      point: 4.0,
    };
  }

  return result;
};

// Function to calculate GPA
const calcGPAAndGrade = (
  payload: (StudentEnrolledCourse & { course: Course })[]
): {
  totalCompletedCredit: number;
  gpa: number;
} => {
  if (payload.length === 0) {
    return {
      totalCompletedCredit: 0,
      gpa: 0,
    };
  }

  let totalCredit = 0;
  let totalGPA = 0;

  for (const grade of payload) {
    totalGPA += grade.point || 0;
    totalCredit += grade.course.credits || 0;
  }

  const avgGPA = Number((totalGPA / payload.length).toFixed(2));

  return {
    totalCompletedCredit: totalCredit,
    gpa: avgGPA,
  };
};

export const StudentEnrolledCourseMarkUtils = {
  getGradeFromMarks,
  calcGPAAndGrade,
};
