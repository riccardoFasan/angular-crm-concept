import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { INITIAL_LOADING_STATE, LoadingState } from '../state';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingStoreService extends ComponentStore<LoadingState> {
  readonly loading$: Observable<boolean> = this.select(
    (state: LoadingState) => state.loading
  );

  readonly updateLoading = this.updater(
    (state: LoadingState, loading: boolean) => ({ ...state, loading })
  );

  constructor() {
    super(INITIAL_LOADING_STATE);
  }
}
