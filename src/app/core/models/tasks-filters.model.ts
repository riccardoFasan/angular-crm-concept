import { Priority, TaskStatus } from '../enums';

export interface TasksFilters {
  description?: string;
  status?: TaskStatus;
  priority?: Priority;
  deadline?: Date;
}
