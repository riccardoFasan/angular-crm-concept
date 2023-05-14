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
import { EditingMode } from 'src/app/core/enums';
import { TitleService } from 'src/app/core/services';
import { areEqualObjects } from 'src/utilities';
import { LoadingStoreService } from 'src/app/core/store';
import { EditState } from '../state';
import { ITEM_ADAPTER } from '../tokens';
import { ItemAdapter } from '../interfaces';
import { INITIAL_EDIT_STATE } from '../state';
import { Item } from '../models';

@Injectable()
export class EditStoreService<T extends Item>
  extends ComponentStore<EditState<T>>
  implements OnStateInit
{
  private readonly adapter: ItemAdapter<T> = inject(ITEM_ADAPTER);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly loadingStore: LoadingStoreService =
    inject(LoadingStoreService);
  private readonly title: TitleService = inject(TitleService);

  readonly formData$: Observable<Partial<T>> = this.select(
    (state: EditState<T>) => state.formData
  );

  readonly item$: Observable<T | undefined> = this.select(
    (state: EditState<T>) => state.item
  );

  readonly loading$: Observable<boolean> = this.select(
    (state: EditState<T>) => state.loading
  );

  readonly error$: Observable<string | undefined> = this.select(
    (state: EditState<T>) => state.error
  );

  readonly saved$: Observable<boolean> = this.select((state: EditState<T>) =>
    areEqualObjects(state.item, state.formData)
  );

  readonly editingMode$: Observable<EditingMode> = this.select(
    (state: EditState<T>) =>
      state.item ? EditingMode.Editing : EditingMode.Creating
  );

  readonly updateFormData = this.updater(
    (state: EditState<T>, formData: Partial<T>) => ({
      ...state,
      formData: { ...state.formData, ...formData },
    })
  );

  readonly saveItem = this.effect<Partial<T>>(
    pipe(
      tap(() => this.syncLoading(true)),
      withLatestFrom(this.saved$, this.editingMode$),
      switchMap(([formData, saved, editingMode]) =>
        iif(
          () => saved !== true,
          editingMode === EditingMode.Creating
            ? this.adapter.createItem(formData as T)
            : this.adapter.updateItem(formData as T),
          this.item$ as Observable<T> // just to trigger the tap operator
        )
      ),
      tap({
        next: (item: T) => {
          this.syncLoading(false);
          this.updateItem(item);
          this.syncTitle(item);
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

  private readonly itemId$: Observable<string | undefined> =
    this.activatedRoute.params.pipe(
      map((params: Params) => {
        const id: string | undefined = params['id'];
        if (Boolean(id) && id !== 'new') return id;
        return undefined;
      }),
      distinctUntilChanged()
    );

  private readonly getItem = this.effect(
    (itemId$: Observable<string | undefined>) =>
      itemId$.pipe(
        switchMap((itemId: string | undefined) => {
          if (!itemId) return EMPTY;
          this.syncLoading(true);
          return this.adapter.getItem(itemId).pipe(
            tap({
              next: (item: T) => {
                this.syncLoading(false);
                this.updateFormData(item);
                this.updateItem(item);
                this.syncTitle(item);
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

  private readonly syncTitle = this.effect<T>(
    pipe(
      tap((item: T) => this.title.setTitle(this.adapter.generateTitle(item)))
    )
  );

  private readonly updateItem = this.updater(
    (state: EditState<T>, item: T) => ({
      ...state,
      item: { ...state.item, ...item },
    })
  );

  private readonly updateLoading = this.updater(
    (state: EditState<T>, loading: boolean) => ({ ...state, loading })
  );

  private readonly updateError = this.updater(
    (state: EditState<T>, error?: string) => ({
      ...state,
      error,
    })
  );

  constructor() {
    super(INITIAL_EDIT_STATE);
  }

  ngrxOnStateInit(): void {
    this.getItem(this.itemId$);
  }
}
