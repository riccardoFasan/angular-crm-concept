import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TaskboardContainerComponent } from './taskboard/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TaskboardContainerComponent],
  template: `<app-taskboard-container></app-taskboard-container>`,
  styles: [],
})
export class AppComponent {}
