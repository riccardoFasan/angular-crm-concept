import { Employee, EmployeesSearchCriteria } from 'src/app/core/models';

export interface EmployeesListState {
  items: Employee[];
  searchCriteria: EmployeesSearchCriteria;
  count: number;
  loading: boolean;
  error?: string;
}

export const INITIAL_EMPLOYEES_LIST_STATE: EmployeesListState = {
  items: [],
  count: 0,
  searchCriteria: {
    filters: {},
    pagination: {
      pageSize: 5,
      pageIndex: 0,
    },
  },
  loading: false,
};
