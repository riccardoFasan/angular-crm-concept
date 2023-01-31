import { Routes } from '@angular/router';
import { TaskEditStoreService } from './store/task-edit-store.service';
import { canLeaveForm } from 'src/app/shared/guards';
import { MatDialog } from '@angular/material/dialog';

export const TASK_EDIT_ROUTES: Routes = [
  {
    path: '',
    providers: [TaskEditStoreService, MatDialog],
    canDeactivate: [canLeaveForm],
    loadComponent: () =>
      import('./task-edit-container/task-edit-container.component').then(
        (m) => m.TaskEditContainerComponent
      ),
  },
];
