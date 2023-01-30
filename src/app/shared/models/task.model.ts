import { Priority, Status } from '../enums';

export interface Task {
  id?: string;
  description: string;
  status: Status;
  priority: Priority;
  deadline?: Date;
}
