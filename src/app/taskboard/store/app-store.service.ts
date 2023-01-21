import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { Filters, Task } from '../models';
import { TaskboardState } from '../state';
import { FAKE_TASKS } from './tasks';

@Injectable()
export class TaskboardStoreService extends ComponentStore<TaskboardState> {
  readonly tasks$: Observable<Task[]> = this.select(
    (state: TaskboardState) => state.tasks
  );

  readonly filters$: Observable<Filters> = this.select(
    (state: TaskboardState) => state.filters
  );

  readonly loading$: Observable<boolean> = this.select(
    (state: TaskboardState) => state.loading
  );

  readonly pageSize$: Observable<number> = this.select(
    (state: TaskboardState) => state.pageSize
  );

  readonly page$: Observable<number> = this.select(
    (state: TaskboardState) => state.page
  );

  readonly count$: Observable<number> = this.select(
    (state: TaskboardState) => state.count
  );

  constructor() {
    super({
      filters: {},
      tasks: FAKE_TASKS,
      loading: false,
      pageSize: 5,
      page: 0,
      count: FAKE_TASKS.length,
    });
  }
}
