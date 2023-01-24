import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'taskboard',
  },
  {
    path: 'taskboard',
    loadChildren: () =>
      import('./features/taskboard/taskboard.routes').then(
        (m) => m.TASKBOARD_ROUTES
      ),
  },
  {
    path: 'taskboard/:id',
    loadChildren: () =>
      import('./features/task-edit/task-edit.routes').then(
        (m) => m.TASK_EDIT_ROUTES
      ),
  },
];
