import { AssignmentRole, EmployeeRole } from 'src/app/core/enums';
import { Option, EmployeesFilters } from 'src/app/core/models';

export interface EmployeesFiltersState {
  filters: EmployeesFilters;
  assignments: Option<AssignmentRole>[];
  jobs: Option<EmployeeRole>[];
  optionsLoading: boolean;
  error?: string;
}

export const INITIAL_EMPLOYEES_FILTERS_STATE: EmployeesFiltersState = {
  filters: {},
  assignments: [],
  jobs: [],
  optionsLoading: false,
};
