import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeRoleColorPipe } from 'src/app/shared/pipes';
import { EmployeeRole } from 'src/app/core/enums';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-employee-role-chip',
  standalone: true,
  imports: [CommonModule, EmployeeRoleColorPipe, MatChipsModule],
  template: `
    <ng-container *ngIf="role">
      <mat-chip
        *ngIf="role | employeeRole as vm"
        [style.backgroundColor]="vm.color"
        [disableRipple]="true"
      >
        {{ vm.name }}
      </mat-chip>
    </ng-container>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeRoleChipComponent {
  @Input() role?: EmployeeRole;
}
