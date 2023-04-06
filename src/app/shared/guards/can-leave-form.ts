import { inject } from '@angular/core';
import { Observable, map, of, race, switchMap } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LeaveFormDialogComponent } from 'src/app/features/task-edit/presentation';
import { DialogAction } from '../enums';
import { CanLeave } from '../interfaces';

export const canLeaveForm = (component: CanLeave) => {
  const dialog: MatDialog = inject(MatDialog);
  return component.canLeave$.pipe(
    switchMap((canLeave: boolean) => {
      if (canLeave) return of(true);
      const dialogRef: MatDialogRef<LeaveFormDialogComponent> = dialog.open(
        LeaveFormDialogComponent
      );
      const backdropClick$: Observable<DialogAction> = dialogRef
        .backdropClick()
        .pipe(map(() => DialogAction.Remain));
      const onButtonClick$: Observable<DialogAction> =
        dialogRef.componentInstance.onClose;
      return race([backdropClick$, onButtonClick$]).pipe(
        switchMap((action: DialogAction) => {
          dialogRef.close();
          if (action === DialogAction.Leave) return of(true);
          if (action === DialogAction.Remain) return of(false);
          return component.beforeLeave();
        })
      );
    })
  );
};
