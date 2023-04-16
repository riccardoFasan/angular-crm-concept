import { Routes } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { canLeaveForm } from 'src/app/shared/guards';
import { importProvidersFrom } from '@angular/core';

export const EMPLOYEE_EDIT_ROUTES: Routes = [
  {
    path: '',
    title: 'Employee',
    providers: [MatDialog, importProvidersFrom(MatDialogModule)],
    canDeactivate: [canLeaveForm],
    loadComponent: () =>
      import('./containers/employee-edit-container.component').then(
        (m) => m.EmployeeEditContainerComponent
      ),
  },
];
