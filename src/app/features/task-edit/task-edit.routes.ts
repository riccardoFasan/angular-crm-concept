import { Routes } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { canLeaveForm } from 'src/app/shared/guards';
import { importProvidersFrom } from '@angular/core';
import { TaskTitleResolver } from './resolvers/task-title.resolver';

export const TASK_EDIT_ROUTES: Routes = [
  {
    path: '',
    title: TaskTitleResolver,
    providers: [MatDialog, importProvidersFrom(MatDialogModule)],
    canDeactivate: [canLeaveForm],
    loadComponent: () =>
      import(
        './containers/task-edit-container/task-edit-container.component'
      ).then((m) => m.TaskEditContainerComponent),
  },
];
