import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesFiltersStoreService } from '../store';
import { provideComponentStore } from '@ngrx/component-store';
import { AssignmentRole, EmployeeRole } from 'src/app/core/enums';
import { Option, EmployeesFilters } from 'src/app/core/models';
import { Observable } from 'rxjs';
import { ErrorSnackbarDirective } from 'src/app/shared/directives';
import { EmployeesSearchComponent } from '../presentation/employees-search.component';

@Component({
  selector: 'app-employees-filters-container',
  standalone: true,
  imports: [CommonModule, EmployeesSearchComponent, ErrorSnackbarDirective],
  template: `
    <ng-container
      *ngIf="{
        filters: filters$ | async,
        assignments: assignments$ | async,
        jobs: jobs$ | async,
        optionsLoading: optionsLoading$ | async,
        error: error$ | async
      } as vm"
    >
      <app-employees-search
        [filters]="vm.filters!"
        [assignments]="vm.assignments!"
        [jobs]="vm.jobs!"
        [optionsLoading]="vm.optionsLoading!"
        (filtersChange)="onFiltersChange($event)"
      ></app-employees-search>
      <app-error-snackbar
        *ngIf="vm.error"
        [message]="vm.error"
        (dismissed)="onSnackbardDismissed()"
      ></app-error-snackbar>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(EmployeesFiltersStoreService)],
})
export class EmployeesFiltersContainerComponent {
  private readonly store: EmployeesFiltersStoreService = inject(
    EmployeesFiltersStoreService
  );

  @Input() set filters(filters: EmployeesFilters) {
    this.store.updateFilters(filters);
  }

  @Output() filtersChange: EventEmitter<EmployeesFilters> =
    new EventEmitter<EmployeesFilters>();

  protected readonly filters$: Observable<EmployeesFilters> =
    this.store.filters$;
  protected readonly assignments$: Observable<Option<AssignmentRole>[]> =
    this.store.assignments$;
  protected readonly jobs$: Observable<Option<EmployeeRole>[]> =
    this.store.jobs$;
  protected readonly optionsLoading$: Observable<boolean> =
    this.store.optionsLoading$;
  protected readonly error$: Observable<string | undefined> = this.store.error$;

  protected onFiltersChange(filters: EmployeesFilters): void {
    this.filtersChange.emit(filters);
  }

  protected onSnackbardDismissed(): void {
    this.store.clearError();
  }
}
