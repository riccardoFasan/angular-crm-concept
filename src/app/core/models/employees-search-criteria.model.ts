import { Pagination, Sorting, EmployeesFilters } from '.';

export interface EmployeesSearchCriteria {
  filters: EmployeesFilters;
  pagination: Pagination;
  sorting?: Sorting;
}
