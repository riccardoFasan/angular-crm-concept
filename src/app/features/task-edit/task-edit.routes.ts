import { Routes } from '@angular/router';

export const TASK_EDIT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./task-edit-container/task-edit-container.component').then(
        (m) => m.TaskEditContainerComponent
      ),
  },
];
