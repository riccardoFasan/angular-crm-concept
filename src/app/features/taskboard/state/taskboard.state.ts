import { Task, SearchCriteria } from 'src/app/shared/models';

export interface TaskboardState {
  tasks: Task[];
  searchCriteria: SearchCriteria;
  count: number;
  loading: boolean;
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
