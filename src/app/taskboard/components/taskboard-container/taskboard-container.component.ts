import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskboardStoreService } from '../../store/app-store.service';
import { Observable } from 'rxjs';
import { Filters, Task } from '../../models';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'app-taskboard-container',
  standalone: true,
  imports: [CommonModule, ListComponent],
  providers: [TaskboardStoreService],
  template: `
    <ng-container
      *ngIf="{
        tasks: tasks$ | async,
        filters: filters$ | async,
        loading: loading$ | async
      } as vm"
    >
      <app-list [tasks]="vm.tasks!" [loading]="vm.loading!"></app-list>
    </ng-container>
  `,
  styles: [],
})
export class TaskboardContainerComponent {
  private readonly store: TaskboardStoreService = inject(TaskboardStoreService);

  readonly tasks$: Observable<Task[]> = this.store.tasks$;
  readonly filters$: Observable<Filters> = this.store.filters$;
  readonly loading$: Observable<boolean> = this.store.loading$;
}
