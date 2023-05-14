import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';
import { Employee } from 'src/app/core/models';

@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatRippleModule, RouterModule],
  template: `
    <mat-card matRipple [routerLink]="[employee.id]">
      <mat-card-header>
        <mat-card-title-group>
          <img
            [src]="employee.pictureUrl"
            alt="{{ employee.firstName }} {{ employee.lastName }}"
          />

          <mat-card-title class="mat-h3">
            {{ employee.firstName }} {{ employee.lastName }}
          </mat-card-title>
          <mat-card-subtitle>
            {{ employee.email }}
          </mat-card-subtitle>
        </mat-card-title-group>
      </mat-card-header>
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

            img {
              object-fit: cover;
              border-radius: 50%;
              width: 4rem;
              height: 4rem;
            }

            mat-card-title {
              margin: 0;
            }
          }
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;
}
