import { Injectable, inject } from '@angular/core';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import { TasksFiltersState, INITIAL_TASKS_FILTERS_STATE } from '../state';
import { Priority, TaskStatus } from 'src/app/core/enums';
import { ApiService } from 'src/app/core/services';
import { Observable, forkJoin, pipe, switchMap, tap } from 'rxjs';
import { TasksFilters, Option } from 'src/app/core/models';

@Injectable()
export class TasksFiltersStoreService
  extends ComponentStore<TasksFiltersState>
  implements OnStateInit
{
  private readonly api: ApiService = inject(ApiService);

  readonly filters$: Observable<TasksFilters> = this.select(
    (state: TasksFiltersState) => state.filters
  );

  readonly priorities$: Observable<Option<Priority>[]> = this.select(
    (state: TasksFiltersState) => state.priorities
  );

  readonly states$: Observable<Option<TaskStatus>[]> = this.select(
    (state: TasksFiltersState) => state.states
  );

  readonly optionsLoading$: Observable<boolean> = this.select(
    (state: TasksFiltersState) => state.optionsLoading
  );

  readonly error$: Observable<string | undefined> = this.select(
    (state: TasksFiltersState) => state.error
  );

  readonly clearError = this.effect<void>(
    pipe(tap(() => this.updateError(undefined)))
  );

  readonly updateFilters = this.updater(
    (state: TasksFiltersState, filters: TasksFilters) => ({
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
    (state: TasksFiltersState, priorities: Option<Priority>[]) => ({
      ...state,
      priorities,
    })
  );

  private readonly updateStates = this.updater(
    (state: TasksFiltersState, states: Option<TaskStatus>[]) => ({
      ...state,
      states,
    })
  );

  private readonly updateOptionsLoading = this.updater(
    (state: TasksFiltersState, optionsLoading: boolean) => ({
      ...state,
      optionsLoading,
    })
  );

  private readonly updateError = this.updater(
    (state: TasksFiltersState, error?: string) => ({
      ...state,
      error,
    })
  );

  constructor() {
    super(INITIAL_TASKS_FILTERS_STATE);
  }

  ngrxOnStateInit(): void {
    this.getOptions();
  }
}
