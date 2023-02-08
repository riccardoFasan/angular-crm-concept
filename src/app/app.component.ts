import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/components';
import { LoadingStoreService } from './shared/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container
      *ngIf="{
        loading: loading$ | async
      } as vm"
    >
      <app-header [loading]="!!vm.loading"></app-header>
      <main>
        <router-outlet></router-outlet>
      </main>
    </ng-container>
  `,
  styles: [
    `
      main {
        padding: 1rem;
      }
    `,
  ],
})
export class AppComponent {
  private readonly loadingStore: LoadingStoreService =
    inject(LoadingStoreService);

  protected readonly loading$: Observable<boolean> = this.loadingStore.loading$;
}
