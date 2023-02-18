import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SidebarStoreService } from '../../store';
import { MobileObserverService } from '../../services';
import { Observable, Subject, combineLatest, takeUntil, tap } from 'rxjs';
import { NavigationComponent } from '../navigation/navigation.component';
import { Router, NavigationStart, RouterModule } from '@angular/router';
import { Event } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    NavigationComponent,
  ],
  template: `
    <mat-progress-bar
      *ngIf="loading"
      color="accent"
      mode="indeterminate"
    ></mat-progress-bar>
    <mat-toolbar
      *ngIf="{ mobile: mobile$ | async } as vm"
      [ngStyle]="{ 'marginTop.px': !loading ? '0' : '-4' }"
      color="primary"
    >
      <mat-toolbar-row>
        <button
          *ngIf="vm.mobile"
          mat-icon-button
          (click)="openNavigation()"
          aria-label="Example icon button with a menu icon"
        >
          <mat-icon>menu</mat-icon>
        </button>
        <h1 class="mat-h2">Material taskbaord</h1>
        <ng-container *ngIf="vm.mobile; else navigation"></ng-container>
        <ng-template #navigation>
          <app-navigation [mobile]="!!vm.mobile"></app-navigation>
        </ng-template>
      </mat-toolbar-row>
    </mat-toolbar>
  `,
  styles: [
    `
      mat-toolbar-row {
        gap: 0.5rem;

        h1.mat-h2 {
          margin: 0 1.5rem 0.125rem 0;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly sidebarStore: SidebarStoreService =
    inject(SidebarStoreService);
  private readonly router: Router = inject(Router);

  private readonly mobileObserver: MobileObserverService = inject(
    MobileObserverService
  );

  @Input() loading: boolean = false;

  @ViewChild('navigation')
  navigationRef!: ViewContainerRef;

  protected readonly mobile$: Observable<boolean> = this.mobileObserver.mobile$;
  private readonly routerEvents$: Observable<Event> = this.router.events;
  private readonly destroy$: Subject<void> = new Subject<void>();

  private readonly closeSidebar$: Observable<[boolean, Event]> = combineLatest([
    this.mobile$,
    this.routerEvents$,
  ]).pipe(
    takeUntil(this.destroy$),
    tap(([mobile, events]: [boolean, Event]) => {
      if (!mobile || events instanceof NavigationStart)
        this.sidebarStore.close();
    })
  );

  ngOnInit(): void {
    this.closeSidebar$.subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  protected openNavigation(): void {
    this.sidebarStore.updateTemplate(this.navigationRef);
    this.sidebarStore.updatePosition('start');
    this.sidebarStore.updateTitle('Menu');
    this.sidebarStore.open();
  }
}
