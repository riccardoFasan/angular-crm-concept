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
  CardsComponent,
  ListComponent,
  PaginationComponent,
} from '../../presentation';
import { TaskboardStoreService } from '../../store';
import { provideComponentStore } from '@ngrx/component-store';
import { ErrorSnackbarDirective } from 'src/app/shared/directives';
import { FiltersContainerComponent } from '../filters-container/filters-container.component';
import { MobileObserverService } from 'src/app/shared/services';

@Component({
  selector: 'app-taskboard-container',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ListComponent,
    CardsComponent,
    PaginationComponent,
    FiltersContainerComponent,
    ErrorSnackbarDirective,
  ],
  providers: [provideComponentStore(TaskboardStoreService)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *ngIf="{
        tasks: tasks$ | async,
        count: count$ | async,
        searchCriteria: searchCriteria$ | async,
        loading: loading$ | async,
        error: error$ | async,
        mobile: mobile$ | async
      } as vm"
    >
      <mat-card [ngClass]="{ fixed: vm.mobile }">
        <app-filters-container
          [filters]="vm.searchCriteria!.filters"
          (filtersChange)="onFiltersChange($event)"
        >
        </app-filters-container>
        <ng-container *ngIf="!vm.mobile">
          <app-list
            [tasks]="vm.tasks!"
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
        </ng-container>
      </mat-card>
      <app-cards
        *ngIf="vm.mobile"
        [tasks]="vm.tasks!"
        [count]="vm.count!"
        [pagination]="vm.searchCriteria!.pagination"
        (paginationChange)="onPaginationChange($event)"
      ></app-cards>
      <app-error-snackbar
        *ngIf="vm.error"
        [message]="vm.error"
        (dismissed)="onSnackbardDismissed()"
      ></app-error-snackbar>
    </ng-container>
  `,
  styles: [
    `
      app-pagination {
        display: inline-block;
        margin-top: 1rem;
      }

      mat-card:has(app-filters-container).fixed {
        margin-left: -1rem;
        margin-right: -1rem;
        margin-top: -1rem;
      }
    `,
  ],
})
export class TaskboardContainerComponent {
  private readonly store: TaskboardStoreService = inject(TaskboardStoreService);
  private readonly mobileObserver: MobileObserverService = inject(
    MobileObserverService
  );

  protected readonly tasks$: Observable<Task[]> = this.store.tasks$;
  protected readonly searchCriteria$: Observable<SearchCriteria> =
    this.store.searchCriteria$;
  protected readonly loading$: Observable<boolean> = this.store.loading$;

  protected readonly error$: Observable<string | undefined> = this.store.error$;
  protected readonly count$: Observable<number> = this.store.count$;

  protected readonly mobile$: Observable<boolean> = this.mobileObserver.mobile$;

  protected onFiltersChange(filters: Filters): void {
    this.store.filter(filters);
  }

  protected onSortingChange(sorting: Sorting): void {
    this.store.sort(sorting);
  }

  protected onPaginationChange(pagination: Pagination): void {
    this.store.paginate(pagination);
  }

  protected onTaskRemoved(task: Task): void {
    this.store.removeTask(task);
  }

  protected onSnackbardDismissed(): void {
    this.store.clearError();
  }
}
