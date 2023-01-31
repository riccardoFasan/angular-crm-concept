import { inject } from '@angular/core';
import { TaskEditStoreService } from '../../features/task-edit/store/task-edit-store.service';
import { map, of, switchMap } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LeaveFormDialogComponent } from 'src/app/features/task-edit/presentation/leave-form-dialog/leave-form-dialog.component';
import { DialogAction } from '../enums';

export const canLeaveForm = () => {
  const dialog: MatDialog = inject(MatDialog);
  const store: TaskEditStoreService = inject(TaskEditStoreService);
  return store.synchronized$.pipe(
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
