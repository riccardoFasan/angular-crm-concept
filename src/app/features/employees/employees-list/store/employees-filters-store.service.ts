import { Injectable, inject } from '@angular/core';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import { AssignmentRole, EmployeeRole } from 'src/app/core/enums';
import { ApiService } from 'src/app/core/services';
import { Observable, forkJoin, pipe, switchMap, tap } from 'rxjs';
import { EmployeesFilters, Option } from 'src/app/core/models';
import {
  EmployeesFiltersState,
  INITIAL_EMPLOYEES_FILTERS_STATE,
} from '../state';

@Injectable()
export class FiltersStoreService
  extends ComponentStore<EmployeesFiltersState>
  implements OnStateInit
{
  private readonly api: ApiService = inject(ApiService);

  readonly filters$: Observable<EmployeesFilters> = this.select(
    (state: EmployeesFiltersState) => state.filters
  );

  readonly assignments$: Observable<Option<AssignmentRole>[]> = this.select(
    (state: EmployeesFiltersState) => state.assignments
  );

  readonly jobs$: Observable<Option<EmployeeRole>[]> = this.select(
    (state: EmployeesFiltersState) => state.jobs
  );

  readonly optionsLoading$: Observable<boolean> = this.select(
    (state: EmployeesFiltersState) => state.optionsLoading
  );

  readonly error$: Observable<string | undefined> = this.select(
    (state: EmployeesFiltersState) => state.error
  );

  readonly clearError = this.effect<void>(
    pipe(tap(() => this.updateError(undefined)))
  );

  readonly updateFilters = this.updater(
    (state: EmployeesFiltersState, filters: EmployeesFilters) => ({
      ...state,
      filters,
    })
  );

  private readonly getOptions = this.effect<void>(
    pipe(
      tap(() => this.updateOptionsLoading(true)),
      switchMap(() =>
        forkJoin([this.api.getAssignmentRoles(), this.api.getEmployeeRoles()])
      ),
      tap({
        next: ([assignments, jobs]) => {
          this.updateAssignments(assignments);
          this.updateRoles(jobs);
          this.updateOptionsLoading(false);
        },
        error: (message: string) => {
          this.updateError(message);
          this.updateOptionsLoading(false);
        },
      })
    )
  );

  private readonly updateAssignments = this.updater(
    (state: EmployeesFiltersState, assignments: Option<AssignmentRole>[]) => ({
      ...state,
      assignments,
    })
  );

  private readonly updateRoles = this.updater(
    (state: EmployeesFiltersState, jobs: Option<EmployeeRole>[]) => ({
      ...state,
      jobs,
    })
  );

  private readonly updateOptionsLoading = this.updater(
    (state: EmployeesFiltersState, optionsLoading: boolean) => ({
      ...state,
      optionsLoading,
    })
  );

  private readonly updateError = this.updater(
    (state: EmployeesFiltersState, error?: string) => ({
      ...state,
      error,
    })
  );

  constructor() {
    super(INITIAL_EMPLOYEES_FILTERS_STATE);
  }

  ngrxOnStateInit(): void {
    this.getOptions();
  }
}
