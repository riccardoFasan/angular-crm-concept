import { EmployeeRole } from '../enums';
import { Assignment } from './assignment.model';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: [EmployeeRole, EmployeeRole | undefined];
  pictureUrl?: string;
  assignments: Assignment[];
}
