import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Filters, Option } from 'src/app/shared/models';
import { Priority, Status } from 'src/app/shared/enums';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-mobile-filters',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    // MatSidenavModule,
  ],
  template: `
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
        (click)="clearDecription()"
      >
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>

    <button (click)="openFilters()" mat-icon-button>
      <mat-icon>filter_alt</mat-icon>
    </button>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        gap: 1rem;
        padding: 1rem 1rem 0 1rem;

        mat-form-field {
          width: 100%;
        }

        & > button {
          margin-bottom: 1.625rem;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileFiltersComponent {
  @Input() filters!: Filters;
  @Input() priorities: Option<Priority>[] = [];
  @Input() states: Option<Status>[] = [];
  @Input() optionsLoading: boolean = false;

  @Output() filtersChange: EventEmitter<Filters> = new EventEmitter<Filters>();

  protected description: string = '';
  protected onDescriptionChange(): void {
    if (this.description.length < 3 && this.description !== '') return;
    this.filtersChange.emit({ ...this.filters, description: this.description });
  }

  protected clearDecription(): void {
    this.description = '';
    this.onDescriptionChange();
  }

  protected openFilters(): void {}
}
