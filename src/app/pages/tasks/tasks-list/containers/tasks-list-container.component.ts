import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import {
  TasksFilters,
  Pagination,
  Sorting,
  Task,
  SearchCriteria,
} from 'src/app/core/models';
import { TaskCardComponent, TasksListComponent } from '../presentation';
import { provideComponentStore } from '@ngrx/component-store';
import { ErrorSnackbarDirective } from 'src/app/shared/directives';
import { MobileObserverService } from 'src/app/shared/services';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PaginationComponent } from 'src/app/shared/components';
import { ListStoreService } from 'src/app/features/list/store/list-store.service';
import { ITEM_ADAPTER } from 'src/app/core/tokens';
import { TasksAdapterService } from '../services/tasks-adapter.service';
import { TasksSearchComponent } from '../presentation/tasks-search.component';
import { CardsComponent } from 'src/app/features/list/presentation';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-tasks-list-container',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatRippleModule,
    TasksListComponent,
    CardsComponent,
    PaginationComponent,
    TasksSearchComponent,
    TaskCardComponent,
    ErrorSnackbarDirective,
  ],
  providers: [
    {
      provide: ITEM_ADAPTER,
      useClass: TasksAdapterService,
    },
    provideComponentStore(ListStoreService),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *ngIf="{
        items: items$ | async,
        count: count$ | async,
        searchCriteria: searchCriteria$ | async,
        loading: loading$ | async,
        error: error$ | async,
        mobile: mobile$ | async
      } as vm"
    >
      <mat-card [ngClass]="{ fixed: vm.mobile }">
        <app-tasks-search
          [filters]="vm.searchCriteria!.filters!"
          (filtersChange)="onFiltersChange($event)"
        ></app-tasks-search>
        <ng-container *ngIf="!vm.mobile">
          <app-tasks-list
            [items]="vm.items!"
            [sorting]="vm.searchCriteria!.sorting"
            (sortingChange)="onSortingChange($event)"
            (itemRemoved)="onTaskRemoved($event)"
          ></app-tasks-list>
          <app-pagination
            [pagination]="vm.searchCriteria!.pagination"
            [count]="vm.count!"
            [loading]="vm.loading!"
            (paginationChange)="onPaginationChange($event)"
          >
            <button mat-button color="accent" [routerLink]="['new']">
              Create new task
            </button>
          </app-pagination>
        </ng-container>
      </mat-card>
      <button
        *ngIf="vm.mobile"
        mat-fab
        color="primary"
        aria-label="Create new task"
        color="accent"
        [routerLink]="['new']"
      >
        <mat-icon>add</mat-icon>
      </button>
      <app-cards
        *ngIf="vm.mobile"
        [items]="vm.items!"
        [loading]="!!vm.loading"
        [count]="vm.count!"
        [pagination]="vm.searchCriteria!.pagination"
        (paginationChange)="onPaginationChange($event)"
      >
        <ng-template let-item #card>
          <app-task-card [task]="item"></app-task-card>
        </ng-template>
      </app-cards>
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

        button {
          margin-left: 0.5rem;
        }
      }

      button[mat-fab] {
        position: fixed;
        right: 1rem;
        bottom: 20vh;
        z-index: 100;
      }

      mat-card:has(app-filters-container).fixed {
        margin-left: -1rem;
        margin-right: -1rem;
        margin-top: -1rem;
      }
    `,
  ],
})
export class TasksListContainerComponent {
  private readonly store: ListStoreService<Task> = inject(
    ListStoreService<Task>
  );
  private readonly mobileObserver: MobileObserverService = inject(
    MobileObserverService
  );

  protected readonly items$: Observable<Task[]> = this.store.items$;
  protected readonly searchCriteria$: Observable<SearchCriteria> =
    this.store.searchCriteria$;
  protected readonly loading$: Observable<boolean> = this.store.loading$;

  protected readonly error$: Observable<string | undefined> = this.store.error$;
  protected readonly count$: Observable<number> = this.store.count$;

  protected readonly mobile$: Observable<boolean> = this.mobileObserver.mobile$;

  protected onFiltersChange(filters: TasksFilters): void {
    this.store.filter(filters);
  }

  protected onSortingChange(sorting: Sorting): void {
    this.store.sort(sorting);
  }

  protected onPaginationChange(pagination: Pagination): void {
    this.store.paginate(pagination);
  }

  protected onTaskRemoved(task: Task): void {
    this.store.removeItem(task);
  }

  protected onSnackbardDismissed(): void {
    this.store.clearError();
  }
}
