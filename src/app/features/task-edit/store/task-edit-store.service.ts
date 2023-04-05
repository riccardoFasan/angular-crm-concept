import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import {
  distinctUntilChanged,
  EMPTY,
  iif,
  map,
  Observable,
  pipe,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { EditingMode } from 'src/app/shared/enums';
import { Task, TaskFormData } from 'src/app/shared/models';
import { ApiService, TitleService } from 'src/app/shared/services';
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
  private readonly title: TitleService = inject(TitleService);

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

  readonly saved$: Observable<boolean> = this.select((state: TaskEditState) =>
    areEqualObjects(state.task, state.formData)
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
      withLatestFrom(this.saved$, this.editingMode$),
      switchMap(([formData, saved, editingMode]) =>
        iif(
          () => saved !== true,
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
          this.syncTitle(task);
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
                this.syncTitle(task);
              },
              error: (message: string) => {
                this.updateError(message);
                this.syncLoading(false);
              },
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

  private readonly syncTitle = this.effect<Task>(
    pipe(tap((task: Task) => this.title.setTitle(task.description)))
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

  ngrxOnStateInit(): void {
    this.getTask(this.taskId$);
  }
}
