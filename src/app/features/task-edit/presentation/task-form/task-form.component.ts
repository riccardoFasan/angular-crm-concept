import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditingMode } from 'src/app/shared/enums';
import { Task } from 'src/app/shared/models';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  template: `
    <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>

    <form>
      <div>
        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <input matInput type="text" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select>
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
          <mat-select>
            <mat-option value="LOW">Low</mat-option>
            <mat-option value="MEDIUM">Medium</mat-option>
            <mat-option value="TOP">Top</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Deadline</mat-label>
          <input [matDatepicker]="picker" matInput />
          <mat-hint>mm/dd/yyyy</mat-hint>
          <mat-datepicker-toggle
            matIconSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
      </div>
    </form>
  `,
  styles: [
    `
      form > div {
        display: flex;
        justify-align: space-between;
        align-items: center;
        padding: 1rem 1rem 0 1rem;
        gap: 1rem;
      }

      form div mat-form-field {
        width: 50%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {
  @Input() loading: boolean = false;
  @Input() set formData(formData: Partial<Task>) {}
  @Input() set task(task: Task) {}
  @Input() synchronized: boolean = false;
  @Input() editingMode: EditingMode = EditingMode.Editing;

  @Output() formDataChange: EventEmitter<Partial<Task>> = new EventEmitter<
    Partial<Task>
  >();
}
