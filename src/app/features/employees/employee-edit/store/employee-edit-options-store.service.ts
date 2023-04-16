import { Injectable, inject } from '@angular/core';
import {
  EmployeeEditOptionsState,
  INITIAL_EMPLOYEE_EDIT_OPTIONS_STATE,
} from '../state';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import {
  Observable,
  filter,
  forkJoin,
  pipe,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  List,
  Option,
  Pagination,
  Task,
  TasksFilters,
  TasksSearchCriteria,
} from 'src/app/core/models';
import { AssignmentRole, EmployeeRole } from 'src/app/core/enums';
import { ApiService } from 'src/app/core/services';

@Injectable()
export class EmployeeEditOptionsStoreService
  extends ComponentStore<EmployeeEditOptionsState>
  implements OnStoreInit
{
  private readonly api: ApiService = inject(ApiService);

  readonly optionsLoading$: Observable<boolean> = this.select(
    (state: EmployeeEditOptionsState) => state.optionsLoading
  );

  readonly searchingTasks$: Observable<boolean> = this.select(
    (state: EmployeeEditOptionsState) => state.searchingTasks
  );

  readonly assignmentRoles$: Observable<Option<AssignmentRole>[]> = this.select(
    (state: EmployeeEditOptionsState) => state.assignmentRoles
  );

  readonly employeeRoles$: Observable<Option<EmployeeRole>[]> = this.select(
    (state: EmployeeEditOptionsState) => state.employeeRoles
  );

  readonly tasks$: Observable<Task[]> = this.select(
    (state: EmployeeEditOptionsState) => state.tasks
  );

  readonly tasksSearchCriteria$: Observable<TasksSearchCriteria | undefined> =
    this.select((state: EmployeeEditOptionsState) => state.tasksSearchCriteria);

  readonly error$: Observable<string | undefined> = this.select(
    (state: EmployeeEditOptionsState) => state.error
  );

  readonly paginateTasks = this.effect<Pagination>(
    pipe(
      withLatestFrom(this.tasksSearchCriteria$),
      tap(([pagination, tasksSearchCriteria]) => {
        const filters: TasksFilters = tasksSearchCriteria?.filters || {};
        this.updateTasksSearchCriteria({
          ...tasksSearchCriteria,
          filters,
          pagination,
        });
      })
    )
  );

  readonly filter = this.effect<TasksFilters>(
    pipe(
      withLatestFrom(this.tasksSearchCriteria$),
      tap(([filters, tasksSearchCriteria]) => {
        const defaultPagination: Pagination = {
          pageIndex: 0,
          pageSize: 5,
        };
        const pagination: Pagination =
          tasksSearchCriteria?.pagination || defaultPagination;
        this.updateTasksSearchCriteria({
          ...tasksSearchCriteria,
          filters,
          pagination,
        });
      })
    )
  );

  readonly clearError = this.effect<void>(
    pipe(tap(() => this.updateError(undefined)))
  );

  private readonly loadOptions = this.effect<void>(
    pipe(
      tap(() => this.updateOptionsLoading(true)),
      switchMap(() =>
        forkJoin([this.api.getAssignmentRoles(), this.api.getEmployeeRoles()])
      ),
      tap({
        next: ([assignmentRoles, employeeRoles]) => {
          this.updateAssignmentRoles(assignmentRoles);
          this.updateEmployeeRoles(employeeRoles);
          this.updateOptionsLoading(false);
        },
        error: (error: string) => {
          this.updateError(error);
          this.updateOptionsLoading(false);
        },
      })
    )
  );

  private readonly getTasks = this.effect(
    (tasksSearchCriteria$: Observable<TasksSearchCriteria | undefined>) =>
      tasksSearchCriteria$.pipe(
        filter((searchCriteria) => !!searchCriteria),
        tap(() => this.updateSearchingTasks(true)),
        switchMap((searchCriteria) =>
          this.api.getTasks(searchCriteria!).pipe(
            tap({
              next: (response: List<Task>) => {
                this.updateTasks(response.items);
                this.updateSearchingTasks(false);
              },
              error: (message: string) => {
                this.updateError(message);
                this.updateSearchingTasks(false);
              },
            })
          )
        )
      )
  );

  private readonly updateOptionsLoading = this.updater(
    (state: EmployeeEditOptionsState, optionsLoading: boolean) => ({
      ...state,
      optionsLoading,
    })
  );

  private readonly updateSearchingTasks = this.updater(
    (state: EmployeeEditOptionsState, searchingTasks: boolean) => ({
      ...state,
      searchingTasks,
    })
  );

  private readonly updateAssignmentRoles = this.updater(
    (
      state: EmployeeEditOptionsState,
      assignmentRoles: Option<AssignmentRole>[]
    ) => ({
      ...state,
      assignmentRoles,
    })
  );

  private readonly updateEmployeeRoles = this.updater(
    (
      state: EmployeeEditOptionsState,
      employeeRoles: Option<EmployeeRole>[]
    ) => ({
      ...state,
      employeeRoles,
    })
  );

  private readonly updateTasksSearchCriteria = this.updater(
    (
      state: EmployeeEditOptionsState,
      tasksSearchCriteria: TasksSearchCriteria
    ) => ({
      ...state,
      tasksSearchCriteria,
    })
  );

  private readonly updateTasks = this.updater(
    (state: EmployeeEditOptionsState, tasks: Task[]) => ({ ...state, tasks })
  );

  private readonly updateError = this.updater(
    (state: EmployeeEditOptionsState, error?: string) => ({
      ...state,
      error,
    })
  );

  constructor() {
    super(INITIAL_EMPLOYEE_EDIT_OPTIONS_STATE);
  }

  ngrxOnStoreInit(): void {
    this.loadOptions();
    this.getTasks(this.tasksSearchCriteria$);
  }
}
