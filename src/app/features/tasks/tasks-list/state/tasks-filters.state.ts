import { Priority, Status } from 'src/app/core/enums';
import { TasksFilters, Option } from 'src/app/core/models';

export interface TasksFiltersState {
  filters: TasksFilters;
  priorities: Option<Priority>[];
  states: Option<Status>[];
  optionsLoading: boolean;
  error?: string;
}

export const INITIAL_TASKS_FILTERS_STATE: TasksFiltersState = {
  filters: {},
  priorities: [],
  states: [],
  optionsLoading: false,
};
