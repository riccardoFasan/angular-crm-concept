import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  Observable,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';
import { Employee, TaskFormData } from 'src/app/core/models';
import { EditingMode } from 'src/app/core/enums';
import { EmployeeFormComponent } from '../presentation';
import { provideComponentStore } from '@ngrx/component-store';
import { CanLeave } from 'src/app/shared/interfaces';
import { ITEM_ADAPTER } from 'src/app/core/tokens';
import { EmployeesAdapterService } from '../../services';
import { EditStoreService } from 'src/app/core/store';
import { ErrorSnackbarDirective } from 'src/app/shared/directives';

@Component({
  selector: 'app-employee-edit-container',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    EmployeeFormComponent,
    ErrorSnackbarDirective,
  ],
  providers: [
    {
      provide: ITEM_ADAPTER,
      useClass: EmployeesAdapterService,
    },
    provideComponentStore(EditStoreService),
  ],
  template: `
    <ng-container
      *ngIf="{
        employee: employee$ | async,
        loading: loading$ | async,
        saved: saved$ | async,
        error: error$ | async,
        editingMode: editingMode$ | async
      } as vm"
    >
      <mat-card>
        <app-employee-form
          [loading]="vm.loading!"
          [employee]="vm.employee!"
          [saved]="vm.saved!"
          [editingMode]="vm.editingMode!"
          (formDataChange)="onFormDataChanged($event)"
          (onSave)="onFormSaved($event)"
        ></app-employee-form>
      </mat-card>
      <app-error-snackbar
        *ngIf="vm.error"
        [message]="vm.error"
        (dismissed)="onSnackbardDismissed()"
      ></app-error-snackbar>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeEditContainerComponent implements CanLeave {
  @ViewChild(EmployeeFormComponent)
  private employeeForm!: EmployeeFormComponent;

  private readonly store: EditStoreService<Employee> = inject(
    EditStoreService<Employee>
  );

  protected readonly employee$: Observable<Employee | undefined> =
    this.store.item$;
  protected readonly error$: Observable<string | undefined> = this.store.error$;
  protected readonly loading$: Observable<boolean> = this.store.loading$;
  protected readonly saved$: Observable<boolean> = this.store.saved$;
  protected readonly editingMode$: Observable<EditingMode> =
    this.store.editingMode$;

  private readonly formData$: Observable<TaskFormData> = this.store.formData$;

  readonly canLeave$: Observable<boolean> = combineLatest([
    this.saved$,
    this.loading$,
  ]).pipe(
    map(([saved, loading]) => saved && !loading),
    distinctUntilChanged()
  );

  beforeLeave(): Observable<boolean> {
    return this.formData$.pipe(
      take(1),
      switchMap((formData: TaskFormData) => {
        if (this.employeeForm.cannotSave) {
          this.employeeForm.touch();
          return of(false);
        }
        this.onFormSaved(formData);
        return this.loading$.pipe(
          filter((loading) => loading === false),
          map(() => true)
        );
      })
    );
  }

  protected onFormDataChanged(formData: TaskFormData): void {
    this.store.updateFormData(formData);
  }

  protected onFormSaved(formData: TaskFormData): void {
    this.store.saveItem(formData);
  }

  protected onSnackbardDismissed(): void {
    this.store.clearError();
  }
}
