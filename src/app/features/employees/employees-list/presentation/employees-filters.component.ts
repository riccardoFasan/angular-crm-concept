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
import { Option } from 'src/app/core/models';
import {
  AssignmentRole,
  EmployeeRole,
  Priority,
  Status,
} from 'src/app/core/enums';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-employees-filters',
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
    MatGridListModule,
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
          <mat-label>Assignment</mat-label>
          <mat-select
            [disabled]="optionsLoading"
            [(ngModel)]="assignment"
            (ngModelChange)="onAssignmentChange()"
          >
            <mat-option
              *ngFor="let assignment of assignments"
              [value]="assignment.value"
            >
              {{ assignment.label }}
            </mat-option>
          </mat-select>
          <button
            *ngIf="assignment"
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
          <mat-label>Job</mat-label>
          <mat-select
            [disabled]="optionsLoading"
            [(ngModel)]="job"
            (ngModelChange)="onJobChange()"
          >
            <mat-option *ngFor="let job of jobs" [value]="job.value">
              {{ job.label }}
            </mat-option>
          </mat-select>
          <button
            *ngIf="job"
            matSuffix
            mat-icon-button
            aria-label="Clear"
            (click)="clearPriority()"
          >
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>
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
export class EmployeesFiltersComponent {
  @Input() mobile: boolean = false;

  @Input() assignment?: AssignmentRole;
  @Input() job?: EmployeeRole;

  @Input() assignments: Option<AssignmentRole>[] = [];
  @Input() jobs: Option<EmployeeRole>[] = [];
  @Input() optionsLoading: boolean = false;

  @Output() assignmentChange: EventEmitter<AssignmentRole> =
    new EventEmitter<AssignmentRole>();
  @Output() jobChange: EventEmitter<EmployeeRole> =
    new EventEmitter<EmployeeRole>();

  protected onAssignmentChange(): void {
    this.assignmentChange.emit(this.assignment);
  }

  protected onJobChange(): void {
    this.jobChange.emit(this.job);
  }

  protected clearStatus(): void {
    this.assignment = undefined;
    this.onAssignmentChange();
  }

  protected clearPriority(): void {
    this.job = undefined;
    this.onJobChange();
  }
}
