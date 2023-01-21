import { Pipe, PipeTransform } from '@angular/core';
import { Priority } from '../enums';

@Pipe({
  name: 'priorityColor',
  standalone: true,
})
export class PriorityColorPipe implements PipeTransform {
  transform(priority: Priority): string {
    if (priority === Priority.High) return 'error';
    if (priority === Priority.Medium) return 'warn';
    return 'success';
  }
}
