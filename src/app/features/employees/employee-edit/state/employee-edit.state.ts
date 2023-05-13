import { Employee, EmployeeFormData, Task } from 'src/app/core/models';

export interface EmployeeEditState {
  formData: EmployeeFormData;
  employee?: Employee;
  loading: boolean;
  error?: string;
}

export const INITIAL_EMPLOYEE_EDIT_STATE: EmployeeEditState = {
  formData: {},
  employee: undefined,
  loading: false,
};
