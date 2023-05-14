import { Observable } from 'rxjs';
import { List, SearchCriteria } from '../models';

export interface ItemAdapter<T> {
  getItems(searchCriteria: SearchCriteria): Observable<List<T>>;
  removeItem(item: T): Observable<T>;
}
