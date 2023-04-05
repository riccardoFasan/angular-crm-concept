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
import { EditingMode, Priority, Status } from 'src/app/shared/enums';
import { Task, TaskFormData } from 'src/app/shared/models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BackComponent } from 'src/app/shared/components';
import { Observable, Subject, takeUntil, tap } from 'rxjs';
import { MobileObserverService } from 'src/app/shared/services';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatGridListModule,
    BackComponent,
  ],
  template: `
    <div>
      <app-back></app-back>
      <h1>{{ editingMode === 'EDITING' ? 'Edit task' : 'Create task' }}</h1>
    </div>
    <form [formGroup]="form">
      <mat-grid-list
        *ngIf="{ mobile: mobile$ | async } as vm"
        [cols]="vm.mobile ? 1 : 2"
        gutterSize="1rem"
        rowHeight="fit"
      >
        <mat-grid-tile colspan="1" rowspan="1">
          <mat-form-field appearance="outline">
            <mat-label>Description</mat-label>
            <input formControlName="description" matInput type="text" />
          </mat-form-field>
        </mat-grid-tile>

        <mat-grid-tile colspan="1" rowspan="1">
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="NOT_STARTED">Not Started</mat-option>
              <mat-option value="IN_PROGRESS">In Progress</mat-option>
              <mat-option value="IN_REVIEW">In Review</mat-option>
              <mat-option value="COMPLETED">Completed</mat-option>
            </mat-select>
          </mat-form-field>
        </mat-grid-tile>

        <mat-grid-tile colspan="1" rowspan="1">
          <mat-form-field appearance="outline">
            <mat-label>Priority</mat-label>
            <mat-select formControlName="priority">
              <mat-option value="LOW">Low</mat-option>
              <mat-option value="MEDIUM">Medium</mat-option>
              <mat-option value="TOP">Top</mat-option>
            </mat-select>
          </mat-form-field>
        </mat-grid-tile>

        <mat-grid-tile colspan="1" rowspan="1">
          <mat-form-field appearance="outline">
            <mat-label>Deadline</mat-label>
            <input
              formControlName="deadline"
              [matDatepicker]="picker"
              matInput
            />
            <mat-hint>mm/dd/yyyy</mat-hint>
            <mat-datepicker-toggle
              matIconSuffix
              [for]="picker"
            ></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </mat-grid-tile>

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
          justify-content: start;
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
            padding: 1rem 0;

            mat-form-field {
              width: calc(100% - 1px);
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
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent implements OnInit, OnDestroy {
  private readonly mobileObserver: MobileObserverService = inject(
    MobileObserverService
  );

  private readonly destroy$: Subject<void> = new Subject<void>();

  @Input() loading: boolean = false;
  @Input() saved: boolean = false;
  @Input() editingMode: EditingMode = EditingMode.Editing;
  @Input() task?: Task;
  @Input() set formData(formData: TaskFormData) {
    this.form.patchValue(formData);
  }

  @Output() formDataChange: EventEmitter<TaskFormData> =
    new EventEmitter<TaskFormData>();

  @Output() onSave: EventEmitter<TaskFormData> =
    new EventEmitter<TaskFormData>();

  protected readonly mobile$: Observable<boolean> = this.mobileObserver.mobile$;

  protected readonly form: FormGroup = new FormGroup({
    description: new FormControl<string>('', [Validators.required]),
    status: new FormControl<Status | null>(null, [Validators.required]),
    priority: new FormControl<Priority | null>(null, [Validators.required]),
    deadline: new FormControl<Date | null>(null),
  });

  private readonly valueChanges$: Observable<Partial<Task>> =
    this.form.valueChanges.pipe(
      takeUntil(this.destroy$),
      tap((formData: Partial<Task>) => this.formDataChange.emit(formData))
    );

  ngOnInit(): void {
    this.valueChanges$.subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  save(): void {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.cannotSave) return;
    this.onSave.emit({ ...this.task, ...this.form.value });
  }

  protected reset(): void {
    if (this.editingMode === EditingMode.Editing && this.task) {
      this.form.patchValue(this.task);
      return;
    }
    this.form.reset();
  }

  private get cannotSave(): boolean {
    return this.saved || this.form.invalid;
  }
}
