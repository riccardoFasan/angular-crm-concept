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
}
