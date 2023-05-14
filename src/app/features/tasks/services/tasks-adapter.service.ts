import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemAdapter } from 'src/app/core/interfaces';
import { List, Task, TasksSearchCriteria } from 'src/app/core/models';
import { ApiService } from 'src/app/core/services';

@Injectable({
  providedIn: 'root',
})
export class TasksAdapterService implements ItemAdapter<Task> {
  private readonly api: ApiService = inject(ApiService);

  getItems(searchCriteria: TasksSearchCriteria): Observable<List<Task>> {
    return this.api.getTasks(searchCriteria);
  }

  removeItem(item: Task): Observable<Task> {
    return this.api.removeTask(item);
  }

  createItem(item: Task): Observable<Task> {
    return this.api.createTask(item);
  }

  updateItem(item: Task): Observable<Task> {
    return this.api.updateTask(item);
  }

  getItem(id: string): Observable<Task> {
    return this.api.getTask(id);
  }

  generateTitle(item: Task): string {
    return item.description;
  }
}
