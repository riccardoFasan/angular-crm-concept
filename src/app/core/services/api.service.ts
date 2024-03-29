import { Injectable } from '@angular/core';
import { first, map, Observable, timer } from 'rxjs';
import { SortOrder } from '../enums';
import {
  Employee,
  EmployeeFormData,
  TasksFilters,
  Pagination,
  TasksSearchCriteria,
  EmployeesSearchCriteria,
  Sorting,
  Task,
  TaskFormData,
  EmployeesFilters,
  List,
} from '../models';
import { FAKE_EMPLOYEES, FAKE_TASKS } from './data';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly fakeRequest$: Observable<number> = timer(500).pipe(first());

  getTasks(searchCriteria: TasksSearchCriteria): Observable<List<Task>> {
    const sortedTasks: Task[] = this.getSortedItems(
      FAKE_TASKS,
      searchCriteria.sorting
    );
    const filteredTasks: Task[] = sortedTasks.filter((task: Task) =>
      this.matchTaskFilters(task, searchCriteria.filters)
    );
    const fromIndex: number = this.getFromIndex(searchCriteria.pagination);
    const toIndex: number = this.getToIndex(searchCriteria.pagination);
    return this.request({
      count: filteredTasks.length,
      items: filteredTasks.slice(fromIndex, toIndex),
    });
  }

  getTask(taskId: string): Observable<Task> {
    const task: Task | undefined = FAKE_TASKS.find(
      (task) => task.id === taskId
    );
    if (!task) throw Error(`Cannot find a task with id ${taskId}`);
    return this.request(task);
  }

  createTask(task: TaskFormData): Observable<Task> {
    const greatestId: number = Math.max(
      ...FAKE_TASKS.map((task) => parseInt(task.id!))
    );
    const id: string = (greatestId + 1).toString();
    // @ts-ignore
    return this.request({
      ...task,
      id,
    });
  }

  updateTask(task: Task): Observable<Task> {
    return this.request(task);
  }

  removeTask(task: Task): Observable<Task> {
    return this.request(task);
  }

  getEmployees(
    searchCriteria: EmployeesSearchCriteria
  ): Observable<List<Employee>> {
    const sortedEmployees: Employee[] = this.getSortedItems(
      FAKE_EMPLOYEES,
      searchCriteria.sorting
    );
    const filteredTasks: Employee[] = sortedEmployees.filter(
      (employee: Employee) =>
        this.matchEmployeesFilters(employee, searchCriteria.filters)
    );
    const fromIndex: number = this.getFromIndex(searchCriteria.pagination);
    const toIndex: number = this.getToIndex(searchCriteria.pagination);
    return this.request({
      count: filteredTasks.length,
      items: filteredTasks.slice(fromIndex, toIndex),
    });
  }

  getEmployee(employeeId: string): Observable<Employee> {
    const employee: Employee | undefined = FAKE_EMPLOYEES.find(
      (employee) => employee.id === employeeId
    );
    if (!employee) throw Error(`Cannot find a employee with id ${employeeId}`);
    return this.request(employee);
  }

  createEmployee(employee: EmployeeFormData): Observable<Employee> {
    const greatestId: number = Math.max(
      ...FAKE_TASKS.map((task) => parseInt(task.id!))
    );
    const id: string = (greatestId + 1).toString();
    // @ts-ignore
    return this.request({
      ...employee,
      id,
    });
  }

  updateEmployee(employee: Employee): Observable<Employee> {
    return this.request(employee);
  }

  removeEmployee(employee: Employee): Observable<Employee> {
    return this.request(employee);
  }

  private request(data: any): Observable<any> {
    return this.fakeRequest$.pipe(map(() => data));
  }

  private getSortedItems<T>(items: T[], sorting?: Sorting): T[] {
    if (!sorting) return items;
    const greaterThanIndex: number =
      sorting.order === SortOrder.Descending ? -1 : 1;
    const lessThanIndex: number =
      sorting.order === SortOrder.Descending ? 1 : -1;
    const property: string =
      sorting.order === SortOrder.None ? 'id' : sorting.property;
    return items.sort((a: T, b: T) => {
      let aValue: any = (a as any)[property];
      let bValue: any = (b as any)[property];
      aValue = isNaN(Number(aValue)) ? aValue : Number(aValue);
      bValue = isNaN(Number(bValue)) ? bValue : Number(bValue);
      if (aValue > bValue) return greaterThanIndex;
      if (aValue < bValue) return lessThanIndex;
      return 0;
    });
  }

  private matchTaskFilters(task: Task, filters: TasksFilters): boolean {
    const matchDescription: boolean =
      !filters.description || task.description.includes(filters.description);
    const matchStatus: boolean =
      !filters.status || task.status === filters.status;
    const matchPriority: boolean =
      !filters.priority || task.priority === filters.priority;
    filters.deadline?.setHours(0, 0, 0, 0);
    task.deadline?.setHours(0, 0, 0, 0);
    const matchDeadline: boolean =
      !filters.deadline ||
      task.deadline?.getTime() === filters.deadline?.getTime();
    return matchDescription && matchStatus && matchPriority && matchDeadline;
  }

  private matchEmployeesFilters(
    employee: Employee,
    filters: EmployeesFilters
  ): boolean {
    const matchName: boolean =
      !filters.name ||
      `${employee.firstName} ${employee.lastName}`
        .toLowerCase()
        .includes(filters.name.toLowerCase());
    const matchRole: boolean =
      !filters.employeeRole || employee.roles!.includes(filters.employeeRole);
    const matchAssignment: boolean =
      !filters.assignmentRole ||
      employee.assignments!.some(
        (assignment) => assignment.role === filters.assignmentRole
      );
    return matchName && matchRole && matchAssignment;
  }

  private getFromIndex(pagination: Pagination): number {
    if (pagination.pageIndex === 0) return 0;
    return pagination.pageIndex * pagination.pageSize;
  }

  private getToIndex(pagination: Pagination): number {
    if (pagination.pageIndex === 0) return pagination.pageSize;
    return pagination.pageIndex * pagination.pageSize + pagination.pageSize;
  }
}
