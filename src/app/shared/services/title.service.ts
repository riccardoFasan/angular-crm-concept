import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  private readonly title: Title = inject(Title);
  private readonly suffix: string = 'Material Taskboard';

  setTitle(title?: string): void {
    const pageTitle: string = this.buildPageTitle(title);
    this.title.setTitle(pageTitle);
  }

  private buildPageTitle(title?: string): string {
    if (title) return `${title} - ${this.suffix}`;
    return this.suffix;
  }
}
