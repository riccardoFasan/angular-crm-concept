import { Task, TasksSearchCriteria } from 'src/app/core/models';

export interface TasksListState {
  items: Task[];
  searchCriteria: TasksSearchCriteria;
  count: number;
  loading: boolean;
  error?: string;
}

export const INITIAL_TASKS_LIST_STATE: TasksListState = {
  items: [],
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
