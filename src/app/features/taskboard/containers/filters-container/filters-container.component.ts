import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltersStoreService } from '../../store';
import { provideComponentStore } from '@ngrx/component-store';
import { Priority, Status } from 'src/app/shared/enums';
import { Filters, Option } from 'src/app/shared/models';
import { Observable, map } from 'rxjs';
import { FiltersComponent } from '../../presentation';
import { ErrorSnackbarDirective } from 'src/app/shared/directives';
import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';
import { SearchComponent } from '../../presentation/search/search.component';

@Component({
  selector: 'app-filters-container',
  standalone: true,
  imports: [CommonModule, SearchComponent, ErrorSnackbarDirective],
  template: `
    <ng-container
      *ngIf="{
        filters: filters$ | async,
        priorities: priorities$ | async,
        states: states$ | async,
        optionsLoading: optionsLoading$ | async,
        error: error$ | async,
        mobile: mobile$ | async
      } as vm"
    >
      <app-search
        [filters]="vm.filters!"
        [priorities]="vm.priorities!"
        [states]="vm.states!"
        [optionsLoading]="vm.optionsLoading!"
        [mobile]="!!vm.mobile"
        (filtersChange)="onFiltersChange($event)"
      ></app-search>
      <app-error-snackbar
        *ngIf="vm.error"
        [message]="vm.error"
        (dismissed)="onSnackbardDismissed()"
      ></app-error-snackbar>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideComponentStore(FiltersStoreService)],
})
export class FiltersContainerComponent {
  private readonly store: FiltersStoreService = inject(FiltersStoreService);
  private readonly breakpointObserver: BreakpointObserver =
    inject(BreakpointObserver);

  @Input() set filters(filters: Filters) {
    this.store.updateFilters(filters);
  }

  @Output() filtersChange: EventEmitter<Filters> = new EventEmitter<Filters>();

  protected readonly filters$: Observable<Filters> = this.store.filters$;
  protected readonly priorities$: Observable<Option<Priority>[]> =
    this.store.priorities$;
  protected readonly states$: Observable<Option<Status>[]> = this.store.states$;
  protected readonly optionsLoading$: Observable<boolean> =
    this.store.optionsLoading$;
  protected readonly error$: Observable<string | undefined> = this.store.error$;

  // ? should be part of store ?
  protected readonly mobile$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.XSmall])
    .pipe(map((result: BreakpointState) => result.matches));

  protected onFiltersChange(filters: Filters): void {
    this.filtersChange.emit(filters);
  }

  protected onSnackbardDismissed(): void {
    this.store.clearError();
  }
}
