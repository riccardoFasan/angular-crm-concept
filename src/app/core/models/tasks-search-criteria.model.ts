import { TasksFilters, Pagination, Sorting } from '.';

export interface TasksSearchCriteria {
  filters: TasksFilters;
  pagination: Pagination;
  sorting?: Sorting;
}
