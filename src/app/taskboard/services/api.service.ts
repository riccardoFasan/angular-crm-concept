import { Injectable } from '@angular/core';
import { map, Observable, take, timer } from 'rxjs';
import { Pagination, SearchCriteria, Task } from '../models';
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
    console.log({
      fromIndex,
      toIndex,
    });
    return timer(500).pipe(
      take(1),
      map(() => ({
        count: FAKE_TASKS.length,
        tasks: FAKE_TASKS.slice(fromIndex, toIndex),
      }))
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
}
