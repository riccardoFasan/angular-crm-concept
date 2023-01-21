import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FilterPaginationOptionsPipe } from '../../pipes';

@Component({
  selector: 'app-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatPaginatorModule, FilterPaginationOptionsPipe],
  template: `<mat-paginator
    showFirstLastButtons
    [pageSizeOptions]="pageSizeOptions | filterPaginationOptions : count"
    [pageSize]="pageSize"
    [pageIndex]="page"
    [length]="count"
    (page)="onPageChange($event)"
  ></mat-paginator>`,
  styles: [
    `
      :host {
        width: 100%;
      }
    `,
  ],
})
export class PaginationComponent {
  @Input() count: number = 0;
  @Input() page: number = 0;
  @Input() pageSize: number = 0;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  protected readonly pageSizeOptions: number[] = [5, 10, 15, 20];

  protected onPageChange(e: PageEvent): void {
    this.pageChange.emit(e.pageIndex);
  }
}
