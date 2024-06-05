import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  standalone: true,
  name: 'twoAfterDot'
})
export class TwoAfterDotPipe implements PipeTransform {
  transform(value: any): string {
    if (!value || isNaN(value)) {
      if (value === 0 || value === null) {
        const num = parseFloat('0');
        return num.toFixed(2);
      }
      // return '';
    } else {
      const num = parseFloat(value);
      return num.toFixed(2);
    }
    return '';
  }
}
