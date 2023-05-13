import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { Task } from 'src/app/core/models';
import { Observable } from 'rxjs';
import { MobileObserverService } from 'src/app/shared/services';
import { DateFieldComponent } from 'src/app/shared/components';

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
  ],
  template: `
    <mat-grid-list
      *ngIf="form"
      [cols]="(mobile$ | async) ? 1 : 2"
      gutterSize="1rem"
      rowHeight="fit"
      [formGroup]="form"
    >
      <mat-grid-tile colspan="1" rowspan="1">
        <!--  <mat-form-field appearance="outline">
          <mat-label>Task</mat-label>
            <mat-select formControlName="task">
            <mat-option *ngFor="let task of tasks" [value]="task.id">
              {{ task.description }}
            </mat-option>
          </mat-select>
        </mat-form-field>-->
      </mat-grid-tile>

      <mat-grid-tile colspan="1" rowspan="1">
        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <mat-select formControlName="role">
            <mat-option value="PROJECT_MANAGER">Project manager</mat-option>
            <mat-option value="DESIGNER">Designer</mat-option>
            <mat-option value="DEVELOPER">Developer</mat-option>
            <mat-option value="TESTER">Tester</mat-option>
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
    </mat-grid-list>
  `,
  styles: [
    `
      :host {
        $row-height: 4rem;
        padding: 1rem;

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

  protected readonly mobile$: Observable<boolean> = this.mobileObserver.mobile$;
}
