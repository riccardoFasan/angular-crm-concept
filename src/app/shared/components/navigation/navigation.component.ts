import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  template: `
    <mat-list [ngClass]="{ 'inline-nav': !mobile }">
      <mat-list-item>
        <button mat-button color="accent" [routerLink]="['taskboard']">
          Taskboard
        </button>
      </mat-list-item>
      <mat-list-item>
        <button mat-button color="accent" [routerLink]="['taskboard', 'new']">
          Create new task
        </button>
      </mat-list-item>
    </mat-list>
  `,
  styles: [
    `
      mat-list {
        mat-list-item {
          padding: 0;

          button {
            width: 100%;
            justify-content: flex-start;
          }
        }

        &.inline-nav {
          display: flex;

          mat-list-item {
            width: unset;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
  @Input() mobile: boolean = false;
  @Output() pageChange: EventEmitter<void> = new EventEmitter<void>();
}
