import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  template: ` {{ task.description }} `,
  styles: [],
})
export class TaskComponent {
  @Input() task!: Task;
}
