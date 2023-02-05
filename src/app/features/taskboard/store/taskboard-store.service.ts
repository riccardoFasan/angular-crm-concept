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

  readonly updatePagination = this.updater(
    (state: TaskboardState, pagination: Pagination) => ({
      ...state,
      searchCriteria: {
        ...state.searchCriteria,
        pagination,
      },
    })
  );

  readonly updateFilters = this.updater(
    (state: TaskboardState, filters: Filters) => ({
      ...state,
      searchCriteria: {
        ...state.searchCriteria,
        filters,
      },
    })
  );

  readonly updateSorting = this.updater(
    (state: TaskboardState, sorting: Sorting) => ({
      ...state,
      searchCriteria: {
        ...state.searchCriteria,
        sorting,
      },
    })
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
            // TODO: error handling
            //error: () => ,
          })
        )
      )
    )
  );

  private readonly getTasks = this.effect(
    (searchCriteria$: Observable<SearchCriteria>) =>
      searchCriteria$.pipe(
        tap(() => this.syncLoading(true)),
        switchMap((searchCriteria: SearchCriteria) =>
          this.api.getTasks(searchCriteria).pipe(
            tap({
              next: (response: { tasks: Task[]; count: number }) => {
                this.updateTasks(response.tasks);
                this.updateCount(response.count);
                this.syncLoading(false);
              },
              // TODO: error handling
              //error: () => ,
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

  constructor() {
    super(INITIAL_TASKBOARD_STATE);
  }

  ngrxOnStateInit(): void {
    this.getTasks(this.searchCriteria$);
  }
}
