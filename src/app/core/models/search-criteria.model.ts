import { Pagination } from './pagination.model';
import { Sorting } from './sorting.model';

export interface SearchCriteria {
  pagination: Pagination;
  sorting?: Sorting;
  filters: object;
}
