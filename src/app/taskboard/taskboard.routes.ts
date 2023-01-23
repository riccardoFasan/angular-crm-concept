import { Routes } from '@angular/router';

export const TASKBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./taskboard-container/taskboard-container.component').then(
        (m) => m.TaskboardContainerComponent
      ),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./list/components/list/list.component').then(
            (m) => m.ListComponent
          ),
      },
    ],
  },
];
