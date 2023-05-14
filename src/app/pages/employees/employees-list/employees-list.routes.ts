import { Routes } from '@angular/router';

export const EMPLOYEES_LIST_ROUTES: Routes = [
  {
    path: '',
    title: 'Employees',
    loadComponent: () =>
      import('./containers/employees-list-container.component').then(
        (m) => m.EmployeesListContainerComponent
      ),
  },
];
