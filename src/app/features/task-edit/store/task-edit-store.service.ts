import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  EMPTY,
  iif,
  Observable,
  pipe,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { EditingMode } from 'src/app/shared/enums';
import { Task, TaskFormData } from 'src/app/shared/models';
import { ApiService } from 'src/app/shared/services';
import { areEqualObjects } from 'src/utilities';
import { INITIAL_TASK_EDIT_STATE, TaskEditState } from '../state';
import { LoadingStoreService } from 'src/app/shared/store';

@Injectable()
export class TaskEditStoreService extends ComponentStore<TaskEditState> {
  private readonly api: ApiService = inject(ApiService);
  private readonly loadingStore: LoadingStoreService =
    inject(LoadingStoreService);

  readonly formData$: Observable<TaskFormData> = this.select(
    (state: TaskEditState) => state.formData
  );

  readonly task$: Observable<Task | undefined> = this.select(
    (state: TaskEditState) => state.task
  );

  readonly loading$: Observable<boolean> = this.select(
    (state: TaskEditState) => state.loading
  );

  readonly error$: Observable<string | undefined> = this.select(
    (state: TaskEditState) => state.error
  );

  readonly synchronized$: Observable<boolean> = this.select(
    (state: TaskEditState) => areEqualObjects(state.task, state.formData)
  );

  readonly editingMode$: Observable<EditingMode> = this.select(
    (state: TaskEditState) =>
      state.task ? EditingMode.Editing : EditingMode.Creating
  );

  readonly updateFormData = this.updater(
    (state: TaskEditState, formData: TaskFormData) => ({
      ...state,
      formData: { ...state.formData, ...formData },
    })
  );

  readonly saveTask = this.effect<TaskFormData>(
    pipe(
      tap(() => this.syncLoading(true)),
      withLatestFrom(this.synchronized$, this.editingMode$),
      switchMap(([formData, synchronized, editingMode]) =>
        iif(
          () => synchronized !== true,
          editingMode === EditingMode.Creating
            ? this.api.createTask(formData)
            : this.api.updateTask(formData as Task),
          this.task$ as Observable<Task> // just to trigger the tap operator
        )
      ),
      tap({
        next: (task: Task) => {
          this.syncLoading(false);
          this.updateTask(task);
        },
        error: (message: string) => {
          this.updateError(message);
          this.syncLoading(false);
        },
      })
    )
  );

  readonly clearError = this.effect<void>(
    pipe(tap(() => this.updateError(undefined)))
  );

  readonly getTask = this.effect<string>(
    pipe(
      tap(() => this.syncLoading(true)),
      switchMap((taskId: string) =>
        this.api.getTask(taskId).pipe(
          tap({
            next: (task: Task) => {
              this.syncLoading(false);
              this.updateFormData(task);
              this.updateTask(task);
            },
            error: (message: string) => {
              this.updateError(message);
              this.syncLoading(false);
            },
          })
        )
      )
    )
  );

  private readonly syncLoading = this.effect<boolean>(
    pipe(
      tap((loading: boolean) => {
        this.updateLoading(loading);
        this.loadingStore.updateLoading(loading);
      })
    )
  );

  private readonly updateTask = this.updater(
    (state: TaskEditState, task: Task) => ({
      ...state,
      task: { ...state.task, ...task },
    })
  );

  private readonly updateLoading = this.updater(
    (state: TaskEditState, loading: boolean) => ({ ...state, loading })
  );

  private readonly updateError = this.updater(
    (state: TaskEditState, error?: string) => ({
      ...state,
      error,
    })
  );

  constructor() {
    super(INITIAL_TASK_EDIT_STATE);
  }
}
