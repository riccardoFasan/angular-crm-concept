import { AssignmentRole, EmployeeRole } from '../enums';

export interface EmployeesFilters {
  name?: string;
  assignment?: AssignmentRole;
  role?: EmployeeRole;
}
