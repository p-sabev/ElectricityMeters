import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Reading} from "../../../core/models/readings.model";
import {CalendarModule} from "primeng/calendar";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormErrorsComponent} from "../../../shared/features/form-errors/form-errors.component";
import {NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {ReceiptComponent} from "../receipt/receipt.component";

@Component({
  selector: 'app-print-receipt',
  standalone: true,
  imports: [
    CalendarModule,
    FaIconComponent,
    FormErrorsComponent,
    NgIf,
    PaginatorModule,
    ReactiveFormsModule,
    TranslateModule,
    ReceiptComponent
  ],
  templateUrl: './print-receipt.component.html',
  styleUrl: './print-receipt.component.scss'
})
export class PrintReceiptComponent {
  @Input() reading!: Reading;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  callPrint = () => {
    setTimeout(() => {
      const mywindow = window.open('', '_blank', 'width=1080,height=1920,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no');
      // @ts-ignore
      const contents = document.getElementById('print-section').innerHTML;

      if (mywindow && contents) {
        mywindow.document.write('<html><head><title>Print</title>');
        mywindow.document.write('<style>.receipt-container {\n' +
          '  display: flex;\n' +
          '  border: 1px solid #000;\n' +
          '  width: 100%;\n' +
          '  max-width: 700px;\n' +
          '  margin: 20px auto;\n' +
          '  padding: 10px; ' +
          '  border-radius: 5px;\n' +
          '}\n' +
          '\n' +
          '.receipt-left, .receipt-right {\n' +
          '  width: 100%;\n' +
          '  padding: 15px 30px;\n' +
          '  box-sizing: border-box;\n' +
          '}\n' +
          '\n' +
          '.receipt-left {\n' +
          '  border-right: 1px dashed black;\n' +
          '}\n' +
          '\n' +
          '.header {\n' +
          '  text-align: center;\n' +
          '  margin-bottom: 20px;\n' +
          '}\n' +
          '\n' +
          '.header-info {\n' +
          '  display: flex;\n' +
          '  justify-content: space-between;\n' +
          '  margin-top: 10px;\n' +
          '}\n' +
          '\n' +
          '.content {\n' +
          '  margin: 20px 0;\n' +
          '}\n' +
          '\n' +
          'p {\n' +
          '  padding: 10px;\n' +
          '  margin: 0;\n' +
          '}\n' +
          '\n' +
          '.p-border {\n' +
          '  border: 1px solid #6c757d;\n' +
          '}\n' +
          '\n' +
          '.first-el-border {\n' +
          '  border-radius: 5px 5px 0 0;\n' +
          '}\n' +
          '\n' +
          '.last-el-border {\n' +
          '  border-radius: 0 0 5px 5px;\n' +
          '}\n' +
          '\n' +
          '.all-el-border {\n' +
          '  border-radius: 5px 5px 5px 5px;\n' +
          '}\n' +
          '\n' +
          '.footer {\n' +
          '  margin-top: 40px;\n' +
          '}\n' +
          '\n' +
          '.footer table {\n' +
          '  width: 100%;\n' +
          '  border-collapse: collapse;\n' +
          '}\n' +
          '\n' +
          '.footer th, .footer td {\n' +
          '  border: 1px solid #000;\n' +
          '  padding: 5px;\n' +
          '  text-align: center;\n' +
          '}\n' +
          '\n' +
          '.text-center {\n' +
          '  text-align: center;\n' +
          '}\n' +
          '\n' +
          '.font-weight-bold {\n' +
          '  font-weight: bold;\n' +
          '}</style>')
        mywindow.document.write('</head><body style="margin:0; size: auto;">');
        mywindow.document.write(contents);
        mywindow.document.write('</body></html>');

        setTimeout(() => {
          mywindow.document.close();
          mywindow.focus();
          mywindow.print();
          mywindow.close();
        }, 1500);
      }
    }, 100);
  }
}
