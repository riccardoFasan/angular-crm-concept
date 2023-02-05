import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatProgressBarModule],
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
      <h1 class="mat-h2">Material taskbaord</h1>
    </mat-toolbar>
  `,
  styles: [
    `
      h1.mat-h2 {
        margin: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() loading: boolean = false;
}
