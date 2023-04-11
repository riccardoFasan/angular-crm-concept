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
  Pagination,
  Sorting,
  List,
  Employee,
  EmployeesSearchCriteria,
  EmployeesFilters,
} from 'src/app/core/models';
import { ApiService } from 'src/app/core/services';
import { LoadingStoreService } from 'src/app/core/store';
import { EmployeesListState, INITIAL_EMPLOYEES_LIST_STATE } from '../state';

@Injectable()
export class EmployeesListStoreService
  extends ComponentStore<EmployeesListState>
  implements OnStateInit
{
  private readonly api: ApiService = inject(ApiService);
  private readonly loadingStore: LoadingStoreService =
    inject(LoadingStoreService);

  readonly items$: Observable<Employee[]> = this.select(
    (state: EmployeesListState) => state.items
  );

  readonly count$: Observable<number> = this.select(
    (state: EmployeesListState) => state.count
  );

  readonly searchCriteria$: Observable<EmployeesSearchCriteria> = this.select(
    (state: EmployeesListState) => state.searchCriteria
  );

  readonly loading$: Observable<boolean> = this.select(
    (state: EmployeesListState) => state.loading
  );

  readonly error$: Observable<string | undefined> = this.select(
    (state: EmployeesListState) => state.error
  );

  readonly paginate = this.effect<Pagination>(
    pipe(
      withLatestFrom(this.searchCriteria$),
      tap(([pagination, searchCriteria]) =>
        this.updateSearchCriteria({ ...searchCriteria, pagination })
      )
    )
  );

  readonly filter = this.effect<EmployeesFilters>(
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

  readonly removeEmployee = this.effect<Employee>(
    pipe(
      tap(() => this.syncLoading(true)),
      withLatestFrom(this.items$),
      concatMap(([employee, items]) =>
        this.api.removeEmployee(employee).pipe(
          tap({
            next: (response: Employee) => {
              const remainingItems: Employee[] = items.filter(
                (employee: Employee) => employee.id !== response.id
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
    (searchCriteria$: Observable<EmployeesSearchCriteria>) =>
      searchCriteria$.pipe(
        tap(() => this.syncLoading(true)),
        exhaustMap((searchCriteria) =>
          this.api.getEmployees(searchCriteria).pipe(
            tap({
              next: (response: List<Employee>) => {
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
    (state: EmployeesListState, loading: boolean) => ({
      ...state,
      loading,
    })
  );

  private readonly updateCount = this.updater(
    (state: EmployeesListState, count: number) => ({
      ...state,
      count,
    })
  );

  private readonly updateItems = this.updater(
    (state: EmployeesListState, items: Employee[]) => ({
      ...state,
      items,
    })
  );

  private readonly updateSearchCriteria = this.updater(
    (state: EmployeesListState, searchCriteria: EmployeesSearchCriteria) => ({
      ...state,
      searchCriteria,
    })
  );

  private readonly updateError = this.updater(
    (state: EmployeesListState, error?: string) => ({
      ...state,
      error,
    })
  );

  constructor() {
    super(INITIAL_EMPLOYEES_LIST_STATE);
  }

  ngrxOnStateInit(): void {
    this.getItems(this.searchCriteria$);
  }
}
