import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import {
  Filters,
  Pagination,
  SearchCriteria,
  Sorting,
  Task,
} from 'src/app/shared/models';
import {
  FiltersComponent,
  ListComponent,
  PaginationComponent,
} from '../presentation';
import { TaskboardStoreService } from '../store';
import { provideComponentStore } from '@ngrx/component-store';

@Component({
  selector: 'app-taskboard-container',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ListComponent,
    PaginationComponent,
    FiltersComponent,
  ],
  providers: [provideComponentStore(TaskboardStoreService)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card
      *ngIf="{
        tasks: tasks$ | async,
        count: count$ | async,
        searchCriteria: searchCriteria$ | async,
        loading: loading$ | async
      } as vm"
    >
      <app-filters
        [filters]="vm.searchCriteria!.filters"
        [loading]="vm.loading!"
        (filtersChange)="onFiltersChange($event)"
      ></app-filters>
      <app-list
        [tasks]="vm.tasks!"
        [loading]="vm.loading!"
        [sorting]="vm.searchCriteria!.sorting"
        (sortingChange)="onSortingChange($event)"
        (taskRemoved)="onTaskRemoved($event)"
      ></app-list>
      <app-pagination
        [pagination]="vm.searchCriteria!.pagination"
        [count]="vm.count!"
        [loading]="vm.loading!"
        (paginationChange)="onPaginationChange($event)"
      ></app-pagination>
    </mat-card>
  `,
  styles: [
    `
      app-pagination {
        display: inline-block;
        margin-top: 1rem;
      }
    `,
  ],
})
export class TaskboardContainerComponent {
  private readonly store: TaskboardStoreService = inject(TaskboardStoreService);

  protected readonly tasks$: Observable<Task[]> = this.store.tasks$;
  protected readonly loading$: Observable<boolean> = this.store.loading$;
  protected readonly searchCriteria$: Observable<SearchCriteria> =
    this.store.searchCriteria$;
  protected readonly count$: Observable<number> = this.store.count$;

  protected onFiltersChange(filters: Filters): void {
    this.store.updateFilters(filters);
  }

  protected onSortingChange(sorting: Sorting): void {
    this.store.updateSorting(sorting);
  }

  protected onPaginationChange(pagination: Pagination): void {
    this.store.updatePagination(pagination);
  }

  protected onTaskRemoved(task: Task): void {
    this.store.removeTask(task);
  }
}
