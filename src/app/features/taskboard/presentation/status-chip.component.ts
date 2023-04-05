import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusColorPipe } from 'src/app/shared/pipes';
import { Status } from 'src/app/shared/enums';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [CommonModule, StatusColorPipe, MatChipsModule],
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
