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
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BackComponent } from 'src/app/shared/components';
import { Observable, Subject, filter, takeUntil, tap, map } from 'rxjs';
import { MobileObserverService } from 'src/app/shared/services';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatStepperModule } from '@angular/material/stepper';
import { AssignmentFormComponent } from './assignment-form.component';
import { areEqualObjects } from 'src/utilities';
import { RoleValidators } from '../validators';
import { AssignmentValidators } from '../validators/assignment.validators';

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
    MatStepperModule,
    BackComponent,
    AssignmentFormComponent,
  ],
  template: `
    <div>
      <app-back></app-back>
      <h1>
        {{ mode === 'EDITING' ? 'Edit employee' : 'Create employee' }}
      </h1>
    </div>
    <form *ngIf="{ mobile: mobile$ | async } as vm" [formGroup]="form">
      <mat-stepper orientation="vertical" #stepper>
        <mat-step
          label="Employee info"
          formGroupName="employee"
          [stepControl]="$any(form.get('employee'))"
        >
          <mat-grid-list
            [cols]="vm.mobile ? 1 : 2"
            gutterSize="1rem"
            rowHeight="fit"
          >
            <mat-grid-tile colspan="1" rowspan="1">
              <mat-form-field appearance="outline">
                <mat-label>Firstname</mat-label>
                <input formControlName="firstName" matInput type="text" />
                <mat-error
                  *ngIf="form.get('employee.firstName')!.hasError('required')"
                >
                  This field is required
                </mat-error>
              </mat-form-field>
            </mat-grid-tile>

            <mat-grid-tile colspan="1" rowspan="1">
              <mat-form-field appearance="outline">
                <mat-label>Lastname</mat-label>
                <input formControlName="lastName" matInput type="text" />
                <mat-error
                  *ngIf="form.get('employee.lastName')!.hasError('required')"
                >
                  This field is required
                </mat-error>
              </mat-form-field>
            </mat-grid-tile>

            <mat-grid-tile colspan="1" rowspan="1">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input formControlName="email" matInput type="email" />
                <mat-error
                  *ngIf="form.get('employee.email')!.hasError('required')"
                >
                  This field is required
                </mat-error>
              </mat-form-field>
            </mat-grid-tile>

            <mat-grid-tile colspan="1" rowspan="1">
              <mat-form-field appearance="outline">
                <mat-label>Picture</mat-label>
                <input formControlName="pictureUrl" matInput type="email" />
              </mat-form-field>
            </mat-grid-tile>

            <mat-grid-tile colspan="2" rowspan="1">
              <mat-form-field appearance="outline">
                <mat-label>Roles</mat-label>
                <mat-select multiple formControlName="roles">
                  <mat-option value="PROJECT_MANAGER">
                    Project manager
                  </mat-option>
                  <mat-option value="DESIGNER">Designer</mat-option>
                  <mat-option value="DEVELOPER">Developer</mat-option>
                  <mat-option value="TESTER">Tester</mat-option>
                </mat-select>
                <mat-error
                  *ngIf="
                    form
                      .get('employee.roles')!
                      .hasError('cannotBeBothDesignerAndTester')
                  "
                >
                  An employee cannot a Designer and a Tester at the same time
                </mat-error>
                <mat-error
                  *ngIf="form.get('employee.roles')!.hasError('required')"
                >
                  An employee must have a role
                </mat-error>
                <mat-error
                  *ngIf="form.get('employee.roles')!.hasError('maxlength')"
                >
                  An employee should have a maximum of 2 roles
                </mat-error>
                <mat-hint
                  *ngIf="form.hasError('cannotBeAReviewerIfIsAProjectManager')"
                >
                  There are some assignment with a reviewer role, that is not
                  allowed if the employee is a project manager
                </mat-hint>
              </mat-form-field>
            </mat-grid-tile>

            <mat-grid-tile colspan="1" rowspan="1">
              <div class="stepper-nav">
                <button mat-button matStepperNext>Next</button>
              </div>
            </mat-grid-tile>
          </mat-grid-list>
        </mat-step>

        <mat-step
          label="Assignments"
          formArrayName="assignments"
          [stepControl]="$any(form.get('assignments'))"
        >
          <app-assignment-form
            *ngFor="let assignment of assignments.controls; index as i"
            [form]="$any(assignment)"
            (removed)="removeAssignment(i)"
            [isProjectManager]="
              form.get('employee.roles')!.value.includes('PROJECT_MANAGER')
            "
          >
          </app-assignment-form>

          <mat-error *ngIf="form.hasError('mustHaveAtLeastOneRole')">
            Assignments cannot be modified if the employee has no role
          </mat-error>

          <mat-grid-list
            [cols]="vm.mobile ? 1 : 2"
            gutterSize="1rem"
            rowHeight="2rem"
          >
            <mat-grid-tile colspan="1" rowspan="1">
              <div class="stepper-nav">
                <button mat-button matStepperPrevious>Back</button>
              </div>
            </mat-grid-tile>

            <mat-grid-tile colspan="1" rowspan="1">
              <div class="add-assignment">
                <button
                  (click)="addNewAssignment()"
                  [disabled]="loading"
                  mat-button
                  mat-flat-button
                  type="button"
                >
                  Add assignment
                </button>
              </div>
            </mat-grid-tile>
          </mat-grid-list>
        </mat-step>
      </mat-stepper>

      <mat-grid-list
        [cols]="vm.mobile ? 1 : 2"
        gutterSize="1rem"
        rowHeight="2rem"
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
              type="button"
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
        $row-height: 8.25rem;
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

            .add-assignment,
            .stepper-nav {
              width: 100%;
              display: flex;
              justify-content: flex-start;
            }

            .stepper-nav {
              justify-content: flex-start;
            }

            .add-assignment {
              justify-content: flex-end;
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeFormComponent implements OnInit, OnDestroy {
  private readonly mobileObserver: MobileObserverService = inject(
    MobileObserverService
  );

  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input({ required: true }) loading: boolean = false;
  @Input({ required: true }) saved: boolean = false;

  @Input({ required: true }) set employee(employee: Employee | undefined) {
    const formData: any = {
      employee: {
        firstName: employee?.firstName || '',
        lastName: employee?.lastName || '',
        email: employee?.email || '',
        pictureUrl: employee?.pictureUrl || '',
        roles: employee?.roles || [],
      },
      assignments: employee?.assignments,
    };
    this.form.patchValue(formData);
    const assignments: Assignment[] = employee?.assignments || [];
    const assignmentsControls: FormArray = <FormArray>(
      this.form.get('assignments')
    );
    assignmentsControls.clear();
    if (assignments.length === 0) {
      this.addNewAssignment();
      return;
    }
    assignments.forEach((assignment: Assignment, i: number) =>
      this.insertAssignment(assignment, i)
    );
  }

  @Input({ required: true }) set editingMode(mode: EditingMode) {
    if (mode === EditingMode.Editing) this.touch();
    if (mode === EditingMode.Creating) {
      const assignments: FormArray = <FormArray>this.form.get('assignments');
      if (assignments.controls.length === 0) this.addNewAssignment();
    }
    this.mode = mode;
  }

  @Output() formDataChange: EventEmitter<EmployeeFormData> =
    new EventEmitter<EmployeeFormData>();

  @Output() onSave: EventEmitter<EmployeeFormData> =
    new EventEmitter<EmployeeFormData>();

  protected mode: EditingMode = EditingMode.Editing;

  protected readonly mobile$: Observable<boolean> = this.mobileObserver.mobile$;

  protected readonly form: FormGroup = new FormGroup(
    {
      employee: new FormGroup({
        firstName: new FormControl<string>('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        lastName: new FormControl<string>('', [
          Validators.required,
          Validators.minLength(3),
        ]),
        email: new FormControl<string>('', [
          Validators.required,
          Validators.email,
        ]),
        pictureUrl: new FormControl<string | null>(null, []), // sent to BE as dataURL // TODO: add size and format validators
        roles: new FormControl<EmployeeRole[]>(
          [],
          [
            Validators.required, // Validators.minLength(1) is ignored by Angular (Read the method description)
            Validators.maxLength(2),
            RoleValidators.cannotBeBothDesignerAndTester,
          ]
        ),
      }),
      assignments: new FormArray([]),
    },
    {
      validators: [
        RoleValidators.mustHaveAtLeastOneRole as ValidatorFn,
        AssignmentValidators.cannotBeAReviewerIfIsAProjectManager as ValidatorFn,
      ],
    }
  );

  private readonly valueChanges$: Observable<EmployeeFormData> =
    this.form.valueChanges.pipe(
      filter(() => !this.loading && this.form.dirty),
      map((formData: any) => ({
        ...this.employee,
        ...formData.employee,
        assignments: formData.assignments,
      })),
      filter((formData: any) => !areEqualObjects(formData, this.employee)),
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

  protected addNewAssignment(): void {
    this.insertAssignment(null);
  }

  private insertAssignment(
    assignment: Assignment | null,
    index: number = -1
  ): void {
    const group: FormGroup = new FormGroup(
      {
        task: new FormControl<Task | null>(assignment?.task || null, [
          Validators.required,
        ]),
        role: new FormControl<AssignmentRole | null>(assignment?.role || null, [
          Validators.required,
        ]),
        assignedAt: new FormControl<Date | null>(
          assignment?.assignedAt || null,
          [Validators.required]
        ),
        fromDate: new FormControl<Date | null>(assignment?.fromDate || null, [
          Validators.required,
        ]),
        dueDate: new FormControl<Date | null>(assignment?.dueDate || null, [
          Validators.required,
        ]),
      },
      {
        validators: [
          AssignmentValidators.cannotBeAWorkerIfTaskIsFinished as ValidatorFn,
        ],
      }
    );

    this.assignments.insert(index, group);
  }
}
