import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models';
import { TaskComponent } from '../task/task.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, TaskComponent],
  template: `<app-task *ngFor="let task of tasks" [task]="task"></app-task>`,
  styles: [],
})
export class ListComponent {
  @Input() tasks: Task[] = [];
  @Input() loading: boolean = false;
}
