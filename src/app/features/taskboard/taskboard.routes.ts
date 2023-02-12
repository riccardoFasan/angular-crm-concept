import { Routes } from '@angular/router';

export const TASKBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        './containers/taskboard-container/taskboard-container.component'
      ).then((m) => m.TaskboardContainerComponent),
  },
];
