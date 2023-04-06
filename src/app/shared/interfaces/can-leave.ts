import { Observable } from 'rxjs';

export interface CanLeave {
  readonly canLeave$: Observable<boolean>;
  beforeLeave(): Observable<any>;
}
