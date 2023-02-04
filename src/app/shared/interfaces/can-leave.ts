import { Observable } from 'rxjs';

export interface CanLeave {
  readonly canLeave$: Observable<boolean>;
  saveAndLeave<T>(): Observable<T>;
}
