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
import { Filters, Option } from 'src/app/shared/models';
import { Priority, Status } from 'src/app/shared/enums';
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
    <div class="filters" [ngClass]="{ 'filters-mobile': mobile }">
      <mat-form-field appearance="outline">
        <mat-label>Status</mat-label>
        <mat-select
          [disabled]="optionsLoading"
          [(ngModel)]="status"
          (ngModelChange)="onStatusChange()"
        >
          <mat-option *ngFor="let state of states" [value]="state.value">
            {{ state.label }}
          </mat-option>
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
        <mat-select
          [disabled]="optionsLoading"
          [(ngModel)]="priority"
          (ngModelChange)="onPriorityChange()"
        >
          <mat-option
            *ngFor="let priority of priorities"
            [value]="priority.value"
          >
            {{ priority.label }}
          </mat-option>
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
    </div>
  `,
  styles: [
    `
      :host {
        &,
        .filters {
          display: flex;
          flex-direction: row;
          justify-content: stretch;
          gap: 1rem;
        }

        mat-form-field {
          flex: 1;
        }

        .filters.filters-mobile {
          padding: 1rem 1rem 0 1rem;
          flex-direction: column;
        }
      }
    `,
  ],
})
export class FiltersComponent {
  @Input() status?: Status;
  @Input() priority?: Priority;
  @Input() deadline?: Date;

  @Input() priorities: Option<Priority>[] = [];
  @Input() states: Option<Status>[] = [];
  @Input() optionsLoading: boolean = false;
  @Input() mobile: boolean = false;

  @Output() statusChange: EventEmitter<Status> = new EventEmitter<Status>();
  @Output() priorityChange: EventEmitter<Priority> =
    new EventEmitter<Priority>();
  @Output() deadlineChange: EventEmitter<Date> = new EventEmitter<Date>();

  protected onStatusChange(): void {
    this.statusChange.emit(this.status);
  }

  protected onPriorityChange(): void {
    this.priorityChange.emit(this.priority);
  }

  protected onDeadlineChange(): void {
    this.deadlineChange.emit(this.deadline);
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
