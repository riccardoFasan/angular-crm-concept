import { EmployeeRole } from '../enums';
import { Assignment } from './assignment.model';

export interface EmployeesFilters {
  name?: string;
  assignments?: Assignment[];
  roles?: EmployeeRole[];
}
