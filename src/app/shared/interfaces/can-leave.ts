import { Observable } from 'rxjs';

export interface CanLeave {
  canLeave$: Observable<boolean>;
}
