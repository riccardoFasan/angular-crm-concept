import { AssignmentRole, EmployeeRole } from '../enums';

export interface EmployeesFilters {
  name?: string;
  assignmentRole?: AssignmentRole;
  employeeRole?: EmployeeRole;
}
