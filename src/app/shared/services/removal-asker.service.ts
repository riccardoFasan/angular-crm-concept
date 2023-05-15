import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, tap } from 'rxjs';
import { RemovalConfirmatonDialogComponent } from '../components/removal-confirmation-dialog.component';
import { ConfirmDialogAction } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class RemovalAsker {
  private readonly dialog: MatDialog = inject(MatDialog);

  shouldRemove(): Observable<boolean> {
    const dialogRef: MatDialogRef<RemovalConfirmatonDialogComponent> =
      this.dialog.open(RemovalConfirmatonDialogComponent);
    return dialogRef.componentInstance.onClose.pipe(
      map(
        (action: ConfirmDialogAction) => action === ConfirmDialogAction.Confirm
      ),
      tap(() => dialogRef.close())
    );
  }
}
