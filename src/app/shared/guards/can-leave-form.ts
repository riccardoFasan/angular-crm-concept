import { inject } from '@angular/core';
import { map, of, switchMap } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LeaveFormDialogComponent } from 'src/app/features/task-edit/presentation/leave-form-dialog/leave-form-dialog.component';
import { DialogAction } from '../enums';
import { CanLeave } from '../interfaces';

export const canLeaveForm = (component: CanLeave) => {
  const dialog: MatDialog = inject(MatDialog);
  return component.canLeave$.pipe(
    switchMap((synchronized: boolean) => {
      if (synchronized) return of(true);
      const dialogRef: MatDialogRef<LeaveFormDialogComponent> = dialog.open(
        LeaveFormDialogComponent
      );
      return dialogRef.afterClosed().pipe(
        map((action: DialogAction) => {
          const wantToLeave: boolean = action === DialogAction.Leave;
          return wantToLeave;
        })
      );
    })
  );
};
