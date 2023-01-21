import { Filters, Task } from '../models';

export interface TaskboardState {
  tasks: Task[];
  filters: Filters;
  loading: boolean;
  pageSize: number;
  page: number;
  count: number;
}
