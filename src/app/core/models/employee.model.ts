import { EmployeeRole } from '../enums';
import { Assignment } from './assignment.model';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl?: string;
  roles: [EmployeeRole, EmployeeRole | undefined];
  assignments: Assignment[];
}
