import { SearchCriteria } from 'src/app/core/models';

export interface ListState<T> {
  items: T[];
  searchCriteria: SearchCriteria;
  count: number;
  loading: boolean;
  error?: string;
}

export const INITIAL_LIST_STATE: ListState<any> = {
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
