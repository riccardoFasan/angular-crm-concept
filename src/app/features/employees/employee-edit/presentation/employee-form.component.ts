import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentRole, EditingMode, EmployeeRole } from 'src/app/core/enums';
import {
  Assignment,
  Employee,
  EmployeeFormData,
  Option,
  Task,
} from 'src/app/core/models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BackComponent } from 'src/app/shared/components';
import {
  Observable,
  Subject,
  distinctUntilChanged,
  filter,
  takeUntil,
  tap,
} from 'rxjs';
import { MobileObserverService } from 'src/app/shared/services';
import { MatGridListModule } from '@angular/material/grid-list';
import { provideComponentStore } from '@ngrx/component-store';
import { EmployeeEditOptionsStoreService } from '../store';
import { AssignmentFormComponent } from './assignment-form.component';
import { areEqualObjects } from 'src/utilities';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatGridListModule,
    BackComponent,
    AssignmentFormComponent,
  ],
  template: `
    <div>
      <app-back></app-back>
      <h1>
        {{ editingMode === 'EDITING' ? 'Edit employee' : 'Create employee' }}
      </h1>
    </div>
    <form *ngIf="{ mobile: mobile$ | async } as vm" [formGroup]="form">
      <mat-grid-list
        [cols]="vm.mobile ? 1 : 2"
        gutterSize="1rem"
        rowHeight="fit"
      >
        <mat-grid-tile colspan="1" rowspan="1">
          <mat-form-field appearance="outline">
            <mat-label>Firstname</mat-label>
            <input formControlName="firstName" matInput type="text" />
          </mat-form-field>
        </mat-grid-tile>

        <mat-grid-tile colspan="1" rowspan="1">
          <mat-form-field appearance="outline">
            <mat-label>Lastname</mat-label>
            <input formControlName="lastName" matInput type="text" />
          </mat-form-field>
        </mat-grid-tile>

        <mat-grid-tile colspan="1" rowspan="1">
          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <input formControlName="email" matInput type="email" />
          </mat-form-field>
        </mat-grid-tile>

        <mat-grid-tile colspan="1" rowspan="1">
          <mat-form-field appearance="outline">
            <mat-label>Picture</mat-label>
            <input formControlName="pictureUrl" matInput type="email" />
          </mat-form-field>
        </mat-grid-tile>
      </mat-grid-list>

      <ng-container formArrayName="assignments">
        <app-assignment-form
          *ngFor="let assignment of assignments.controls; index as i"
          [form]="$any(assignment)"
        >
        </app-assignment-form>
      </ng-container>

      <mat-grid-list
        [cols]="vm.mobile ? 1 : 2"
        gutterSize="1rem"
        rowHeight="5rem"
      >
        <mat-grid-tile [colspan]="vm.mobile ? 1 : 2" rowspan="1">
          <div>
            <button
              (click)="reset()"
              [disabled]="loading"
              mat-button
              mat-flat-button
              type="button"
            >
              Reset
            </button>
            <button
              (click)="save()"
              [disabled]="loading"
              mat-flat-button
              color="primary"
              type="submit"
            >
              Save
            </button>
          </div>
        </mat-grid-tile>
      </mat-grid-list>
    </form>
  `,
  styles: [
    `
      :host {
        $row-height: 5rem;
        padding: 1rem;

        div:first-child {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 2rem;

          h1 {
            margin: 0;
          }
        }

        mat-grid-list {
          width: 100%;

          &[cols='2'] {
            height: $row-height * 3;
          }

          &[cols='1'] {
            height: $row-height * 5;
          }

          mat-grid-tile {
            padding: 0;

            mat-form-field {
              width: calc(100% - 1px);
            }

            input[type='file'] {
              margin-left: 1rem;
            }
          }

          &:last-child div {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            width: 100%;
            margin-top: 2rem;
          }
        }
      }
    `,
  ],
  providers: [provideComponentStore(EmployeeEditOptionsStoreService)],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  private readonly mobileObserver: MobileObserverService = inject(
    MobileObserverService
  );

  private readonly optionsStore: EmployeeEditOptionsStoreService = inject(
    EmployeeEditOptionsStoreService
  );

  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input({ required: true }) loading: boolean = false;
  @Input({ required: true }) saved: boolean = false;
  @Input({ required: true }) editingMode: EditingMode = EditingMode.Editing;
  @Input({ required: true }) employee?: Employee;
  @Input({ required: true }) set formData(formData: EmployeeFormData) {
    this.form.patchValue(formData);
    const assignments: Assignment[] = formData.assignments || [];
    assignments.forEach((assignment: Assignment, i: number) =>
      this.insertAssignment(assignment, i)
    );
  }

  @Output() formDataChange: EventEmitter<EmployeeFormData> =
    new EventEmitter<EmployeeFormData>();

  @Output() onSave: EventEmitter<EmployeeFormData> =
    new EventEmitter<EmployeeFormData>();

  protected readonly searchingTasks$: Observable<boolean> =
    this.optionsStore.searchingTasks$;
  protected readonly assignmentRoles$: Observable<Option<AssignmentRole>[]> =
    this.optionsStore.assignmentRoles$;
  protected readonly employeeRoles$: Observable<Option<EmployeeRole>[]> =
    this.optionsStore.employeeRoles$;
  protected readonly tasks$: Observable<Task[]> = this.optionsStore.tasks$;

  protected readonly mobile$: Observable<boolean> = this.mobileObserver.mobile$;

  protected readonly form: FormGroup = new FormGroup({
    firstName: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    lastName: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    pictureUrl: new FormControl<string | null>(null, []), // sent to BE as dataURL // TODO: add size and format validators
    roles: new FormControl<EmployeeRole[]>(
      [],
      [Validators.min(1), Validators.max(2)] // TODO: add custom validator for role combination
    ),
    assignments: new FormArray([], []), // TODO: disable if no roles
  });

  private readonly valueChanges$: Observable<EmployeeFormData> =
    this.form.valueChanges.pipe(
      filter(
        (formData: EmployeeFormData) =>
          !areEqualObjects(formData, this.form.value)
      ),
      tap((formData: EmployeeFormData) => this.formDataChange.emit(formData)),
      takeUntil(this.destroy$)
    );

  ngOnInit(): void {
    this.valueChanges$.subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  get cannotSave(): boolean {
    return this.saved || this.form.invalid;
  }

  touch(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
  }

  protected get assignments(): FormArray {
    return this.form.get('assignments') as FormArray;
  }

  protected insertAssignment(assignment: Assignment, index: number = 0): void {
    const group: FormGroup = new FormGroup({
      task: new FormControl<Task | null>(assignment.task || null, [
        Validators.required,
      ]),
      role: new FormControl<AssignmentRole | null>(assignment.role || null, [
        Validators.required,
      ]),
      fromDate: new FormControl<Date | null>(assignment.fromDate || null, [
        Validators.required,
      ]),
      dueDate: new FormControl<Date | null>(assignment.dueDate || null, [
        Validators.required,
      ]),
    });
    this.assignments.insert(index, group);
  }

  protected removeAssignment(index: number): void {
    this.assignments.removeAt(index);
  }

  protected save(): void {
    this.touch();
    if (this.cannotSave) return;
    this.onSave.emit({ ...this.employee, ...this.form.value });
  }

  protected reset(): void {
    if (this.editingMode === EditingMode.Editing && this.employee) {
      this.form.patchValue(this.employee);
      return;
    }
    this.form.reset();
  }
}
