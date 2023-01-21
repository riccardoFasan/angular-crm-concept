import { Pipe, PipeTransform } from '@angular/core';
import { Status } from '../enums';

@Pipe({
  name: 'statusColor',
  standalone: true,
})
export class StatusColorPipe implements PipeTransform {
  transform(status: Status): 'success' | 'warn' | 'blue' | 'gray' {
    if (status === Status.Completed) return 'success';
    if (status === Status.InProgress) return 'warn';
    if (status === Status.InReview) return 'blue';
    return 'gray';
  }
}
