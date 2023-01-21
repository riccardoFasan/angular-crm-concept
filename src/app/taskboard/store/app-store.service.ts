import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';
import { Priority, Status } from '../enums';
import { Filters, Task } from '../models';
import { TaskboardState } from '../state';

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

  constructor() {
    super({
      filters: {},
      tasks: [
        {
          id: 'hey',
          description:
            'My firsy rendered task with component-store and anguar material',
          status: Status.NotStarted,
          priority: Priority.Low,
          deadline: new Date(),
        },
      ],
      loading: false,
    });
  }
}
