// Imports
import { RedisClient } from '../../../shared/redis';
import { FacultyConstants } from './faculty.constant';
import { FacultyService } from './faculty.service';

// Listening to faculty data from REDIS
const initFacultyEvents = async () => {
  // Create
  await RedisClient.subscribe(
    FacultyConstants.event_faculty_created,
    async (event: string) => {
      const data = JSON.parse(event);
      await FacultyService.createFacultyFromEvent(data);
    }
  );
};

export default initFacultyEvents;
