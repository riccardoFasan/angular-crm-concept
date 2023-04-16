import { AssignmentRole, EmployeeRole } from 'src/app/core/enums';
import { Option, Task, TasksSearchCriteria } from 'src/app/core/models';

export interface EmployeeEditOptionsState {
  optionsLoading: boolean;
  searchingTasks: boolean;
  assignmentRoles: Option<AssignmentRole>[];
  employeeRoles: Option<EmployeeRole>[];
  tasks: Task[];
  tasksSearchCriteria?: TasksSearchCriteria;
  error?: string;
}

export const INITIAL_EMPLOYEE_EDIT_OPTIONS_STATE: EmployeeEditOptionsState = {
  optionsLoading: false,
  searchingTasks: false,
  assignmentRoles: [],
  employeeRoles: [],
  tasks: [],
};
