import { Injectable, inject } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TitleService } from '../services';

@Injectable()
export class TaskboardTitleStrategy extends TitleStrategy {
  private readonly title: TitleService = inject(TitleService);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title: string | undefined = this.buildTitle(snapshot);
    this.title.setTitle(title);
  }
}
