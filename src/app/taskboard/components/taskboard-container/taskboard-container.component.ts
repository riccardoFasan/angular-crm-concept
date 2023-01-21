import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskboardStoreService } from '../../store/app-store.service';
import { Observable } from 'rxjs';
import { Pagination, SearchCriteria, Task } from '../../models';
import { ListComponent } from '../list/list.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-taskboard-container',
  standalone: true,
  imports: [CommonModule, ListComponent, PaginationComponent],
  providers: [TaskboardStoreService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *ngIf="{
        tasks: tasks$ | async,
        count: count$ | async,
        searchCriteria: searchCriteria$ | async,
        loading: loading$ | async
      } as vm"
    >
      <app-list [tasks]="vm.tasks!" [loading]="vm.loading!"></app-list>
      <app-pagination
        [pagination]="vm.searchCriteria!.pagination"
        [count]="vm.count!"
        [loading]="vm.loading!"
        (paginationChange)="onPaginationChange($event)"
      ></app-pagination>
    </ng-container>
  `,
  styles: [
    `
      app-pagination {
        display: inline-block;
        margin-top: 1rem;
      }
    `,
  ],
})
export class TaskboardContainerComponent implements AfterViewInit {
  private readonly store: TaskboardStoreService = inject(TaskboardStoreService);

  protected readonly tasks$: Observable<Task[]> = this.store.tasks$;
  protected readonly loading$: Observable<boolean> = this.store.loading$;
  protected readonly searchCriteria$: Observable<SearchCriteria> =
    this.store.searchCriteria$;
  protected readonly count$: Observable<number> = this.store.count$;

  ngAfterViewInit(): void {
    this.store.getTasks(this.searchCriteria$);
  }

  protected onPaginationChange(pagination: Pagination): void {
    this.store.updatePagination(pagination);
  }
}
