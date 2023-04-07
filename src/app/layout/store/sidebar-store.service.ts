import { Injectable, TemplateRef } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { INITIAL_SIDEBAR_STATE, SidebarState } from '../state';
import { MatDrawerMode } from '@angular/material/sidenav';
import { Observable, filter, pipe, tap, withLatestFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarStoreService extends ComponentStore<SidebarState> {
  readonly title$: Observable<string> = this.select(
    (state: SidebarState) => state.title
  );
  readonly opened$: Observable<boolean> = this.select(
    (state: SidebarState) => state.opened
  );
  readonly position$: Observable<'start' | 'end'> = this.select(
    (state: SidebarState) => state.position
  );
  readonly mode$: Observable<MatDrawerMode> = this.select(
    (state: SidebarState) => state.mode
  );
  readonly template$: Observable<TemplateRef<any> | undefined> = this.select(
    (state: SidebarState) => state.template
  );

  readonly updateTitle = this.updater((state: SidebarState, title: string) => ({
    ...state,
    title,
  }));
  readonly updatePosition = this.updater(
    (state: SidebarState, position: 'start' | 'end') => ({ ...state, position })
  );
  readonly updateMode = this.updater(
    (state: SidebarState, mode: MatDrawerMode) => ({ ...state, mode })
  );
  readonly updateTemplate = this.updater(
    (state: SidebarState, template: any) => ({ ...state, template })
  );

  readonly open = this.effect<void>(
    pipe(
      withLatestFrom(this.opened$, this.template$),
      filter(([_, opened, template]) => !opened && !!template),
      tap(([_, __, template]) => {
        if (!template) return;
        this.updateOpened(true);
      })
    )
  );

  readonly close = this.effect<void>(pipe(tap(() => this.updateOpened(false))));

  private readonly updateOpened = this.updater(
    (state: SidebarState, opened: boolean) => ({ ...state, opened })
  );

  constructor() {
    super(INITIAL_SIDEBAR_STATE);
  }
}
