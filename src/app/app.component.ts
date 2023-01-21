import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TaskboardContainerComponent } from './taskboard/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskboardContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header>
      <h1 class="mat-h1">Material taskbaord</h1>
      <h2 class="mat-h3">
        A taskboard styled with Google Material principles and writted in
        reactive Angular code
      </h2>
    </header>
    <main>
      <app-taskboard-container></app-taskboard-container>
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
