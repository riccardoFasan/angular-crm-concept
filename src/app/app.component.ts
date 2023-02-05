import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoadingStoreService } from './shared/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header [loading]="!!(loading$ | async)"></app-header>
    <main>
      <router-outlet></router-outlet>
    </main>
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

  loading$: Observable<boolean> = this.loadingStore.loading$;
}
