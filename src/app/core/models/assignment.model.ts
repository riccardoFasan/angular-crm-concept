import { AssignmentRole } from '../enums';
import { Task } from './task.model';

export interface Assignment {
  task: Task;
  role: AssignmentRole;
  assignedAt: Date; // handled automatically
  fromDate: Date;
  dueDate: Date;
}
