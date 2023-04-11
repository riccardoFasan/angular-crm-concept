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
import { Option, EmployeesFilters } from 'src/app/core/models';
import { AssignmentRole, EmployeeRole } from 'src/app/core/enums';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EmployeesFiltersComponent } from '.';
import { MatGridListModule } from '@angular/material/grid-list';
import { MobileObserverService } from 'src/app/shared/services';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-employees-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    EmployeesFiltersComponent,
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
          <mat-label>Name</mat-label>
          <input
            [(ngModel)]="name"
            (input)="onDescriptionChange()"
            matInput
            type="text"
          />
          <button
            *ngIf="name"
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
          <app-employees-filters
            [mobile]="!!vm.mobile"
            [assignment]="assignment"
            [job]="job"
            [assignments]="assignments"
            [jobs]="jobs"
            [optionsLoading]="optionsLoading"
            (assignmentChange)="onFiltersChange({ assignment: $event })"
            (jobChange)="onFiltersChange({ role: $event })"
          ></app-employees-filters>
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
export class EmployeesSearchComponent {
  private readonly sidebarStore: SidebarStoreService =
    inject(SidebarStoreService);
  private readonly mobileObserver: MobileObserverService = inject(
    MobileObserverService
  );

  @Input() filters!: EmployeesFilters;
  @Input() assignments: Option<AssignmentRole>[] = [];
  @Input() jobs: Option<EmployeeRole>[] = [];
  @Input() optionsLoading: boolean = false;

  @Output() filtersChange: EventEmitter<EmployeesFilters> =
    new EventEmitter<EmployeesFilters>();

  @ViewChild('filters')
  private filtersRef!: ViewContainerRef;

  protected readonly mobile$: Observable<boolean> =
    this.mobileObserver.mobile$.pipe(
      tap((mobile: boolean) => {
        if (!mobile) this.sidebarStore.close();
      })
    );

  protected name: string = '';
  protected assignment?: AssignmentRole;
  protected job?: EmployeeRole;

  protected onDescriptionChange(): void {
    if (this.name.length < 3 && this.name !== '') return;
    this.filtersChange.emit({ ...this.filters, name: this.name });
  }

  protected onFiltersChange(filters: Partial<EmployeesFilters>): void {
    this.filtersChange.emit({ ...this.filters, ...filters });
  }

  protected clearDescription(): void {
    this.name = '';
    this.onDescriptionChange();
  }

  protected openFilters(): void {
    this.sidebarStore.updateTemplate(this.filtersRef);
    this.sidebarStore.updatePosition('end');
    this.sidebarStore.updateTitle('Advanced Filters');
    this.sidebarStore.open();
  }
}
