import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Reading} from "../../../core/models/readings.model";
import {CalendarModule} from "primeng/calendar";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormErrorsComponent} from "../../../shared/features/form-errors/form-errors.component";
import {NgForOf, NgIf} from "@angular/common";
import {PaginatorModule} from "primeng/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {ReceiptComponent} from "../receipt/receipt.component";
import {Fee, InsertPayment} from "../../../core/models/payment.model";
import {TwoAfterDotPipe} from "../../../shared/pipes/two-after-dot/two-after-dot.pipe";
import * as moment from "moment/moment";
import {PaymentsService} from "../../payments/payments.service";
import {ErrorService} from "../../../core/services/error.service";
import {NotificationsEmitterService} from "../../../core/services/notifications.service";
import {SettingsService} from "../../settings/settings.service";
import {catchError, EMPTY, tap} from 'rxjs';

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
    ReceiptComponent,
    TwoAfterDotPipe,
    NgForOf
  ],
  templateUrl: './print-receipt.component.html',
  styleUrl: './print-receipt.component.scss'
})
export class PrintReceiptComponent implements OnInit {
  @Input() reading!: Reading;
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(private paymentsService: PaymentsService,
              private settingsService: SettingsService,
              private notifications: NotificationsEmitterService,
              private errorService: ErrorService) {
  }

  feeList: Fee[] = [];

  encoding: string = '';

  ngOnInit() {
    if (!this.reading?.feeList?.length) {
      this.fetchAllDefaultFees();
    } else {
      this.feeList = this.reading.feeList;
    }
  }

  fetchAllDefaultFees() {
    this.settingsService.getDefaultFees().pipe(
      tap((data) => {
        this.feeList = data;
      }),
      catchError((error) => {
        this.errorService.processError(error);
        return EMPTY;
      })
    ).subscribe();
  }

  deleteFee(i: number) {
    this.feeList.splice(i, 1);
  }

  markAsPaid() {
    const body: InsertPayment = {
      readingId: this.reading.id,
      date: moment().toDate(),
      feeList: this.feeList
    };

    this.paymentsService.insertPayment(body).pipe(
      tap(() => {
        this.notifications.Success.emit('SuccessfullyMarkedAsPaid');
        this.reading.isPaid = true;
      }),
      catchError((error) => {
        this.errorService.processError(error);
        return EMPTY;
      })
    ).subscribe();
  }

  callPrint = () => {
    setTimeout(() => {
      const styles = '<style>.receipt-container {\n' +
        '  display: flex;\n' +
        '  border: 1px solid #000;\n' +
        '  width: 100%;\n' +
        '  max-width: 500px;\n' +
        '  margin: 20px auto;\n' +
        '  padding: 10px; ' +
        '  border-radius: 5px; ' +
        '  zoom: 1.8;\n' +
        '}\n' +
        '\n' +
        '.receipt-left, .receipt-right {\n' +
        '  width: 100%;\n' +
        '  padding: 0;\n' +
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
        '  padding: 2px 5px;\n' +
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
        '}</style>';
      // @ts-ignore
      const contents = styles + document.getElementById('print-section').innerHTML;

      document.body.innerHTML = contents;

      setTimeout(() => {
        window.print();
        setTimeout(() => {
          location.reload();
        }, 5000);
      }, 1000);

    }, 100);
  }

}
