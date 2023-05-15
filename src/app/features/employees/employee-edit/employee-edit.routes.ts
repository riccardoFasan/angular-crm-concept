import { Routes } from '@angular/router';
import { canLeaveForm } from 'src/app/shared/guards';

export const EMPLOYEE_EDIT_ROUTES: Routes = [
  {
    path: '',
    title: 'Employee',
    canDeactivate: [canLeaveForm],
    loadComponent: () =>
      import('./containers/employee-edit-container.component').then(
        (m) => m.EmployeeEditContainerComponent
      ),
  },
];
