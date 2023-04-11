import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import {
  concatMap,
  exhaustMap,
  Observable,
  pipe,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  TasksFilters,
  Pagination,
  TasksSearchCriteria,
  Sorting,
  Task,
  List,
} from 'src/app/core/models';
import { ApiService } from 'src/app/core/services';
import { INITIAL_TASKS_LIST_STATE, TasksListState } from '../state';
import { LoadingStoreService } from 'src/app/core/store';

@Injectable()
export class TasksListStoreService
  extends ComponentStore<TasksListState>
  implements OnStateInit
{
  private readonly api: ApiService = inject(ApiService);
  private readonly loadingStore: LoadingStoreService =
    inject(LoadingStoreService);

  readonly items$: Observable<Task[]> = this.select(
    (state: TasksListState) => state.items
  );

  readonly count$: Observable<number> = this.select(
    (state: TasksListState) => state.count
  );

  readonly searchCriteria$: Observable<TasksSearchCriteria> = this.select(
    (state: TasksListState) => state.searchCriteria
  );

  readonly loading$: Observable<boolean> = this.select(
    (state: TasksListState) => state.loading
  );

  readonly error$: Observable<string | undefined> = this.select(
    (state: TasksListState) => state.error
  );

  readonly paginate = this.effect<Pagination>(
    pipe(
      withLatestFrom(this.searchCriteria$),
      tap(([pagination, searchCriteria]) =>
        this.updateSearchCriteria({ ...searchCriteria, pagination })
      )
    )
  );

  readonly filter = this.effect<TasksFilters>(
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
      withLatestFrom(this.items$),
      concatMap(([task, items]) =>
        this.api.removeTask(task).pipe(
          tap({
            next: (response: Task) => {
              const remainingItems: Task[] = items.filter(
                (task: Task) => task.id !== response.id
              );
              this.updateItems(remainingItems);
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

  private readonly getItems = this.effect(
    (searchCriteria$: Observable<TasksSearchCriteria>) =>
      searchCriteria$.pipe(
        tap(() => this.syncLoading(true)),
        exhaustMap((searchCriteria) =>
          this.api.getTasks(searchCriteria).pipe(
            tap({
              next: (response: List<Task>) => {
                this.updateItems(response.items);
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
    (state: TasksListState, loading: boolean) => ({
      ...state,
      loading,
    })
  );

  private readonly updateCount = this.updater(
    (state: TasksListState, count: number) => ({
      ...state,
      count,
    })
  );

  private readonly updateItems = this.updater(
    (state: TasksListState, items: Task[]) => ({
      ...state,
      items,
    })
  );

  private readonly updateSearchCriteria = this.updater(
    (state: TasksListState, searchCriteria: TasksSearchCriteria) => ({
      ...state,
      searchCriteria,
    })
  );

  private readonly updateError = this.updater(
    (state: TasksListState, error?: string) => ({
      ...state,
      error,
    })
  );

  constructor() {
    super(INITIAL_TASKS_LIST_STATE);
  }

  ngrxOnStateInit(): void {
    this.getItems(this.searchCriteria$);
  }
}
