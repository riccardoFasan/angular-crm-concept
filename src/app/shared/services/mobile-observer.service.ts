import { Injectable, inject } from '@angular/core';
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MobileObserverService {
  private readonly breakpointObserver: BreakpointObserver =
    inject(BreakpointObserver);

  readonly mobile$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.XSmall])
    .pipe(map((result: BreakpointState) => result.matches));
}
