import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Item, Pagination } from 'src/app/core/models';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollingModule],
  template: `
    <div cdkVirtualScrollingElement>
      <cdk-virtual-scroll-viewport
        [itemSize]="134"
        (scrolledIndexChange)="onScroll($event)"
      >
        <div #cards>
          <ng-container *ngIf="cardRef">
            <ng-container
              *cdkVirtualFor="let item of loadedItems"
              [ngTemplateOutlet]="cardRef"
              [ngTemplateOutletContext]="{ $implicit: item }"
            >
            </ng-container>
          </ng-container>
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
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsComponent<T extends Item> {
  @Input() count: number = 0;
  @Input() pagination!: Pagination;
  @Input() loading: boolean = false;

  @Input() set items(items: T[]) {
    const newTasks: T[] = items.filter(
      (task: T) => !this.loadedItems.some((t) => t.id === task.id)
    );
    this.loadedItems = [...this.loadedItems, ...newTasks];
  }

  @ContentChild('card')
  protected cardRef!: TemplateRef<any>;

  @Output() paginationChange: EventEmitter<Pagination> =
    new EventEmitter<Pagination>();

  protected loadedItems: T[] = [];

  protected onScroll(scrollIndex: number): void {
    if (!this.canChangePage(scrollIndex)) return;
    this.onPageIndexChange(scrollIndex);
  }

  private get currentCount(): number {
    return this.loadedItems.length;
  }

  private get totalPages(): number {
    return Math.ceil(this.count / this.pagination.pageSize);
  }

  private canChangePage(nextPageIndex: number): boolean {
    if (this.loading) return false;
    const hasCount: boolean = this.count > 0;
    if (!hasCount) return false;
    if (nextPageIndex <= this.pagination.pageIndex) return false;
    if (nextPageIndex > this.totalPages) return false;
    const nextTotalCount: number =
      this.pagination.pageSize * (nextPageIndex + 1);
    const isLastPage: boolean = this.totalPages === nextPageIndex;
    const willLoadNewEntries: boolean =
      (isLastPage &&
        nextTotalCount > this.currentCount &&
        nextTotalCount <= this.pagination.pageSize * this.totalPages) ||
      (!isLastPage &&
        nextTotalCount > this.currentCount &&
        nextTotalCount <= this.count);
    return willLoadNewEntries;
  }

  private onPageIndexChange(nextPageIndex: number): void {
    this.paginationChange.emit({
      ...this.pagination,
      pageIndex: nextPageIndex,
    });
  }
}
