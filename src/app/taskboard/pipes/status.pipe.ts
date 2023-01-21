import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../enums';
@Pipe({
  name: 'status',
  standalone: true,
})
export class StatusPipe implements PipeTransform {
  transform(status: Status): { color: string | null; name: string } {
    if (status === Status.Completed)
      return { name: 'Completed', color: '#18DB91' };
    if (status === Status.InProgress)
      return { name: 'In Progress', color: '#FF810A' };
    if (status === Status.InReview)
      return { name: 'In Review', color: '#2994DB' };
    return { name: 'Not Started', color: null };
  }
}
