import {Component, Input} from '@angular/core';
import {Reading} from "../../../core/models/readings.model";
import {TwoAfterDotPipe} from "../../../shared/pipes/twoAfterDot.pipe";
import {DatePipe} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'app-receipt',
  standalone: true,
  imports: [
    TwoAfterDotPipe,
    DatePipe,
    TranslateModule
  ],
  templateUrl: './receipt.component.html',
  styleUrl: './receipt.component.scss'
})
export class ReceiptComponent {
  @Input() reading!: Reading;

  today = new Date();

  priceToWords(price: number): string {
    const singleDigits = [
      '', 'едно', 'две', 'три', 'четири', 'пет', 'шест', 'седем', 'осем', 'девет'
    ];
    const teens = [
      'десет', 'единадесет', 'дванадесет', 'тринадесет', 'четиринадесет', 'петнадесет', 'шестнадесет', 'седемнадесет', 'осемнадесет', 'деветнадесет'
    ];
    const tens = [
      '', '', 'двадесет', 'тридесет', 'четиридесет', 'петдесет', 'шестдесет', 'седемдесет', 'осемдесет', 'деветдесет'
    ];
    const hundreds = [
      '', 'сто', 'двеста', 'триста', 'четиристотин', 'петстотин', 'шестстотин', 'седемстотин', 'осемстотин', 'деветстотин'
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
        const hundrets = getHundreds(Math.floor(n / 1000))
        result += (hundrets === 'едно' || hundrets.trim() === 'и едно' ? ' хиляда ' : (hundrets + ' хиляди '));
        n %= 1000;
      }
      result += getHundreds(n);
      return result.trim();
    }

    if (price === 0) return 'нула лева и нула стотинки';

    const leva = Math.floor(price);
    const stotinki = Math.round((price - leva) * 100);

    let levaWords = '';
    if (leva > 0) {
      levaWords = getThousands(leva) + ' лева';
    }

    let stotinkiWords = '';
    if (stotinki > 0) {
      stotinkiWords = getHundreds(stotinki) + ' стотинки';
    } else {
      stotinkiWords = 'нула стотинки';
    }

    return (levaWords + ' и ' + stotinkiWords).trim();
  }

}
