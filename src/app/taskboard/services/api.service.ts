import { Injectable } from '@angular/core';
import { map, Observable, take, timer } from 'rxjs';
import { Filters, Pagination, SearchCriteria, Task } from '../models';
import { FAKE_TASKS } from './tasks';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  getTasks(
    searchCriteria: SearchCriteria
  ): Observable<{ tasks: Task[]; count: number }> {
    const fromIndex: number = this.getFromIndex(searchCriteria.pagination);
    const toIndex: number = this.getToIndex(searchCriteria.pagination);
    return timer(300).pipe(
      take(1),
      map(() => {
        const filteredTasks: Task[] = FAKE_TASKS.filter((task: Task) =>
          this.matchFilters(task, searchCriteria.filters)
        );
        return {
          count: filteredTasks.length,
          tasks: filteredTasks.slice(fromIndex, toIndex),
        };
      })
    );
  }

  private getFromIndex(pagination: Pagination): number {
    if (pagination.pageIndex === 0) return 0;
    return pagination.pageIndex * pagination.pageSize;
  }

  private getToIndex(pagination: Pagination): number {
    if (pagination.pageIndex === 0) return pagination.pageSize;
    return pagination.pageIndex * pagination.pageSize + pagination.pageSize;
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
}
