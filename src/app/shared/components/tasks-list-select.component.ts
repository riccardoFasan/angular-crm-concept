import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ITEM_ADAPTER } from 'src/app/core/tokens';
import { TasksAdapterService } from 'src/app/features/tasks/services/tasks-adapter.service';
import { ListSelectComponent } from './list-select.component';

@Component({
  selector: 'app-tasks-list-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ListSelectComponent],
  template: `
    <app-list-select [label]="'Task'" [control]="control"></app-list-select>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  providers: [
    {
      provide: ITEM_ADAPTER,
      useExisting: TasksAdapterService,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksListSelectComponent {
  @Input() control: FormControl = new FormControl(undefined);
}
