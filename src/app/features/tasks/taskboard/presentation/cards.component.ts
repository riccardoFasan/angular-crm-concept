import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pagination, Task } from 'src/app/core/models';
import { MatCardModule } from '@angular/material/card';
import { StatusChipComponent, PriorityChipComponent } from '.';
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
    <div cdkVirtualScrollingElement>
      <cdk-virtual-scroll-viewport
        [itemSize]="cards.offsetHeight / loadedTasks.length"
        (scrolledIndexChange)="onScroll()"
      >
        <div #cards>
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
        </div>
      </cdk-virtual-scroll-viewport>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: calc(100vh - 112px - 56px - 2rem);
        width: calc(100% + 2rem);
        margin-right: -1rem;
        margin-left: -1rem;
        padding-top: 1rem;

        div[cdkVirtualScrollingElement] {
          height: 100%;
          width: 100%;
          flex: 1;

          cdk-virtual-scroll-viewport {
            mat-card {
              margin: 1rem;

              &:first-child {
                margin-top: 0;
              }

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
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsComponent {
  @Input() count: number = 0;
  @Input() pagination!: Pagination;
  @Input() loading: boolean = false;
  @Input() set tasks(tasks: Task[]) {
    const newTasks: Task[] = tasks.filter(
      (task: Task) => !this.loadedTasks.some((t) => t.id === task.id)
    );
    this.loadedTasks = [...this.loadedTasks, ...newTasks];
  }

  @Output() paginationChange: EventEmitter<Pagination> =
    new EventEmitter<Pagination>();

  protected loadedTasks: Task[] = [];

  protected onScroll(): void {
    if (this.canChangePage) this.onPageIndexChange();
  }

  private get canChangePage(): boolean {
    if (this.loading) return false;
    const pageNumber: number = this.pagination.pageIndex + 1;
    const nextPageNumber: number = pageNumber + 1;
    const nextTotalCount: number = this.pagination.pageSize * nextPageNumber;
    const willLoadNewItems: boolean =
      nextTotalCount > this.loadedTasks.length && nextTotalCount <= this.count;
    return willLoadNewItems;
  }

  private onPageIndexChange(): void {
    this.paginationChange.emit({
      ...this.pagination,
      pageIndex: this.pagination.pageIndex + 1,
    });
  }
}
