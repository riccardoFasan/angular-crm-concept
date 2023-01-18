import { Filters, Task } from '../models';

export interface TaskboardState {
  tasks: Task[];
  filters: Filters;
  loading: boolean;
}
