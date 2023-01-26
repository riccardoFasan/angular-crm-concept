import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { EMPTY, filter, iif, Observable, of, switchMap, tap } from 'rxjs';
import { EditingMode } from 'src/app/shared/enums';
import { Task } from 'src/app/shared/models';
import { ApiService } from 'src/app/shared/services';
import { areEqualObjects } from 'src/utilities';
import { TaskEditState } from '../state';

@Injectable()
export class TaskEditStoreService extends ComponentStore<TaskEditState> {
  readonly loading$: Observable<boolean> = this.select(
    (state: TaskEditState) => state.loading
  );

  readonly formData$: Observable<Partial<Task>> = this.select(
    (state: TaskEditState) => state.formData
  );

  readonly task$: Observable<Task | undefined> = this.select(
    (state: TaskEditState) => state.task
  );

  readonly synchronized$: Observable<boolean> = this.select(
    (state: TaskEditState) => areEqualObjects(state.task, state.formData)
  );

  readonly editingMode$: Observable<EditingMode> = this.select(
    (state: TaskEditState) =>
      state.task ? EditingMode.Editing : EditingMode.Creating
  );

  readonly updateLoading = this.updater(
    (state: TaskEditState, loading: boolean) => ({ ...state, loading })
  );

  readonly updateFormData = this.updater(
    (state: TaskEditState, formData: Partial<Task>) => ({ ...state, formData })
  );

  readonly getTask = this.effect((taskId$: Observable<string | undefined>) =>
    taskId$.pipe(
      switchMap((taskId: string | undefined) => {
        if (!taskId) return EMPTY;
        this.updateLoading(true);
        return this.api.getTask(taskId).pipe(
          tap({
            next: (task: Task) => {
              this.updateLoading(false);
              this.updateFormData(task);
              this.updateTask(task);
            },
            // TODO: error handling
            //error: () => ,
          })
        );
      })
    )
  );

  readonly syncTask = this.effect((formData$: Observable<Partial<Task>>) =>
    formData$.pipe(
      switchMap((formData: Partial<Task>) =>
        this.editingMode$.pipe(
          tap(() => this.updateLoading(true)),
          switchMap((editingMode: EditingMode) => {
            const apiCall$: Observable<Task> =
              editingMode === EditingMode.Creating
                ? this.api.createTask(formData)
                : this.api.updateTask(formData);
            return apiCall$.pipe(
              tap({
                next: (task: Task) => {
                  this.updateLoading(false);
                  this.updateFormData(task);
                  this.updateTask(task);
                },
                // TODO: error handling
                //error: () => ,
              })
            );
          })
        )
      )
    )
  );

  private readonly updateTask = this.updater(
    (state: TaskEditState, task: Task) => ({ ...state, task })
  );

  private readonly api: ApiService = inject(ApiService);

  constructor() {
    super({
      loading: false,
      formData: {},
    });
  }
}
