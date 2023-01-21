import { Filters } from './filters.model';
import { Pagination } from './pagination.model';

export interface SearchCriteria {
  filters: Filters;
  pagination: Pagination;
}
