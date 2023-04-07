import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Priority } from 'src/app/core/enums';
import { PriorityColorPipe } from 'src/app/shared/pipes';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-priority-chip',
  standalone: true,
  imports: [CommonModule, PriorityColorPipe, MatChipsModule],
  template: `
    <mat-chip
      *ngIf="priority | priority as vm"
      [style.backgroundColor]="vm.color"
      [disableRipple]="true"
    >
      {{ vm.name }}
    </mat-chip>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriorityChipComponent {
  @Input() priority!: Priority;
}
