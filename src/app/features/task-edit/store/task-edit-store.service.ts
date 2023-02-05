import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import {
  distinctUntilChanged,
  EMPTY,
  first,
  map,
  Observable,
  pipe,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { EditingMode } from 'src/app/shared/enums';
import { Task, TaskFormData } from 'src/app/shared/models';
import { ApiService } from 'src/app/shared/services';
import { areEqualObjects } from 'src/utilities';
import { INITIAL_TASK_EDIT_STATE, TaskEditState } from '../state';
import { LoadingStoreService } from 'src/app/shared/store';

@Injectable()
export class TaskEditStoreService
  extends ComponentStore<TaskEditState>
  implements OnStateInit
{
  private readonly api: ApiService = inject(ApiService);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
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
      switchMap((formData: TaskFormData) =>
        this.synchronized$.pipe(
          first((synchronized: boolean) => synchronized !== true),
          switchMap(() =>
            this.editingMode$.pipe(
              take(1),
              tap(() => this.syncLoading(true)),
              switchMap((editingMode: EditingMode) =>
                editingMode === EditingMode.Creating
                  ? this.api.createTask(formData)
                  : this.api.updateTask(formData as Task)
              ),
              tap({
                next: (task: Task) => {
                  this.syncLoading(false);
                  this.updateTask(task);
                },
                // TODO: error handling
                //error: () => ,
              })
            )
          )
        )
      )
    )
  );

  private readonly taskId$: Observable<string | undefined> =
    this.activatedRoute.params.pipe(
      map((params: Params) => {
        const id: string | undefined = params['id'];
        if (Boolean(id) && id !== 'new') return id;
        return undefined;
      }),
      distinctUntilChanged()
    );

  private readonly getTask = this.effect(
    (taskId$: Observable<string | undefined>) =>
      taskId$.pipe(
        switchMap((taskId: string | undefined) => {
          if (!taskId) return EMPTY;
          this.syncLoading(true);
          return this.api.getTask(taskId).pipe(
            tap({
              next: (task: Task) => {
                this.syncLoading(false);
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

  constructor() {
    super(INITIAL_TASK_EDIT_STATE);
  }

  ngrxOnStateInit(): void {
    this.getTask(this.taskId$);
  }
}
