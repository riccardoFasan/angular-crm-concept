import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-date-field',
  standalone: true,
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
  ],
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <input
        [formControl]="control"
        (ngModelChange)="onChange()"
        [matDatepicker]="picker"
        matInput
      />
      <mat-hint>mm/dd/yyyy</mat-hint>
      <mat-datepicker-toggle
        matIconSuffix
        [for]="picker"
      ></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
      <button
        *ngIf="control.value"
        [disabled]="control.disabled"
        matSuffix
        mat-icon-button
        aria-label="Clear"
        (click)="clear()"
      >
        <mat-icon>close</mat-icon>
      </button>
    </mat-form-field>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateFieldComponent {
  @Input({ required: true }) label: string = '';
  @Input() control: FormControl = new FormControl(undefined);
  @Input() set date(date: Date | undefined) {
    this.control.setValue(date);
  }

  @Output() dateChange: EventEmitter<Date> = new EventEmitter<Date>();

  protected onChange(): void {
    this.dateChange.emit(this.control.value);
  }

  protected clear(): void {
    this.control.setValue(undefined);
  }
}
