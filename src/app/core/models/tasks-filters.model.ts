import { Priority, Status } from '../enums';

export interface TasksFilters {
  description?: string;
  status?: Status;
  priority?: Priority;
  deadline?: Date;
}
