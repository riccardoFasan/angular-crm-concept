import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogAction } from 'src/app/shared/enums';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-leave-form-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <h1 mat-dialog-title>Exit without saving?</h1>
    <div mat-dialog-content>
      <p>
        There are unsaved changes.
        <br />
        Do you want to leave the form without save your changes, remain and
        continue editing or save and exit?
      </p>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-flat-button (click)="remain()">Remain</button>
      <div>
        <button mat-button mat-flat-button (click)="leave()">Exit</button>
        <button mat-button mat-flat-button color="primary" (click)="save()">
          Save and exit
        </button>
      </div>
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
export class LeaveFormDialogComponent {
  @Output() onClose: EventEmitter<DialogAction> =
    new EventEmitter<DialogAction>();

  protected leave(): void {
    this.onClose.emit(DialogAction.Leave);
  }

  protected save(): void {
    this.onClose.emit(DialogAction.Save);
  }

  protected remain(): void {
    this.onClose.emit(DialogAction.Remain);
  }
}
