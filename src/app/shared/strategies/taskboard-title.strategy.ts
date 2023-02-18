import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable()
export class TaskboardTitleStrategy extends TitleStrategy {
  private readonly title: Title = inject(Title);
  private readonly suffix: string = 'Material Taskboard';

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title: string = this.buildTitle(snapshot);
    this.title.setTitle(title);
  }

  override buildTitle(snapshot: RouterStateSnapshot): string {
    const title: string | undefined = super.buildTitle(snapshot);
    if (title) return `${title} - ${this.suffix}`;
    return this.suffix;
  }
}
