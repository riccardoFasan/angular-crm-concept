import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditingMode } from 'src/app/shared/enums';
import { Task } from 'src/app/shared/models';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {
  @Input() loading: boolean = false;
  @Input() set formData(formData: Partial<Task>) {}
  @Input() set task(task: Task) {}
  @Input() synchronized: boolean = false;
  @Input() editingMode: EditingMode = EditingMode.Editing;

  @Output() formDataChange: EventEmitter<Partial<Task>> = new EventEmitter<
    Partial<Task>
  >();
}
