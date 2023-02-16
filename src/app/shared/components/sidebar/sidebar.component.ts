import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidebarStoreService } from '../../store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule],
  template: `
    <ng-container
      *ngIf="{
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
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  private store: SidebarStoreService = inject(SidebarStoreService);

  protected readonly opened$ = this.store.opened$;
  protected readonly position$ = this.store.position$;
  protected readonly mode$ = this.store.mode$;

  // TODO: refactor with cdk portal
  protected readonly template$ = this.store.template$;

  protected onSidebarClosed(): void {
    this.store.updateOpened(false);
  }
}
