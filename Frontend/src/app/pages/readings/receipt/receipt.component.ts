import { Component, Input } from '@angular/core';
import { Reading } from '../../../core/models/readings.model';
import { TwoAfterDotPipe } from '../../../shared/pipes/two-after-dot/two-after-dot.pipe';
import { DatePipe, NgForOf, NgIf, NgStyle } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Fee } from '../../../core/models/payment.model';

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [TwoAfterDotPipe, DatePipe, TranslateModule, NgForOf, NgIf, NgStyle],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss',
})
export class ReceiptComponent {
  @Input() reading!: Reading;
  @Input() fees: Fee[] = [];

  today = new Date();

  priceToWords(price: number): string {
    const singleDigits = ['', 'едно', 'две', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет'];
    const teens = [
      'десет',
      'единадесет',
      'дванадесет',
      'тринадесет',
      'четиринадесет',
      'петнадесет',
      'шестнадесет',
      'седемнадесет',
      'осемнадесет',
      'деветнадесет',
    ];
    const tens = [
      '',
      '',
      'двадесет',
      'тридесет',
      'четиридесет',
      'петдесет',
      'шестдесет',
      'седемдесет',
      'осемдесет',
      'деветдесет',
    ];
    const hundreds = [
      '',
      'сто',
      'двеста',
      'триста',
      'четиристотин',
      'петстотин',
      'шестстотин',
      'седемстотин',
      'осемстотин',
      'деветстотин',
    ];

    function getHundreds(n: number): string {
      let result = '';
      if (n > 99) {
        result += hundreds[Math.floor(n / 100)] + ' ';
        n %= 100;
      }
      if (n > 19) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
      if (n > 9) {
        result += ' и ' + teens[n - 10] + ' ';
      } else {
        result += (n === 0 ? '' : ' и ') + singleDigits[n] + ' ';
      }
      return result.trim();
    }

    function getThousands(n: number): string {
      let result = '';
      if (n > 999) {
        const hundrets = getHundreds(Math.floor(n / 1000));
        result += hundrets === 'едно' || hundrets.trim() === 'и едно' ? ' хиляда ' : hundrets + ' хиляди ';
        n %= 1000;
      }
      result += getHundreds(n);
      return result.trim();
    }

    if (price === 0) return 'нула евро и нула цента';

    const leva = Math.floor(price);
    const stotinki = Math.round((price - leva) * 100);

    let levaWords = '';
    if (leva > 0) {
      levaWords = getThousands(leva) + ' евро';
    }

    let stotinkiWords = '';
    if (stotinki > 0) {
      stotinkiWords = getHundreds(stotinki) + ' цента';
    } else {
      stotinkiWords = 'нула цента';
    }

    return (levaWords + ' и ' + stotinkiWords)
      .replace(/^\s*и\s*/, '')
      .replace(/\s+/g, ' ')
      .replace(' и и ', ' и ')
      .trim();
  }

  getTotalFees(): number {
    let total = 0;
    this.fees?.forEach((fee: Fee) => {
      if (fee.value && fee.value > 0) {
        total += fee.value;
      }
    });
    return total;
  }
}
