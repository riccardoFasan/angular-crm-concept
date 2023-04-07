import { Task, SearchCriteria } from 'src/app/core/models';

export interface TaskboardState {
  tasks: Task[];
  searchCriteria: SearchCriteria;
  count: number;
  loading: boolean;
  error?: string;
}

export const INITIAL_TASKBOARD_STATE: TaskboardState = {
  tasks: [],
  count: 0,
  searchCriteria: {
    filters: {},
    pagination: {
      pageSize: 5,
      pageIndex: 0,
    },
  },
  loading: false,
};
