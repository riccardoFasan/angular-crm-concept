import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { INITIAL_SIDEBAR_STATE, SidebarState } from '../state';
import { MatDrawerMode } from '@angular/material/sidenav';
import { pipe, tap, withLatestFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarStoreService extends ComponentStore<SidebarState> {
  readonly opened$ = this.select((state: SidebarState) => state.opened);
  readonly position$ = this.select((state: SidebarState) => state.position);
  readonly mode$ = this.select((state: SidebarState) => state.mode);
  readonly template$ = this.select((state: SidebarState) => state.template);

  readonly updatePosition = this.updater(
    (state: SidebarState, position: 'start' | 'end') => ({ ...state, position })
  );
  readonly updateMode = this.updater(
    (state: SidebarState, mode: MatDrawerMode) => ({ ...state, mode })
  );
  readonly updateTemplate = this.updater(
    (state: SidebarState, template: any) => ({ ...state, template })
  );

  readonly toggleOpen = this.effect<void>(
    pipe(
      withLatestFrom(this.opened$, this.template$),
      tap(([_, opened, template]) => {
        if (!template) return;
        this.updateOpened(!opened);
      })
    )
  );

  readonly updateOpened = this.updater(
    (state: SidebarState, opened: boolean) => ({ ...state, opened })
  );

  constructor() {
    super(INITIAL_SIDEBAR_STATE);
  }
}
