import { Pipe, PipeTransform } from '@angular/core';
import { Status } from 'src/app/shared/enums';
@Pipe({
  name: 'status',
  standalone: true,
})
export class StatusColorPipe implements PipeTransform {
  transform(status: Status): { color: string | null; name: string } {
    if (status === Status.Completed)
      return { name: 'Completed', color: '#18BB99' };
    if (status === Status.InProgress)
      return { name: 'In Progress', color: '#FF810A' };
    if (status === Status.InReview)
      return { name: 'In Review', color: '#2994DB' };
    return { name: 'Not Started', color: null };
  }
}
