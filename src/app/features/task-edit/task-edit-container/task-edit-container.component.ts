import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskEditStoreService } from '../store/task-edit-store.service';

@Component({
  selector: 'app-task-edit-container',
  standalone: true,
  imports: [CommonModule],
  providers: [TaskEditStoreService],
  template: ` <p>task-edit-container works!</p> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskEditContainerComponent {
  private readonly store: TaskEditStoreService = inject(TaskEditStoreService);
}
