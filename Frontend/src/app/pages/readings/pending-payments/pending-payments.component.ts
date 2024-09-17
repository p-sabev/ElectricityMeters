import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ErrorService} from "../../../core/services/error.service";
import {ReadingsService} from "../readings.service";
import {PendingPaymentsReportResponse, SubscibersPendingPayments} from "../../../core/models/readings.model";
import {CalendarModule} from "primeng/calendar";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {FormErrorsComponent} from "../../../shared/features/form-errors/form-errors.component";
import {TranslateModule} from "@ngx-translate/core";
import {TwoAfterDotPipe} from "../../../shared/pipes/twoAfterDot.pipe";
import {TableModule} from "primeng/table";

@Component({
  selector: 'app-pending-payments',
  standalone: true,
  imports: [
    CalendarModule,
    DatePipe,
    FaIconComponent,
    FormErrorsComponent,
    NgForOf,
    NgIf,
    TranslateModule,
    TwoAfterDotPipe,
    TableModule
  ],
  templateUrl: './pending-payments.component.html',
  styleUrl: './pending-payments.component.scss'
})
export class PendingPaymentsComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readingsService: ReadingsService,
              private errorService: ErrorService) { }

  pendingPaymentsReportData: PendingPaymentsReportResponse | null = null;
  hasSomeWithMoreThanOnePayment = false;

  ngOnInit() {
    this.fetchAllPendingPaymentsReport();
  }

  fetchAllPendingPaymentsReport() {
    this.readingsService.fetchAllPendingPayments().subscribe((resp: any) => {
      this.pendingPaymentsReportData = resp;
      if (resp?.subscribersPendindPayments?.length) {
        resp.subscribersPendindPayments.forEach((subscriber: SubscibersPendingPayments) => {
          if (subscriber.paymentsCount > 1) {
            this.hasSomeWithMoreThanOnePayment = true;
          }
        });
      }
    }, (error: any) => {
      this.errorService.processError(error);
    });
  }
}
