// Imports
import { RedisClient } from '../../../shared/redis';
import { StudentConstants } from './student.constant';
import { StudentService } from './student.service';

// Listening to student data from REDIS
const initStudentEvents = async () => {
  // Create
  await RedisClient.subscribe(
    StudentConstants.event_student_created,
    async (event: string) => {
      const data = JSON.parse(event);
      await StudentService.createStudentFromEvent(data);
    }
  );
};

export default initStudentEvents;
