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
import { AssignmentRole, EmployeeRole } from 'src/app/core/enums';
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
      [cols]="mobile ? '1' : '2'"
      gutterSize="1rem"
      rowHeight="fit"
    >
      <mat-grid-tile colspan="1" rowspan="1">
        <mat-form-field appearance="outline">
          <mat-label>Assignment</mat-label>
          <mat-select
            [(ngModel)]="assignmentRole"
            (ngModelChange)="onAssignmentRoleChange()"
          >
            <mat-option value="WORKER">Worker</mat-option>
            <mat-option value="REVIEWER">Reviewer</mat-option>
          </mat-select>
          <button
            *ngIf="assignmentRole"
            matSuffix
            mat-icon-button
            aria-label="Clear"
            (click)="clearAssignmentRole()"
          >
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>
      </mat-grid-tile>
      <mat-grid-tile colspan="1" rowspan="1">
        <mat-form-field appearance="outline">
          <mat-label>Job</mat-label>
          <mat-select
            [(ngModel)]="employeeRole"
            (ngModelChange)="onEmployeeRoleChange()"
          >
            <mat-option value="PROJECT_MANAGER">Project Manager</mat-option>
            <mat-option value="DESIGNER">Designer</mat-option>
            <mat-option value="DEVELOPER">Developer</mat-option>
            <mat-option value="TESTERED">Tester</mat-option>
          </mat-select>
          <button
            *ngIf="employeeRole"
            matSuffix
            mat-icon-button
            aria-label="Clear"
            (click)="clearEmployeeRole()"
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

          &[cols='2'] {
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

  @Input() assignmentRole?: AssignmentRole;
  @Input() employeeRole?: EmployeeRole;

  @Output() assignmentRoleChange: EventEmitter<AssignmentRole> =
    new EventEmitter<AssignmentRole>();
  @Output() employeeRoleChange: EventEmitter<EmployeeRole> =
    new EventEmitter<EmployeeRole>();

  protected onAssignmentRoleChange(): void {
    this.assignmentRoleChange.emit(this.assignmentRole);
  }

  protected onEmployeeRoleChange(): void {
    this.employeeRoleChange.emit(this.employeeRole);
  }

  protected clearAssignmentRole(): void {
    this.assignmentRole = undefined;
    this.onAssignmentRoleChange();
  }

  protected clearEmployeeRole(): void {
    this.employeeRole = undefined;
    this.onEmployeeRoleChange();
  }
}
