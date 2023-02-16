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
import { SidebarStoreService } from 'src/app/shared/store';
import { Filters, Option } from 'src/app/shared/models';
import { Priority, Status } from 'src/app/shared/enums';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FiltersComponent } from '../filters/filters.component';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FiltersComponent,
    MatGridListModule,
  ],
  template: `
    <mat-grid-list cols="4" gutterSize="1rem">
      <mat-grid-tile [colspan]="mobile ? '3' : '1'" rowspan="1">
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

      <mat-grid-tile [colspan]="mobile ? '1' : '3'" rowspan="1">
        <button
          *ngIf="mobile; else filters"
          (click)="openFilters()"
          mat-icon-button
        >
          <mat-icon>filter_alt</mat-icon>
        </button>
        <ng-template #filters>
          <app-filters
            [status]="status"
            [priority]="priority"
            [deadline]="deadline"
            [priorities]="priorities"
            [states]="states"
            [optionsLoading]="optionsLoading"
            [mobile]="mobile"
            (statusChange)="onFiltersChange({ status: $event })"
            (priorityChange)="onFiltersChange({ priority: $event })"
            (deadlineChange)="onFiltersChange({ deadline: $event })"
          ></app-filters>
        </ng-template>
      </mat-grid-tile>
    </mat-grid-list>
  `,
  styles: [
    `
      mat-form-field,
      app-filters {
        width: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  private readonly sidebarStore: SidebarStoreService =
    inject(SidebarStoreService);

  @Input() filters!: Filters;
  @Input() priorities: Option<Priority>[] = [];
  @Input() states: Option<Status>[] = [];
  @Input() optionsLoading: boolean = false;
  @Input() mobile: boolean = false;

  @Output() filtersChange: EventEmitter<Filters> = new EventEmitter<Filters>();

  @ViewChild('filters')
  filtersRef!: ViewContainerRef;

  protected description: string = '';
  protected status?: Status;
  protected priority?: Priority;
  protected deadline?: Date;

  protected onDescriptionChange(): void {
    if (this.description.length < 3 && this.description !== '') return;
    this.filtersChange.emit({ ...this.filters, description: this.description });
  }

  protected onFiltersChange(filters: Partial<Filters>): void {
    this.filtersChange.emit({ ...this.filters, ...filters });
  }

  protected clearDescription(): void {
    this.description = '';
    this.onDescriptionChange();
  }

  protected openFilters(): void {
    this.sidebarStore.updateTemplate(this.filtersRef);
    this.sidebarStore.updatePosition('end');
    this.sidebarStore.toggleOpen();
  }
}
