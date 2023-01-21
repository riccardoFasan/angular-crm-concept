import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { PriorityColorPipe, StatusColorPipe } from '../../pipes';

@Component({
  selector: 'app-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    PriorityColorPipe,
    StatusColorPipe,
  ],
  template: `<table mat-table [dataSource]="tasks">
    <ng-container matColumnDef="description">
      <th mat-header-cell *matHeaderCellDef>Description</th>
      <td mat-cell *matCellDef="let element">{{ element.description }}</td>
    </ng-container>

    <ng-container matColumnDef="status">
      <th mat-header-cell *matHeaderCellDef>Status</th>
      <td mat-cell *matCellDef="let element">
        <mat-chip
          [color]="element.priority | statusColor"
          [disableRipple]="true"
        >
          {{ element.status }}
        </mat-chip>
      </td>
    </ng-container>

    <ng-container matColumnDef="priority">
      <th mat-header-cell *matHeaderCellDef>Priority</th>
      <td mat-cell *matCellDef="let element">
        <mat-chip
          [color]="element.priority | priorityColor"
          [disableRipple]="true"
        >
          {{ element.priority }}
        </mat-chip>
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
  </table>`,
  styles: [],
})
export class ListComponent {
  @Input() tasks: Task[] = [];
  @Input() loading: boolean = false;

  protected readonly columns: string[] = [
    'description',
    'status',
    'priority',
    'deadline',
  ];
}
