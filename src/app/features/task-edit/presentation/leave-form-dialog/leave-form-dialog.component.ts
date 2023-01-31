import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogAction } from 'src/app/shared/enums';

@Component({
  selector: 'app-leave-form-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h1 mat-dialog-title>Leave task without saving?</h1>
    <div mat-dialog-actions>
      <button mat-button color="primary" type="button" (click)="leave()">
        Leave form
      </button>
      <button mat-button color="warn" type="button" (click)="remain()">
        Remain
      </button>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveFormDialogComponent {
  private readonly dialogRef: MatDialogRef<LeaveFormDialogComponent> = inject(
    MatDialogRef<LeaveFormDialogComponent>
  );

  protected leave(): void {
    this.dialogRef.close(DialogAction.Leave);
  }

  protected remain(): void {
    this.dialogRef.close(DialogAction.Remain);
  }
}
