import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Observable } from 'rxjs';
import {
  Pagination,
  Sorting,
  Employee,
  EmployeesSearchCriteria,
  EmployeesFilters,
} from 'src/app/core/models';
import {
  EmployeeCardComponent,
  EmployeesListComponent,
  EmployeesSearchComponent,
} from '../presentation';
import { provideComponentStore } from '@ngrx/component-store';
import { ErrorSnackbarDirective } from 'src/app/shared/directives';
import { MobileObserverService } from 'src/app/shared/services';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CardsComponent, PaginationComponent } from 'src/app/shared/components';
import { ITEM_ADAPTER } from 'src/app/core/tokens';
import { ListStoreService } from 'src/app/core/store';
import { EmployeesAdapterService } from '../../services';

@Component({
  selector: 'app-employees-list-container',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    EmployeesListComponent,
    EmployeeCardComponent,
    CardsComponent,
    PaginationComponent,
    EmployeesSearchComponent,
    ErrorSnackbarDirective,
  ],
  providers: [
    {
      provide: ITEM_ADAPTER,
      useClass: EmployeesAdapterService,
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
        <app-employees-search
          [filters]="vm.searchCriteria!.filters!"
          (filtersChange)="onFiltersChange($event)"
        ></app-employees-search>
        <ng-container *ngIf="!vm.mobile">
          <app-employees-list
            [items]="vm.items!"
            [sorting]="vm.searchCriteria!.sorting"
            (sortingChange)="onSortingChange($event)"
            (itemRemoved)="onEmployeeRemoved($event)"
          ></app-employees-list>
          <app-pagination
            [pagination]="vm.searchCriteria!.pagination"
            [count]="vm.count!"
            [loading]="vm.loading!"
            (paginationChange)="onPaginationChange($event)"
          >
            <button mat-button color="accent" [routerLink]="['new']">
              Create new employee
            </button>
          </app-pagination>
        </ng-container>
      </mat-card>
      <button
        *ngIf="vm.mobile"
        mat-fab
        color="primary"
        aria-label="Create new employee"
        color="accent"
        [routerLink]="['new']"
      >
        <mat-icon>add</mat-icon>
      </button>
      <app-cards
        *ngIf="vm.mobile"
        [items]="vm.items!"
        [filters]="vm.searchCriteria!.filters!"
        [loading]="!!vm.loading"
        [count]="vm.count!"
        [pagination]="vm.searchCriteria!.pagination"
        (paginationChange)="onPaginationChange($event)"
      >
        <ng-template let-item #card>
          <app-employee-card [employee]="item"> </app-employee-card>
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
export class EmployeesListContainerComponent {
  private readonly store: ListStoreService<Employee> = inject(
    ListStoreService<Employee>
  );
  private readonly mobileObserver: MobileObserverService = inject(
    MobileObserverService
  );

  protected readonly items$: Observable<Employee[]> = this.store.items$;
  protected readonly searchCriteria$: Observable<EmployeesSearchCriteria> =
    this.store.searchCriteria$;
  protected readonly loading$: Observable<boolean> = this.store.loading$;

  protected readonly error$: Observable<string | undefined> = this.store.error$;
  protected readonly count$: Observable<number> = this.store.count$;

  protected readonly mobile$: Observable<boolean> = this.mobileObserver.mobile$;

  protected onFiltersChange(filters: EmployeesFilters): void {
    this.store.filter(filters);
  }

  protected onSortingChange(sorting: Sorting): void {
    this.store.sort(sorting);
  }

  protected onPaginationChange(pagination: Pagination): void {
    this.store.paginate(pagination);
  }

  protected onEmployeeRemoved(employee: Employee): void {
    this.store.removeItem(employee);
  }

  protected onSnackbardDismissed(): void {
    this.store.clearError();
  }
}
