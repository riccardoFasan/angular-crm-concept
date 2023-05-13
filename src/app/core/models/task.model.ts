import { Priority, TaskStatus } from '../enums';

export interface Task {
  id?: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  deadline?: Date;
}
