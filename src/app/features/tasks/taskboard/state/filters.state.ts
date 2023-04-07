import { Priority, Status } from 'src/app/core/enums';
import { TasksFilters, Option } from 'src/app/core/models';

export interface FiltersState {
  filters: TasksFilters;
  priorities: Option<Priority>[];
  states: Option<Status>[];
  optionsLoading: boolean;
  error?: string;
}

export const INITIAL_FILTERS_STATE: FiltersState = {
  filters: {},
  priorities: [],
  states: [],
  optionsLoading: false,
};
