import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sorting, Task } from '../../models';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { PriorityChipComponent } from '../priority-chip/priority-chip.component';
import { StatusChipComponent } from '../status-chip/status-chip.component';
import { SortOrder } from '../../enums';

@Component({
  selector: 'app-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatTableModule,
    MatProgressBarModule,
    MatSortModule,
    PriorityChipComponent,
    StatusChipComponent,
  ],
  template: `
    <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
    <table
      mat-table
      matSort
      (matSortChange)="onSortChange($event)"
      [ngStyle]="{ 'marginTop.px': !loading ? '4' : '0' }"
      [dataSource]="tasks"
    >
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let element">#{{ element.id }}</td>
      </ng-container>

      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Description</th>
        <td mat-cell *matCellDef="let element">{{ element.description }}</td>
      </ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
        <td mat-cell *matCellDef="let element">
          <app-status-chip [status]="element.status"></app-status-chip>
        </td>
      </ng-container>

      <ng-container matColumnDef="priority">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Priority</th>
        <td mat-cell *matCellDef="let element">
          <app-priority-chip [priority]="element.priority"></app-priority-chip>
        </td>
      </ng-container>

      <ng-container matColumnDef="deadline">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Deadline</th>
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
  @Input() sorting?: Sorting;

  @Output() sortingChange: EventEmitter<Sorting> = new EventEmitter<Sorting>();

  protected readonly columns: string[] = [
    'id',
    'description',
    'status',
    'priority',
    'deadline',
  ];

  protected onSortChange(e: Sort): void {
    const order: SortOrder = this.mapSortDirection(e.direction);
    this.sortingChange.emit({ property: e.active, order });
  }

  private mapSortDirection(direction: SortDirection): SortOrder {
    if (!direction) return SortOrder.None;
    return direction === 'asc' ? SortOrder.Ascending : SortOrder.Descending;
  }
}
