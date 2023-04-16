import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee, Sorting } from 'src/app/core/models';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { SortOrder } from 'src/app/core/enums';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EmployeeRoleChipComponent } from './employee-role-chip.component';

@Component({
  selector: 'app-employees-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    EmployeeRoleChipComponent,
  ],
  template: `
    <table
      mat-table
      matSort
      (matSortChange)="onSortChange($event)"
      [dataSource]="items"
    >
      <ng-container matColumnDef="id">
        <th mat-header-cell *matHeaderCellDef>ID</th>
        <td mat-cell *matCellDef="let item">#{{ item.id }}</td>
      </ng-container>

      <ng-container matColumnDef="picture">
        <th mat-header-cell *matHeaderCellDef>Picture</th>
        <td mat-cell *matCellDef="let item" [routerLink]="[item.id]">
          <img
            [src]="item.pictureUrl"
            alt="{{ item.firstName }} {{ item.lastName }}"
          />
        </td>
      </ng-container>

      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
        <td mat-cell *matCellDef="let item">
          <a [routerLink]="[item.id]">
            {{ item.firstName }} {{ item.lastName }}
          </a>
        </td>
      </ng-container>

      <ng-container matColumnDef="email">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
        <td mat-cell *matCellDef="let item">
          {{ item.email }}
        </td>
      </ng-container>

      <ng-container matColumnDef="roles">
        <th mat-header-cell *matHeaderCellDef>Roles</th>
        <td mat-cell *matCellDef="let item">
          <app-employee-role-chip
            *ngFor="let role of item.roles"
            [role]="role"
          ></app-employee-role-chip>
        </td>
      </ng-container>

      <ng-container matColumnDef="tasks">
        <th mat-header-cell *matHeaderCellDef>Tasks</th>
        <td mat-cell *matCellDef="let item">
          <ng-container *ngFor="let assignment of item.assignments">
            <a [routerLink]="['/tasks', assignment.task.id]">
              {{ assignment.task.description }}
            </a>
            <br />
          </ng-container>
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef mat-sort-header></th>
        <td mat-cell *matCellDef="let item">
          <div class="actions">
            <button
              mat-icon-button
              color="accent"
              aria-label="Edit employee"
              [routerLink]="[item.id]"
            >
              <mat-icon>edit</mat-icon>
            </button>
            <button
              mat-icon-button
              color="warn"
              aria-label="Remove employee"
              (click)="remove(item)"
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
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;

          img {
            object-fit: cover;
            border-radius: 50%;
            width: 4rem;
            height: 4rem;
          }

          a {
            color: #3cb1ff;
          }

          app-employee-role-chip {
            display: inline-block;
            margin: 0.25rem;
          }

          div.actions {
            display: flex;
          }
        }
      }
    `,
  ],
})
export class EmployeesListComponent {
  @Input() items: Employee[] = [];
  @Input() sorting?: Sorting;

  @Output() sortingChange: EventEmitter<Sorting> = new EventEmitter<Sorting>();
  @Output() itemRemoved: EventEmitter<Employee> = new EventEmitter<Employee>();

  protected readonly columns: string[] = [
    'id',
    'picture',
    'name',
    'email',
    'roles',
    'tasks',
    'actions',
  ];

  protected onSortChange(e: Sort): void {
    const order: SortOrder = this.mapSortDirection(e.direction);
    this.sortingChange.emit({ property: e.active, order });
  }

  protected remove(item: Employee): void {
    this.itemRemoved.emit(item);
  }

  private mapSortDirection(direction: SortDirection): SortOrder {
    if (!direction) return SortOrder.None;
    return direction === 'asc' ? SortOrder.Ascending : SortOrder.Descending;
  }
}
