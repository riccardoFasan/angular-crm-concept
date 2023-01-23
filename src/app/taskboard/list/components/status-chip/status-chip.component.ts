import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusPipe } from '../../pipes';
import { MatChipsModule } from '@angular/material/chips';
import { Status } from 'src/app/taskboard/enums';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule, StatusPipe, MatChipsModule],
  template: `
    <mat-chip
      *ngIf="status | status as vm"
      [style.backgroundColor]="vm.color"
      [disableRipple]="true"
    >
      {{ vm.name }}
    </mat-chip>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusChipComponent {
  @Input() status!: Status;
}
