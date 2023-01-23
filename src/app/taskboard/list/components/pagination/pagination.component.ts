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
import { Pagination } from 'src/app/taskboard/models';

@Component({
  selector: 'app-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatPaginatorModule, FilterPaginationOptionsPipe],
  template: `
    <mat-paginator
      showFirstLastButtons
      [pageSizeOptions]="pageSizeOptions | filterPaginationOptions : count"
      [pageSize]="pagination.pageSize"
      [pageIndex]="pagination.pageIndex"
      [disabled]="loading"
      [length]="count"
      (page)="onPaginationChange($event)"
    >
    </mat-paginator>
  `,
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
  @Input() loading: boolean = false;
  @Input() pagination!: Pagination;

  @Output() paginationChange: EventEmitter<Pagination> =
    new EventEmitter<Pagination>();

  protected readonly pageSizeOptions: number[] = [5, 10];

  protected onPaginationChange(e: PageEvent): void {
    this.paginationChange.emit({
      pageIndex: e.pageIndex,
      pageSize: e.pageSize,
    });
  }
}
