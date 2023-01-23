import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <h1 class="mat-h1">Material taskbaord</h1>
      <h2 class="mat-h3">
        A taskboard styled with Google Material principles and written in
        reactive Angular code
      </h2>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      header,
      main {
        padding: 1rem;
      }
    `,
  ],
})
export class AppComponent {}
