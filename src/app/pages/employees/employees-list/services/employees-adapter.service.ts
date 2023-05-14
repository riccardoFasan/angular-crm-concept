import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemAdapter } from 'src/app/core/interfaces';
import { Employee, EmployeesSearchCriteria, List } from 'src/app/core/models';
import { ApiService } from 'src/app/core/services';

@Injectable({
  providedIn: 'root',
})
export class EmployeesAdapterService implements ItemAdapter<Employee> {
  private readonly api: ApiService = inject(ApiService);

  getItems(
    searchCriteria: EmployeesSearchCriteria
  ): Observable<List<Employee>> {
    return this.api.getEmployees(searchCriteria);
  }

  removeItem(item: Employee): Observable<Employee> {
    return this.api.removeEmployee(item);
  }
}
