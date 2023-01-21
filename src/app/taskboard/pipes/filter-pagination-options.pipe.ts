import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPaginationOptions',
  standalone: true,
})
export class FilterPaginationOptionsPipe implements PipeTransform {
  transform(options: number[], count: number): number[] {
    return options.filter(
      (option: number, i: number) =>
        option <= count ||
        (options[i - 1] < count && (options[i + 1] > count || !options[i + 1]))
    );
  }
}
