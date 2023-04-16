import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import {
  distinctUntilChanged,
  EMPTY,
  iif,
  map,
  Observable,
  pipe,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { EditingMode } from 'src/app/core/enums';
import { Employee, EmployeeFormData } from 'src/app/core/models';
import { ApiService, TitleService } from 'src/app/core/services';
import { areEqualObjects } from 'src/utilities';
import { INITIAL_EMPLOYEE_EDIT_STATE, EmployeeEditState } from '../state';
import { LoadingStoreService } from 'src/app/core/store';

@Injectable()
export class EmployeeEditStoreService
  extends ComponentStore<EmployeeEditState>
  implements OnStateInit
{
  private readonly api: ApiService = inject(ApiService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly loadingStore: LoadingStoreService =
    inject(LoadingStoreService);
  private readonly title: TitleService = inject(TitleService);

  readonly formData$: Observable<EmployeeFormData> = this.select(
    (state: EmployeeEditState) => state.formData
  );

  readonly employee$: Observable<Employee | undefined> = this.select(
    (state: EmployeeEditState) => state.employee
  );

  readonly loading$: Observable<boolean> = this.select(
    (state: EmployeeEditState) => state.loading
  );

  readonly error$: Observable<string | undefined> = this.select(
    (state: EmployeeEditState) => state.error
  );

  readonly saved$: Observable<boolean> = this.select(
    (state: EmployeeEditState) =>
      areEqualObjects(state.employee, state.formData)
  );

  readonly editingMode$: Observable<EditingMode> = this.select(
    (state: EmployeeEditState) =>
      state.employee ? EditingMode.Editing : EditingMode.Creating
  );

  readonly updateFormData = this.updater(
    (state: EmployeeEditState, formData: EmployeeFormData) => ({
      ...state,
      formData: { ...state.formData, ...formData },
    })
  );

  readonly saveEmployee = this.effect<EmployeeFormData>(
    pipe(
      tap(() => this.syncLoading(true)),
      withLatestFrom(this.saved$, this.editingMode$),
      switchMap(([formData, saved, editingMode]) =>
        iif(
          () => saved !== true,
          editingMode === EditingMode.Creating
            ? this.api.createEmployee(formData)
            : this.api.updateEmployee(formData as Employee),
          this.employee$ as Observable<Employee> // just to trigger the tap operator
        )
      ),
      tap({
        next: (employee: Employee) => {
          this.syncLoading(false);
          this.updateEmployee(employee);
          this.syncTitle(employee);
        },
        error: (message: string) => {
          this.updateError(message);
          this.syncLoading(false);
        },
      })
    )
  );

  readonly clearError = this.effect<void>(
    pipe(tap(() => this.updateError(undefined)))
  );

  private readonly employeeId$: Observable<string | undefined> =
    this.activatedRoute.params.pipe(
      map((params: Params) => {
        const id: string | undefined = params['id'];
        if (Boolean(id) && id !== 'new') return id;
        return undefined;
      }),
      distinctUntilChanged()
    );

  private readonly getEmployee = this.effect(
    (employeeId$: Observable<string | undefined>) =>
      employeeId$.pipe(
        switchMap((employeeId: string | undefined) => {
          if (!employeeId) return EMPTY;
          this.syncLoading(true);
          return this.api.getEmployee(employeeId).pipe(
            tap({
              next: (employee: Employee) => {
                this.syncLoading(false);
                this.updateFormData(employee);
                this.updateEmployee(employee);
                this.syncTitle(employee);
              },
              error: (message: string) => {
                this.updateError(message);
                this.syncLoading(false);
              },
            })
          );
        })
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

  private readonly syncTitle = this.effect<Employee>(
    pipe(
      tap((employee: Employee) =>
        this.title.setTitle(`${employee.firstName} ${employee.lastName}`)
      )
    )
  );

  private readonly updateEmployee = this.updater(
    (state: EmployeeEditState, employee: Employee) => ({
      ...state,
      employee: { ...state.employee, ...employee },
    })
  );

  private readonly updateLoading = this.updater(
    (state: EmployeeEditState, loading: boolean) => ({ ...state, loading })
  );

  private readonly updateError = this.updater(
    (state: EmployeeEditState, error?: string) => ({
      ...state,
      error,
    })
  );

  constructor() {
    super(INITIAL_EMPLOYEE_EDIT_STATE);
  }

  ngrxOnStateInit(): void {
    this.getEmployee(this.employeeId$);
  }
}
