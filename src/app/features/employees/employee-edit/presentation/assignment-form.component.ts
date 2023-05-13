import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Observable } from 'rxjs';
import { MobileObserverService } from 'src/app/shared/services';
import {
  DateFieldComponent,
  TasksListSelectComponent,
} from 'src/app/shared/components';

@Component({
  selector: 'app-assignment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatGridListModule,
    DateFieldComponent,
    TasksListSelectComponent,
    MatButtonModule,
  ],
  template: `
    <ng-container *ngIf="{ mobile: mobile$ | async } as vm">
      <mat-grid-list
        *ngIf="form"
        [cols]="vm.mobile ? 1 : 2"
        gutterSize="1rem"
        rowHeight="fit"
        [formGroup]="form"
      >
        <mat-grid-tile colspan="1" rowspan="1">
          <app-tasks-list-select
            [control]="$any(form.get('task'))"
          ></app-tasks-list-select>
        </mat-grid-tile>

        <mat-grid-tile colspan="1" rowspan="1">
          <mat-form-field appearance="outline">
            <mat-label>Role</mat-label>
            <mat-select formControlName="role">
              <mat-option value="WORKER">Worker</mat-option>
              <mat-option value="REVIEWER">Reviewer</mat-option>
            </mat-select>
          </mat-form-field>
        </mat-grid-tile>

        <mat-grid-tile colspan="1" rowspan="1">
          <app-date-field
            [label]="'From date'"
            [control]="$any(form.get('fromDate'))"
          >
          </app-date-field>
        </mat-grid-tile>

        <mat-grid-tile colspan="1" rowspan="1">
          <app-date-field
            [label]="'Due date'"
            [control]="$any(form.get('dueDate'))"
          >
          </app-date-field>
        </mat-grid-tile>

        <mat-grid-tile [colspan]="vm.mobile ? 1 : 2" rowspan="1">
          <div>
            <button
              [disabled]="form.disabled"
              (click)="remove()"
              mat-button
              mat-flat-button
              type="button"
            >
              Remove
            </button>
          </div>
        </mat-grid-tile>
      </mat-grid-list>
    </ng-container>
  `,
  styles: [
    `
      :host {
        $row-height: 6rem;

        display: block;
        padding: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 1rem;
        margin-bottom: 2rem;

        mat-grid-list {
          width: 100%;

          &[cols='2'] {
            height: $row-height * 3;
          }

          &[cols='1'] {
            height: $row-height * 5;
          }

          mat-grid-tile {
            padding: 0;

            &:last-child div {
              width: 100%;
              display: flex;
              justify-content: flex-end;
            }

            mat-form-field {
              width: calc(100% - 1px);
            }
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignmentFormComponent {
  private readonly mobileObserver: MobileObserverService = inject(
    MobileObserverService
  );

  @Input({ required: true }) form!: FormGroup;
  @Output() removed: EventEmitter<void> = new EventEmitter<void>();

  protected readonly mobile$: Observable<boolean> = this.mobileObserver.mobile$;

  protected remove(): void {
    this.removed.emit();
  }
}
