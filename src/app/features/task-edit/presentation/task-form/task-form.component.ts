import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
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
import { MatDividerModule } from '@angular/material/divider';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BackComponent } from 'src/app/shared/components/back/back.component';
import { Observable, tap } from 'rxjs';

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
    MatDividerModule,
    BackComponent,
  ],
  template: `
    <div>
      <app-back></app-back>
      <h1>{{ editingMode === 'EDITING' ? 'Edit task' : 'New task' }}</h1>
    </div>
    <form
      [formGroup]="form"
      [ngStyle]="{ 'marginTop.px': !loading ? '4' : '0' }"
    >
      <div>
        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <input formControlName="description" matInput type="text" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select formControlName="status">
            <mat-option value="NOT_STARTED">Not Started</mat-option>
            <mat-option value="IN_PROGRESS">In Progress</mat-option>
            <mat-option value="IN_REVIEW">In Review</mat-option>
            <mat-option value="COMPLETED">Completed</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div>
        <mat-form-field appearance="outline">
          <mat-label>Priority</mat-label>
          <mat-select formControlName="priority">
            <mat-option value="LOW">Low</mat-option>
            <mat-option value="MEDIUM">Medium</mat-option>
            <mat-option value="TOP">Top</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Deadline</mat-label>
          <input formControlName="deadline" [matDatepicker]="picker" matInput />
          <mat-hint>mm/dd/yyyy</mat-hint>
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </div>

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
    </form>

    <mat-divider></mat-divider>

    <div class="data">
      <code>
        {{ valueChanges$ | async | json }}
      </code>
      <code>
        {{ task | json }}
      </code>
    </div>
  `,
  styles: [
    `
      h1 {
        margin: 0;
      }

      :host {
        padding: 1rem;
      }

      :host div:first-child,
      form > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }

      :host div:first-child {
        justify-content: start;
        margin-bottom: 3rem;
      }

      form {
        margin-bottom: 1.5rem;
      }

      form > div mat-form-field {
        width: 50%;
      }

      form > div:last-child {
        margin-top: 1rem;
        justify-content: flex-end;
      }

      .data {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        gap: 1rem;
        padding-top: 1.5rem;
      }

      .data code {
        display: block;
        width: 50%;
        flex-grow: 1;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.5rem;
        padding: 0.75rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {
  @Input() loading: boolean = false;
  @Input() synchronized: boolean = false;
  @Input() editingMode: EditingMode = EditingMode.Editing;
  @Input() task?: Task;
  @Input() set formData(formData: TaskFormData) {
    this.form.patchValue(formData);
  }

  @Output() formDataChange: EventEmitter<TaskFormData> =
    new EventEmitter<TaskFormData>();

  @Output() onSave: EventEmitter<TaskFormData> =
    new EventEmitter<TaskFormData>();

  protected readonly form: FormGroup = new FormGroup({
    description: new FormControl<string>('', [Validators.required]),
    status: new FormControl<Status | null>(null, [Validators.required]),
    priority: new FormControl<Priority | null>(null, [Validators.required]),
    deadline: new FormControl<Date | null>(null),
  });

  valueChanges$: Observable<Partial<Task>> = this.form.valueChanges.pipe(
    tap((formData: Partial<Task>) => this.formDataChange.emit(formData))
  );

  protected save(): void {
    if (this.form.invalid && !this.synchronized) return;
    this.onSave.emit({ ...this.task, ...this.form.value });
  }

  protected reset(): void {
    if (this.editingMode === EditingMode.Editing && this.task) {
      this.form.patchValue(this.task);
      return;
    }
    this.form.reset();
  }
}
