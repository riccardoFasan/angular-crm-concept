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
        [itemSize]="cards.offsetHeight / loadedItems.length"
        (scrolledIndexChange)="onScroll()"
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

  protected onScroll(): void {
    if (this.canChangePage) this.onPageIndexChange();
  }

  private get canChangePage(): boolean {
    if (this.loading) return false;
    const pageNumber: number = this.pagination.pageIndex + 1;
    const nextPageNumber: number = pageNumber + 1;
    const nextTotalCount: number = this.pagination.pageSize * nextPageNumber;
    const willLoadNewItems: boolean =
      nextTotalCount > this.loadedItems.length && nextTotalCount <= this.count;
    return willLoadNewItems;
  }

  private onPageIndexChange(): void {
    this.paginationChange.emit({
      ...this.pagination,
      pageIndex: this.pagination.pageIndex + 1,
    });
  }
}
