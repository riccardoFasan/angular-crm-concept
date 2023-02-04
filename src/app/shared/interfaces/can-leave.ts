import { Observable } from 'rxjs';

export interface CanLeave {
  readonly targetPath: string;
  readonly canLeave$: Observable<boolean>;
  beforeLeave(): Observable<any>;
}
