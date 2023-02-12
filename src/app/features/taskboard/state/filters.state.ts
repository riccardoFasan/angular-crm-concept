import { Priority, Status } from 'src/app/shared/enums';
import { Filters, Option } from 'src/app/shared/models';

export interface FiltersState {
  filters: Filters;
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
