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
          import('./pages/tasks/tasks-list/tasks-list.routes').then(
            (m) => m.TASKS_LIST_ROUTES
          ),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./pages/tasks/task-edit/task-edit.routes').then(
            (m) => m.TASK_EDIT_ROUTES
          ),
      },
    ],
  },
  {
    path: 'employees',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/employees/employees-list/employees-list.routes').then(
            (m) => m.EMPLOYEES_LIST_ROUTES
          ),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./pages/employees/employee-edit/employee-edit.routes').then(
            (m) => m.EMPLOYEE_EDIT_ROUTES
          ),
      },
    ],
  },
];
