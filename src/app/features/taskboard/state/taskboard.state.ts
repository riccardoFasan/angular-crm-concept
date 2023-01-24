import { Task, SearchCriteria } from 'src/app/shared/models';

export interface TaskboardState {
  tasks: Task[];
  searchCriteria: SearchCriteria;
  count: number;
  loading: boolean;
}
