import { Priority, Status } from '../enums';

export interface Filters {
  description?: string;
  status?: Status;
  priority?: Priority;
  deadline?: Date;
}
