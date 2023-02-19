import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pagination, Task } from 'src/app/shared/models';
import { MatCardModule } from '@angular/material/card';
import { StatusChipComponent } from '../status-chip/status-chip.component';
import { PriorityChipComponent } from '../priority-chip/priority-chip.component';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatRippleModule,
    ScrollingModule,
    StatusChipComponent,
    PriorityChipComponent,
  ],
  template: `
    <cdk-virtual-scroll-viewport
      itemSize="135"
      (scrolledIndexChange)="onScroll($event)"
    >
      <mat-card
        matRipple
        [routerLink]="[task.id]"
        *cdkVirtualFor="let task of loadedTasks"
      >
        <mat-card-header>
          <mat-card-title-group>
            <mat-card-title class="mat-h3">{{
              task.description
            }}</mat-card-title>
            <mat-card-subtitle>
              {{ task.deadline | date : 'dd MMMM YYYY' }}
            </mat-card-subtitle>
          </mat-card-title-group>
        </mat-card-header>
        <mat-card-content>
          <app-status-chip [status]="task.status"></app-status-chip>
          <app-priority-chip [priority]="task.priority"></app-priority-chip>
        </mat-card-content>
      </mat-card>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [
    `
      :host {
        margin-right: -1rem;
        margin-left: -1rem;
        display: block;

        cdk-virtual-scroll-viewport {
          height: 70vh;
          width: 100%;

          mat-card {
            margin: 1rem;

            &:last-child {
              margin-bottom: 0;
            }

            mat-card-title-group {
              margin-bottom: 1.25rem;

              mat-card-title {
                margin: 0;
              }
            }

            mat-card-content app-status-chip {
              margin-right: 1rem;
            }
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsComponent {
  @Input() count: number = 0;
  @Input() pagination!: Pagination;
  @Input() set tasks(tasks: Task[]) {
    this.loadedTasks = [...this.loadedTasks, ...tasks];
  }

  @Output() paginationChange: EventEmitter<Pagination> =
    new EventEmitter<Pagination>();

  protected loadedTasks: Task[] = [];

  private readonly tasksPerScroll = 5;

  protected onScroll(pageIndex: number): void {
    const nextTotalTasks: number = this.tasksPerScroll * (pageIndex + 1);
    const hasCount: boolean = this.count > 0;
    const willNotOverflow: boolean = this.count >= nextTotalTasks;
    const willLoadNewTasks: boolean = nextTotalTasks > this.loadedTasks.length;
    const canChangePage: boolean =
      hasCount && willNotOverflow && willLoadNewTasks;
    if (!canChangePage) return;
    this.onPageIndexChange(pageIndex);
  }

  private onPageIndexChange(pageIndex: number): void {
    this.paginationChange.emit({
      ...this.pagination,
      pageIndex,
    });
  }
}
