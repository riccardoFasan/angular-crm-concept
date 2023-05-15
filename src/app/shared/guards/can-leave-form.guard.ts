import { inject } from '@angular/core';
import { Observable, map, of, race, switchMap } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LeaveFormDialogComponent } from 'src/app/shared/components';
import { FormDialogAction } from '../enums';
import { CanLeave } from '../interfaces';
import { CanDeactivateFn } from '@angular/router';

export const canLeaveForm: CanDeactivateFn<CanLeave> = (
  component: CanLeave
) => {
  const dialog: MatDialog = inject(MatDialog);
  return component.canLeave$.pipe(
    switchMap((canLeave: boolean) => {
      if (canLeave) return of(true);
      const dialogRef: MatDialogRef<LeaveFormDialogComponent> = dialog.open(
        LeaveFormDialogComponent
      );
      const backdropClick$: Observable<FormDialogAction> = dialogRef
        .backdropClick()
        .pipe(map(() => FormDialogAction.Remain));
      const onButtonClick$: Observable<FormDialogAction> =
        dialogRef.componentInstance.onClose;
      return race([backdropClick$, onButtonClick$]).pipe(
        switchMap((action: FormDialogAction) => {
          dialogRef.close();
          if (action === FormDialogAction.Leave) return of(true);
          if (action === FormDialogAction.Remain) return of(false);
          return component.beforeLeave();
        })
      );
    })
  );
};
