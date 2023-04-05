import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavigationService } from '../services';

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
  private readonly navigation: NavigationService = inject(NavigationService);

  @Input() fallbackPath: string = '/';

  protected back(): void {
    this.navigation.back(this.fallbackPath);
  }
}
