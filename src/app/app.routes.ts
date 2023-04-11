import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'tasks',
  },
  {
    path: 'tasks',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./features/tasks/tasks-list/tasks-list.routes').then(
            (m) => m.TASKS_LIST_ROUTES
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
