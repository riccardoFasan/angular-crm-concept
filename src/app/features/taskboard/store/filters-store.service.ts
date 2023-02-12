import { Injectable, inject } from '@angular/core';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import { FiltersState, INITIAL_FILTERS_STATE } from '../state';
import { Priority, Status } from 'src/app/shared/enums';
import { ApiService } from 'src/app/shared/services';
import { Observable, forkJoin, pipe, switchMap, tap } from 'rxjs';
import { Filters, Option } from 'src/app/shared/models';

@Injectable()
export class FiltersStoreService
  extends ComponentStore<FiltersState>
  implements OnStateInit
{
  private readonly api: ApiService = inject(ApiService);

  readonly filters$: Observable<Filters> = this.select(
    (state: FiltersState) => state.filters
  );

  readonly priorities$: Observable<Option<Priority>[]> = this.select(
    (state: FiltersState) => state.priorities
  );

  readonly states$: Observable<Option<Status>[]> = this.select(
    (state: FiltersState) => state.states
  );

  readonly optionsLoading$: Observable<boolean> = this.select(
    (state: FiltersState) => state.optionsLoading
  );

  readonly error$: Observable<string | undefined> = this.select(
    (state: FiltersState) => state.error
  );

  readonly clearError = this.effect<void>(
    pipe(tap(() => this.updateError(undefined)))
  );

  readonly updateFilters = this.updater(
    (state: FiltersState, filters: Filters) => ({
      ...state,
      filters,
    })
  );

  private readonly getOptions = this.effect<void>(
    pipe(
      tap(() => this.updateOptionsLoading(true)),
      switchMap(() =>
        forkJoin([this.api.getPriorites(), this.api.getStates()])
      ),
      tap({
        next: ([priorities, states]) => {
          this.updatePriorites(priorities);
          this.updateStates(states);
          this.updateOptionsLoading(false);
        },
        error: (message: string) => {
          this.updateError(message);
          this.updateOptionsLoading(false);
        },
      })
    )
  );

  private readonly updatePriorites = this.updater(
    (state: FiltersState, priorities: Option<Priority>[]) => ({
      ...state,
      priorities,
    })
  );

  private readonly updateStates = this.updater(
    (state: FiltersState, states: Option<Status>[]) => ({
      ...state,
      states,
    })
  );

  private readonly updateOptionsLoading = this.updater(
    (state: FiltersState, optionsLoading: boolean) => ({
      ...state,
      optionsLoading,
    })
  );

  private readonly updateError = this.updater(
    (state: FiltersState, error?: string) => ({
      ...state,
      error,
    })
  );

  constructor() {
    super(INITIAL_FILTERS_STATE);
  }

  ngrxOnStateInit(): void {
    this.getOptions();
  }
}
