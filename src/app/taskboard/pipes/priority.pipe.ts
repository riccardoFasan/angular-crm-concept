import { Pipe, PipeTransform } from '@angular/core';
import { Priority } from '../enums';

@Pipe({
  name: 'priority',
  standalone: true,
})
export class PriorityPipe implements PipeTransform {
  transform(priority: Priority): { color: string; name: string } {
    if (priority === Priority.Top) return { name: 'Top', color: '#DB234B' };
    if (priority === Priority.Medium)
      return { name: 'Medium', color: '#FF810A' };
    return { name: 'Low', color: '#18DB91' };
  }
}
