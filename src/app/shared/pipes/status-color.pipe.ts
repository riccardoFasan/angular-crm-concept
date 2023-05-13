import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from 'src/app/core/enums';
@Pipe({
  name: 'status',
  standalone: true,
})
export class StatusColorPipe implements PipeTransform {
  transform(status: TaskStatus): { color: string | null; name: string } {
    if (status === TaskStatus.Completed)
      return { name: 'Completed', color: '#18BB99' };
    if (status === TaskStatus.InProgress)
      return { name: 'In Progress', color: '#FF810A' };
    if (status === TaskStatus.InReview)
      return { name: 'In Review', color: '#2994DB' };
    return { name: 'Not Started', color: null };
  }
}
