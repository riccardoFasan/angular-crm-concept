import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmDialogAction } from '../enums';

@Component({
  selector: 'app-removoval-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <h1 mat-dialog-title>Do you want to delete this item?</h1>
    <div mat-dialog-content>
      <p>
        Are you really sure you want to remove this item?
        <br />
        Do you want to leave the form without save your changes, remain and
        continue editing or save and exit?
      </p>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-flat-button (click)="cancel()">Cancel</button>
      <button mat-button mat-flat-button color="primary" (click)="confirm()">
        Confirm and delete this item
      </button>
    </div>
  `,
  styles: [
    `
      div {
        display: flex;
        justify-content: space-between;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemovalConfirmatonDialogComponent {
  @Output() onClose: EventEmitter<ConfirmDialogAction> =
    new EventEmitter<ConfirmDialogAction>();

  protected confirm(): void {
    this.onClose.emit(ConfirmDialogAction.Confirm);
  }

  protected cancel(): void {
    this.onClose.emit(ConfirmDialogAction.Cancel);
  }
}
