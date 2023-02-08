import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import { Observable, pipe, switchMap, tap, withLatestFrom } from 'rxjs';
import {
  Filters,
  Pagination,
  SearchCriteria,
  Sorting,
  Task,
} from 'src/app/shared/models';
import { ApiService } from 'src/app/shared/services';
import { INITIAL_TASKBOARD_STATE, TaskboardState } from '../state';
import { LoadingStoreService } from 'src/app/shared/store';

@Injectable()
export class TaskboardStoreService
  extends ComponentStore<TaskboardState>
  implements OnStateInit
{
  private readonly api: ApiService = inject(ApiService);
  private readonly loadingStore: LoadingStoreService =
    inject(LoadingStoreService);

  readonly tasks$: Observable<Task[]> = this.select(
    (state: TaskboardState) => state.tasks
  );

  readonly count$: Observable<number> = this.select(
    (state: TaskboardState) => state.count
  );

  readonly searchCriteria$: Observable<SearchCriteria> = this.select(
    (state: TaskboardState) => state.searchCriteria
  );

  readonly loading$: Observable<boolean> = this.select(
    (state: TaskboardState) => state.loading
  );

  readonly error$: Observable<string | undefined> = this.select(
    (state: TaskboardState) => state.error
  );

  readonly paginate = this.effect<Pagination>(
    pipe(
      withLatestFrom(this.searchCriteria$),
      tap(([pagination, searchCriteria]) =>
        this.updateSearchCriteria({ ...searchCriteria, pagination })
      )
    )
  );

  readonly filter = this.effect<Filters>(
    pipe(
      withLatestFrom(this.searchCriteria$),
      tap(([filters, searchCriteria]) =>
        this.updateSearchCriteria({ ...searchCriteria, filters })
      )
    )
  );

  readonly sort = this.effect<Sorting>(
    pipe(
      withLatestFrom(this.searchCriteria$),
      tap(([sorting, searchCriteria]) =>
        this.updateSearchCriteria({ ...searchCriteria, sorting })
      )
    )
  );

  readonly removeTask = this.effect<Task>(
    pipe(
      tap(() => this.syncLoading(true)),
      withLatestFrom(this.tasks$),
      switchMap(([task, tasks]) =>
        this.api.removeTask(task).pipe(
          tap({
            next: (response: Task) => {
              const remainingTasks: Task[] = tasks.filter(
                (task: Task) => task.id !== response.id
              );
              this.updateTasks(remainingTasks);
              this.syncLoading(false);
            },
            error: (message: string) => {
              this.updateError(message);
              this.syncLoading(false);
            },
          })
        )
      )
    )
  );

  readonly clearError = this.effect<void>(
    pipe(tap(() => this.updateError(undefined)))
  );

  private readonly getTasks = this.effect(
    (searchCriteria$: Observable<SearchCriteria>) =>
      searchCriteria$.pipe(
        tap(() => this.syncLoading(true)),
        switchMap((searchCriteria) =>
          this.api.getTasks(searchCriteria).pipe(
            tap({
              next: (response: { tasks: Task[]; count: number }) => {
                this.updateTasks(response.tasks);
                this.updateCount(response.count);
                this.syncLoading(false);
              },
              error: (message: string) => {
                this.updateError(message);
                this.syncLoading(false);
              },
            })
          )
        )
      )
  );

  private readonly syncLoading = this.effect<boolean>(
    pipe(
      tap((loading: boolean) => {
        this.updateLoading(loading);
        this.loadingStore.updateLoading(loading);
      })
    )
  );

  private readonly updateLoading = this.updater(
    (state: TaskboardState, loading: boolean) => ({
      ...state,
      loading,
    })
  );

  private readonly updateCount = this.updater(
    (state: TaskboardState, count: number) => ({
      ...state,
      count,
    })
  );

  private readonly updateTasks = this.updater(
    (state: TaskboardState, tasks: Task[]) => ({
      ...state,
      tasks,
    })
  );

  private readonly updateSearchCriteria = this.updater(
    (state: TaskboardState, searchCriteria: SearchCriteria) => ({
      ...state,
      searchCriteria,
    })
  );

  private readonly updateError = this.updater(
    (state: TaskboardState, error?: string) => ({
      ...state,
      error,
    })
  );

  constructor() {
    super(INITIAL_TASKBOARD_STATE);
  }

  ngrxOnStateInit(): void {
    this.getTasks(this.searchCriteria$);
  }
}
