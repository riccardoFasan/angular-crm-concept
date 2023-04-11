import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksFiltersStoreService } from '../store';
import { provideComponentStore } from '@ngrx/component-store';
import { Priority, Status } from 'src/app/core/enums';
import { TasksFilters, Option } from 'src/app/core/models';
import { Observable } from 'rxjs';
import { ErrorSnackbarDirective } from 'src/app/shared/directives';
import { TasksSearchComponent } from '../presentation/tasks-search.component';

@Component({
  selector: 'app-tasks-filters-container',
  standalone: true,
  imports: [CommonModule, TasksSearchComponent, ErrorSnackbarDirective],
  template: `
    <ng-container
      *ngIf="{
        filters: filters$ | async,
        priorities: priorities$ | async,
        states: states$ | async,
        optionsLoading: optionsLoading$ | async,
        error: error$ | async
      } as vm"
    >
      <app-tasks-search
        [filters]="vm.filters!"
        [priorities]="vm.priorities!"
        [states]="vm.states!"
        [optionsLoading]="vm.optionsLoading!"
        (filtersChange)="onFiltersChange($event)"
      ></app-tasks-search>
      <app-error-snackbar
        *ngIf="vm.error"
        [message]="vm.error"
        (dismissed)="onSnackbardDismissed()"
      ></app-error-snackbar>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(TasksFiltersStoreService)],
})
export class TasksFiltersContainerComponent {
  private readonly store: TasksFiltersStoreService = inject(
    TasksFiltersStoreService
  );

  @Input() set filters(filters: TasksFilters) {
    this.store.updateFilters(filters);
  }

  @Output() filtersChange: EventEmitter<TasksFilters> =
    new EventEmitter<TasksFilters>();

  protected readonly filters$: Observable<TasksFilters> = this.store.filters$;
  protected readonly priorities$: Observable<Option<Priority>[]> =
    this.store.priorities$;
  protected readonly states$: Observable<Option<Status>[]> = this.store.states$;
  protected readonly optionsLoading$: Observable<boolean> =
    this.store.optionsLoading$;
  protected readonly error$: Observable<string | undefined> = this.store.error$;

  protected onFiltersChange(filters: TasksFilters): void {
    this.filtersChange.emit(filters);
  }

  protected onSnackbardDismissed(): void {
    this.store.clearError();
  }
}
