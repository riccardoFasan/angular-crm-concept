import { Filters, Pagination, Sorting } from '.';

export interface SearchCriteria {
  filters: Filters;
  pagination: Pagination;
  sorting?: Sorting;
}
