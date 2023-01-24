import { Injectable } from '@angular/core';
import { map, Observable, take, timer } from 'rxjs';
import { SortOrder } from '../enums';
import { Filters, Pagination, SearchCriteria, Sorting, Task } from '../models';
import { FAKE_TASKS } from './tasks';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  getTasks(
    searchCriteria: SearchCriteria
  ): Observable<{ tasks: Task[]; count: number }> {
    return timer(300).pipe(
      take(1),
      map(() => {
        const sortedTasks: Task[] = this.getSortedTasks(
          FAKE_TASKS,
          searchCriteria.sorting
        );
        const filteredTasks: Task[] = sortedTasks.filter((task: Task) =>
          this.matchFilters(task, searchCriteria.filters)
        );
        const fromIndex: number = this.getFromIndex(searchCriteria.pagination);
        const toIndex: number = this.getToIndex(searchCriteria.pagination);
        return {
          count: filteredTasks.length,
          tasks: filteredTasks.slice(fromIndex, toIndex),
        };
      })
    );
  }

  private getSortedTasks(tasks: Task[], sorting?: Sorting): Task[] {
    if (!sorting) return tasks;
    const greaterThanIndex: number =
      sorting.order === SortOrder.Descending ? -1 : 1;
    const lessThanIndex: number =
      sorting.order === SortOrder.Descending ? 1 : -1;
    const property: string =
      sorting.order === SortOrder.None ? 'id' : sorting.property;
    return tasks.sort((a: Task, b: Task) => {
      let aValue: any = (a as any)[property];
      let bValue: any = (b as any)[property];
      aValue = isNaN(Number(aValue)) ? aValue : Number(aValue);
      bValue = isNaN(Number(bValue)) ? bValue : Number(bValue);
      if (aValue > bValue) return greaterThanIndex;
      if (aValue < bValue) return lessThanIndex;
      return 0;
    });
  }

  private matchFilters(task: Task, filters: Filters): boolean {
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

  private getFromIndex(pagination: Pagination): number {
    if (pagination.pageIndex === 0) return 0;
    return pagination.pageIndex * pagination.pageSize;
  }

  private getToIndex(pagination: Pagination): number {
    if (pagination.pageIndex === 0) return pagination.pageSize;
    return pagination.pageIndex * pagination.pageSize + pagination.pageSize;
  }
}
