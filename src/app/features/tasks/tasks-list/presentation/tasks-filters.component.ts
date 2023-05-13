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
import { MatIconModule } from '@angular/material/icon';
import { Option } from 'src/app/core/models';
import { Priority, TaskStatus } from 'src/app/core/enums';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { DateFieldComponent } from 'src/app/shared/components';

@Component({
  selector: 'app-tasks-filters',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    DateFieldComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-grid-list
      [cols]="mobile ? '1' : '3'"
      gutterSize="1rem"
      rowHeight="fit"
    >
      <mat-grid-tile colspan="1" rowspan="1">
        <mat-form-field appearance="outline">
          <mat-label>TaskStatus</mat-label>
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
      </mat-grid-tile>
      <mat-grid-tile colspan="1" rowspan="1">
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
      </mat-grid-tile>
      <mat-grid-tile colspan="1" rowspan="1">
        <app-date-field
          [label]="'Deadline'"
          [date]="deadline!"
          (dateChange)="onDeadlineChange($event)"
        ></app-date-field>
      </mat-grid-tile>
    </mat-grid-list>
  `,
  styles: [
    `
      :host {
        $row-height: 5rem;

        h3 {
          margin-bottom: 2rem;
        }

        mat-grid-list {
          width: 100%;

          &[cols='3'] {
            height: $row-height;
          }

          &[cols='1'] {
            height: $row-height * 3;

            mat-grid-tile {
              padding: 1rem 0;
            }
          }

          mat-grid-tile mat-form-field {
            width: 100%;
          }
        }
      }
    `,
  ],
})
export class TasksFiltersComponent {
  @Input() mobile: boolean = false;

  @Input() status?: TaskStatus;
  @Input() priority?: Priority;
  @Input() deadline?: Date;

  @Input() priorities: Option<Priority>[] = [];
  @Input() states: Option<TaskStatus>[] = [];
  @Input() optionsLoading: boolean = false;

  @Output() statusChange: EventEmitter<TaskStatus> =
    new EventEmitter<TaskStatus>();
  @Output() priorityChange: EventEmitter<Priority> =
    new EventEmitter<Priority>();
  @Output() deadlineChange: EventEmitter<Date> = new EventEmitter<Date>();

  protected onStatusChange(): void {
    this.statusChange.emit(this.status);
  }

  protected onPriorityChange(): void {
    this.priorityChange.emit(this.priority);
  }

  protected onDeadlineChange(deadline: Date | undefined): void {
    this.deadline = deadline;
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
    this.onDeadlineChange(this.deadline);
  }
}
