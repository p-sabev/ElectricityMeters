import {Component, EventEmitter, Output} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormErrorsComponent} from "../../../shared/features/form-errors/form-errors.component";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {CalendarModule} from "primeng/calendar";
import * as moment from 'moment';
import {PaymentsService} from "../payments.service";
import {ErrorService} from "../../../core/services/error.service";
import {PaymentsReportResponse, SearchPaymentsReport} from "../../../core/models/payment.model";
import {TwoAfterDotPipe} from "../../../shared/pipes/twoAfterDot.pipe";

@Component({
  selector: 'app-payment-report',
  standalone: true,
  imports: [
    FaIconComponent,
    FormErrorsComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TranslateModule,
    CalendarModule,
    FormsModule,
    TwoAfterDotPipe,
    DatePipe
  ],
  templateUrl: './payment-report.component.html',
  styleUrl: './payment-report.component.scss'
})
export class PaymentReportComponent {
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(private paymentsService: PaymentsService,
              private errorService: ErrorService) { }

  dateFrom: Date = moment().startOf('month').toDate();
  dateTo: Date = moment().endOf('month').toDate();

  paymentReportData: PaymentsReportResponse | null = null;

  fetchPaymentReport() {
    const body: SearchPaymentsReport = {
      dateFrom: moment(this.dateFrom).format('YYYY-MM-DD') + 'T00:00:00.000Z',
      dateTo: moment(this.dateTo).format('YYYY-MM-DD') + 'T23:59:59.999Z',
    }
    this.paymentsService.searchPaymentsReport(body).subscribe((resp) => {
      this.paymentReportData = resp;
    }, (error) => {
      this.errorService.processError(error);
    });
  }
}
