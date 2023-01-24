import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { TaskEditState } from '../state';

@Injectable()
export class TaskEditStoreService extends ComponentStore<TaskEditState> {
  constructor() {
    super({});
  }
}
