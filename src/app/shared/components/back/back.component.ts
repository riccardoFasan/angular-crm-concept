import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <button (click)="back()" mat-icon-button>
      <mat-icon>arrow_back</mat-icon>
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackComponent {
  @Input() fallbackPath: string = '/';

  private location: Location = inject(Location);
  private router: Router = inject(Router);

  protected back(): void {
    if (!this.hasPreviousPath) {
      this.router.navigateByUrl(this.fallbackPath);
      return;
    }
    this.location.back();
  }

  private get hasPreviousPath(): boolean {
    return Boolean(this.router.getCurrentNavigation()?.previousNavigation);
  }
}
