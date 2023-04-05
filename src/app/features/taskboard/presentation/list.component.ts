import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sorting, Task } from 'src/app/shared/models';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { PriorityChipComponent, StatusChipComponent } from '.';
import { SortOrder } from 'src/app/shared/enums';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    PriorityChipComponent,
    StatusChipComponent,
  ],
  template: `
    <table
      mat-table
      matSort
      (matSortChange)="onSortChange($event)"
      [dataSource]="tasks"
    >
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let task">#{{ task.id }}</td>
      </ng-container>

      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Description</th>
        <td mat-cell *matCellDef="let task" [routerLink]="[task.id]">
          {{ task.description }}
        </td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
        <td mat-cell *matCellDef="let task">
          <app-status-chip [status]="task.status"></app-status-chip>
        </td>
      </ng-container>

      <ng-container matColumnDef="priority">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Priority</th>
        <td mat-cell *matCellDef="let task">
          <app-priority-chip [priority]="task.priority"></app-priority-chip>
        </td>
      </ng-container>

      <ng-container matColumnDef="deadline">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Deadline</th>
        <td mat-cell *matCellDef="let task">
          {{ task.deadline | date : 'dd MMMM YYYY' }}
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef mat-sort-header></th>
        <td mat-cell *matCellDef="let task">
          <div class="actions">
            <button
              mat-icon-button
              color="accent"
              aria-label="Edit task"
              [routerLink]="[task.id]"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              aria-label="Remove task"
              (click)="remove(task)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="columns"></tr>
      <tr mat-row *matRowDef="let row; columns: columns"></tr>
    </table>
  `,
  styles: [
    `
      :host {
        max-width: 100%;
        overflow-x: auto;

        table tr td {
          cursor: pointer;

          div.actions {
            display: flex;
          }
        }
      }
    `,
  ],
})
export class ListComponent {
  @Input() tasks: Task[] = [];
  @Input() sorting?: Sorting;

  @Output() sortingChange: EventEmitter<Sorting> = new EventEmitter<Sorting>();
  @Output() taskRemoved: EventEmitter<Task> = new EventEmitter<Task>();

  protected readonly columns: string[] = [
    'id',
    'description',
    'status',
    'priority',
    'deadline',
    'actions',
  ];

  protected onSortChange(e: Sort): void {
    const order: SortOrder = this.mapSortDirection(e.direction);
    this.sortingChange.emit({ property: e.active, order });
  }

  protected remove(task: Task): void {
    this.taskRemoved.emit(task);
  }

  private mapSortDirection(direction: SortDirection): SortOrder {
    if (!direction) return SortOrder.None;
    return direction === 'asc' ? SortOrder.Ascending : SortOrder.Descending;
  }
}
