import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskboardStoreService } from '../../store/app-store.service';
import { Observable } from 'rxjs';
import { Filters, Task } from '../../models';
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
        filters: filters$ | async,
        loading: loading$ | async,
        pageSize: pageSize$ | async,
        page: page$ | async,
        count: count$ | async
      } as vm"
    >
      <app-list [tasks]="vm.tasks!" [loading]="vm.loading!"></app-list>
      <app-pagination
        [page]="vm.page!"
        [pageSize]="vm.pageSize!"
        [count]="vm.count!"
        (pageChange)="onPageChange($event)"
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
export class TaskboardContainerComponent {
  private readonly store: TaskboardStoreService = inject(TaskboardStoreService);

  protected readonly tasks$: Observable<Task[]> = this.store.tasks$;
  protected readonly filters$: Observable<Filters> = this.store.filters$;
  protected readonly loading$: Observable<boolean> = this.store.loading$;
  protected readonly pageSize$: Observable<number> = this.store.pageSize$;
  protected readonly page$: Observable<number> = this.store.page$;
  protected readonly count$: Observable<number> = this.store.count$;

  protected onPageChange(page: number): void {}
}
