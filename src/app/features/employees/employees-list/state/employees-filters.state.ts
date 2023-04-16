import { AssignmentRole, EmployeeRole } from 'src/app/core/enums';
import { Option, EmployeesFilters } from 'src/app/core/models';

export interface EmployeesFiltersState {
  filters: EmployeesFilters;
  assignmentRoles: Option<AssignmentRole>[];
  employeeRoles: Option<EmployeeRole>[];
  optionsLoading: boolean;
  error?: string;
}

export const INITIAL_EMPLOYEES_FILTERS_STATE: EmployeesFiltersState = {
  filters: {},
  assignmentRoles: [],
  employeeRoles: [],
  optionsLoading: false,
};
