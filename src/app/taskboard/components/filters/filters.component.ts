import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Filters } from '../../models';
import { Priority, Status } from '../../enums';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Description</mat-label>
      <input
        [(ngModel)]="description"
        (input)="onDescriptionChange()"
        matInput
        type="text"
      />
      <button
        *ngIf="description"
        matSuffix
        mat-icon-button
        aria-label="Clear"
        (click)="clearDecription()"
      >
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Status</mat-label>
      <mat-select [(ngModel)]="status" (ngModelChange)="onStatusChange()">
        <mat-option value="NOT_STARTED">Not Started</mat-option>
        <mat-option value="IN_PROGRESS">In Progress</mat-option>
        <mat-option value="IN_REVIEW">In Review</mat-option>
        <mat-option value="COMPLETED">Completed</mat-option>
      </mat-select>
      <button
        *ngIf="status"
        matSuffix
        mat-icon-button
        aria-label="Clear"
        (click)="clearStatus()"
      >
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Priority</mat-label>
      <mat-select [(ngModel)]="priority" (ngModelChange)="onPriorityChange()">
        <mat-option value="LOW">Low</mat-option>
        <mat-option value="MEDIUM">Medium</mat-option>
        <mat-option value="TOP">Top</mat-option>
      </mat-select>
      <button
        *ngIf="priority"
        matSuffix
        mat-icon-button
        aria-label="Clear"
        (click)="clearPriority()"
      >
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>

    <mat-form-field appearance="outline">
      <mat-label>Deadline</mat-label>
      <input
        [(ngModel)]="deadline"
        (ngModelChange)="onDeadlineChange()"
        [matDatepicker]="picker"
        matInput
      />
      <mat-hint>mm/dd/yyyy</mat-hint>
      <mat-datepicker-toggle
        matIconSuffix
        [for]="picker"
      ></mat-datepicker-toggle>
      <button
        *ngIf="deadline"
        matSuffix
        mat-icon-button
        aria-label="Clear"
        (click)="clearDeadline()"
      >
        <mat-icon>close</mat-icon>
      </button>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: stretch;
        padding: 1rem 1rem 0 1rem;
        margin-bottom: 2rem;
        gap: 1rem;
      }

      mat-form-field {
        flex-grow: 1;
      }
    `,
  ],
})
export class FiltersComponent {
  @Input() loading: boolean = false;
  @Input() filters!: Filters;

  @Output() filtersChange: EventEmitter<Filters> = new EventEmitter<Filters>();

  protected description: string = '';
  protected status?: Status;
  protected priority?: Priority;
  protected deadline?: Date;

  protected onDescriptionChange(): void {
    if (this.description.length < 3 && this.description !== '') return;
    this.filtersChange.emit({ ...this.filters, description: this.description });
  }

  protected onStatusChange(): void {
    this.filtersChange.emit({ ...this.filters, status: this.status });
  }

  protected onPriorityChange(): void {
    this.filtersChange.emit({ ...this.filters, priority: this.priority });
  }

  protected onDeadlineChange(): void {
    this.filtersChange.emit({ ...this.filters, deadline: this.deadline });
  }

  protected clearDecription(): void {
    this.description = '';
    this.onDescriptionChange();
  }

  protected clearStatus(): void {
    this.status = undefined;
    this.onStatusChange();
  }

  protected clearPriority(): void {
    this.priority = undefined;
    this.onPriorityChange();
  }

  protected clearDeadline(): void {
    this.deadline = undefined;
    this.onDeadlineChange();
  }
}
