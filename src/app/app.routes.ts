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
      import('./taskboard/taskboard.routes').then((m) => m.TASKBOARD_ROUTES),
  },
];
