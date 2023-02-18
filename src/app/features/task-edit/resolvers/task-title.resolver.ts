import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { TaskEditStoreService } from '../store';
import { inject } from '@angular/core';
import { filter, map } from 'rxjs';

export const TaskTitleResolver: ResolveFn<string> = (
  route: ActivatedRouteSnapshot
) => {
  // ! This title resolver makes a full prefetch of the task
  const store: TaskEditStoreService = inject(TaskEditStoreService);
  const id: string | null = route.paramMap.get('id');
  if (!id || id === 'new') return 'Create task';
  store.getTask(id);
  return store.task$.pipe(
    filter((task) => !!task && task.id === id),
    map((task) => `Edit task ${task?.description}`)
  );
};
