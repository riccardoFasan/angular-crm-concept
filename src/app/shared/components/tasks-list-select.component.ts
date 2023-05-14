import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Pagination,
  Task,
  TasksFilters,
  TasksSearchCriteria,
} from 'src/app/core/models';
import { Observable } from 'rxjs';
import { provideComponentStore } from '@ngrx/component-store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  CdkVirtualScrollViewport,
  ScrollingModule,
} from '@angular/cdk/scrolling';
import { ErrorSnackbarDirective } from '../directives';
import { ITEM_ADAPTER } from 'src/app/core/tokens';
import { TasksAdapterService } from 'src/app/features/tasks/services/tasks-adapter.service';
import { ListStoreService } from 'src/app/core/store';

@Component({
  selector: 'app-tasks-list-select',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    ScrollingModule,
    ErrorSnackbarDirective,
  ],
  template: `
    <ng-container
      *ngIf="{
        items: items$ | async,
        count: count$ | async,
        searchCriteria: searchCriteria$ | async,
        loading: loading$ | async,
        error: error$ | async
      } as vm"
    >
      <mat-form-field appearance="outline">
        <mat-label>Task</mat-label>
        <input
          type="text"
          placeholder="Select a task"
          aria-label="Task"
          matInput
          (input)="onFilterChange($event, vm.searchCriteria!.filters)"
          [formControl]="control"
          [matAutocomplete]="auto"
        />
        <mat-autocomplete
          autoActiveFirstOption
          [displayWith]="display"
          #auto="matAutocomplete"
        >
          <!-- (scrolledIndexChange)="onScroll()" -->
          <cdk-virtual-scroll-viewport [itemSize]="48">
            <mat-option *cdkVirtualFor="let item of vm.items" [value]="item">
              {{ item.description }}
            </mat-option>
          </cdk-virtual-scroll-viewport>
        </mat-autocomplete>
      </mat-form-field>
      <app-error-snackbar
        *ngIf="vm.error"
        [message]="vm.error"
        (dismissed)="onSnackbardDismissed()"
      ></app-error-snackbar>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;

        mat-form-field {
          width: calc(100% - 1px);
        }
      }
    `,
  ],
  providers: [
    {
      provide: ITEM_ADAPTER,
      useExisting: TasksAdapterService,
    },
    provideComponentStore(ListStoreService),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListSelectComponent {
  private readonly store: ListStoreService<Task> = inject(
    ListStoreService<Task>
  );

  @Input() control: FormControl = new FormControl(undefined);

  @ViewChild(CdkVirtualScrollViewport)
  private cdkVirtualScrollViewPort!: CdkVirtualScrollViewport;

  protected readonly items$: Observable<Task[]> = this.store.items$;
  protected readonly searchCriteria$: Observable<TasksSearchCriteria> =
    this.store.searchCriteria$;
  protected readonly loading$: Observable<boolean> = this.store.loading$;

  protected readonly error$: Observable<string | undefined> = this.store.error$;
  protected readonly count$: Observable<number> = this.store.count$;

  protected display(task: Task | null): string {
    return task?.description || '';
  }

  protected onPaginationChange(pagination: Pagination): void {
    this.store.paginate(pagination);
  }

  protected onSnackbardDismissed(): void {
    this.store.clearError();
  }

  protected onFilterChange(event: any, filters: TasksFilters): void {
    const filter: string | undefined = event.target?.value || undefined;
    this.onFiltersChange({ ...filters, description: filter });
  }

  protected openChange($event: boolean): void {
    if ($event) {
      this.cdkVirtualScrollViewPort.scrollToIndex(0);
      this.cdkVirtualScrollViewPort.checkViewportSize();
    }
  }

  private onFiltersChange(filters: TasksFilters): void {
    this.store.filter(filters);
  }
}
