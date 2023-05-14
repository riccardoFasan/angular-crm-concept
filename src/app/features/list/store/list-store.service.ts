import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStateInit } from '@ngrx/component-store';
import {
  concatMap,
  switchMap,
  Observable,
  pipe,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Pagination, SearchCriteria, Sorting, List } from 'src/app/core/models';
import { LoadingStoreService } from 'src/app/core/store';
import { INITIAL_LIST_STATE, ListState } from '../state/list.state';
import { ITEM_ADAPTER } from 'src/app/core/tokens';
import { ItemAdapter } from 'src/app/core/interfaces';

interface Item {
  id?: string;
}

@Injectable()
export class ListStoreService<T extends Item>
  extends ComponentStore<ListState<T>>
  implements OnStateInit
{
  private readonly adpater: ItemAdapter<T> = inject(ITEM_ADAPTER);
  private readonly loadingStore: LoadingStoreService =
    inject(LoadingStoreService);

  readonly items$: Observable<T[]> = this.select(
    (state: ListState<T>) => state.items
  );

  readonly count$: Observable<number> = this.select(
    (state: ListState<T>) => state.count
  );

  readonly searchCriteria$: Observable<SearchCriteria> = this.select(
    (state: ListState<T>) => state.searchCriteria
  );

  readonly loading$: Observable<boolean> = this.select(
    (state: ListState<T>) => state.loading
  );

  readonly error$: Observable<string | undefined> = this.select(
    (state: ListState<T>) => state.error
  );

  readonly paginate = this.effect<Pagination>(
    pipe(
      withLatestFrom(this.searchCriteria$),
      tap(([pagination, searchCriteria]) =>
        this.updateSearchCriteria({ ...searchCriteria, pagination })
      )
    )
  );

  readonly filter = this.effect<object>(
    pipe(
      withLatestFrom(this.searchCriteria$),
      tap(([filters, searchCriteria]) =>
        this.updateSearchCriteria({ ...searchCriteria, filters })
      )
    )
  );

  readonly sort = this.effect<Sorting>(
    pipe(
      withLatestFrom(this.searchCriteria$),
      tap(([sorting, searchCriteria]) =>
        this.updateSearchCriteria({ ...searchCriteria, sorting })
      )
    )
  );

  readonly removeItem = this.effect<T>(
    pipe(
      tap(() => this.syncLoading(true)),
      withLatestFrom(this.items$),
      concatMap(([item, items]) =>
        this.adpater.removeItem(item).pipe(
          tap({
            next: (response: T) => {
              const remainingItems: T[] = items.filter(
                (item: T) => item.id !== response.id
              );
              this.updateItems(remainingItems);
              this.syncLoading(false);
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

  readonly clearError = this.effect<void>(
    pipe(tap(() => this.updateError(undefined)))
  );

  private readonly getItems = this.effect(
    (searchCriteria$: Observable<SearchCriteria>) =>
      searchCriteria$.pipe(
        tap(() => this.syncLoading(true)),
        switchMap((searchCriteria) =>
          this.adpater.getItems(searchCriteria).pipe(
            tap({
              next: (response: List<T>) => {
                this.updateItems(response.items);
                this.updateCount(response.count);
                this.syncLoading(false);
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

  private readonly updateLoading = this.updater(
    (state: ListState<T>, loading: boolean) => ({
      ...state,
      loading,
    })
  );

  private readonly updateCount = this.updater(
    (state: ListState<T>, count: number) => ({
      ...state,
      count,
    })
  );

  private readonly updateItems = this.updater(
    (state: ListState<T>, items: T[]) => ({
      ...state,
      items,
    })
  );

  private readonly updateSearchCriteria = this.updater(
    (state: ListState<T>, searchCriteria: SearchCriteria) => ({
      ...state,
      searchCriteria,
    })
  );

  private readonly updateError = this.updater(
    (state: ListState<T>, error?: string) => ({
      ...state,
      error,
    })
  );

  constructor() {
    super(INITIAL_LIST_STATE);
  }

  ngrxOnStateInit(): void {
    this.getItems(this.searchCriteria$);
  }
}
