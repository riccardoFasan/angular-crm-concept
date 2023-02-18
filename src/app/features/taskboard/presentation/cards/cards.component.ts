import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from 'src/app/shared/models';
import { MatCardModule } from '@angular/material/card';
import { StatusChipComponent } from '../status-chip/status-chip.component';
import { PriorityChipComponent } from '../priority-chip/priority-chip.component';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule,
    MatRippleModule,
    StatusChipComponent,
    PriorityChipComponent,
  ],
  template: `
    <mat-card matRipple [routerLink]="[task.id]" *ngFor="let task of tasks">
      <mat-card-header>
        <mat-card-title-group>
          <mat-card-title class="mat-h3">{{ task.description }}</mat-card-title>
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
      mat-card {
        margin: 1.75rem 0;

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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsComponent {
  @Input() tasks: Task[] = [];
}
