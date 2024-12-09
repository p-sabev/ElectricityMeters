import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'twoAfterDot',
})
export class TwoAfterDotPipe implements PipeTransform {
  transform(value: any): string {
    if (value === null || value === undefined || value === '') {
      return '0.00';
    }

    const num = parseFloat(value);

    if (isNaN(num)) {
      return '';
    }

    return num.toFixed(2);
  }
}
