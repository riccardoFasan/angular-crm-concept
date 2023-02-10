import { Priority, Status } from 'src/app/shared/enums';
import { Task, SearchCriteria, Option } from 'src/app/shared/models';

export interface TaskboardState {
  tasks: Task[];
  searchCriteria: SearchCriteria;
  count: number;
  loading: boolean;
  priorities: Option<Priority>[];
  states: Option<Status>[];
  filtersLoading: boolean;
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
  priorities: [],
  states: [],
  filtersLoading: false,
};
