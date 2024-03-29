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
        <button
          mat-button
          color="accent"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          [routerLink]="['tasks']"
        >
          Taskboard
        </button>
      </mat-list-item>
      <mat-list-item>
        <button
          mat-button
          color="accent"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
          [routerLink]="['employees']"
        >
          Employees
        </button>
      </mat-list-item>
    </mat-list>
  `,
  styles: [
    `
      $border-style: 0.125rem solid transparent;

      mat-list {
        mat-list-item {
          padding: 0;

          button {
            width: 100%;
            justify-content: flex-start;
            border-left: $border-style;
            border-radius: 0;
          }
        }

        &.inline-nav {
          display: flex;

          mat-list-item {
            width: unset;

            button {
              border-left: 0;
              border-bottom: $border-style;
            }
          }
        }

        &,
        &.inline-nav {
          mat-list-item button.active {
            border-color: #69f0ae;
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
