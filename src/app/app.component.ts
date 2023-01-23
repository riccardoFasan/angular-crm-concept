import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from './shared/components/header/header.component';
import { TaskboardContainerComponent } from './taskboard/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TaskboardContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header></app-header>
    <main>
      <app-taskboard-container></app-taskboard-container>
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
export class AppComponent {}
