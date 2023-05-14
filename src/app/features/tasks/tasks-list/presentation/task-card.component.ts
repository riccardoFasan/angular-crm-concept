import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { Task } from 'src/app/core/models';
import { StatusChipComponent } from './status-chip.component';
import { PriorityChipComponent } from './priority-chip.component';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatRippleModule,
    RouterModule,
    StatusChipComponent,
    PriorityChipComponent,
  ],
  template: `
    <mat-card matRipple [routerLink]="[task.id]">
      <mat-card-header>
        <mat-card-title-group>
          <mat-card-title class="mat-h3">
            {{ task.description }}
          </mat-card-title>
          <mat-card-subtitle>
            {{ task.deadline | date : 'dd MMMM YYYY' }}
          </mat-card-subtitle>
        </mat-card-title-group>
      </mat-card-header>
      <mat-card-content>
        <app-status-chip [status]="task.status"></app-status-chip>
        <app-priority-chip [priority]="task.priority"></app-priority-chip>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      :host {
        display: block;
        margin-bottom: 1rem;

        mat-card {
          margin: 1rem;

          &:first-child {
            margin-top: 0;
          }

          &:last-child {
            margin-bottom: 0;
          }

          mat-card-title-group {
            margin-bottom: 1.25rem;

            mat-card-title {
              margin: 0;
            }
          }

          mat-card-content app-status-chip {
            margin-right: 1rem;
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskCardComponent {
  @Input() task!: Task;
}
