import { Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private location: Location = inject(Location);
  private router: Router = inject(Router);

  back(fallbackPath: string = '/'): void {
    if (!this.hasPreviousPath) {
      this.router.navigateByUrl(fallbackPath);
      return;
    }
    this.location.back();
  }

  private get hasPreviousPath(): boolean {
    return Boolean(this.router.getCurrentNavigation()?.previousNavigation);
  }
}
