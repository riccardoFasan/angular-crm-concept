import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  template: `
    <mat-progress-bar
      *ngIf="loading"
      color="accent"
      mode="indeterminate"
    ></mat-progress-bar>
    <mat-toolbar
      [ngStyle]="{ 'marginTop.px': !loading ? '0' : '-4' }"
      color="primary"
    >
      <mat-toolbar-row>
        <h1 class="mat-h2">Material taskbaord</h1>
        <button mat-button color="accent" [routerLink]="['taskboard']">
          Taskboard
        </button>
        <button mat-button color="accent" [routerLink]="['taskboard', 'new']">
          Create new task
        </button>
      </mat-toolbar-row>
    </mat-toolbar>
  `,
  styles: [
    `
      mat-toolbar-row {
        gap: 0.5rem;

        h1.mat-h2 {
          margin: 0 1.5rem 0.125rem 0;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() loading: boolean = false;
}
