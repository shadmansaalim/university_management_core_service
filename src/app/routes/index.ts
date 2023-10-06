// Imports
import express from 'express';
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route';
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route';
import { AcademicSemesterRoutes } from '../modules/academicSemester/academicSemester.route';
import { BuildingRoutes } from '../modules/building/building.route';
import { CourseRoutes } from '../modules/course/course.route';
import { FacultyRoutes } from '../modules/faculty/faculty.route';
import { OfferedCourseRoutes } from '../modules/offeredCourse/offeredCourse.route';
import { OfferedCourseClassScheduleRoutes } from '../modules/offeredCourseClassSchedule/offeredCourseClassSchedule.route';
import { OfferedCourseSectionRoutes } from '../modules/offeredCourseSection/offeredCourseSection.route';
import { RoomRoutes } from '../modules/room/room.route';
import { SemesterRegistrationRoutes } from '../modules/semesterRegistration/semesterRegistration.route';
import { StudentRoutes } from '../modules/student/student.route';
import { StudentEnrolledCourseRoutes } from '../modules/studentEnrolledCourse/studentEnrolledCourse.route';
import { StudentEnrolledCourseMarkRoutes } from '../modules/studentEnrolledCourseMark/studentEnrolledCourseMark.route';
import { StudentSemesterPaymentRoutes } from '../modules/studentSemesterPayment/studentSemesterPayment.route';
import { IModuleRoute } from './route.interface';

// Express router
const router = express.Router();

// App Module Routes
const moduleRoutes = [
  { path: '/students', route: StudentRoutes },
  { path: '/faculties', route: FacultyRoutes },
  { path: '/academic-semesters', route: AcademicSemesterRoutes },
  { path: '/academic-faculties', route: AcademicFacultyRoutes },
  { path: '/academic-departments', route: AcademicDepartmentRoutes },
  { path: '/buildings', route: BuildingRoutes },
  { path: '/rooms', route: RoomRoutes },
  { path: '/courses', route: CourseRoutes },
  { path: '/semester-registrations', route: SemesterRegistrationRoutes },
  { path: '/offered-courses', route: OfferedCourseRoutes },
  { path: '/offered-course-sections', route: OfferedCourseSectionRoutes },
  {
    path: '/offered-course-class-schedules',
    route: OfferedCourseClassScheduleRoutes,
  },
  {
    path: '/student-enrolled-courses',
    route: StudentEnrolledCourseRoutes,
  },
  {
    path: '/student-enrolled-course-marks',
    route: StudentEnrolledCourseMarkRoutes,
  },
  {
    path: '/student-semester-payments',
    route: StudentSemesterPaymentRoutes,
  },
];

// Application Routes
moduleRoutes.forEach((moduleRoute: IModuleRoute) => {
  router.use(moduleRoute?.path, moduleRoute?.route);
});

export default router;
