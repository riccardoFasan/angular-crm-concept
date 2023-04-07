import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'taskboard',
  },
  {
    path: 'taskboard',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/tasks/taskboard/taskboard.routes').then(
            (m) => m.TASKBOARD_ROUTES
          ),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./features/tasks/task-edit/task-edit.routes').then(
            (m) => m.TASK_EDIT_ROUTES
          ),
      },
    ],
  },
];
