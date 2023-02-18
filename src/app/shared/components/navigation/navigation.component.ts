import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MobileObserverService } from '../../services';
import { Observable } from 'rxjs';

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
    <mat-list
      *ngIf="{ mobile: mobile$ | async } as vm"
      [ngClass]="{ 'inline-nav': !vm.mobile }"
    >
      <mat-list-item>
        <button mat-button color="accent" (click)="navigate('taskboard')">
          Taskboard
        </button>
      </mat-list-item>
      <mat-list-item>
        <button mat-button color="accent" (click)="navigate('taskboard/new')">
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
  private readonly mobileObserver: MobileObserverService = inject(
    MobileObserverService
  );
  private readonly router: Router = inject(Router);

  @Output() pageChange: EventEmitter<void> = new EventEmitter<void>();

  protected readonly mobile$: Observable<boolean> = this.mobileObserver.mobile$;

  protected navigate(url: string): void {
    this.router.navigateByUrl(url);
    this.pageChange.emit();
  }
}
