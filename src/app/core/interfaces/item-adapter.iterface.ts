import { Observable } from 'rxjs';
import { List, SearchCriteria } from '../models';

export interface ItemAdapter<T> {
  getItems(searchCriteria: SearchCriteria): Observable<List<T>>;
  getItem(id: string): Observable<T>;
  generateTitle(item: T): string;
  removeItem(item: T): Observable<T>;
  createItem(item: T): Observable<T>;
  updateItem(item: T): Observable<T>;
}
