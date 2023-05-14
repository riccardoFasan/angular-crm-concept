import { Routes } from '@angular/router';

export const TASKS_LIST_ROUTES: Routes = [
  {
    path: '',
    title: 'Taskboard',
    loadComponent: () =>
      import('./containers/tasks-list-container.component').then(
        (m) => m.TasksListContainerComponent
      ),
  },
];
