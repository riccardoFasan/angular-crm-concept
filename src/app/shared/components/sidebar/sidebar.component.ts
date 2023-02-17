import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarStoreService } from '../../store';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatButtonModule, MatIconModule],
  template: `
    <ng-container
      *ngIf="{
        title: title$ | async,
        opened: opened$ | async,
        position: position$ | async,
        mode: mode$ | async,
        template: template$ | async
      } as vm"
    >
      <mat-sidenav-container>
        <mat-sidenav
          [mode]="vm.mode!"
          [position]="vm.position!"
          [opened]="!!vm.opened"
          (closed)="onSidebarClosed()"
        >
          <div>
            <h3>{{ vm.title }}</h3>
            <button (click)="onSidebarClosed()" mat-icon-button>
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <ng-container *ngTemplateOutlet="vm.template!"></ng-container>
        </mat-sidenav>
        <mat-sidenav-content>
          <ng-content></ng-content>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </ng-container>
  `,
  styles: [
    `
      :host {
        display: block;

        &,
        mat-sidenav-container {
          height: 100%;
        }

        mat-sidenav-container mat-sidenav {
          display: block;
          padding: 1rem;
          width: 75vw;

          div:first-child {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 2rem;

            h3 {
              margin: 0;
            }
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private store: SidebarStoreService = inject(SidebarStoreService);

  protected readonly title$ = this.store.title$;
  protected readonly opened$ = this.store.opened$;
  protected readonly position$ = this.store.position$;
  protected readonly mode$ = this.store.mode$;

  // TODO: refactor with cdk portal
  protected readonly template$ = this.store.template$;

  protected onSidebarClosed(): void {
    this.store.close();
  }
}
