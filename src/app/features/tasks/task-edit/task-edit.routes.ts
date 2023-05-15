import { Routes } from '@angular/router';
import { canLeaveForm } from 'src/app/shared/guards';

export const TASK_EDIT_ROUTES: Routes = [
  {
    path: '',
    title: 'Task',
    canDeactivate: [canLeaveForm],
    loadComponent: () =>
      import('./containers/task-edit-container.component').then(
        (m) => m.TaskEditContainerComponent
      ),
  },
];
