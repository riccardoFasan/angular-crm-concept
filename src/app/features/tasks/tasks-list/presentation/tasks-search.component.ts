import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarStoreService } from 'src/app/layout/store';
import { TasksFilters, Option } from 'src/app/core/models';
import { Priority, Status } from 'src/app/core/enums';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TasksFiltersComponent } from '.';
import { MatGridListModule } from '@angular/material/grid-list';
import { MobileObserverService } from 'src/app/shared/services';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-tasks-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    TasksFiltersComponent,
    MatGridListModule,
  ],
  template: `
    <mat-grid-list
      *ngIf="{ mobile: mobile$ | async } as vm"
      [cols]="vm.mobile ? 6 : 4"
      gutterSize="1rem"
      rowHeight="fit"
    >
      <mat-grid-tile [colspan]="vm.mobile ? '5' : '1'" rowspan="1">
        <mat-form-field appearance="outline">
          <mat-label>Description</mat-label>
          <input
            [(ngModel)]="description"
            (input)="onDescriptionChange()"
            matInput
            type="text"
          />
          <button
            *ngIf="description"
            matSuffix
            mat-icon-button
            aria-label="Clear"
            (click)="clearDescription()"
          >
            <mat-icon>close</mat-icon>
          </button>
        </mat-form-field>
      </mat-grid-tile>

      <mat-grid-tile [colspan]="vm.mobile ? '1' : '3'" rowspan="1">
        <button
          *ngIf="vm.mobile; else filters"
          (click)="openFilters()"
          mat-icon-button
        >
          <mat-icon>filter_alt</mat-icon>
        </button>
        <ng-template #filters>
          <app-tasks-filters
            [mobile]="!!vm.mobile"
            [status]="status"
            [priority]="priority"
            [deadline]="deadline"
            [priorities]="priorities"
            [states]="states"
            [optionsLoading]="optionsLoading"
            (statusChange)="onFiltersChange({ status: $event })"
            (priorityChange)="onFiltersChange({ priority: $event })"
            (deadlineChange)="onFiltersChange({ deadline: $event })"
          ></app-tasks-filters>
        </ng-template>
      </mat-grid-tile>
    </mat-grid-list>
  `,
  styles: [
    `
      :host {
        $row-height: 5rem;

        display: block;
        padding: 1rem;

        mat-grid-list {
          margin: 0 auto;
          height: $row-height;

          mat-grid-tile {
            &:last-child button {
              margin-bottom: 1.375rem;
            }

            mat-form-field,
            app-filters {
              width: calc(100% - 1px);
            }
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksSearchComponent {
  private readonly sidebarStore: SidebarStoreService =
    inject(SidebarStoreService);
  private readonly mobileObserver: MobileObserverService = inject(
    MobileObserverService
  );

  @Input() filters!: TasksFilters;
  @Input() priorities: Option<Priority>[] = [];
  @Input() states: Option<Status>[] = [];
  @Input() optionsLoading: boolean = false;

  @Output() filtersChange: EventEmitter<TasksFilters> =
    new EventEmitter<TasksFilters>();

  @ViewChild('filters')
  private filtersRef!: ViewContainerRef;

  protected readonly mobile$: Observable<boolean> =
    this.mobileObserver.mobile$.pipe(
      tap((mobile: boolean) => {
        if (!mobile) this.sidebarStore.close();
      })
    );

  protected description: string = '';
  protected status?: Status;
  protected priority?: Priority;
  protected deadline?: Date;

  protected onDescriptionChange(): void {
    if (this.description.length < 3 && this.description !== '') return;
    this.filtersChange.emit({ ...this.filters, description: this.description });
  }

  protected onFiltersChange(filters: Partial<TasksFilters>): void {
    this.filtersChange.emit({ ...this.filters, ...filters });
  }

  protected clearDescription(): void {
    this.description = '';
    this.onDescriptionChange();
  }

  protected openFilters(): void {
    this.sidebarStore.updateTemplate(this.filtersRef);
    this.sidebarStore.updatePosition('end');
    this.sidebarStore.updateTitle('Advanced Filters');
    this.sidebarStore.open();
  }
}
