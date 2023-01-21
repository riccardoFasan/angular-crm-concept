import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { PriorityChipComponent } from '../priority-chip/priority-chip.component';
import { StatusChipComponent } from '../status-chip/status-chip.component';

@Component({
  selector: 'app-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    PriorityChipComponent,
    StatusChipComponent,
    MatTableModule,
    MatProgressBarModule,
  ],
  template: `
    <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
    <table
      [ngStyle]="{ 'marginTop.px': !loading ? '4' : '0' }"
      mat-table
      [dataSource]="tasks"
    >
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let element">#{{ element.id }}</td>
      </ng-container>

      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef>Description</th>
        <td mat-cell *matCellDef="let element">{{ element.description }}</td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Status</th>
        <td mat-cell *matCellDef="let element">
          <app-status-chip [status]="element.status"></app-status-chip>
        </td>
      </ng-container>

      <ng-container matColumnDef="priority">
        <th mat-header-cell *matHeaderCellDef>Priority</th>
        <td mat-cell *matCellDef="let element">
          <app-priority-chip [priority]="element.priority"></app-priority-chip>
        </td>
      </ng-container>

      <ng-container matColumnDef="deadline">
        <th mat-header-cell *matHeaderCellDef>Deadline</th>
        <td mat-cell *matCellDef="let element">
          {{ element.deadline | date : 'dd MMMM YYYY' }}
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
    </table>
  `,
  styles: [],
})
export class ListComponent {
  @Input() tasks: Task[] = [];
  @Input() loading: boolean = false;

  protected readonly columns: string[] = [
    'id',
    'description',
    'status',
    'priority',
    'deadline',
  ];
}
