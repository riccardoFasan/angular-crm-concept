import { Task, SearchCriteria } from '../models';

export interface TaskboardState {
  tasks: Task[];
  searchCriteria: SearchCriteria;
  count: number;
  loading: boolean;
}
